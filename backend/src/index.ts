import dotenv from 'dotenv'
import { pool } from './database'
import express from 'express'
import cors from 'cors'
import utf8 from 'utf8'
import google from './google'
dotenv.config()

const app = express()
app.use(cors())
app.options('*',cors())
app.use('/google', google)


// select all from students table
app.get('/select_courses', (request, response) => {
 
	pool.query('SELECT * FROM courses;', (error, result) => {
			if (error) throw error;

			response.send(result.rows);
	});
});


// select all from templates table *
app.get('/select_templates', (request, response) => {
 
	pool.query('SELECT * FROM templates', (error, result) => {
			if (error) throw error;

			response.send(result.rows);
	});
});

// select courses for teacher *
app.get('/select_courses_for_teacher', (request, response) => {
	request.query.teacher_id = 1

	pool.query(`SELECT id, name FROM courses 
	JOIN teachers_courses ON courses.id = teachers_courses.course_id 
	WHERE teachers_courses.teacher_id = $1`, [request.query.teacher_id], (error, result) => {
			if (error) throw error;

			response.send(result.rows);
	});
});

// select groups for course *
app.get('/select_groups_for_course', (request, response) => {
 
	pool.query(`SELECT id, name FROM groups 
	JOIN groups_courses ON groups_courses.group_id = groups.id
	WHERE groups_courses.course_id = $1`, [request.query.course_id], (error, result) => {
			if (error) throw error;

			response.send(result.rows);
	});
});

// select course name by its id *
app.get('/select_course_name_by_id', (request, response) => {
 
	pool.query(`SELECT name FROM courses WHERE id = $1`, [request.query.id], (error, result) => {
			if (error) throw error;

			response.send(result.rows);
	});
});

// select group name by its id *
app.get('/select_group_name_by_id', (request, response) => {
 
	pool.query(`SELECT name FROM groups WHERE id = $1`, [request.query.id], (error, result) => {
			if (error) throw error;

			response.send(result.rows);
	});
});

// select students by group id *
app.get('/select_students_by_group_id', (request, response) => {
 
	pool.query(`SELECT * FROM students WHERE group_id = $1 ORDER BY full_name ASC`, [request.query.group_id], (error, result) => {
			if (error) throw error;

			response.send(result.rows);
	});
});

// select works *
app.get('/select_works_for_student', (request, response) => {

	pool.query(`SELECT * FROM works WHERE course_id = $1 AND student_id = $2`, 
	[request.query.course_id, request.query.student_id], (error, result) => {
			if (error) throw error;

			response.send(result.rows);
	});
});

// select info about work *
app.get('/select_work_info', (request, response) => {

	pool.query(`SELECT works.id id, works.name work_name, works.complited, works.deadline, works.created_at,
	works.document_id, students.short_name student_sname, 
	c.id course_id, c.name course_name, g.id group_id, g.name group_name, array_agg(activities.time) times
	FROM works JOIN students ON works.student_id = students.id 
	JOIN courses AS c ON works.course_id = c.id 
	JOIN groups AS g ON students.group_id = g.id
	LEFT JOIN activities ON activities.work_id = works.id
	WHERE works.id = $1
	GROUP BY works.id, works.name, works.complited, works.created_at,
	works.document_id, students.short_name, 
	c.id, c.name, g.id, g.name`,
	[request.query.id], (error, result) => {
			if (error) throw error;

			response.send(result.rows);
	});
});

app.post('/change_work_status', (request, response) => {
	pool.query(`UPDATE works SET complited = $1, finished_at = now() WHERE id = $2`,
	[true, request.query.id], (error, result) => {
			if (error) throw error;

			response.send(result.rows);
	});
});


app.listen(80)

