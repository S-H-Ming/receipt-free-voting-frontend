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
}

export default GetProof;