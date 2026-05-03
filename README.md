# 🏫 PlaySchool Management Portal
**A Comprehensive Full-Stack Educational Finance & Administration Portal**

PlaySchool is a robust MERN stack application designed to digitize school administration and fee management. It features a sophisticated  teacher dashboard, student dashboard for real-time fee tracking and an advanced admin panel for institutional financial monitoring.


## 🚀 Key Features

### **Student Experience**
*   **Intelligent Fee Tracking**: A centralized view of pending, paid, and overdue fees.
*   **Unified Payment Flow**: Integration with **Razorpay** allows students to pay individual installments or clear all dues in a single transaction.
*   **Smart Reminders**: Automated visual cues and reminders for overdue payments to ensure zero late-fee surprises.
*   **Digital Receipts**: On-demand PDF receipt generation using **jsPDF** for every successful transaction.

### **Teacher Experience**
*   **Digital Attendance Tracker**: A streamlined interface for teachers to mark daily attendance, which automatically syncs with the student's profile.
*   **Assessment**: Tools to input marks for assignments and exams, with automatic percentage and grade calculation.
*   **Application review**: Managing student requests directly from the faculty portal.

### **Administration & Finance**
*   **Finance Tracker Dashboard**: High-level analytics including Total Collection, Pending Dues, and Active Student counts.
*   **Automated Notifications**: One-click **Nodemailer** integration to send professional email reminders to students with outstanding balances.
*   **Deep Data Population**: Efficient database queries using Mongoose deep population to link students, users, and fee records seamlessly.
*   **Transaction Auditing**: Real-time logging of all successful payments with unique Razorpay IDs.


## 🛠️ Tech Stack

*   **Frontend**: React.js, Tailwind CSS (Modern Glassmorphism UI)
*   **Animations**: Framer Motion
*   **Backend**: Node.js, Express.js
*   **Database**: MongoDB
*   **Payment Gateway:** Razorpay
*   **Email Service:** Nodemailer (Gmail SMTP)
*   **PDF Generation**: jsPDF


## 📦 Installation & Configuration

1.  **Clone the Repository**
    ```bash
    git clone [https://github.com/your-username/Playschool.git](https://github.com/your-username/Playschool.git)
    ```

2.  **Install Dependencies**
    ```bash
    # Install backend dependencies
    cd backend && npm install
    # Install frontend dependencies
    cd frontend && npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory (ensure this is listed in your `.gitignore` to protect sensitive keys):
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    RAZORPAY_KEY_ID=your_razorpay_key
    RAZORPAY_KEY_SECRET=your_razorpay_secret
    EMAIL_USER=your_school_email@gmail.com
    EMAIL_PASS=your_gmail_app_password
    ```

4.  **Run the application:**
    ```bash
    # From root directory
    cd backend && npm start
    cd frontend && npm start
    ```

## 🔒 Security Measures
*   **Signature Verification**: Implements SHA-256 HMAC verification for all payment signatures to prevent fraudulent transactions.
*   **Data Integrity**: Used Mongoose `updateMany` for bulk payment status updates, ensuring database consistency.
*   **Credential Masking**: Strict use of `.env` files and Git exclusion patterns to protect API secrets.


## 👤 About the Author
**Aditi Nageshwar**
*   **MCA Graduate Student**, National Institute of Technology (NIT), Bhopal (Class of 2026)