import React, { useState } from 'react';
import UserManagementViewComponentEnum from '../types/Enums';

interface ClientRegistrationFormProps {
    endpoint: string;
    token: string;
    openFormCallback: (component: UserManagementViewComponentEnum) => void;
    closeFormCallback: (component: UserManagementViewComponentEnum) => void;
    renderOpen: boolean;
}

interface NewClient {
    message: null;
    trainerId: null;
    equipmentType: null;
    exerciseType: null;
    client: {
        firstName: string;
        lastName: string;
        email: string;
    };
    exerciseRecord: null;
}

const ClientRegistration: React.FC<ClientRegistrationFormProps> = ({ endpoint, token, openFormCallback, closeFormCallback, renderOpen }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' | null }>({
        message: '',
        type: null,
    });

    const registrationEndpoint = `${endpoint}/trainer/new/client`;

    const handleToggle = () => {
        setFeedback({ message: '', type: null });
        openFormCallback(UserManagementViewComponentEnum.CLIENT_REGISTRATION);
    };

    const handleCancel = () => {
        setFeedback({ message: '', type: null });
        closeFormCallback(UserManagementViewComponentEnum.CLIENT_REGISTRATION);
    };

    const onRegister = async (newClient: NewClient) => {
        try {
            const response = await fetch(registrationEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(newClient),
            });

            if (response.ok) {
                const unwrappedResponse = await response.json();
                console.log(unwrappedResponse);
                setFeedback({ message: 'Client successfully registered!', type: 'success' });
                // Clear form after successful registration
                setFirstName('');
                setLastName('');
                setEmail('');
            } else {
                setFeedback({
                    message: `Failed to register client: ${response.status}`,
                    type: 'error',
                });
            }
        } catch (error) {
            console.error('Error while registering client:', error);
            setFeedback({ message: 'An error occurred while registering the client.', type: 'error' });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onRegister({
            message: null,
            trainerId: null,
            equipmentType: null,
            exerciseType: null,
            client: {
                firstName,
                lastName,
                email
            },
            exerciseRecord: null
        });
    };

    return (
        <div className="card shadow-sm p-3 mb-5 rounded" style={{ width: '18rem' }}>
            {!renderOpen ? (
                <button onClick={handleToggle} className="btn btn-primary w-100">
                    Register Client
                </button>
            ) : (
                <form onSubmit={handleSubmit}>
                    <h5 className="card-title text-primary">Register Client</h5>
                    <div className="mb-3">
                        <label htmlFor="client-first-name" className="form-label text-primary">First Name</label>
                        <input
                            type="text"
                            id="client-first-name"
                            className="form-control"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="client-last-name" className="form-label text-primary">Last Name</label>
                        <input
                            type="text"
                            id="client-last-name"
                            className="form-control"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="client-email" className="form-label text-primary">Email</label>
                        <input
                            type="email"
                            id="client-email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="d-flex justify-content-between">
                        <button type="button" onClick={handleCancel} className="btn btn-secondary">
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

export default ClientRegistration; 