
## Running Backend & Frontend Separately Using XAMPP (No Docker)

1. **Download and extract** the project files to your preferred folder.  

2. **Open XAMPP Control Panel**  
   - Start **Apache** and **MySQL** services.  

3. **Create the database in phpMyAdmin**  
   - Open your browser and go to: [http://localhost/phpmyadmin](http://localhost/phpmyadmin)  
   - Click **Databases** in the top menu.  
   - In the “Create database” field, enter **frontdesk** and click **Create**.  
   - *(No need to create tables — the backend will create them automatically when it runs.)*  

4. **Run the Backend**  
   - Open **Windows PowerShell** or **Command Prompt**.  
   - Navigate to the backend folder:  
     ```
     cd your_file_path\backend
     ```
   - Install dependencies:  
     ```
     npm install
     ```
   - Start the backend in development mode:  
     ```
     npm run start:dev
     ```

5. **Run the Frontend**  
   - Open a **new** PowerShell/Command Prompt window.  
   - Navigate to the frontend folder:  
     ```
     cd your_file_path\frontend
     ```
   - Install dependencies:  
     ```
     npm install
     ```
   - Start the frontend:  
     ```
     npm run dev
     ```

6. **Open the application**  
   - In your browser, go to [http://localhost:3000](http://localhost:3000) to access the frontend UI.  
   - Backend API will run on [http://localhost:3001](http://localhost:3001).  

7. **Login with default credentials**:  
   - **Username:** admin  
   - **Password:** password123


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


