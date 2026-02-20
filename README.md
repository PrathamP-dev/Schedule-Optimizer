# Project Scheduling System 🚀  

## 📌 Overview

ProManage Solutions Pvt. Ltd. manages multiple client software projects every week — including UI design, development, testing, and deployment.  

Since the company operates only **Monday to Friday** and can complete **one project per day**, smart scheduling is essential to avoid missed deadlines and revenue loss.

This project is a **Java-based scheduling system** connected to a **PostgreSQL database** that automates weekly planning and selects the most profitable projects within their deadlines.

---

## 🎯 The Problem

Project planning was previously handled using spreadsheets, which often resulted in:

- Missed deadlines  
- Inefficient planning  
- Revenue loss  

An automated system was needed to improve accuracy and maximize weekly profit.

---

## ⚙️ Key Features

- Store project details in PostgreSQL  
- Auto-generate unique project IDs  
- View all available projects  
- Generate an optimal weekly schedule  
- Maximum 5 projects per week  
- Only 1 project scheduled per day  

---

## 🧠 How It Works

The system uses a **Greedy Scheduling approach (Job Sequencing with Deadlines)**:

- Projects with higher revenue are given priority  
- Each project is scheduled before its deadline  
- No more than five projects are selected per week  

This ensures the company earns the highest possible revenue within its fixed working days.

---

## 🛠️ Tech Stack

- Java  
- PostgreSQL  
- JDBC  
- Greedy Algorithm  

---

## 🎓 Academic Purpose

This project was developed as part of a college assignment to demonstrate practical understanding of:

- Java programming  
- Database connectivity
- Data Structures
- Scheduling algorithms  
- Real-world problem solving  

---

## 👨‍💻 Author

**Pratham P. Sharma**  
Software Engineer | Cloud & Systems Enthusiast  

---
