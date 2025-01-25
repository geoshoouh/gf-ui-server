import React, { useState } from 'react';

interface UserRegistrationFormProps {
    endpoint: string
}

interface NewUser {
    firstName: string,
    lastName: string,
    email: string,
    role: string,
    password: string,
}

const UserRegistration: React.FC<UserRegistrationFormProps> = (props: UserRegistrationFormProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('Trainer'); 

    const password = 'default_password'

    const registrationEndpoint = props.endpoint + '/admin/register'

    const handleToggle = () => {
        setIsExpanded(!isExpanded);
    };

    const onRegister = async (newUser: NewUser) => {
        const response = await fetch(registrationEndpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUser),
        })
    
        if (response.ok) {
          const unwrappedResponse = await response.json();
          console.log(unwrappedResponse)
        } 
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onRegister({ firstName, lastName, email, role, password});
        setFirstName('');
        setLastName('');
        setEmail('');
        setRole('Trainer');
        setIsExpanded(false);
    };

    return (
        <div className="card shadow-sm p-3 mb-5 bg-white rounded" style={{ width: '18rem' }}>
            {!isExpanded ? (
                <button onClick={handleToggle} className="btn btn-primary w-100">
                    Register User
                </button>
            ) : (
                <form onSubmit={handleSubmit}>
                    <h5 className="card-title">Register User</h5>
                    <div className="mb-3">
                        <label htmlFor="first-name" className="form-label">First Name</label>
                        <input
                            type="text"
                            id="first-name"
                            className="form-control"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="last-name" className="form-label">Last Name</label>
                        <input
                            type="text"
                            id="last-name"
                            className="form-control"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="role" className="form-label">Role</label>
                        <select
                            id="role"
                            className="form-select"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            required
                        >
                            <option value="Trainer">Trainer</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </div>
                    <div className="d-flex justify-content-between">
                        <button type="button" onClick={handleToggle} className="btn btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-success">
                            Submit
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default UserRegistration;
