# 🍽️ SickMeal – Hostel Meal Request Management System

SickMeal is a web-based platform designed specifically for college hostels to simplify and streamline the process of meal requests for students who are unwell. It ensures smooth communication between students, wardens, and mess in-charges while reducing manual overhead and delays.

---

## 🎯 Purpose

- Simplify the meal request process for sick students in hostels.
- Enable wardens and mess in-charges to efficiently handle approvals and notifications.
- Ensure only authenticated users (college emails) can access the system.
- Improve student well-being by eliminating delays and reducing manual errors.

---

## 🧑‍💻 Users & Roles

- **Student:** Can submit a meal request online using their **college email**.
- **Warden:** Can view and approve/reject requests from students using their **college email**.
- **Mess In-Charge:** Gets notified of approved requests.
- **Admin:** Has access to view **all requests** and their statuses.

---
## Student SignUp
![Screenshot 2025-05-29 161715](https://github.com/user-attachments/assets/5ff52710-c1b8-4069-a758-3da4667614d1)

## Warden Signup

![Screenshot 2025-05-29 163337](https://github.com/user-attachments/assets/fead3962-e2cf-4997-8855-4113636301cd)


## 🔄 Workflow
## 1.Studen Dashboard

  ![Screenshot 2025-05-29 163247](https://github.com/user-attachments/assets/ddfa64ac-8af0-4183-8e6b-fa962508fd85)


### 2. 📝 Online Meal Request Submission by Student
- Students log in using their official college email.
- They fill out a request form with details like name, roll number, room, reason, etc.

![Screenshot 2025-05-29 162740](https://github.com/user-attachments/assets/be4d32db-5fa1-4e4d-8af3-a6d42aed95e8)


---

### 3. 🗂️ Warden Approval Process
- Warden logs in using their college email.
- Views pending requests and either approves or rejects them.

![Screenshot 2025-05-29 163953](https://github.com/user-attachments/assets/2f8d51bc-0681-4d5a-9a5e-e1dc5c8ee666)


---

### 4. 🍽️ Mess In-Charge Notification
- Upon approval, the mess in-charge is notified.
- They ensure meals are provided to the student's room.

![Screenshot 2025-05-29 164631](https://github.com/user-attachments/assets/1db725f3-fafb-4ded-82b7-7b6fb724c4af)


---

### 5. 🛠️ Admin Dashboard
- Admin can see all student requests.
- Track the status: Pending, Approved, Rejected, Delivered.

![Screenshot 2025-05-29 164847](https://github.com/user-attachments/assets/82d61bc0-d279-405e-8bf3-1a8621d6a549)



---

## ⚙️ Tech Stack

- **Frontend:** React.js, HTML, CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **IDE:** Visual Studio Code

---

## 🚀 Getting Started

### 🔧 Prerequisites

- Node.js & npm
- MongoDB Atlas Cluster
- Visual Studio Code

### 📦 Installation

1. **Clone the Repository**
```bash
git clone https://github.com/your-username/sickmeal.git
cd sickmeal
