import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { PlusCircleIcon } from '../components/icons';
import { playSound } from '../services/audioService';

interface RegisterPageProps {
    onSwitchToLogin: () => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onSwitchToLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        playSound('click');
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        setError('');
        setLoading(true);
        try {
            await register(email, password);
            playSound('success');
        } catch (err: any) {
            setError(err.message || 'Failed to register.');
            playSound('fail');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center font-sans animate-fadeIn">
            <div className="glassmorphism p-8 rounded-lg border border-cyan-500/50 shadow-lg shadow-cyan-500/20 w-full max-w-sm">
                <div className="text-center mb-8">
                    <PlusCircleIcon className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
                    <h1 className="text-3xl font-orbitron text-white">Create Agent Profile</h1>
                    <p className="text-gray-400">Join the simulation.</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-400 mb-2" htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-600 rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-400 mb-2" htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-600 rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            required
                        />
                    </div>
                     <div className="mb-6">
                        <label className="block text-gray-400 mb-2" htmlFor="confirm-password">Confirm Password</label>
                        <input
                            type="password"
                            id="confirm-password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-600 rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            required
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-md transition-colors font-bold disabled:bg-gray-600"
                    >
                        {loading ? 'Creating Profile...' : 'Register'}
                    </button>
                </form>
                <p className="text-center text-gray-400 mt-6">
                    Already have a profile?{' '}
                    <button onClick={onSwitchToLogin} className="text-cyan-400 hover:underline">Log in here</button>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;