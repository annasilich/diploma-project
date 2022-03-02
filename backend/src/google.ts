import fs from 'fs'
import { google }  from 'googleapis'
import { pool } from './database'

let auth = null
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err)
	// @ts-ignore
  authorize(JSON.parse(content), (oauthClient) => { auth = oauthClient })
})

function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0])

  fs.readFile('token.json', (err, token) => {
    if (err) return console.log('Error loading token file:', err)
		// @ts-ignore
    oAuth2Client.setCredentials(JSON.parse(token))
    callback(oAuth2Client)
  })
}

async function copy(fileId, name): Promise<any> {
	return new Promise((res, rej) => {
		const drive = google.drive({ version: 'v3', auth })

		drive.files.copy({
			fileId,
			// @ts-ignore
			resource: {
				name,
			},
		}, (err, driveResponse) => {
			if (err) return rej(err)
			res(driveResponse)
		})
	})
}

async function grant(fileId, email, deadline): Promise<any> {
	return new Promise((res, rej) => {
		const drive = google.drive({ version: 'v3', auth })

		drive.permissions.create({
			fileId,
			sendNotificationEmail: true,
			emailMessage: 'Дедлайн по работе: ' + deadline,
			requestBody: {
				role: 'writer',
				type: 'user',
				emailAddress: email
			}
		}, (err, driveResponse) => {
			if (err) return rej(err)
			res(driveResponse)
		})
	})
}

async function deleteFile(fileId): Promise<any> {
	return new Promise((res, rej) => {
		const drive = google.drive({ version: 'v3', auth })

		drive.files.delete({
			fileId,
		}, (err, driveResponse) => {
			if (err) return rej(err)
			res(driveResponse)
		})
	})
}

import { Router } from 'express'
const router = new Router()

// create template
router.post('/new_template', async (request, response) => {
	request.query.teacher_id = 1

	try {
		const { data } = await copy(request.query.document_id, request.query.name)

	await pool.query(`
		INSERT INTO templates 
		(name, description, document_id, link, teacher_id)
		VALUES ($1, $2, $3, $4, $5)
		`, [request.query.name, request.query.description, data.id, request.query.link, request.query.teacher_id]
	)

	response.status(201).send(`Template added.`)
	}
	catch (e) {
		console.log(e)
		response.status(500).send(e)
	}
})

// delete template
router.post('/delete_template', async (request, response) => {

	const { rows: [{ document_id }] } = await pool.query(`
	SELECT document_id FROM templates WHERE id = $1`, [request.query.id])
	
	await deleteFile(document_id)
    
	pool.query(`DELETE FROM templates WHERE id = $1`, [request.query.id], (error, result) => {
		if (error) throw error;

		response.status(201).send(`Template deleted.`);
	});
});

// edit template
router.post('/update_template', async (request, response) => {
		const { rows: [{ document_id }] } = await pool.query(`
		SELECT document_id FROM templates WHERE id = $1`, [request.query.id])
		try {
		const new_document_id = request.query.link.replace('https://docs.google.com/document/d/', '').replace('https://drive.google.com/file/d/', '').split('/')[0]

		const { data } = await copy(new_document_id, request.query.name)
			
		pool.query(`UPDATE templates SET name = $1, description = $2, document_id = $3, link = $4 WHERE id = $5`, 
		[request.query.name, request.query.description, data.id, request.query.link, request.query.id], (error, result) => {
			if (error) throw error;

			response.status(201).send(`Template updated.`);
		});
		await deleteFile(document_id)
		}
	catch (e) {
		console.log(e)
		response.status(500).send(e)
	}
});

router.post('/create_documents', async (request, response) => {
	const teacher_id = 1
	try {
		const [
			{ rows: [{ document_id }] },
			{ rows: [{ email }] },
			{ rows: students }
		] = await Promise.all([
			pool.query(`
				SELECT document_id FROM templates WHERE id = $1
			`, [request.query.template_id]),
			pool.query(`
				SELECT users.google_email email
				FROM teachers
				JOIN users ON users.id = teachers.user_id
				WHERE teachers.id = $1
			`, [teacher_id]),
			pool.query(`
				SELECT students.*, users.google_email email
				FROM students
				JOIN users ON users.id = students.user_id
				WHERE group_id = $1
				ORDER BY students.id ASC
			`, [request.query.group_id])
		])

		for (let i = 0; i < students.length; i++) {
			const { data } = await copy(document_id, request.query.task_name)

			await Promise.all([
				grant(data.id, students[i].email, request.query.deadline),
				grant(data.id, email, request.query.deadline),
				pool.query(`
					INSERT INTO works
					(name, complited, deadline, document_id, template_id, student_id, course_id) 
					VALUES ($1, $2, $3, $4, $5, $6, $7)
					`, [request.query.task_name, false, request.query.deadline, data.id, 
						request.query.template_id, students[i].id, request.query.course_id]
				)
			])
		}

		response.status(201).send(`Documents created.`)
	}
	catch (e) {
		console.log(e)
		response.status(500).send(e)
	}
})

async function activity(fileId): Promise<string[]> {
	return new Promise((res, rej) => {
		const drive = google.drive({ version: 'v3', auth })

		drive.revisions.list({
			fileId
		}, (err, driveResponse) => {
			if (err) return rej(err)

			res(driveResponse.data.revisions.map(revisions => revisions.modifiedTime))
		})
	})
}

async function checkActivity() {
	const { rows: documents } = await pool.query(`
		SELECT works.id, document_id, array_agg(activities.time) times
		FROM works
		LEFT JOIN activities ON activities.work_id = works.id
		WHERE NOT complited
		GROUP BY document_id, works.id
		ORDER BY works.id ASC
	`)

	const promises = []

	for (let i = 0; i < documents.length; i++) {
		promises.push(
			(async (document) => {
				const times = await activity(documents[i].document_id)
				document.times = document.times.map(time => time ? time.getTime() : time)
				const convertedTimes = times.map(time => time ? new Date(time).getTime() : time)

				for (let j = 0; j < convertedTimes.length; j++) {
					if (!document.times.includes(convertedTimes[j])) {
						await pool.query(`
							INSERT INTO activities
							(work_id, time) VALUES ($1, $2)
						`, [document.id, new Date(convertedTimes[j])])
					}
				}
			})(documents[i])
		)
	}

	await Promise.all(promises)
}

checkActivity()
setInterval(checkActivity, 60000)

export default router