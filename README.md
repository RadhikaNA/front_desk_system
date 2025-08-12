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

![WhatsApp Image 2025-08-12 at 11 50 56 AM](https://github.com/user-attachments/assets/8485cd44-9e02-44e8-ad06-cef432b059a0)

![WhatsApp Image 2025-08-12 at 11 51 37 AM](https://github.com/user-attachments/assets/663aab0b-cb16-457e-a7b2-3c3aeb2ffc6c)

![WhatsApp Image 2025-08-12 at 11 52 13 AM](https://github.com/user-attachments/assets/4d23368f-a3ba-43ba-8d1d-65277090e243)

![WhatsApp Image 2025-08-12 at 11 53 15 AM](https://github.com/user-attachments/assets/9d65ea91-02cf-494c-8603-1f85ea60b587)

![WhatsApp Image 2025-08-12 at 11 54 43 AM](https://github.com/user-attachments/assets/547bb3a3-f67b-4651-925a-0478e778d9e0)

![WhatsApp Image 2025-08-12 at 11 54 57 AM](https://github.com/user-attachments/assets/fb984d0a-9c08-4cd1-9bb0-14c6e55fed29)

![WhatsApp Image 2025-08-12 at 11 55 33 AM](https://github.com/user-attachments/assets/e271d88b-1aaf-4bed-a1f4-d1a79cf3be98)

![WhatsApp Image 2025-08-12 at 12 02 08 PM](https://github.com/user-attachments/assets/dc9128bc-063d-49ea-9f06-499c80ef544b)

![WhatsApp Image 2025-08-12 at 12 02 39 PM](https://github.com/user-attachments/assets/00f469b1-d228-47ed-9f65-1797ad10a5d0)


