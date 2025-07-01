# ✨ Next.js Todo App - Javascript

This is a simple **Todo application** built using **Next.js (JavaScript)**.  
It uses **NeonDB (PostgreSQL)** as the database and JWT for authentication.

---

## 💾 Environment Variables

```env
DATABASE_URL="from neondb"
JWT_SECRET="your_jwt_secret_here"
```

---

## ⚡ Getting Started

```bash
npm install
npm run dev
```

## 🗂️ Project Structure

- `src/app/page.jsx`: The first landing page.
- `src/app/todo/page.jsx`: The main Todo page where users can see and manage their tasks.
- `scripts/01-create-tables.sql`: SQL file containing queries to create necessary database tables.

## 🧩 Auth Dialog

`src/components/auth-dialog.jsx`

This is the authentication modal dialog shown on the landing page for login/register.

## 🧑‍💻 Controllers

Inside `src/controllers/`, there are controller files that handle business logic:

**Task Controller**
- Handles creating, fetching, updating, deleting, and toggling tasks.
- Uses model functions to interact with the database.
- Returns standardized success or error responses.

**Auth Controller**
- Handles user authentication logic (e.g., login, register).
- Validates credentials and generates JWT tokens.

## 💡 How APIs Work

All APIs live inside `src/app/api/`.

- The APIs receive HTTP requests (like POST, PUT, DELETE).
- They parse request data and validate it.
- Call the relevant controller function (e.g., `taskController.updateTask()`).
- The controller then calls the model (e.g., `Task.update()`), which actually runs SQL queries.
- Finally, APIs return JSON responses.

### Example APIs

**`src/app/api/auth/login/route.js`**
- Handles login requests.
- Checks email and password, calls `authController.login`.
- Returns a JWT token on success.

**`src/app/api/tasks/[id]/route.js`**
- PUT: Updates an existing task using `taskController.updateTask`.
- DELETE: Deletes a task using `taskController.deleteTask`.

## 🗃️ Models

Located in `src/models/`:

- Define functions to interact with the database using raw SQL queries via Neon.
- Example methods: `create`, `findByUserId`, `update`, `delete`, `toggleComplete`.

## 🏗️ Flow Summary

```
API route ➡️ Controller ➡️ Model ➡️ Database
```

1. API receives request and calls controller.
2. Controller handles logic and calls model.
3. Model runs SQL queries and returns results.
4. Controller processes result and sends back to API.
5. API sends JSON response to client.

## ✅ Scripts

The `scripts/01-create-tables.sql` file contains the SQL commands needed to create database tables. Run these on neondb .

## 🚀 Run It

```bash
npm install
npm run dev
```
