# MyFlix

**A movie and TV discovery app inspired by streaming platforms.** MyFlix brings TMDB-powered browsing, search, detailed titles, trailers, and personal favorites into a responsive React experience backed by a Node.js/Express API.

> Portfolio project by [Ajiboye Oluwaseyi](https://github.com/ajiboy-dev).

## Project highlights

- Browse trending, popular, top-rated, now-playing, and upcoming movies and TV shows.
- Search across titles and discover movies or shows with genre, year, rating, and sort filters.
- Explore movie and TV details, seasons and episodes, related titles, credits, and trailers.
- Create an account, manage a profile, and keep a personal favorites list.
- Switch between dark and light themes with responsive navigation.
- Explore a dedicated public-domain movies section.

## Screenshots

The repository does not currently include app screenshots. Add genuine captures under `docs/screenshots/` and replace the notes below when available.

| Browse | Title details | Search |
| --- | --- | --- |
| _Add `docs/screenshots/browse.png`_ | _Add `docs/screenshots/details.png`_ | _Add `docs/screenshots/search.png`_ |

## Tech stack

- **Client:** React, Vite, Axios, Context API
- **Server:** Node.js, Express
- **Database and authentication:** MongoDB, Mongoose, JWT, bcryptjs
- **Movie data:** The Movie Database (TMDB) API

## Run locally

Requirements: Node.js, MongoDB, and a TMDB API key.

### 1. Configure the client

```bash
cd client
npm install
```

Create `client/.env` and set your TMDB configuration:

```env
VITE_TMDB_API_KEY=your_tmdb_api_key
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
VITE_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p/w500
```

Start the Vite development server:

```bash
npm run dev
```

### 2. Configure and start the API

```bash
cd server
npm install
```

Configure the server environment in `server/.env` using the variables expected by the server configuration, including your MongoDB connection string and JWT secret. Then start the API:

```bash
npm run dev
```

See the server entry point and configuration for the full required environment variable names. Keep secrets in local environment files and never commit them.

## Project structure

```text
myflix/
├── client/
│   └── src/
│       ├── components/   # Shared UI components
│       ├── context/      # Authentication and theme state
│       ├── pages/        # Movie, TV, search, and profile pages
│       └── services/     # API and TMDB integrations
└── server/
    ├── config/           # Database setup
    ├── middlewares/      # Authentication middleware
    ├── models/           # Mongoose models
    └── routes/            # API routes
```

## Data and attribution

Movie and television metadata and images are provided through TMDB. This project is not endorsed or certified by TMDB. Public-domain movie content is provided via Internet Archive.

## Author

**Ajiboye Oluwaseyi** · [GitHub](https://github.com/ajiboy-dev)
