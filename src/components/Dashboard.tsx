import Navbar from './Navbar'
import GPF_User from '../types/Interfaces';
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
                <ExerciseInput clients={["bill", "jack"]} equipmentTypes={["ARX", "TRX"]} exerciseTypes={["pushup", "situp"]} onSubmit={() => { console.log( "submit clicked on ex in") }}  />
            } 
        </>
    );
}

export default Dashboard;