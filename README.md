# Front Desk System (Demo)

A minimal **Front Desk System** for a clinic, built with:
- **Backend**: NestJS + TypeORM + MySQL
- **Frontend**: Next.js (React)
- **Database**: MySQL
- Includes features for managing **doctors, appointments, and patient queues**.

---

## Running the Project

### 1️⃣ Using XAMPP (Recommended for Windows Users)

1. **Download and extract** the project files to your computer.
2. **Open XAMPP** and start **Apache** and **MySQL** services.
3. Open **phpMyAdmin** in your browser:  [http://localhost/phpmyadmin](http://localhost/phpmyadmin)
4. Create a new database named: frontdesk
*(No need to create tables — they will be generated automatically.)*
5. Open **Windows PowerShell** or your **Terminal** and navigate to the backend folder:
```bash
cd your_file_path\backend
npm install
npm run start:dev
````

6. Open a **new terminal tab** and navigate to the frontend folder:

   ```bash
   cd your_file_path\frontend
   npm install
   npm run dev
   ```
7. When the frontend starts, open the link:

   ```
   http://localhost:3000
   ```

---

### 2️⃣ Using Docker (Optional)

1. Make sure **Docker** and **Docker Compose** are installed.
2. From the project root, run:

   ```bash
   docker compose up --build
   ```

   This will:

   * Start MySQL (port `3306`)
   * Build & start backend (port `3001`)
   * Build & start frontend (port `3000`)
3. Open:

   ```
   http://localhost:3000
   ```

---

## Login Details

* **Username:** `admin`
* **Password:** `password123`

---

## Notes

* Backend seeds two sample doctors on first run.
* For quick API testing, use **Postman** to call backend endpoints at:

  ```
  http://localhost:3001
  ```

## Notes  
- Backend seeds a default user: **username: admin**, **password: password123**.  
- Backend seeds two sample doctors.  
- For quick API testing use Postman to call backend endpoints at http://localhost:3001  
- The project is intentionally minimal to satisfy assignment requirements; extend it as needed.

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


