import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { API_URL } from '../constants';
import { commitment } from '../interfaces/context.interface';

function GetCommitment() {
    let commitment: commitment | undefined;

    const getCommitment = async () => {
        try {
            await axios.get(`${API_URL}/VA/get_pairs`);

            const response = await axios.get(`${API_URL}/VA/get_commitment`);
            if (response.status === 200) {
                commitment = response.data;
            }
        } catch (error) {
            console.error('Error fetching commitment:', error);
        }
    };

    return commitment;
}

export default GetCommitment;