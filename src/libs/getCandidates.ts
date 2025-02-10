// Import React and useState, useEffect hooks
import React, { useState, useEffect } from 'react';

const getCandidates = async () => {
    try {
        const response = await fetch('https://127.0.0.1:8000/get_candidates', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data; // { name: string, image_data: string }
    } catch (error) {
        console.error("Error fetching candidates:", error);
        throw error;
    }
};

// React component to display candidates
const App = () => {
    const [candidates, setCandidates] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                const fetchedCandidates = await getCandidates();
                setCandidates(fetchedCandidates);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchCandidates();
    }, []);

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h2>Candidates:</h2>
            {candidates ? (
                <div>
                    <p>Name: {candidates.name}</p>
                    <img
                        src={`data:image/png;base64,${candidates.image_data}`}
                        alt="Candidate"
                    />
                </div>
            ) : (
                <p>Loading candidates...</p>
            )}
        </div>
    );
};

export default App;
