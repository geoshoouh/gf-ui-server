import React, { useState } from 'react';
import Navbar from './Navbar'
import GPF_User from '../types/Interfaces';
import type { ExerciseRecord } from '../types/Interfaces';
import UserManagementView from './UserManagementView';
import ExerciseInput from './ExerciseInput';
import ExerciseHistoryExport from './ExerciseHistoryExport';

interface DashboardProps {
    role: string,
    token: string,
    isAuthenticated: boolean,
    endpoint: string,
    user: GPF_User,
}

const Dashboard: React.FC<DashboardProps> = (props: DashboardProps) => {

    const user: GPF_User = props.user;
    const [currentView, setCurrentView] = useState<string>('exercise');

    const handleExerciseSubmit = async (exerciseRecord: ExerciseRecord) => {
        try {
            // Format the data according to server expectations
            const serverData = {
                exerciseRecord: {
                    client: {
                        email: exerciseRecord.client
                    },
                    equipmentType: exerciseRecord.equipment,
                    exercise: exerciseRecord.exercise,
                    resistance: parseInt(exerciseRecord.params[0]) || 0,
                    seatSetting: parseInt(exerciseRecord.params[1]) || 0,
                    padSetting: parseInt(exerciseRecord.params[2]) || 0,
                    rightArm: parseInt(exerciseRecord.params[3]) || 0,
                    leftArm: parseInt(exerciseRecord.params[4]) || 0
                }
            };

            const response = await fetch(`${props.endpoint}/trainer/new/record`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${props.token}`,
                },
                body: JSON.stringify(serverData),
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
            <Navbar currentView={currentView} onViewChange={setCurrentView} />
            {
                (user.role.toUpperCase() === 'ADMIN') 
                ? 
                <>
                    <UserManagementView endpoint={props.endpoint} token={props.token}/>
                </>
                :
                <>
                    {currentView === 'exercise' && (
                        <ExerciseInput 
                            endpoint={props.endpoint} 
                            token={props.token} 
                            onSubmit={handleExerciseSubmit} 
                        />
                    )}
                    {currentView === 'export' && (
                        <ExerciseHistoryExport 
                            endpoint={props.endpoint} 
                            token={props.token} 
                        />
                    )}
                </>
            } 
        </>
    );
}

export default Dashboard;