
const API_URL = 'http://localhost:8000';

export const getPapers = async () =>{
    try{
        const response = await fetch(`${API_URL}/papers/`);
        if(!response.ok){
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = response.json();
        return data;
    } catch(error){
        console.error("There was a problem: ", error);
        throw error;
    }
}

export const createPaper = async (paperData)=>{
    console.log('posting papers')
    console.log(paperData)
    const response = await fetch(`${API_URL}/papers/`,
         {
            method: "POST",
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(paperData)
         });
         if (!response.ok){
            throw new Error(`Error: ${response.statusText}`);
         }
                
    const data = await response.json();
    return data;
}

export const searchPapers = async (keyword) =>{
    console.log(`searching ${keyword}`)
    const response = await fetch(`${API_URL}/search/?keyword=${keyword}`,
        {
            method: "GET",
            headers:{
                'Content-Type': 'application/json',
            }
         });
         if (!response.ok){
            throw new Error(`Error: ${response.statusText}`);
         }

    
    return response.data;
}