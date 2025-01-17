import Navbar from './Navbar'
import GPF_User from '../types/Interfaces';

const Dashboard: React.FC<GPF_User> = () => {

    return (
        <>
            <Navbar />
            <h1>Hi, from dashboard</h1>
        </>
    );
}

export default Dashboard;