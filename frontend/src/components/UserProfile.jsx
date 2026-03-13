import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Save, MapPin } from 'lucide-react';
import { MEXICO_STATES } from '../data/states';
import { SoundManager } from '../utils/SoundManager';

export default function UserProfile({ user, onClose, onUpdate }) {
    const [selectedState, setSelectedState] = useState(user?.state_id || '');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        if (user?.state_id) {
            setSelectedState(user.state_id);
        }
    }, [user]);

    const handleSave = async () => {
        setLoading(true);
        setMessage(null);
        SoundManager.play('click');

        try {
            const token = localStorage.getItem('mexi_token');
            const response = await fetch('http://localhost/mexi-events/api/geolocation.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    country_code: 'MX', // Assuming manual selection implies they want to be in Mexico context
                    state_id: selectedState
                })
            });

            const data = await response.json();

            if (data.success) {
                setMessage({ type: 'success', text: 'Location updated successfully!' });
                SoundManager.play('success');
                
                // Update local storage and parent state
                const updatedUser = { ...user, state_id: selectedState, country_code: 'MX' };
                localStorage.setItem('mexi_user', JSON.stringify(updatedUser));
                onUpdate(updatedUser);
                
                setTimeout(() => {
                    onClose();
                }, 1500);
            } else {
                throw new Error(data.error || 'Failed to update location');
            }
        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: err.message });
            SoundManager.play('error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-slate-800 p-6 flex justify-between items-center border-b border-slate-700">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <MapPin className="text-mexi-gold" />
                        Profile Settings
                    </h2>
                    <button 
                        onClick={onClose}
                        className="text-slate-400 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    {/* User Info */}
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wider text-slate-400 font-bold">Username</label>
                        <div className="bg-slate-800/50 p-3 rounded-lg text-white font-medium border border-slate-700">
                            {user?.username}
                        </div>
                    </div>

                    {/* Location Selector */}
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wider text-slate-400 font-bold">My Location</label>
                        <p className="text-xs text-slate-500 mb-2">
                            Select your home state to highlight it on the map and see local events.
                        </p>
                        <select
                            value={selectedState}
                            onChange={(e) => setSelectedState(e.target.value)}
                            className="w-full bg-slate-800 text-white p-3 rounded-lg border border-slate-600 focus:border-mexi-gold focus:ring-1 focus:ring-mexi-gold outline-none transition-all appearance-none cursor-pointer hover:bg-slate-700"
                        >
                            <option value="">Select a state...</option>
                            {MEXICO_STATES.map(state => (
                                <option key={state.id} value={state.id}>
                                    {state.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Message */}
                    {message && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`p-3 rounded-lg text-sm font-medium ${
                                message.type === 'success' 
                                    ? 'bg-green-900/30 text-green-300 border border-green-800' 
                                    : 'bg-red-900/30 text-red-300 border border-red-800'
                            }`}
                        >
                            {message.text}
                        </motion.div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 bg-slate-800/50 border-t border-slate-700 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-slate-400 hover:text-white transition-colors font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="px-6 py-2 bg-mexi-pink hover:bg-mexi-pink/90 text-white rounded-lg font-bold shadow-lg shadow-mexi-pink/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <Save size={18} />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}
