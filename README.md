# Knitto Group - Backend Developer Skill Test

This project is a RESTful API for an ordering system, developed using **Node.js**, **TypeScript**, and **PostgreSQL (Raw SQL)** to meet the technical requirements for the Knitto Group Skill Test.

## 📦 Installation & Setup

Follow these steps to run the project locally:

### 1. Clone & Install
```bash
git clone [https://github.com/siyaga/produk-test.git]
cd knitto-backend-test
npm install
```

2. Environment Setup
Create a .env file in the root directory and configure your database credentials:

Cuplikan kode
PORT=3000
DATABASE_URL=postgres://user:password@localhost:5432/db_name
JWT_SECRET=your_secret_key
3. Run Application
The project includes an automatic initialization script to set up database tables and indexes on the first run.

Bash
# Development Mode
npm run dev

# Production Mode
npm run build
npm start
4. API Documentation
Once the server is running, the full interactive documentation is available at: http://localhost:3000/api-docs
