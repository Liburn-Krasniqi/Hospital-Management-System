# HMS – Hospital Management System

A full-stack web application for managing patients, doctors, appointments, and medical reports.

## Stack

- **Frontend:** React 19, Vite, React Router, Bootstrap, Lucide React
- **Backend:** Node.js, Express 5
- **Database:** PostgreSQL with Prisma ORM

## Project Structure

```
HMS/
├── client/          # React frontend
├── server/          # Express API + Prisma
└── README.md
```

## Prerequisites

- Node.js 18+
- PostgreSQL
- npm or pnpm

## Setup

### 1. Database

Create a PostgreSQL database and set the connection string in `server/.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/HMS"
PORT=8000
```

> **Note:** The client expects the API at `http://localhost:8000`. Set `PORT=8000` in `server/.env` so they match.

### 2. Server

```bash
cd server
npm install
npx prisma migrate dev
npm run dev
```

### 3. Client

```bash
cd client
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Features

| Role   | Capabilities |
|--------|--------------|
| **Patient** | Sign up, browse doctors, request appointments, view appointments, view medical reports |
| **Doctor**  | Log in, manage appointment requests, view appointments, write reports, view reports |

### Main flows

- **Appointments:** Patients request appointments → doctors approve/reject → appointments are scheduled
- **Reports:** Doctors write reports for patients (findings, recommendations, type of visit); reports can be linked to appointments

## API Overview

| Base       | Endpoints |
|-----------|-----------|
| `/api/patients`   | CRUD, pagination |
| `/api/doctors`    | List, by ID |
| `/api/appointments` | CRUD, by patient/doctor, requests |
| `/api/reports`    | CRUD, by patient/doctor/appointment |

## Scripts

### Server
- `npm run dev` – Start with nodemon
- `npm start` – Start production server

### Client
- `npm run dev` – Start Vite dev server
- `npm run build` – Production build

## License

ISC
