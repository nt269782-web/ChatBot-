# ChatBot — Vercel + Spring Boot

This project is prepared as a **Vercel frontend + Spring Boot backend** deployment.

## What was fixed

- Removed the old `.history`, `.idea`, `.vscode` and `target` files from the deployment package.
- Fixed the database mismatch: the original project had a PostgreSQL Maven dependency but a MySQL JDBC URL.
- Added environment-based database configuration.
- Added H2 as a local fallback, so the backend can start without MySQL.
- Added `PORT` support for cloud hosting.
- Removed hard-coded `http://localhost:8080` calls from the frontend.
- Added Vercel serverless proxy functions under `/api`.
- Fixed unsafe `innerHTML` usage for user messages.
- Fixed admin Edit handling when questions/answers contain quotes.
- Added proper API error handling.
- Added a clean Vercel `index.html`.
- Added a Dockerfile suitable for the Spring Boot backend.

## Deployment architecture

```text
Browser
   |
   v
Vercel
   |-- index.html
   |-- admin.html
   |-- /api/chat ------------   |-- /api/admin/* ---------> Spring Boot backend
                              |
                              v
                         PostgreSQL
```

## 1. Deploy the backend

Deploy this repository to a service that runs Java/Docker, such as Render.

Set these environment variables on the backend:

```text
DB_URL=jdbc:postgresql://<host>:5432/<database>?sslmode=require
DB_USERNAME=<database username>
DB_PASSWORD=<database password>
DB_DRIVER=org.postgresql.Driver
```

After deployment, copy the backend URL, for example:

```text
https://your-chatbot-backend.onrender.com
```

## 2. Deploy the frontend on Vercel

Import this repository/project into Vercel.

In **Vercel → Project → Settings → Environment Variables**, add:

```text
BACKEND_URL=https://your-chatbot-backend.onrender.com
```

Then redeploy.

The frontend calls `/api/chat` and `/api/admin/*`; Vercel proxies those requests to the Spring Boot backend.

## 3. URLs after deployment

Main chatbot:

```text
https://your-vercel-project.vercel.app/
```

Admin panel:

```text
https://your-vercel-project.vercel.app/admin
```

## Local testing

### Backend

```bash
./mvnw spring-boot:run
```

On Windows:

```bat
mvnw.cmd spring-boot:run
```

The H2 fallback database is used locally when `DB_URL` is not set.

### Frontend

You can open `index.html` with a local static server. The Vercel `/api` proxy itself is available after deployment (or through `vercel dev`).

## Important

Vercel is used for the frontend and API proxy. The Spring Boot/JPA backend should be deployed on a Java-capable service such as Render. **Do not put database passwords in JavaScript or commit them to GitHub.**
