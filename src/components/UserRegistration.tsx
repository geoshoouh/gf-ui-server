import React, { useState } from 'react';

interface UserRegistrationFormProps {
    onRegister: (user: { name: string; email: string; role: string }) => void;
}

const UserRegistration: React.FC<UserRegistrationFormProps> = ({ onRegister }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('Trainer'); 

    const handleToggle = () => {
        setIsExpanded(!isExpanded);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onRegister({ name, email, role });
        setName('');
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
                        <label htmlFor="name" className="form-label">Name</label>
                        <input
                            type="text"
                            id="name"
                            className="form-control"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
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
