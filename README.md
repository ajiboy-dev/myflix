# MyFlix - Movie Streaming Platform

A Netflix-inspired movie and TV show platform built with the MERN stack.

![MyFlix Screenshot](https://via.placeholder.com/1200x600?text=MyFlix)

## ✨ Features

- 🎬 Browse thousands of movies and TV shows via TMDB API
- 📺 TV show details with seasons and episodes
- 🔍 Advanced search with filters (genre, year, rating)
- 👤 User authentication (JWT) and profile management
- ❤️ Favorites system
- 🎞️ Public domain movies section
- 🌙 Dark/Light theme toggle
- 📱 Fully responsive with mobile sidebar
- 🎥 Trailer player with download option

## 🛠️ Tech Stack

**Frontend:**

- React.js
- Context API for state management
- TMDB API
- Axios

**Backend:**

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT authentication
- bcrypt for password hashing

## 📦 Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB installed and running
- TMDB API Key (get from https://www.themoviedb.org/)

### Setup Instructions

1. **Clone the repository**

```bash
git clone https://github.com/YOUR_USERNAME/myflix.git
cd myflix
```

2. **Install server dependencies**

```bash
cd server
npm install
```

3. **Install client dependencies**

```bash
cd ../client
npm install
```

4. **Set up environment variables**

Create `server/.env`:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/myflix
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d
```

Create `client/.env`:

```
REACT_APP_TMDB_API_KEY=your_tmdb_api_key_here
REACT_APP_TMDB_BASE_URL=https://api.themoviedb.org/3
REACT_APP_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p/w500
```

5. **Start MongoDB**

```bash
# Windows
net start MongoDB

# Mac/Linux
sudo service mongod start
```

6. **Run the application**

Open two terminal windows:

**Terminal 1 - Backend:**

```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**

```bash
cd client
npm start
```

7. **Open your browser**

Navigate to: `http://localhost:3000`

## 🚀 Usage

1. Register a new account
2. Browse movies and TV shows
3. Search with filters
4. Add movies to favorites
5. View detailed information and trailers
6. Toggle between dark/light themes

## 📂 Project Structure

```
myflix/
├── client/                 # React frontend
│   ├── public/
│   └── src/
│       ├── components/     # React components
│       ├── context/        # Context API providers
│       ├── pages/          # Page components
│       ├── services/       # API services
│       ├── App.js
│       └── index.js
│
├── server/                 # Express backend
│   ├── config/            # Database configuration
│   ├── middleware/        # Auth middleware
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   └── index.js
│
└── README.md
```

## 🔐 Environment Variables

### Server

- `PORT` - Server port (default: 5000)
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRES_IN` - Token expiration time

### Client

- `REACT_APP_TMDB_API_KEY` - Your TMDB API key
- `REACT_APP_TMDB_BASE_URL` - TMDB API base URL
- `REACT_APP_TMDB_IMAGE_BASE_URL` - TMDB image base URL

## 📝 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update profile (protected)
- `PUT /api/auth/change-password` - Change password (protected)

### Favorites

- `POST /api/auth/favorites` - Add to favorites (protected)
- `DELETE /api/auth/favorites/:movieId` - Remove from favorites (protected)

### Public Domain

- `GET /api/public-domain/movies` - Get public domain movies
- `GET /api/public-domain/search?query=` - Search public domain
- `GET /api/public-domain/random` - Get random movies

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

**Your Name**

- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

## 🙏 Acknowledgments

- [TMDB](https://www.themoviedb.org/) for the movie database API
- [Internet Archive](https://archive.org/) for public domain movies
- Netflix for UI/UX inspiration

## 📸 Screenshots

Add your screenshots here after deployment!

---

⭐ If you found this project helpful, please give it a star!
