# PixNest — Cloud Image Storage

A full-stack web application that allows users to register, create nested folders, and upload images  similar to Google Drive.

Built as part of the Dobby Ads Full Stack Developer Assignment.

## Live Demo

https://dobby-ads-khaki.vercel.app

## Test Credentials

| Field    | Value            |
|----------|------------------|
| Email    | test@pixnest.com |
| Password | test1234         |

## Features

- User authentication — Signup, Login, Logout with JWT
- Create nested folders at any depth
- Upload images inside folders with name and file
- Folder size calculated recursively including all subfolders
- User-specific access — users only see their own data
- Clean, responsive UI

## Tech Stack

| Layer     | Technology              |
|-----------|-------------------------|
| Frontend  | ReactJS, Axios          |
| Backend   | Node.js, Express.js     |
| Database  | MongoDB Atlas, Mongoose |
| Auth      | JWT, bcryptjs           |
| Storage   | Multer (image uploads)  |
| Deploy    | Vercel + Render         |

## Project Structure
dobby-ads/
├── backend/

│   ├── models/

│   │   ├── User.js

│   │   ├── Folder.js

│   │   └── Image.js

│   ├── routes/

│   │   ├── auth.js

│   │   ├── folders.js

│   │   └── images.js

│   ├── middleware/

│   │   └── auth.js

│   └── server.js

└── frontend/

└── src/

├── pages/

│   ├── Login.js

│   ├── Signup.js

│   └── Dashboard.js

├── components/

│   ├── Navbar.js

│   └── FolderItem.js

└── context/

└── AuthContext.js

## API Endpoints

| Method | Endpoint                     | Description          | Auth |
|--------|------------------------------|----------------------|------|
| POST   | /api/auth/signup             | Register new user    | No   |
| POST   | /api/auth/login              | Login user           | No   |
| GET    | /api/folders                 | Get root folders     | Yes  |
| POST   | /api/folders                 | Create folder        | Yes  |
| GET    | /api/folders/:id/children    | Get subfolders       | Yes  |
| DELETE | /api/folders/:id             | Delete folder        | Yes  |
| GET    | /api/images/folder/:id       | Get images in folder | Yes  |
| POST   | /api/images                  | Upload image         | Yes  |
| DELETE | /api/images/:id              | Delete image         | Yes  |

## Running Locally

### Prerequisites
- Node.js
- MongoDB

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm start
```

### Environment Variables (backend/.env)
PORT=5000

MONGO_URI=your_mongodb_uri

JWT_SECRET=your_jwt_secret

## Deployment

- Frontend deployed on **Vercel** — https://dobby-ads-khaki.vercel.app
- Backend deployed on **Render** — https://pixnest-backend.onrender.com
- Database hosted on **MongoDB Atlas**

