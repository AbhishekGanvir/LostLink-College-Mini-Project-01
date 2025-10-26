

# 🌐 LostLink - The Lost and Found Service

![Project Thumbnail](Main%20project.png)



**LostLink** is a full-stack web platform that makes it easy for **students and campus communities** to **report, track, and recover lost or found items**. Users can post items, comment, and receive notifications when interactions occur. Admins can manage users, posts, and maintain platform safety.



---

## 🚀 Core Features

* **Responsive & Modern UI** – smooth experience across devices.
* **Dynamic Post Feed** – filter by type, category, or search term.
* **User Profiles** – view stats, posts, and verification badges.
* **Post & Comment System** – create, update, and interact on posts.
* **Admin Dashboard** – overview, management, and cleanup capabilities.
* **Notifications** – real-time alerts for comments and interactions.
* **Secure Authentication** – JWT-based sessions with role-based access.

---

## 🎨 Highlights

* Gradient headers and interactive UI elements.
* Custom scrollbars for post lists.
* Clear distinction between resolved and unresolved posts.
* Modal-based interactions for posts, profiles, and admin actions.

---

## 🏗 Technology Stack

* **Frontend:** React 18+, TailwindCSS, Axios, React Router, React Hot Toast, Icon Libraries.
* **Backend:** Node.js, Express, MongoDB, JWT Authentication, Cloudinary for images.

---

## 🖼 Project Architecture

![Project Architecture](Project%20Architecture.png)




---

## 🔐 Security & Authorization

* JWT tokens stored in `localStorage` and automatically included in requests.
* Protected routes for authenticated users; admin-only actions enforced.
* Admin actions confirmed via modals to prevent accidental data changes.

---

## 📖 Detailed Documentation

For more in-depth information, see:

* [Frontend Documentation](frontend.md) – UI components, pages, state management, and modals.
* [Backend Documentation](backend.md) – API routes, database models, authentication, and notifications.

---


