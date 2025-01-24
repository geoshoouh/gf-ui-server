import React, { useState } from 'react';

interface UserDeletionFormProps {
    endpoint: string;
}

const UserDeletion: React.FC<UserDeletionFormProps> = (props: UserDeletionFormProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [email, setEmail] = useState('');

    const deletionEndpoint = props.endpoint + '/admin/user/delete';

    const handleToggle = () => {
        setIsExpanded(!isExpanded);
    };

    const onDelete = async (email: string) => {
        try {
            const response = await fetch(deletionEndpoint, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                const unwrappedResponse = await response.json();
                console.log(unwrappedResponse);
            } else {
                console.error('Failed to delete user:', response.statusText);
            }
        } catch (error) {
            console.error('Error while deleting user:', error);
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
        </div>
    );
};

export default UserDeletion;