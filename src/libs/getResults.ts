// Import React and useState, useEffect hooks
import React, { useState, useEffect } from 'react';

// Fetch results from the API
const getResults = async () => {
    try {
        const response = await fetch('https://127.0.0.1:8000/VA/get_results', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data.result; // "yes" or "no"
    } catch (error) {
        console.error("Error fetching results:", error);
        throw error;
    }
};

// React component to display results
const App = () => {
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const fetchedResult = await getResults();
                setResult(fetchedResult);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchResults();
    }, []);

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h2>Result:</h2>
            {result ? <p>{result === 'yes' ? 'Yes' : 'No'}</p> : <p>Loading result...</p>}
        </div>
    );
};

export default App;
