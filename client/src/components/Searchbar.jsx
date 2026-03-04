import React, { useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  const handleChange = (e) => {
    setQuery(e.target.value);
    // Optional: trigger search on every keystroke
    // onSearch(e.target.value);
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="search-bar"
          placeholder="Search for movies, TV shows..."
          value={query}
          onChange={handleChange}
        />
      </form>
    </div>
  );
};

export default SearchBar;
