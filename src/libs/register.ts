import axios from 'axios';
import { API_URL } from '../constants';
import { Ballot, register_response, register_voter } from '../interfaces/context.interface';

async function register(email: string, ballot: Ballot): Promise<register_response> {
    try {
        const response = await axios.post<register_response>(`${API_URL}/ia/`, {
            email: email,
            ballot: ballot,
        });

        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error(`Unexpected response status: ${response.status}`);
        }
    } catch (error) {
        console.error("Registration error:", error);
        throw error; 
    }
}

export default register;
