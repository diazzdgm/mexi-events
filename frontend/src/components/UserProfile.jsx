import React from 'react';
import { motion } from 'framer-motion';
import { X, MapPin } from 'lucide-react';

export default function UserProfile({ user, onClose, onUpdate }) {
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
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wider text-slate-400 font-bold">Username</label>
                        <div className="bg-slate-800/50 p-3 rounded-lg text-white font-medium border border-slate-700">
                            {user?.username}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 bg-slate-800/50 border-t border-slate-700 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-slate-400 hover:text-white transition-colors font-medium"
                    >
                        Cerrar
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}
