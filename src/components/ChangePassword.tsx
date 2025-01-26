import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GPF_User from '../types/Interfaces';

interface ChangePasswordProps {
    endpoint: string; // Backend endpoint for updating the password
    appUser: GPF_User;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({ endpoint, appUser }) => {

    const navigate = useNavigate();

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Ensure passwords match
        if (newPassword !== confirmPassword) {
            setMessage('Passwords do not match.');
            setIsSuccess(false);
            return;
        }

        const requestBodyObj = {
            email: appUser.email,
            password: currentPassword,
            newPassword: newPassword,
        }

        const changePassEndpoint = endpoint + `/${appUser.role.toLowerCase()}/user/update/password`

        try {
            const response = await fetch(changePassEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${appUser.token}`, // Use the token for authentication
                },
                body: JSON.stringify(requestBodyObj),
            });

            if (response.ok) {
                setIsSuccess(true);
                setMessage('Password updated successfully! Redirecting to login...');
                setTimeout(() => {
                    navigate('/login'); // Redirect to login page
                }, 1000);
            } else {
                const errorData = await response.json();
                setMessage(errorData.message || 'Failed to update password.');
                setIsSuccess(false);
            }
        } catch (error) {
            console.error('Error updating password:', error);
            setMessage('An error occurred. Please try again.');
            setIsSuccess(false);
        }
    };

    return (
        <div className="card p-4 shadow" style={{ width: '400px', margin: '50px auto' }}>
            <h2 className="text-center mb-4">Change Password</h2>
            <form onSubmit={handleSubmit}>
            <div className="mb-3">
                    <label htmlFor="currentPassword" className="form-label">New Password</label>
                    <input
                        type="password"
                        id="currentPassword"
                        className="form-control"
                        placeholder="Enter current password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="newPassword" className="form-label">New Password</label>
                    <input
                        type="password"
                        id="newPassword"
                        className="form-control"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        className="form-control"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-success w-100">Update Password</button>
                {message && (
                    <div
                        className={`alert mt-4 ${
                            isSuccess ? 'alert-success' : 'alert-danger'
                        }`}
                        role="alert"
                    >
                        {message}
                    </div>
                )}
            </form>
        </div>
    );
};

export default ChangePassword;
