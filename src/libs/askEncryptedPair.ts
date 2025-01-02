import React, {useEffect, useState} from 'react';
import axios from 'axios';

function EncryptedPairs () {
    const [encryptedPairs, setEncryptedPairs] = useState<[number, number][]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect( () => {
        const askEncryptedPairs = async () => {
            try {
                const response = await axios.get('https://127.0.0.1:8000/VA/get_pairs');
                setEncryptedPairs(response.data.encrypted_pairs); //http ok 200
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    setError(error.message); //http bad request 400
                }
            }
    };
    askEncryptedPairs();
    }, []);

    // UI
}; 

export default EncryptedPairs;
