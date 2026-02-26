import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, ArrowRight, X } from 'lucide-react';

export default function LandingPage({ onExplore, onSelectState }) {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const videoRef = React.useRef(null);

  useEffect(() => {
    // Ideally fetch from an endpoint like /api/get_featured_events.php
    // For now, we'll simulate or fetch a few states we know have events
    const statesToFetch = ['Guanajuato', 'Oaxaca', 'Mexico City'];
    
    Promise.all(statesToFetch.map(state => 
      fetch(`http://localhost/mexi-events/api/get_events.php?state=${encodeURIComponent(state)}`)
        .then(res => res.json())
        .then(data => data.data ? data.data[0] : null)
    ))
    .then(results => {
      setFeaturedEvents(results.filter(Boolean));
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  return (
    <div className="w-full min-h-screen bg-mexi-dark text-white overflow-y-auto">
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0 z-0">
          <video 
            ref={videoRef}
            autoPlay 
            loop 
            muted 
            playsInline
            onLoadedMetadata={() => {
                if (videoRef.current) {
                    videoRef.current.currentTime = 3;
                }
            }}
            className="w-full h-full object-cover opacity-40"
          >
            <source src="/assets/background-video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-mexi-dark/30 via-mexi-dark/60 to-mexi-dark"></div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="z-10 max-w-4xl"
        >
          <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter">
            MEXI<span className="text-transparent bg-clip-text bg-gradient-to-r from-mexi-pink to-purple-600">EVENTS</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Discover the vibrant culture, traditions, and festivals of Mexico through an interactive journey.
          </p>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onExplore}
            className="group relative px-8 py-4 bg-mexi-pink text-white text-lg font-bold rounded-full shadow-lg hover:shadow-mexi-pink/50 transition-all flex items-center gap-3 mx-auto overflow-hidden"
          >
            <span className="relative z-10">Explore Interactive Map</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-mexi-pink opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </motion.button>
        </motion.div>
      </section>

      {/* Featured Locations */}
      <section className="py-20 px-4 md:px-10 max-w-7xl mx-auto z-10 relative">
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
        >
            <h2 className="text-4xl font-bold mb-12 text-center text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Featured Destinations</h2>
            
            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-mexi-pink"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {featuredEvents.map((event, index) => (
                        <motion.div
                            key={event.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -10 }}
                            onClick={() => onSelectState(event.state_name)}
                            className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl overflow-hidden cursor-pointer group hover:border-mexi-pink/50 transition-all shadow-xl"
                        >
                            <div className="h-48 overflow-hidden relative">
                                <img 
                                    src={event.image_url} 
                                    alt={event.event_title} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-60"></div>
                                <span className="absolute bottom-4 left-4 bg-mexi-blue/90 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                    {event.state_name}
                                </span>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold mb-2 text-white group-hover:text-mexi-pink transition-colors line-clamp-1">{event.event_title}</h3>
                                <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                                    <Calendar className="w-4 h-4" />
                                    <span>{event.event_date}</span>
                                </div>
                                <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                                    {event.description}
                                </p>
                                <div className="flex items-center text-mexi-pink text-sm font-semibold group-hover:translate-x-2 transition-transform">
                                    View on Map <ArrowRight className="w-4 h-4 ml-1" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </motion.div>
      </section>
      
      {/* Floating Toggle Preview (Mini Map Trigger) - Only visible when scrolled down a bit? 
          Actually user asked for persistent floating toggle. Let's put it bottom right. */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        onClick={onExplore}
        className="fixed bottom-8 right-8 z-50 bg-mexi-pink p-4 rounded-full shadow-2xl shadow-mexi-pink/40 border-4 border-mexi-dark"
      >
        <MapPin className="w-6 h-6 text-white" />
      </motion.button>
    </div>
  );
}
