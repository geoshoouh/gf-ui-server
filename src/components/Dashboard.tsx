import Navbar from './Navbar'
import GPF_User from '../types/Interfaces';
import type { ExerciseRecord } from '../types/Interfaces';
import UserManagementView from './UserManagementView';
import ExerciseInput from './ExerciseInput';

interface DashboardProps {
    role: string,
    token: string,
    isAuthenticated: boolean,
    endpoint: string,
    user: GPF_User,
}

const Dashboard: React.FC<DashboardProps> = (props: DashboardProps) => {

    const user: GPF_User = props.user;

    const handleExerciseSubmit = async (exerciseRecord: ExerciseRecord) => {
        try {
            const response = await fetch(`${props.endpoint}/trainer/new/record`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${props.token}`,
                },
                body: JSON.stringify(exerciseRecord),
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Exercise record saved successfully:', result.message);
                // You could add a success notification here
            } else {
                console.error('Failed to save exercise record:', response.status);
                // You could add an error notification here
            }
            
        } catch (error) {
            console.error('Error saving exercise record:', error);
        }
    };

    return (
        <>
            <Navbar />
            {
                (user.role.toUpperCase() === 'ADMIN') 
                ? 
                <>
                    <UserManagementView endpoint={props.endpoint} token={props.token}/>
                </>
                :
                <ExerciseInput 
                    endpoint={props.endpoint} 
                    token={props.token} 
                    onSubmit={handleExerciseSubmit} 
                />
            } 
        </>
    );
}

export default Dashboard;