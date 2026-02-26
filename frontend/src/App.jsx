import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MexicoMap from './components/MexicoMap';
import EventCard from './components/EventCard';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import UserProfile from './components/UserProfile';
import { useGeolocation } from './hooks/useGeolocation';
import { MEXICO_STATES } from './data/states';
import { X, ArrowLeft, Settings, LogOut, User, Globe, MapPin } from 'lucide-react';
import { SoundManager } from './utils/SoundManager';
import TrendingSidebar from './components/TrendingSidebar';

function App() {
  const [view, setView] = useState('landing'); // 'landing' | 'map'
  const [hoveredState, setHoveredState] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cardPosition, setCardPosition] = useState({ x: 0, y: 0 });
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const { location } = useGeolocation();
  const [showRangeWarning, setShowRangeWarning] = useState(false);
  const [showNearMePopup, setShowNearMePopup] = useState(false);
  
  // Use ref for timeout to ensure synchronous access across closures
  const hideTimeoutRef = useRef(null);

  useEffect(() => {
    if (location && location.is_mexico === false) {
        // If user is logged in and has manually set their location to Mexico, don't show warning
        if (user && user.country_code === 'MX') return;
        
        // Check if we already showed it this session? 
        // For now, let's show it, user can close it.
        // Maybe we want to persist the dismissal?
        const warningDismissed = sessionStorage.getItem('mexi_warning_dismissed');
        if (!warningDismissed) {
            setShowRangeWarning(true);
        }
    }
  }, [location, user]);

  // Deep linking logic
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const stateParam = params.get('state');
    
    // Check login status
    const storedUser = localStorage.getItem('mexi_user');
    if (storedUser) {
        setUser(JSON.parse(storedUser));
    }

    // Only allow auto-nav to map if user is logged in
    if (stateParam) {
      if (storedUser) {
          setView('map');
          setSelectedState(stateParam);
          setCardPosition({ x: window.innerWidth / 2 - 160, y: window.innerHeight / 2 - 100 });
          fetchEvents(stateParam);
      } else {
          // If not logged in but tries to deep link, show login
          // Remove param to prevent loop or confusion? 
          // Or keep it and nav after login? Let's just show login on landing.
          setShowLogin(true);
      }
    }
  }, []);

  const handleExplore = () => {
    SoundManager.play('click');
    if (user) {
        setView('map');
    } else {
        setShowLogin(true);
    }
  };

  const handleAdmin = () => {
      SoundManager.play('click');
      window.location.href = '/admin.html';
  }

  const handleLoginClick = () => {
      SoundManager.play('click');
      setShowLogin(true);
  };

  const handleLoginSuccess = (userData, isNewUser = false) => {
      SoundManager.play('success');
      setUser(userData);
      setShowLogin(false);
      
      if (isNewUser) {
          setShowProfile(true);
      } else if (userData.state_id) {
          // If user already has a state, show it
          handleUpdateUser(userData);
      }
      
      // If there was a pending state param, maybe nav there?
      // For now, if they clicked Explore, we should probably nav to map
      // But we don't know if they clicked Explore or just Login button.
      // Let's just stay on Landing, user can click Explore again (now enabled).
      // Or auto-nav if we want to be fancy. Let's keep it simple.
  };

  const handleLogout = () => {
      SoundManager.play('pop');
      localStorage.removeItem('mexi_user');
      localStorage.removeItem('mexi_token');
      setUser(null);
      setView('landing'); // Force back to landing
      window.location.href = '/'; // Refresh to clear state
  };

  const handleSelectStateFromLanding = (stateName) => {
    SoundManager.play('click');
    if (user) {
        setView('map');
        setSelectedState(stateName);
        setCardPosition({ x: window.innerWidth / 2 - 160, y: window.innerHeight / 2 - 100 });
        fetchEvents(stateName);
        
        const url = new URL(window.location);
        url.searchParams.set('state', stateName);
        window.history.pushState({}, '', url);
    } else {
        setShowLogin(true);
    }
  };

  const handleBackToLanding = () => {
    SoundManager.play('click');
    setView('landing');
    setHoveredState(null);
    setSelectedState(null);
    setEventData(null);
    const url = new URL(window.location);
    url.searchParams.delete('state');
    window.history.pushState({}, '', url);
  };

  const handleTrendingClick = (event) => {
      SoundManager.play('click');
      setView('map');
      
      // Simulate selection logic without state hovering
      // We set the selectedState to the event's state to highlight it
      // And we set the eventData to just this event
      
      const stateObj = MEXICO_STATES.find(s => s.name.toLowerCase() === event.state_name.toLowerCase());
      if (stateObj) {
          setSelectedState(stateObj.name); // Highlight map
      } else {
          setSelectedState(null);
      }
      
      // Override standard fetch with this specific event
      setEventData(event);
      setHoveredState(event.state_name); // Trigger card appearance
      
      // Center card
      setCardPosition({ x: window.innerWidth / 2 - 160, y: window.innerHeight / 2 - 100 });
  };

  const fetchEvents = (stateName) => {
    setLoading(true);
    setError(null);
    setEventData(null);
    
    // We should probably send the token here too if we want to protect the READ API
    // But currently the READ API is public.
    const token = localStorage.getItem('mexi_token');
    const headers = {};
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    fetch(`http://localhost/mexi-events/api/get_events.php?state=${encodeURIComponent(stateName)}`, {
        headers: headers
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
        } else if (data.message) {
          setError(data.message);
        } else if (data.data) {
          // Store ALL events, not just the first one
          setEventData(data.data);
        } else {
          setError("No hay eventos próximos en este estado");
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Error al cargar eventos");
        setLoading(false);
      });
  };

  const handleUpdateUser = (updatedUser) => {
      setUser(updatedUser);
      if (updatedUser.country_code === 'MX') {
          setShowRangeWarning(false);
      }
      
      // If user selected a state, auto-navigate to map and select it
      if (updatedUser.state_id) {
          const stateObj = MEXICO_STATES.find(s => s.id === updatedUser.state_id);
          if (stateObj) {
              const stateName = stateObj.name;
              setView('map');
              
              // Simulate selection
              setSelectedState(stateName);
              setHoveredState(stateName); // To show card
              setCardPosition({ x: window.innerWidth / 2 - 160, y: window.innerHeight / 2 - 100 });
              fetchEvents(stateName);
              
              // Show "Near You" popup
              setShowNearMePopup(true);
              SoundManager.play('success');
              
              // Hide popup after 4 seconds
              setTimeout(() => {
                  setShowNearMePopup(false);
              }, 4000);
          }
      }
  };

  const handleStateHover = (stateName, e) => {
    if (selectedState) return;

    // Only play sound if it's a new state
    if (hoveredState !== stateName) {
        SoundManager.play('hover');
    }

    if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
    }

    setHoveredState(stateName);
    setCardPosition({ x: e.clientX, y: e.clientY });
    fetchEvents(stateName);
  };

  const handleStateClick = (stateName, e) => {
      SoundManager.play('click');
      if (selectedState === stateName) return;

      setSelectedState(stateName);
      setHoveredState(stateName);
      setCardPosition({ x: e.clientX, y: e.clientY });
      fetchEvents(stateName);

      const url = new URL(window.location);
      url.searchParams.set('state', stateName);
      window.history.pushState({}, '', url);
  };

  const handleCloseCard = () => {
      SoundManager.play('pop');
      setSelectedState(null);
      setHoveredState(null);
      const url = new URL(window.location);
      url.searchParams.delete('state');
      window.history.pushState({}, '', url);
  };

  const handleStateLeave = () => {
    if (selectedState) return;

    // Clear any existing timeout first to be safe
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);

    hideTimeoutRef.current = setTimeout(() => {
      setHoveredState(null);
      setEventData(null);
    }, 300);
  };

  const handleCardEnter = () => {
    if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
    }
  };

  const handleCardLeave = () => {
    if (selectedState) return;

    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    
    hideTimeoutRef.current = setTimeout(() => {
      setHoveredState(null);
      setEventData(null);
    }, 300);
  };

  return (
    <div className="w-full min-h-screen bg-mexi-dark relative overflow-hidden font-sans">
      <AnimatePresence>
          {showLogin && (
              <Login onLogin={handleLoginSuccess} onCancel={() => { SoundManager.play('pop'); setShowLogin(false); }} />
          )}
          {showProfile && (
              <UserProfile 
                  user={user} 
                  onClose={() => setShowProfile(false)} 
                  onUpdate={handleUpdateUser} 
              />
          )}
          {showRangeWarning && (
              <motion.div
                  initial={{ y: -100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -100, opacity: 0 }}
                  className="fixed top-0 left-0 right-0 z-[60] bg-orange-600/90 text-white p-3 backdrop-blur-md shadow-lg flex justify-center items-center gap-4 border-b border-orange-500"
              >
                  <div className="flex items-center gap-2">
                      <Globe className="animate-pulse" size={20} />
                      <span className="font-semibold hidden sm:inline">Notice:</span>
                  </div>
                  <p className="font-medium text-sm sm:text-base text-center max-w-2xl">
                      It looks like you're far from our current events! You can still browse, but local features are optimized for Mexico.
                  </p>
                  <button 
                      onClick={() => {
                          SoundManager.play('click');
                          setShowRangeWarning(false);
                          sessionStorage.setItem('mexi_warning_dismissed', 'true');
                      }}
                      className="bg-white/20 hover:bg-white/30 p-1 rounded-full transition-colors ml-2"
                  >
                      <X size={18} />
                  </button>
              </motion.div>
          )}

          {showNearMePopup && (
              <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 50 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 50 }}
                  className="fixed bottom-24 right-8 z-50 bg-mexi-pink/90 text-white p-4 rounded-xl shadow-2xl backdrop-blur-md border border-white/20 flex items-center gap-3 max-w-xs"
              >
                  <div className="bg-white/20 p-2 rounded-full">
                      <MapPin size={24} className="text-white animate-bounce" />
                  </div>
                  <div>
                      <h4 className="font-bold text-lg leading-tight">¡Bienvenido!</h4>
                      <p className="text-sm font-medium opacity-90">Mira los eventos cerca de ti</p>
                  </div>
                  <button 
                      onClick={() => setShowNearMePopup(false)}
                      className="absolute top-1 right-1 p-1 hover:bg-white/20 rounded-full transition-colors"
                  >
                      <X size={14} />
                  </button>
              </motion.div>
          )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {view === 'landing' ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-10"
          >
            <LandingPage onExplore={handleExplore} onSelectState={handleSelectStateFromLanding} />
            
            {/* User Controls */}
            <div className="fixed bottom-8 left-8 flex gap-4 z-50">
                {user ? (
                    <>
                        <div 
                            onClick={() => setShowProfile(true)}
                            className="bg-slate-800/80 backdrop-blur text-white px-4 py-3 rounded-full flex items-center gap-2 border border-slate-700 cursor-pointer hover:bg-slate-700 transition-colors"
                        >
                            <User size={18} className="text-mexi-pink" />
                            <span className="font-semibold">{user.username}</span>
                            <span className="text-xs bg-slate-700 px-2 py-0.5 rounded uppercase">{user.role}</span>
                        </div>
                        
                        {user.role === 'admin' && (
                            <button 
                                onClick={handleAdmin}
                                onMouseEnter={() => SoundManager.play('hover')}
                                className="p-3 bg-slate-800/80 hover:bg-slate-700 text-gray-400 hover:text-white rounded-full transition-all border border-slate-700"
                                title="Admin Panel"
                            >
                                <Settings size={20} />
                            </button>
                        )}
                        
                        <button 
                            onClick={handleLogout}
                            onMouseEnter={() => SoundManager.play('hover')}
                            className="p-3 bg-red-900/50 hover:bg-red-900/80 text-red-200 hover:text-white rounded-full transition-all border border-red-900/50"
                            title="Logout"
                        >
                            <LogOut size={20} />
                        </button>
                    </>
                ) : (
                    <button 
                        onClick={handleLoginClick}
                        onMouseEnter={() => SoundManager.play('hover')}
                        className="bg-slate-800/80 hover:bg-slate-700 text-white px-6 py-3 rounded-full font-semibold transition-all border border-slate-700 hover:border-mexi-pink shadow-lg"
                    >
                        Login / Sign Up
                    </button>
                )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="map"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-10 flex flex-col items-center justify-center"
          >
            <header className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-20 pointer-events-none">
                <div className="pointer-events-auto">
                    <motion.button 
                        onClick={handleBackToLanding}
                        onMouseEnter={() => SoundManager.play('hover')}
                        whileHover={{ x: -5 }}
                        className="flex items-center gap-2 text-white/80 hover:text-mexi-pink transition-colors bg-mexi-dark/50 px-4 py-2 rounded-full backdrop-blur-md"
                    >
                        <ArrowLeft size={20} />
                        <span className="font-semibold">Back to Home</span>
                    </motion.button>
                </div>
                
                <div className="text-right pointer-events-auto">
                    <h1 className="text-4xl font-black text-white tracking-widest uppercase drop-shadow-lg opacity-20 hover:opacity-100 transition-opacity duration-500">
                        Mexi<span className="text-mexi-pink">Events</span>
                    </h1>
                </div>
            </header>

            <TrendingSidebar onEventClick={handleTrendingClick} />

            <div className="w-full h-full flex items-center justify-center p-4 md:p-10">
                <MexicoMap 
                  onHover={handleStateHover} 
                  onLeave={handleStateLeave}
                  onClick={handleStateClick}
                  userStateId={user?.state_id || location?.state_id}
                />
            </div>
            
            {(hoveredState || selectedState) && (
                <EventCard 
                    key={hoveredState || selectedState} // Add key to force clean remount if state changes
                    event={eventData} 
                    position={cardPosition}
                    visible={true} 
                    loading={loading} 
                    error={error}
                    onMouseEnter={handleCardEnter}
                    onMouseLeave={handleCardLeave}
                    onClose={handleCloseCard}
                    isLocked={!!selectedState}
                />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
