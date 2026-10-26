# StudyFlow Student Task Manager

A beginner-friendly full-stack project for tracking study tasks. It demonstrates MongoDB, Express, React, and Node.js working together.

> This starter is designed to run locally after installing the prerequisites and configuring MongoDB. Add your own screenshots, test results, GitHub URL, and live URL before submitting it.

## Features

- Create an account and sign in.
- Add, list, edit, complete, and delete your own tasks.
- Add an optional description and due date.
- Filter tasks by all, to do, and completed.
- Show loading, empty, and error states.
- Protect task ownership on the server.
- Validate input, limit sign-in attempts, use secure HTTP headers, and keep the login session in an HTTP-only cookie.
- Paginate the task API (20 by default, maximum 50 per page).

## What you need

1. Node.js 20.19 or newer (includes npm).
2. Visual Studio Code (VS Code) or another code editor.
3. MongoDB running locally, or a MongoDB Atlas database.
4. Git for version control and GitHub.

Official installers: [Node.js](https://nodejs.org/en/download), [VS Code](https://code.visualstudio.com/Download), [MongoDB](https://www.mongodb.com/try/download/community), and [Git](https://git-scm.com/downloads). Check `node -v`, `npm -v`, and `git --version` in a terminal.

## Open in Visual Studio Code

1. Extract the ZIP to a folder you can find, such as `Documents/Projects/StudentTaskManagerProject`.
2. Open VS Code and choose **File → Open Folder...**. Select the extracted `StudentTaskManagerProject` folder.
3. Choose **Terminal → New Terminal**. Run the commands below from the folder containing this README.

## Set up MongoDB and private settings

1. Copy `server/.env.example` to `server/.env`.
2. Set `MONGODB_URI` to your local MongoDB URL or Atlas connection string.
3. Replace `JWT_SECRET` with a long random string (at least 32 characters). In PowerShell you can generate one with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
4. Copy `client/.env.example` to `client/.env`. The default API address works for local development.
5. Keep both `.env` files private. Git ignores them. Never commit a database password or JWT secret. Frontend variables beginning with `VITE_` are visible to browser users, so do not put secrets there.

For local MongoDB, start its service first. For Atlas, create a database user and restrict network access. Paste the connection string only into `server/.env`.

## Install packages and start the app

In the VS Code terminal at the project root:

```bash
npm install
npm --prefix server install
npm --prefix client install
npm run dev
```

Open the address Vite prints (usually `http://localhost:5173`). The API status page is `http://localhost:5000/api/health`. Keep the terminal open while using the app. Press **Ctrl+C** to stop it.

### Common setup problems

- **MongoDB connection error:** start MongoDB and check `MONGODB_URI`, database credentials, and Atlas network access.
- **Missing environment variable:** check that `.env` is in the correct folder and is not still named `.env.example`.
- **Port already in use:** close another app using port 5000 or 5173.
- **CORS error:** make sure `CLIENT_URL` exactly matches the browser address.
- **Still stuck:** read the server terminal, then the browser Developer Tools Console and Network tabs. Change one thing at a time and retry.

## Folder map

```text
StudentTaskManagerProject/
  client/
    src/
      App.jsx                 Screens, form, task list, and UI states
      api.js                  Shared HTTP client
      styles.css              Responsive styling
    .env.example              Frontend API address; no secrets
  server/
    src/
      config/                 Environment and database connection
      controllers/            Request handling
      middleware/             Authentication and error handling
      models/                 User and Task schemas
      routes/                 API paths and HTTP methods
      utils/                  Validation and async helper
    .env.example              Backend variable names only
  .vscode/                    Helpful editor recommendations
  .gitignore
  README.md
```

## What happens when you save a task?

1. React checks the form and sends `POST /api/tasks`.
2. Express checks the login cookie.
3. The controller validates the task again and associates it with the signed-in user.
4. Mongoose saves it in MongoDB.
5. The API returns the task and React shows it in the list.

React never connects directly to MongoDB. The backend checks ownership for every task operation.

## API reference

All task endpoints require a signed-in session. Responses use JSON.

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/api/health` | Check that the API is running |
| `POST` | `/api/auth/register` | Create an account |
| `POST` | `/api/auth/login` | Sign in |
| `GET` | `/api/auth/me` | Get the signed-in user |
| `POST` | `/api/auth/logout` | Sign out |
| `GET` | `/api/tasks?page=1&limit=20` | List your tasks |
| `POST` | `/api/tasks` | Create a task |
| `PATCH` | `/api/tasks/:id` | Update your task |
| `DELETE` | `/api/tasks/:id` | Delete your task |

Common status codes: `200` success, `201` created, `400` invalid input, `401` sign-in required, `404` not found, `409` duplicate email, `500` unexpected server error.

## Beginner build plan

| Step | Build / learn | Evidence to collect |
|---|---|---|
| 1 | Read this guide and sketch the screens | Photo or screenshot of your sketch |
| 2 | Start MongoDB and run the apps | App page opens; health endpoint returns `ok` |
| 3 | Create an account and sign in | Note the steps; do not record your password |
| 4 | Add, edit, complete, and delete tasks | Screenshot using fake sample data |
| 5 | Try an invalid title and an empty list | Record the visible validation and empty messages |
| 6 | Create a second account and check privacy | Account two cannot see account one's tasks |
| 7 | Complete the checklist below | Fill in actual outcomes |
| 8 | Commit milestones and push to GitHub | Repository URL and meaningful commits |
| 9 | Deploy after the local flows work | Live URL and production checks |

Do not mark work complete until you have tried it yourself.

## Manual review checklist

Fill in the Result column while you manually check the app. Use fake sample details.

| Check | Expected result | Result |
|---|---|---|
| Open the app while signed out | Sign-in screen appears | |
| Submit invalid email or short password | Helpful message; account is not created | |
| Register with valid details | Task dashboard appears | |
| Add a task with a title | Task appears after saving | |
| Try to submit without a title | Form prevents submission | |
| Mark a task completed | Status changes to Done | |
| Edit a task | Updated information appears | |
| Filter to To do and Done | Only matching tasks appear | |
| Delete a task | It disappears after confirmation | |
| Sign out, then sign back in | Saved tasks remain | |
| Create a second account | It cannot see the first account's tasks | |
| Refresh the browser | Session and tasks load correctly | |

## Git and GitHub

Do this after you have tried the local app. Never add `.env` files.

```bash
git init
git add .
git status
```

Check the `git status` output. If `server/.env` or `client/.env` appears, stop and fix `.gitignore`. Then make a first commit:

```bash
git commit -m "Create MERN task manager starter"
```

Create an empty GitHub repository. Choose **Private** while developing unless your course requires it to be public. Copy the repository HTTPS URL and replace the example below:

```bash
git remote add origin https://github.com/YOUR-NAME/YOUR-REPOSITORY.git
git branch -M main
git push -u origin main
```

Save future work in small commits, such as `Add task completion filter`, then run `git push`. Add the repository URL to this README before submitting.

## Deployment checklist

This project is set up for local learning. Before deployment, configure production environment variables, allow only the deployed frontend origin, use HTTPS, enable secure cookies, restrict database access, and verify that no request points to localhost. Check sign-up, sign-in, ownership, refresh, and core task actions on the live site. Hosting limits and prices change, so check the provider's current documentation before choosing a host.

## Known limits and future ideas

- The starter has one student role; there is no admin dashboard or shared task feature.
- Email confirmation and password reset are not included.
- The interface displays up to 50 tasks at a time. The API accepts page parameters to demonstrate pagination.
- Add tests, a calendar, priorities, reminders, or deployment after you understand the core flows.

## Official learning references

- [React Learn](https://react.dev/learn)
- [Vite Guide](https://vite.dev/guide/)
- [Express Guide](https://expressjs.com/en/starter/installing/)
- [Mongoose Guide](https://mongoosejs.com/docs/)
- [MongoDB Manual](https://www.mongodb.com/docs/)
- [Git documentation](https://git-scm.com/doc)
- [GitHub documentation](https://docs.github.com/)

## Submission details

- Student: `[Your name]`
- Course / institution: `[Your course]`
- GitHub repository: `[Add your repository URL]`
- Hosted app: `[Add URL after deployment, if required]`
- Screenshots: `[Add screenshots using fake data]`
- Known limitations: `[Update after checking the app]`

## Companion report

The project planning report is included in docs/Student_Task_Manager_MERN_Project_Report.docx. Update the report and this README with your own implementation evidence before submission.

