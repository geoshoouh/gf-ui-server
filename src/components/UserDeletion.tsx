import React, { useState } from 'react';

interface UserDeletionFormProps {
    endpoint: string;
    token: string;
}

const UserDeletion: React.FC<UserDeletionFormProps> = ({ endpoint, token }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [email, setEmail] = useState('');
    const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' | null }>({
        message: '',
        type: null,
    });

    const deletionEndpoint = `${endpoint}/admin/user/delete`;

    const handleToggle = () => {
        setIsExpanded(!isExpanded);
        setFeedback({ message: '', type: null });
    };

    const onDelete = async (email: string) => {
        const emailObject = { email };

        try {
            const response = await fetch(deletionEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(emailObject),
            });

            if (response.ok) {
                const unwrappedResponse = await response.json();
                console.log(unwrappedResponse);
                setFeedback({ message: 'User successfully deleted!', type: 'success' });
            } else {
                setFeedback({ message: `Failed to delete user: ${response.statusText}`, type: 'error' });
            }
        } catch (error) {
            console.error('Error while deleting user:', error);
            setFeedback({ message: 'An error occurred while deleting the user.', type: 'error' });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onDelete(email);
        setEmail('');
        setIsExpanded(false);
    };

    return (
        <div className="card shadow-sm p-3 mb-5 bg-white rounded" style={{ width: '18rem' }}>
            {!isExpanded ? (
                <button onClick={handleToggle} className="btn btn-danger w-100">
                    Delete User
                </button>
            ) : (
                <form onSubmit={handleSubmit}>
                    <h5 className="card-title">Delete User</h5>
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
                    <div className="d-flex justify-content-between">
                        <button type="button" onClick={handleToggle} className="btn btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-danger">
                            Delete
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

export default UserDeletion;
