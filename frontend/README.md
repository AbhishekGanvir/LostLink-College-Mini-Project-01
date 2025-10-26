

#  LostLink - Lost and Found Service

## 📘 Overview

**Lostlink Frontend** is a responsive and modern **React-based application** designed to provide a smooth user experience for managing lost and found items. It includes user profiles, post management, and an admin dashboard.

---

## 🚀 Features 

### 🔹 General Features

* **Responsive Layout** with TailwindCSS.
* **Dynamic Navbar** with search functionality and post creation button.
* **Post Filtering**: filter by type, category, and search query.
* **Custom Scrollbars** for better UX on long post lists.
* **Modals**: Post creation and profile editing modals.

### 🔹 Pages

#### 1️⃣ Home Page

* Displays a feed of **all unresolved posts**.
* Filter posts by:

  * **Type**: All, Found, Lost.
  * **Category**: Electronics, Books, Others, etc.
  * **Search query**: Title, description, tags, or user name.
* Components:

  * `Navbar` – search and post creation.
  * `Sidebar` – filters and categories.
  * `RightPanel` – additional info or trending items.
  * `ItemCard` – each post preview.
  * `PostFormModal` – create a new post.

#### 2️⃣ Profile Page

* Shows **user information**:

  * Profile picture, name, verification status, college/year, department.
* Displays **user posts** with filtering:

  * All, Found, Lost, Resolved, Unresolved.
* Actions:

  * **Edit profile** modal (`EditProfileModal`).
  * **Create post** modal (`PostFormModal`).
* Stats displayed: total posts, unresolved, resolved.

#### 3️⃣ Admin Dashboard

* Provides **administrative overview**:

  * Total users, posts, comments, resolved/unresolved posts.
* **User Management**:

  * View users, navigate to their profiles, delete users.
* **Post Management**:

  * View posts, delete posts.
* **Danger Zone**: Delete all users, posts, and comments (frontend confirms with `ConfirmDialog` modal).

---

## 🏗 Frontend Tech Stack

* **React 18+** with hooks (`useState`, `useEffect`).
* **TailwindCSS** for styling.
* **React Router DOM** for page navigation.
* **Axios** for API calls (frontend handles responses and state updates).
* **Icons**: Lucide & React Feather.
* **Notifications**: `react-hot-toast`.
* **State Management**: Local component state and props.

---

## 📁 Frontend Structure

```
src/
├─ components/            # Reusable components
│  ├─ Navbar.jsx
│  ├─ Sidebar.jsx
│  ├─ RightPanel.jsx
│  ├─ ItemCard.jsx
│  ├─ PostFormModal.jsx
│  ├─ EditProfileModal.jsx
│  └─ ConfirmDialog.jsx
├─ pages/
│  ├─ Home.jsx
│  ├─ Profile.jsx
│  └─ AdminDashboard.jsx
├─ utils/
│  ├─ api.js             # Frontend API calls
│  └─ auth.js            # Authentication helpers
├─ App.jsx
└─ main.jsx
```



## 🎨 UI/UX Highlights

* Gradient headers on profile and admin dashboard.
* Custom scrollbars for post lists.
* Interactive buttons with hover and transition effects.
* Visual distinction between resolved/unresolved posts.
* User profile verification badges.

---


## 🔐 Authentication Handling

* JWT stored in `localStorage` (`ll_token`).
* Token automatically included in Axios requests.
* Frontend redirects unauthenticated users to login if necessary.
* Profile and admin pages use token to fetch data securely.

---

## 📝 Notes

* Frontend fully manages **state, UI updates, modals, filters, and data display**.
* Backend implementation is abstracted; frontend only consumes API endpoints.
* Admin actions like cleanup or deletion are **confirmed via modal dialogs** to prevent accidental actions.

---
