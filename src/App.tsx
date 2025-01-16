import './App.css'
import Login from './components/Login'
import StatusIndicator from './components/StatusIndicator'

const App: React.FC = () => {

  const authServerEndpoint: string = "https://auth.gfauth.xyz"
  
  return (
    <>
      <div className="card">
        <div className="container d-flex justify-content-center align-items-center vh-100">
          <Login endpoint={authServerEndpoint + '/auth/login'}/>
        </div>
        <StatusIndicator subject='Authentication Server' endpoint={authServerEndpoint + '/ping'}/>
      </div>
    </>
  )
}

export default App
