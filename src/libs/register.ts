import axios from 'axios';
import { API_URL } from '../constants';
import { Ballot, register_response } from '../interfaces/context.interface';
import { useSession } from 'next-auth/react';


async function register(ballot: Ballot): Promise<register_response> {
    const { data: session } = useSession();

    if (!session?.user?.identifier) {
        throw new Error("User not authenticated");
    }

    try {
        const response = await axios.post<register_response>(`${API_URL}/ia/`, {
            email: session.user.identifier,
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
