import Navbar from './Navbar'
import GPF_User from '../types/Interfaces';
import UserManagementView from './UserManagementView';

interface DashboardProps {
    role: string,
    token: string,
    isAuthenticated: boolean,
    endpoint: string,
    user: GPF_User,
}

const Dashboard: React.FC<DashboardProps> = (props: DashboardProps) => {

    const user: GPF_User = props.user;
    
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
                <h1>Trainer Stuff</h1>
            } 
        </>
    );
}

export default Dashboard;