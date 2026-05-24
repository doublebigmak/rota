import React, {useState} from 'react';
import {createPaper} from '../api';

const AddPaper = ({onPaperAdded}) =>{
    const [paper,setPaper] = useState({title:'', authors:'',abstract: '', keywords: ''});

    const handleChange = (e) =>{
        setPaper({ ...paper, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) =>{
        e.preventDefault();

        try{
            const newPaper = await createPaper(paper);
            onPaperAdded(newPaper);
            setPaper({title: '', authors: '', abstract: '', keywords: ''});
        } catch (error){
            console.error('Error adding paper:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
          <h2>Add New Paper</h2>
          <input
            name="title"
            value={paper.title}
            onChange={handleChange}
            placeholder="Title"
            required
          />
          <input
            name="authors"
            value={paper.authors}
            onChange={handleChange}
            placeholder="Authors" 
            required
          />
          <textarea
            name="abstract"
            value={paper.abstract}
            onChange={handleChange}
            placeholder="Abstract"
            required
          />
          <input
            name="keywords"
            value={paper.keywords}
            onChange={handleChange}
            placeholder="Keywords"
            required
          />
          <button type="submit">Add Paper</button>
        </form>
      );
};

export default AddPaper;