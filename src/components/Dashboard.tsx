import Navbar from './Navbar'
import GPF_User from '../types/Interfaces';

const Dashboard: React.FC<GPF_User> = ({role, token, isAuthenticated}) => {

    const user: GPF_User = {role: role, token: token, isAuthenticated: isAuthenticated};
    
    return (
        <>
            <Navbar />
            {
                (user.role.toUpperCase() === 'ADMIN') 
                ? 
                <h1>Admin Stuff</h1> 
                :
                <h1>Trainer Stuff</h1>
            } 
        </>
    );
}

export default Dashboard;