import Login from "../components/Login";
import StatusIndicator from "../components/StatusIndicator";

function LoginView() {

    const authServerEndpoint: string = "https://auth.gfauth.xyz"

    return (
        <>
            <div className="card">
                <Login endpoint={authServerEndpoint + '/auth/login'}/>
                <StatusIndicator endpoint={authServerEndpoint + '/ping'} subject="Login Server"/>
            </div>
        </>
    );
}

export default LoginView;