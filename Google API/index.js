const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/documents',
								'https://www.googleapis.com/auth/documents.readonly',
								'https://www.googleapis.com/auth/drive',
								'https://www.googleapis.com/auth/drive.file',
								'https://www.googleapis.com/auth/drive.appdata',
								'https://www.googleapis.com/auth/drive.photos.readonly',
								'https://www.googleapis.com/auth/drive.readonly',
								'https://www.googleapis.com/auth/drive.metadata.readonly',
								'https://www.googleapis.com/auth/drive.metadata'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Docs API.
  authorize(JSON.parse(content), printDocTitle);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Prints the title of a sample doc:
 * https://docs.google.com/document/d/195j9eDD3ccgjQRttHhJPymLJUCOUjs-jmwTrekvdjFE/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth 2.0 client.
 */
function printDocTitle(auth) {
	/*
  const docs = google.docs({version: 'v1', auth});
  docs.documents.get({
    documentId: '195j9eDD3ccgjQRttHhJPymLJUCOUjs-jmwTrekvdjFE',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    //console.log(`The title of the document is: ${res.data.title}`);
  });
	*/
	const drive = google.drive({version: 'v3', auth});
	var copyTitle = "???????????????? ????????";
	let request = {
		name: copyTitle,
	};
	drive.files.copy({
		fileId: '1n56O1ivlBibwVB9VqV-na2-EF1rvoLdB',
		resource: request,
	}, (err, driveResponse) => {
		if (err) return console.log('The API returned an error: ' + err);
		console.log(driveResponse.data.id)
		startPolling(driveResponse.data.id, drive)
	});
}

const modifiedTimes = []

function startPolling(fileId, drive) {
	setInterval(() => {
		drive.revisions.list({
			fileId
		}, (err, driveResponse) => {
			if (err) return console.log('The API returned an error: ' + err)
			
			const { revisions } = driveResponse.data

			for (let i = 0; i < revisions.length; i++) {
				const { modifiedTime } = revisions[i]

				if (!modifiedTimes.includes(modifiedTime)) {
					modifiedTimes.push(modifiedTime)
					console.log('new edit at', modifiedTime)
				}
			}
			
			fs.writeFileSync('modified_times.json', JSON.stringify({ fileId, modifiedTimes }, null, 2))
		})
	}, 10000)
}