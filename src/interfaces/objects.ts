export interface commitment {
    commitment: string;
    seed: number;
    proof: [[number, number], [number, number]] [];
}

export interface proof {
    seed: number;
    proof: [[number, number], [number, number]] [];
}

export interface encrypted_pairs {
    encrypted_pairs: [[number, number], [number, number]] [];
}



