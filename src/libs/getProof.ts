//https://127.0.0.1:8000/VA/get_proof
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { BACKEND_URL } from '@/environment';
import { proof } from '../interfaces/objects';

function GetProof() {
    let proof: proof | undefined;

    const getProof = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/VA/get_proof`);
            if (response.status === 200) {
                proof = response.data;
            }

        } catch (error) {
            console.error('Error fetching proof:', error);
        }
    };

    return proof;
}

export default GetProof;