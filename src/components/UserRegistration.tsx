import React, { useState } from 'react';
import UserManagementViewComponentEnum from '../types/Enums';

interface UserRegistrationFormProps {
    endpoint: string;
    token: string;
    openFormCallback: (component: UserManagementViewComponentEnum) => void;
    closeFormCallback: (component: UserManagementViewComponentEnum) => void;
    renderOpen: boolean;
}

interface NewUser {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    password: string;
}

const UserRegistration: React.FC<UserRegistrationFormProps> = ({ endpoint, token, openFormCallback, closeFormCallback, renderOpen }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('Trainer');
    const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' | null }>({
        message: '',
        type: null,
    });

    const password = 'default_password';
    const registrationEndpoint = `${endpoint}/admin/register`;

    const handleToggle = () => {
        setFeedback({ message: '', type: null });
        openFormCallback(UserManagementViewComponentEnum.USER_REGISTRATION);
    };

    const handleCancel = () => {
        setFeedback({ message: '', type: null });
        closeFormCallback(UserManagementViewComponentEnum.USER_REGISTRATION);
    };

    const onRegister = async (newUser: NewUser) => {
        try {
            const response = await fetch(registrationEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(newUser),
            });

            if (response.ok) {
                const unwrappedResponse = await response.json();
                console.log(unwrappedResponse);
                setFeedback({ message: 'User successfully registered!', type: 'success' });
            } else {
                setFeedback({
                    message: `Failed to register user: ${response.status}`,
                    type: 'error',
                });
            }
        } catch (error) {
            console.error('Error while registering user:', error);
            setFeedback({ message: 'An error occurred while registering the user.', type: 'error' });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onRegister({ firstName, lastName, email, role, password });
        setFirstName('');
        setLastName('');
        setEmail('');
        setRole('Trainer');
    };

    return (
        <div className="card shadow-sm p-3 mb-5 rounded" style={{ width: '18rem' }}>
            {!renderOpen ? (
                <button onClick={handleToggle} className="btn btn-primary w-100">
                    Register User
                </button>
            ) : (
                <form onSubmit={handleSubmit}>
                    <h5 className="card-title text-primary">Register User</h5>
                    <div className="mb-3">
                        <label htmlFor="first-name" className="form-label text-primary">First Name</label>
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
                        <label htmlFor="last-name" className="form-label text-primary">Last Name</label>
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
                        <label htmlFor="email" className="form-label text-primary">Email</label>
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
                        <label htmlFor="role" className="form-label text-primary">Role</label>
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
                        <button type="button" onClick={ handleCancel } className="btn btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Submit
                        </button>
                    </div>
                </form>
            )}
            {feedback.message && (
                <div
                    className={`alert mt-3 ${
                        feedback.type === 'success' ? 'alert-success' : 'alert-danger'
                    }`}
                    role="alert"
                >
                    {feedback.message}
                </div>
            )}
        </div>
    );
};

export default UserRegistration;
