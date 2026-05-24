import logo from './logo.svg';
import './App.css';

import React, {useState} from 'react';
import PaperList from './components/PaperList';
import AddPaper from './components/AddPaper';
import SearchPapers from './components/SearchPapers';

function App() {
  const [searchResults,setSearchResults]=React.useState(null);

  const handlePaperAdded = ()=>{
    setSearchResults(null);

  }

  const handleSearchResults = (results)=>
    setSearchResults(results);

  return(
    <div className="App">
      <h1>Research Paper Repository</h1>
      <AddPaper onPaperAdded={handlePaperAdded} />
      <SearchPapers onSearchResults={handleSearchResults} />
      {searchResults ? (
        <div>
          <h2>Search Results</h2>
          <ul>
            {searchResults.map((paper) => (
              <li key={paper.id}>
                <h3>{paper.title}</h3>
                <p>Authors: {paper.authors}</p>
                <p>Keywords: {paper.keywords}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <PaperList />
      )}
    </div>
  );
}

export default App;
