import React from 'react';
import { ArrowLeft, Calendar, MapPin, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EventDetails({ event, onBack }) {
    if (!event) return null;

    return (
        <div className="w-full h-full overflow-y-auto bg-gray-100 pb-12 relative z-50">
            {/* Hero Header with Image */}
            <div className="relative h-[50vh] w-full overflow-hidden">
                <motion.img 
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.8 }}
                    src={event.image_url || 'https://via.placeholder.com/800x400'} 
                    alt={event.event_title} 
                    className="w-full h-full object-cover"
                    onError={(e) => {e.target.src = 'https://via.placeholder.com/800x400?text=No+Image'}}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
                    <div className="container mx-auto px-4 pb-12">
                        <motion.h1 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg"
                        >
                            {event.event_title}
                        </motion.h1>
                        <motion.div 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-wrap items-center text-white gap-6 text-lg"
                        >
                            <span className="flex items-center">
                                <MapPin className="mr-2 text-mexi-pink" size={24} /> 
                                {event.state_name}
                            </span>
                            <span className="flex items-center">
                                <Calendar className="mr-2 text-green-400" size={24} /> 
                                {event.event_date}
                            </span>
                        </motion.div>
                    </div>
                </div>
                
                <button 
                    onClick={onBack}
                    className="absolute top-6 left-6 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full backdrop-blur-sm transition-all z-20"
                >
                    <ArrowLeft size={24} />
                </button>
            </div>

            <div className="container mx-auto px-4 -mt-10 relative z-10">
                <div className="bg-white rounded-xl shadow-xl p-8 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">About this Event</h2>
                            <p className="text-gray-600 leading-relaxed text-lg mb-6 whitespace-pre-line">
                                {event.description || "No description available for this event."}
                            </p>
                        </div>
                        
                        <div className="md:col-span-1">
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 sticky top-4">
                                <h3 className="font-bold text-xl mb-4 text-gray-800">Interested?</h3>
                                {event.official_site_url ? (
                                    <a 
                                        href={event.official_site_url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold py-3 px-4 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                                    >
                                        <ExternalLink size={20} />
                                        Visit Official Site
                                    </a>
                                ) : (
                                    <button disabled className="w-full bg-gray-300 text-gray-500 font-bold py-3 px-4 rounded-lg cursor-not-allowed">
                                        No Website Available
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
