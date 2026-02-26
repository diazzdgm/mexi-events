import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Star, TrendingUp, Calendar } from 'lucide-react';

export default function TrendingSidebar({ onEventClick }) {
    const [trendingEvents, setTrendingEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrending = () => {
            fetch('http://localhost/mexi-events/api/get_trending.php')
                .then(res => res.json())
                .then(data => {
                    setTrendingEvents(data.data || []);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Error fetching trending events:", err);
                    setLoading(false);
                });
        };

        fetchTrending();
        // Refresh every 30 seconds for "real-time" feel
        const interval = setInterval(fetchTrending, 30000);
        return () => clearInterval(interval);
    }, []);

    if (loading || trendingEvents.length === 0) return null;

    return (
        <motion.div 
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="fixed left-4 top-24 z-40 w-72 max-h-[calc(100vh-120px)] flex flex-col pointer-events-none"
        >
            <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto flex flex-col">
                <div className="p-4 border-b border-slate-700/50 bg-gradient-to-r from-slate-900 to-slate-800">
                    <h3 className="text-white font-bold flex items-center gap-2 text-lg">
                        <TrendingUp className="text-mexi-pink" size={20} />
                        Most Anticipated
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">Top liked events by community</p>
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
                                {/* Thumbnail */}
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

                                {/* Info */}
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
                                                {event.average_rating.toFixed(1)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
