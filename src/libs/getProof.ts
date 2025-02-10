//https://127.0.0.1:8000/VA/get_proof
import React, {useEffect, useState} from 'react';
import axios from 'axios';

function GetProof() {
    const [seed, setSeed] = useState<number | null>(null);
    const [proof, setProof] = useState<[ [number, number], [number, number] ][]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getProof = async () => {
            try {
                const response = await axios.get('https://127.0.0.1:8000/VA/get_proof');
                setSeed(response.data.seed);
                setProof(response.data.proof); // http ok 200
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    setError(error.message);
                }
            }
        };

        getProof();
    }, []);

    //UI
    return (
        <div>
            <h1>Proof</h1>
            {error ? (
                <p>{error}</p>
            ): (
                <div>
                    <p>Seed: {seed}</p>
                    <ul>
                        {proof.map((pair, index) => (
                            <li key={index}>
                                {`[(${pair[0][0]}, ${pair[0][1]}), (${pair[1][0]}, ${pair[1][1]})]`}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default GetProof;