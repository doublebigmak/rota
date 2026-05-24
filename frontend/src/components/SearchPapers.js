
import React, { useState } from 'react';
import { searchPapers } from '../api';

const SearchPapers = ({ onSearchResults }) => {
    const [keyword, setKeyword] = useState('');

    const handleSearch = async (e) =>{
        e.preventDefault();
        try {
            const results = await searchPapers(keyword);
            onSearchResults(results);

        }catch (error) {
            console.error('Error searching papers:', error);
        }
    };

    return(
    <form onSubmit={handleSearch}>
      <input
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Search keyword"
        required
      />
      <button type="submit">Search</button>
    </form>
  );

};

export default SearchPapers;