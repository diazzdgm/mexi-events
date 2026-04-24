import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Star, TrendingUp, Calendar, X, ChevronRight } from 'lucide-react';
import PopularityChart from './PopularityChart';

export default function TrendingSidebar({ onEventClick }) {
    const [trendingEvents, setTrendingEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const fetchTrending = () => {
            fetch(import.meta.env.VITE_API_URL + '/api/get_trending.php')
                .then(async res => {
                    let text = await res.text();
                    const jsonStartIndex = text.indexOf('{');
                    if (jsonStartIndex !== -1) text = text.substring(jsonStartIndex);
                    try { return JSON.parse(text); } catch (e) { return { data: [] }; }
                })
                .then(data => {
                    setTrendingEvents(data.data || []);
                    setLoading(false);
                    if (data.data && data.data.length > 0 && !isVisible) {
                    }
                })
                .catch(err => {
                    console.error("Error fetching trending events:", err);
                    setLoading(false);
                });
        };

        fetchTrending();
        const interval = setInterval(fetchTrending, 30000);
        return () => clearInterval(interval);
    }, []);

    if (loading || trendingEvents.length === 0) return null;

    return (
        <>
            <AnimatePresence>
                {isVisible ? (
                    <motion.div 
                        initial={{ x: -300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -300, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed left-4 top-24 z-40 w-72 max-h-[calc(100vh-120px)] flex flex-col pointer-events-none"
                    >
                        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto flex flex-col">
                            <div className="p-4 border-b border-slate-700/50 bg-gradient-to-r from-slate-900 to-slate-800 flex justify-between items-start">
                                <div>
                                    <h3 className="text-white font-bold flex items-center gap-2 text-lg">
                                        <TrendingUp className="text-mexi-pink" size={20} />
                                        Most Anticipated
                                    </h3>
                                    <p className="text-xs text-gray-400 mt-1">Top liked events by community</p>
                                </div>
                                <button 
                                    onClick={() => setIsVisible(false)}
                                    className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-slate-700 rounded-lg"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="overflow-y-auto p-2 space-y-2 scrollbar-thin scrollbar-thumb-slate-600">
                                {trendingEvents.map((event, index) => (
                                    <motion.div
                                        key={event.id}
                                        whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.05)' }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => onEventClick(event)}
                                        className="bg-slate-800/50 rounded-xl p-3 cursor-pointer border border-transparent hover:border-mexi-pink/30 transition-all group"
                                    >
                                        <div className="flex gap-3">
                                            <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-slate-700 relative">
                                                {event.image_url && event.image_url.match(/\.(mp4|webm)$/i) ? (
                                                    <video src={event.image_url} className="w-full h-full object-cover" />
                                                ) : (
                                                    <img 
                                                        src={event.image_url || 'https://via.placeholder.com/150'} 
                                                        alt={event.event_title} 
                                                        className="w-full h-full object-cover"
                                                    />
                                                )}
                                                <div className="absolute top-0 left-0 bg-black/60 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-br-lg">
                                                    #{index + 1}
                                                </div>
                                            </div>
                                            <div className="flex flex-col justify-between flex-1 min-w-0">
                                                <div>
                                                    <h4 className="text-white font-semibold text-sm truncate group-hover:text-mexi-pink transition-colors">
                                                        {event.event_title}
                                                    </h4>
                                                    <div className="flex items-center gap-1 text-[10px] text-gray-400 uppercase tracking-wide">
                                                        <span className="truncate">{event.state_name}</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between mt-2">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex items-center gap-1 text-xs font-bold text-mexi-pink">
                                                            <Heart size={12} className="fill-mexi-pink" />
                                                            {event.likes_count}
                                                        </div>
                                                        <div className="flex items-center gap-1 text-xs font-bold text-yellow-400">
                                                            <Star size={12} className="fill-yellow-400" />
                                                            {event.average_rating?.toFixed(1)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}

                                <div className="pt-2">
                                    <PopularityChart events={trendingEvents} />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.button
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -50, opacity: 0 }}
                        whileHover={{ x: 5 }}
                        onClick={() => setIsVisible(true)}
                        className="fixed left-0 top-32 z-40 bg-slate-900 border-y border-r border-slate-700 text-mexi-pink p-3 rounded-r-xl shadow-xl hover:bg-slate-800 transition-colors flex items-center gap-2 group"
                    >
                        <TrendingUp size={24} />
                        <ChevronRight size={16} className="w-0 overflow-hidden group-hover:w-4 transition-all duration-300" />
                    </motion.button>
                )}
            </AnimatePresence>
        </>
    );
}
