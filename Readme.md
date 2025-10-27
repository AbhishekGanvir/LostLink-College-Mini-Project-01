

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

* [Frontend Documentation](https://github.com/AbhishekGanvir/LostLink-College-Mini-Project-01/blob/main/frontend/README.md) – UI components, pages, state management, and modals.
* [Backend Documentation](https://github.com/AbhishekGanvir/LostLink-College-Mini-Project-01/blob/main/backend/Readme.md) – API routes, database models, authentication, and notifications.

---
## 💻 Quick Installation & Start

1. **Clone the repository**

```bash
git clone https://github.com/AbhishekGanvir/LostLink-College-Mini-Project-01.git
cd LostLink-College-Mini-Project-01
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the **root** (or backend, if needed) with:

```
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
REACT_APP_API_URL=http://localhost:5000/api
```

4. **Build frontend and start the app**

```bash
npm run build
npm run start
```

5. **Access the app**
   Open your browser and go to:

```
http://localhost:5000
```
> ⚠️ **Important:** When deploying, make sure to replace `REACT_APP_API_URL` with your **deployed backend URL** — otherwise, the frontend will fail to connect to the backend.


## 🤝 Contributing

We welcome contributions from anyone interested in improving **LostLink**! Whether it’s fixing bugs, adding features, improving UI/UX, or enhancing documentation, your help is appreciated.



### Guidelines

* Follow existing code style and naming conventions.
* Test your changes locally before submitting.
* Keep commits small and focused.
* Respect the community and maintain a collaborative approach.

---

