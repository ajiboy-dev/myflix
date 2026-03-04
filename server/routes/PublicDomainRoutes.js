const express = require("express");
const axios = require("axios");
const router = express.Router();

// Curated list of great public domain films
const FEATURED_MOVIES = [
  {
    title: "Nosferatu",
    year: 1922,
    identifier: "nosferatu_1922",
    category: "horror",
    thumbnail: "https://archive.org/services/img/nosferatu_1922",
  },
  {
    title: "The Cabinet of Dr. Caligari",
    year: 1920,
    identifier: "TheCabinetOfDr.Caligari",
    category: "horror",
    thumbnail: "https://archive.org/services/img/TheCabinetOfDr.Caligari",
  },
  {
    title: "Metropolis",
    year: 1927,
    identifier: "Metropolis_1927",
    category: "scifi",
    thumbnail: "https://archive.org/services/img/Metropolis_1927",
  },
  {
    title: "A Trip to the Moon",
    year: 1902,
    identifier: "Le_voyage_dans_la_lune",
    category: "scifi",
    thumbnail: "https://archive.org/services/img/Le_voyage_dans_la_lune",
  },
  {
    title: "The General",
    year: 1926,
    identifier: "The_General_Buster_Keaton",
    category: "classics",
    thumbnail: "https://archive.org/services/img/The_General_Buster_Keaton",
  },
  {
    title: "Sherlock Jr.",
    year: 1924,
    identifier: "SherlockJr",
    category: "classics",
    thumbnail: "https://archive.org/services/img/SherlockJr",
  },
];

const CURATED_COLLECTION = [
  // Silent Era
  {
    title: "The Kid",
    year: 1921,
    identifier: "TheKid1921",
    category: "silent",
  },
  {
    title: "Safety Last!",
    year: 1923,
    identifier: "SafetyLast",
    category: "silent",
  },
  {
    title: "The Gold Rush",
    year: 1925,
    identifier: "CC_1925_01_01_TheGoldRush",
    category: "silent",
  },

  // Horror
  {
    title: "The Phantom of the Opera",
    year: 1925,
    identifier: "PhantomoftheOpera",
    category: "horror",
  },
  { title: "Vampyr", year: 1932, identifier: "Vampyr1932", category: "horror" },
  {
    title: "White Zombie",
    year: 1932,
    identifier: "WhiteZombie",
    category: "horror",
  },

  // Sci-Fi
  {
    title: "Things to Come",
    year: 1936,
    identifier: "things_to_come",
    category: "scifi",
  },
  {
    title: "The Invisible Man",
    year: 1933,
    identifier: "TheInvisibleMan",
    category: "scifi",
  },

  // Western
  {
    title: "The Great Train Robbery",
    year: 1903,
    identifier: "great_train_robbery",
    category: "western",
  },
  {
    title: "Tumbling Tumbleweeds",
    year: 1935,
    identifier: "TumblingTumbleweeds",
    category: "western",
  },

  // Classics
  {
    title: "His Girl Friday",
    year: 1940,
    identifier: "HisGirlFriday",
    category: "classics",
  },
  {
    title: "The Little Princess",
    year: 1939,
    identifier: "LittlePrincess",
    category: "classics",
  },
  {
    title: "It's a Wonderful Life",
    year: 1946,
    identifier: "ItsAWonderfulLife",
    category: "classics",
  },
  {
    title: "Charade",
    year: 1963,
    identifier: "Charade_Cary_Grant",
    category: "classics",
  },
  {
    title: "Night of the Living Dead",
    year: 1968,
    identifier: "night_of_the_living_dead",
    category: "horror",
  },
];

// ─── GET /api/public-domain/movies ─────────────────────
router.get("/movies", async (req, res) => {
  try {
    // Build featured movies with full URLs
    const featured = FEATURED_MOVIES.map((movie) => ({
      ...movie,
      thumbnail: `https://archive.org/services/img/${movie.identifier}`,
      watchUrl: `https://archive.org/details/${movie.identifier}`,
      downloadUrl: `https://archive.org/download/${movie.identifier}`,
    }));

    // Build curated collection
    const movies = CURATED_COLLECTION.map((movie) => ({
      ...movie,
      thumbnail: `https://archive.org/services/img/${movie.identifier}`,
      watchUrl: `https://archive.org/details/${movie.identifier}`,
      downloadUrl: `https://archive.org/download/${movie.identifier}`,
      duration: "Various",
    }));

    res.json({ featured, movies });
  } catch (error) {
    console.error("Error fetching public domain movies:", error);
    res.status(500).json({ message: "Failed to fetch movies" });
  }
});

// ─── GET /api/public-domain/search ─────────────────────
router.get("/search", async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Query parameter required" });
    }

    // Search Internet Archive for public domain films
    const response = await axios.get("https://archive.org/advancedsearch.php", {
      params: {
        q: `${query} AND mediatype:movies AND year:[* TO 1927]`,
        fl: "identifier,title,year,description",
        rows: 20,
        output: "json",
      },
    });

    const results = response.data.response.docs.map((doc) => ({
      title: doc.title,
      year: doc.year,
      identifier: doc.identifier,
      description: doc.description,
      thumbnail: `https://archive.org/services/img/${doc.identifier}`,
      watchUrl: `https://archive.org/details/${doc.identifier}`,
      downloadUrl: `https://archive.org/download/${doc.identifier}`,
    }));

    res.json({ results });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Search failed" });
  }
});

// ─── GET /api/public-domain/random ──────────────────────
router.get("/random", async (req, res) => {
  try {
    // Get random selection from curated list
    const shuffled = [...CURATED_COLLECTION].sort(() => 0.5 - Math.random());
    const random = shuffled.slice(0, 6).map((movie) => ({
      ...movie,
      thumbnail: `https://archive.org/services/img/${movie.identifier}`,
      watchUrl: `https://archive.org/details/${movie.identifier}`,
      downloadUrl: `https://archive.org/download/${movie.identifier}`,
    }));

    res.json({ movies: random });
  } catch (error) {
    console.error("Error getting random movies:", error);
    res.status(500).json({ message: "Failed to get random movies" });
  }
});

module.exports = router;
