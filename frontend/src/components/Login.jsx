import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, LogIn, UserPlus } from 'lucide-react';

export default function Login({ onLogin, onCancel }) {
    const [isRegistering, setIsRegistering] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (isRegistering) {
            if (username.length < 3 || username.length > 20) {
                setError("Username must be between 3 and 20 characters");
                return;
            }
            if (!/^[a-zA-Z0-9_]+$/.test(username)) {
                setError("Username can only contain letters, numbers, and underscores");
                return;
            }
            if (password.length < 6) {
                setError("Password must be at least 6 characters long");
                return;
            }
            if (password !== confirmPassword) {
                setError("Passwords do not match");
                return;
            }
        }

        setLoading(true);

        const endpoint = isRegistering
            ? import.meta.env.VITE_API_URL + '/api/register.php'
            : import.meta.env.VITE_API_URL + '/api/login.php';

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            
            const data = await response.json();
            
            if (data.success) {
                localStorage.setItem('mexi_user', JSON.stringify(data.user));
                localStorage.setItem('mexi_token', data.token);
                onLogin(data.user, isRegistering);
            } else {
                setError(data.error || 'Authentication failed');
            }
        } catch (err) {
            setError('Connection error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-slate-900 border border-slate-700 p-8 rounded-2xl shadow-2xl w-full max-w-md"
            >
                <h2 className="text-2xl font-bold text-white mb-6 text-center flex items-center justify-center gap-2">
                    {isRegistering ? <UserPlus className="text-mexi-pink" /> : <LogIn className="text-mexi-pink" />}
                    {isRegistering ? 'Create Account' : 'Login'}
                </h2>
                
                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded mb-4 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-400 text-sm mb-1">Username</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
                            <input 
                                type="text" 
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-mexi-pink transition-colors"
                                placeholder="Enter username"
                                required
                            />
                        </div>
                        {isRegistering && (
                            <p className="text-xs text-gray-500 mt-1 pl-1">
                                3-20 characters, letters, numbers & underscore only.
                            </p>
                        )}
                    </div>
                    
                    <div>
                        <label className="block text-gray-400 text-sm mb-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
                            <input 
                                type="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-mexi-pink transition-colors"
                                placeholder="Enter password"
                                required
                            />
                        </div>
                        {isRegistering && (
                            <p className="text-xs text-gray-500 mt-1 pl-1">
                                Minimum 6 characters.
                            </p>
                        )}
                    </div>

                    {isRegistering && (
                        <div>
                            <label className="block text-gray-400 text-sm mb-1">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
                                <input 
                                    type="password" 
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-mexi-pink transition-colors"
                                    placeholder="Confirm password"
                                    required
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex gap-3 pt-4">
                        <button 
                            type="button" 
                            onClick={onCancel}
                            className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-gray-300 rounded-lg font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="flex-1 py-2.5 bg-gradient-to-r from-mexi-pink to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-lg font-bold shadow-lg shadow-pink-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Processing...' : (isRegistering ? 'Sign Up' : 'Login')}
                        </button>
                    </div>

                    <div className="text-center pt-2">
                        <button 
                            type="button"
                            onClick={() => {
                                setIsRegistering(!isRegistering);
                                setError('');
                                setPassword('');
                                setConfirmPassword('');
                            }}
                            className="text-sm text-gray-400 hover:text-white underline transition-colors"
                        >
                            {isRegistering ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
