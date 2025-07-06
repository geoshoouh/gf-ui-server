interface GPF_User {
    email: string,
    role: string,
    token: string,
    isAuthenticated: boolean
}

interface ExerciseRecord {
    client: string;
    equipment: string;
    exercise: string;
    params: string[];
}

interface Client {
    id?: string;
    name?: string;
    email?: string;
    // Add other client properties as needed
}

export default GPF_User;
export type { ExerciseRecord, Client };