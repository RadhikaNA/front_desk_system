```markdown
# Front Desk System (Demo)

This archive contains a minimal Front Desk System for a clinic.

**Structure**  
- backend/ : NestJS + TypeORM server (minimal)  
- frontend/: Next.js demo UI  
- docker-compose.yml : run MySQL + backend + frontend quickly  

## Quick start (using Docker)  
1. Make sure Docker & Docker Compose are installed.  
2. From the project root run:  
```

docker compose up --build

```
This will:  
- start MySQL (port 3306)  
- build & start backend (port 3001)  
- build & start frontend (port 3000)  
3. Open http://localhost:3000 in your browser.

## Quick start (manual setup)  

### Prerequisites  
- Node.js (v16 or above)  
- MySQL server running locally or remotely  
- npm or yarn package manager  

### Backend Setup  
1. Navigate to the backend directory:  
```

cd backend

```
2. Install dependencies:  
```

npm install

```
3. Create a `.env` file in the backend directory with the following content (adjust as needed):  
```

JWT\_SECRET=your\_jwt\_secret\_key
DB\_HOST=localhost
DB\_PORT=3306
DB\_USERNAME=your\_mysql\_username
DB\_PASSWORD=your\_mysql\_password
DB\_DATABASE=front\_desk\_db

```
4. Make sure the MySQL database (`front_desk_db`) exists or create it.  
5. Start the backend server:  
```

npm run start\:dev

```
The backend will seed the default admin user and sample doctors on first run.

### Frontend Setup  
1. Navigate to the frontend directory:  
```

cd frontend

```
2. Install dependencies:  
```

npm install

```
3. Create a `.env.local` file in the frontend directory with:  
```

NEXT\_PUBLIC\_API\_URL=[http://localhost:3001](http://localhost:3001)

```
4. Start the frontend development server:  
```

npm run dev

```
5. Open your browser at [http://localhost:3000](http://localhost:3000)

---

You can now log in using the seeded admin credentials:

- **Username:** admin  
- **Password:** password123

Use Postman or the UI to interact with the system.

## Notes  
- Backend seeds a default user: **username: admin**, **password: password123**.  
- Backend seeds two sample doctors.  
- For quick API testing use Postman to call backend endpoints at http://localhost:3001  
- The project is intentionally minimal to satisfy assignment requirements; extend it as needed.
```
Snapshots

![Snapshot 3](https://github.com/user-attachments/assets/13f75aa1-a1e3-4979-bca5-1a5291ea94ab)

![Snapshot 2](https://github.com/user-attachments/assets/17000def-27b4-49ee-8377-40577d790fd6)

![Snapshot 4](https://github.com/user-attachments/assets/2935ef16-e733-4552-b925-c8e2ec3b0a3c)

![Snapshot 1](https://github.com/user-attachments/assets/fd861ae0-5c0d-4417-857e-4fe0b0382dec)
