Digital Health Record – React + Material UI

This project is a simple digital health record dashboard I built to practice real-world frontend skills.
It focuses on clean UI, reusable components, and a clear data lifecycle for patients, appointments, labs, and activity logs.



## 🚀 **What the app does**

The app allows you to:

### **🧑‍⚕️ Manage Patients**

* Add new patients
* View all patients in a list
* Open a full patient profile page
  (timeline of appointments + lab history)

### 📅 Handle Appointments

* Create quick appointments from the dashboard
* Update appointment status (completed / cancelled)
* Delete appointments when needed
* Today’s appointments appear automatically

### **🔬 Track Lab Results**

* Add lab results to specific patients
* They show up instantly in the activity feed
* They are also linked to the patient’s timeline

### **📝 Activity Log**

* Every important action is recorded
* You can delete a single entry or clear everything

---

## 🎨 **UI & UX**

* Material UI v7 (with the new Grid v2)
* Light/Dark mode switch
* Sticky navbar with navigation
* Breadcrumbs for page structure
* Skeleton loaders, alerts, and snackbars
* Fully responsive layout

The goal was to make the dashboard feel modern and easy to use.

---

## 🧩 **Tech Stack**

* **React + Vite**
* **Material UI 7**
* **LocalStorage** for data
* **Custom storage modules**
  (`appointmentsStorage`, `patientsStorage`, `activityStorage`)

---

## 📦 **How to run it locally**

```bash
npm install
npm run dev
```

Open:

```
http://localhost:5173
```

---

## 📚 Why I built this

I wanted to create a dashboard that feels close to real medical or admin software:

* clear workflows
* reusable components
* separated data modules
* consistent UI
* and a structure that could later connect to a backend

It helped me understand how to think in lifecycles (patients → appointments → labs → activity) and how data flows between pages.

---

## 💡 Next steps

Some features I plan to add:

* Edit patient details
* Add clinical notes
* Search & filtering
* Move to a real backend (Node/Express or FastAPI)
* JWT login instead of simple auth

---

If you'd like, I can also add:

✅ Project screenshots
✅ A demo GIF
✅ Badges (React, MUI, Vite)
✅ A clean architecture diagram


