# Bootie Learning Platform

![Version](https://img.shields.io/badge/version-0.1.0-blue.svg?cacheSeconds=2592000)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Node](https://img.shields.io/badge/Node.js-14+-green.svg)
![React](https://img.shields.io/badge/React-18+-61DAFB.svg)

> A comprehensive, interactive learning platform for programming courses inspired by Boot.dev

## ✨ Features

- **Interactive Code Editor** - Write and run code directly in your browser
- **Real-time Feedback** - Get immediate results for your coding exercises
- **Structured Learning Paths** - Follow carefully designed curriculum from basics to advanced
- **Progress Tracking** - Monitor your learning journey with detailed analytics
- **Multiple Exercise Types** - Coding challenges, multiple choice, and fill-in-the-blank
- **Subscription Model** - Free tier and premium subscription options
- **Instructor Tools** - Course creation and management dashboard
- **Administrator Dashboard** - Complete platform management

## 🛠️ Tech Stack

### Frontend
- React with Vite
- Tailwind CSS
- React Router
- Context API
- Axios + React Query

### Backend
- Node.js & Express
- MongoDB with Mongoose
- JWT Authentication
- Stripe payment integration
- VM2 for secure code execution

## 📋 Prerequisites

- Node.js (v14+)
- MongoDB
- npm or yarn
- Git

## 🚀 Installation

1. Clone the repository
   ```sh
   git clone https://github.com/Brian-Zavala/bootie.git
   cd bootie
   ```

2. Install server dependencies
   ```sh
   cd server
   npm install
   ```

3. Set up server environment variables
   ```sh
   # Create .env file in the server directory
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Install client dependencies
   ```sh
   cd ../client
   npm install
   ```

5. Set up client environment variables
   ```sh
   # Create .env file in the client directory
   cp .env.example .env
   # Edit .env with your configuration
   ```

## 💻 Development

Run the server:
```sh
cd server
npm run dev
```

Run the client in a new terminal:
```sh
cd client
npm run dev
```

The client will be available at `http://localhost:5173` and the server at `http://localhost:5000`.

## 🐳 Docker Deployment

Build and start with Docker Compose:
```sh
docker-compose up --build -d
```

The application will be available at `http://localhost:80`.

## 📁 Project Structure

```
Booty/
├── client/                 # Frontend application
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── api/            # API client
│   │   ├── components/     # React components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   ├── utils/          # Utility functions
│   │   ├── App.jsx         # Main application component
│   │   └── main.jsx        # Entry point
│   ├── .env                # Environment variables
│   └── vite.config.js      # Vite configuration
│
├── server/                 # Backend application
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Utility functions
│   │   └── index.js        # Entry point
│   └── .env                # Environment variables
│
└── docker-compose.yml      # Docker configuration
```

## 🔑 Environment Variables

### Server (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bootie
JWT_SECRET=your_jwt_secret_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
NODE_ENV=development
```

### Client (.env)
```
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

## 🔄 API Endpoints

<details>
<summary>Click to expand API endpoints</summary>

### Auth
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Current user

### Courses
- `GET /api/courses` - List courses
- `GET /api/courses/:slug` - Course details
- `POST /api/courses` - Create course
- `PUT /api/courses/:id` - Update course
- `POST /api/courses/:id/enroll` - Enroll

### Exercises
- `GET /api/exercises/:id` - Get exercise
- `POST /api/exercises/:id/submit` - Submit solution

### Payments
- `GET /api/payments/plans` - Get plans
- `POST /api/payments/create-checkout-session` - Checkout

</details>

## 👥 User Roles

- **Student** - Default role for learners
- **Instructor** - Can create and manage courses
- **Admin** - Full system access

## 🤝 Contributing

Contributions, issues and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

Copyright © 2025. This project is [MIT](LICENSE) licensed.

## 🙏 Acknowledgements

- [Boot.dev](https://boot.dev) for the inspiration
- [React](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)

---

Made by Brian Zavala
