import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { API_URL } from '../constants';
import { encrypted_pairs } from '../interfaces/context.interface'

function EncryptedPairs () {
    let encrypted_pairs: encrypted_pairs = {
        encrypted_pairs: [[[0, 0], [0, 0]]]
    };

    const askEncryptedPairs = async () => {
        try {
            const response = await axios.get(`${API_URL}/VA/get_pairs`);
            if (response.status === 200) {
                encrypted_pairs = response. data;
            }
        } catch (error) {
            console.error('Error fetching encrypted pairs:', error);
        }
    };
    return encrypted_pairs;
    
} 

export default EncryptedPairs;
