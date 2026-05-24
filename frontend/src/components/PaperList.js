import react, {useState,useEffect} from 'react';
import { getPapers } from '../api';

const PaperList=()=>{
    const [papers, setPapers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(()=>{
        const fetchPapers = async() =>{
          try {
            setIsLoading(true);
            const data = await getPapers();
            console.log('fetching papers')
            setPapers(data);
            setIsLoading(false);
          } catch (err) {
            setError('Failed to fetch papers');
            setIsLoading(false);
          }
        };
    
        fetchPapers();
    },[]);



    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (papers.length === 0) return <div>No papers found</div>;

    return (
        <div>
          <h2>Papers</h2>
          <ul>
            {papers.map((paper) => (
              <li key={paper.id}>
                <h3>{paper.title}</h3>
                <p>Authors: {paper.authors}</p>
                <p>Keywords: {paper.keywords}</p>
              </li>
            ))}
          </ul>
        </div>
    );
};


export default PaperList;
