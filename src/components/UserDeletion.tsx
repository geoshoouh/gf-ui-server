import React, { useState } from 'react';
import UserManagementViewComponentEnum from '../types/Enums';

interface UserDeletionFormProps {
    endpoint: string;
    token: string;
    openFormCallback: (component: UserManagementViewComponentEnum) => void;
    closeFormCallback: (component: UserManagementViewComponentEnum) => void;
    renderOpen: boolean;
}

const UserDeletion: React.FC<UserDeletionFormProps> = ({ endpoint, token, openFormCallback, closeFormCallback, renderOpen }) => {
    const [email, setEmail] = useState('');
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' | null }>({
        message: '',
        type: null,
    });
    
    const deletionEndpoint = `${endpoint}/admin/user/delete`;

    const handleToggle = () => {
        setFeedback({ message: '', type: null });

        openFormCallback(UserManagementViewComponentEnum.USER_DELETION);
    };

    const onDelete = async () => {
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
                setFeedback({ message: `Failed to delete user: ${response.status}`, type: 'error' });
            }
        } catch (error) {
            console.error('Error while deleting user:', error);
            setFeedback({ message: 'An error occurred while deleting the user.', type: 'error' });
        }

        setShowConfirmation(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowConfirmation(true); // Show confirmation modal
    };

    const handleCancel = () => {
        setShowConfirmation(false);
        closeFormCallback(UserManagementViewComponentEnum.USER_DELETION);
        setFeedback({ message: '', type: null });
    };

    return (
        <div className="card shadow-sm p-3 mb-5 rounded" style={{ width: '18rem' }}>
            {!renderOpen ? (
                <button onClick={handleToggle} className="btn btn-danger w-100">
                    Delete User
                </button>
            ) : (
                <form onSubmit={handleSubmit}>
                    <h5 className="card-title text-primary">Delete User</h5>
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
                    <div className="d-flex justify-content-between">
                        <button type="button" onClick={handleCancel} className="btn btn-secondary">
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

            {showConfirmation && (
                <div
                    className="modal"
                    style={{
                        display: 'block',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    }}
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title text-primary">Confirm Deletion</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={handleCancel}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <p>Are you sure you want to delete the user with email <strong>{email}</strong>?</p>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={onDelete}
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserDeletion;
