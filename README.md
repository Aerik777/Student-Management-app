# 🎓 Student Management System

A comprehensive Full-Stack Student Management System built with **Next.js 14**, providing specialized portals for Admins, Faculty, and Students. Features real-time communication, assignment management, attendance tracking, and fee processing.

---

## 🚀 Key Features

### 👤 User Roles & Dashboards

- **SuperAdmin**: System-level configuration and high-level oversight.
- **Admin**:
  - CRUD operations for Students and Faculty.
  - Manage Departments and Courses.
  - Track Attendance and Grades.
  - Fee management integration.
- **Faculty**:
  - Create and manage assignment questions.
  - Grade student submissions.
  - Real-time messaging with students.
  - Profile management.
- **Student**:
  - Submit assignments (PDF support).
  - View grades and attendance.
  - Real-time messaging with faculty.
  - Pay fees via secure payment gateway.

### 🛠️ Technical Capabilities

- **Real-time Messaging**: Powered by **Pusher** for instant chat between students and faculty.
- **Secure Authentication**: Robust role-based access control (RBAC) using **NextAuth.js**.
- **Assignment Handling**: Support for PDF submissions and teacher feedback.
- **Data Export**: Generate PDFs for reports or certificates using **jsPDF** and **html2canvas**.
- **Payments**: Integrated with **Stripe** for handling tuition fees and other payments.
- **Email Notifications**: Automated notifications via **Nodemailer**.

---

## 💻 Tech Stack

- **Frontend**: [Next.js 14](https://nextjs.org/) (App Router), [Tailwind CSS](https://tailwindcss.com/), [Lucide React](https://lucide.dev/) (Icons).
- **Backend**: Next.js Server Actions & API Routes.
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/) ODM.
- **Real-time**: [Pusher](https://pusher.com/).
- **Authentication**: [NextAuth.js](https://next-auth.js.org/).
- **Forms**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/).
- **Payments**: [Stripe](https://stripe.com/).

---

## 🛠️ Setup & Installation

### 1. Prerequisites

- Node.js (v18 or later)
- MongoDB account (local or Atlas)
- Pusher account
- Stripe account (for payments)

### 2. Clone the repository

```bash
git clone <repository-url>
cd Student-Management-app
```

### 3. Install dependencies

```bash
pnpm install
# or
npm install
```

### 4. Environment Variables

Create a `.env` file in the root directory and add the following:

```env
# Database
MONGODB_URI=your_mongodb_uri

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key

# Email Configuration (Nodemailer)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Pusher Configuration (Real-time chat)
PUSHER_APP_ID=your_id
NEXT_PUBLIC_PUSHER_KEY=your_key
PUSHER_SECRET=your_secret
NEXT_PUBLIC_PUSHER_CLUSTER=your_cluster

# Stripe Configuration
STRIPE_SECRET_KEY=your_stripe_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable
```

### 5. Run Development Server

```bash
pnpm dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📂 Project Structure

- `/app`: Next.js App Router folders for all routes (Admin, Faculty, Student portals).
- `/actions`: Server Actions for database operations and business logic.
- `/components`: Reusable UI components.
- `/models`: Mongoose schemas for Users, Assignments, Attendance, etc.
- `/lib`: Utility functions and shared library configurations (MongoDB, Pusher).
- `/public`: Static assets (images, icons).

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
