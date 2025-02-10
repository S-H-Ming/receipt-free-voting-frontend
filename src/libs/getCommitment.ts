import React, {useEffect, useState} from 'react';
import axios from 'axios';

function GetCommitment() {
    const [commitment, setCommitment] = useState<string | null>(null);
    const [seed, setSeed] = useState<number | null>(null);
    const [proof, setProof] = useState<[[number, number], [number, number]] []>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getCommitment = async () => {
            try {
                await axios.get('https://127.0.0.1:8000/VA/get_pairs');

                const response = await axios.get('https://127.0.0.1:8000/VA/get_commitment');
                if (response.status === 200) {
                    setCommitment(response.data.commitment); // 200
                    setSeed(response.data.seed);
                    setProof(response.data.proof);
                } else {
                    setError('Failed to get commitment');
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    setError(error.message);
                }
            }
        };
    }, []);

    return (
        <div>
            <h1>Commitment</h1>
            {error ? (
                <p>{error}</p>
            ) : (
                <p>Commitment: {commitment}</p>
                <p>Seed: {seed}</p>
                <ul>
                    {proof.map((pair, index) => (
                        <li key={index}>
                            {`[(${pair[0][0]}, ${pair[0][1]}), (${pair[1][0]}, ${pair[1][1]})]`}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default GetCommitment;