import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, MessageSquare, Send, Maximize2, Minimize2, User, ExternalLink, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import StarRating from './StarRating';
import { SoundManager } from '../utils/SoundManager';

export default function EventCard({ event, position, visible, loading, error, onMouseEnter, onMouseLeave, onClose, isLocked, forceExpand }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isExpanded, setIsExpanded] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [commentsLoading, setCommentsLoading] = useState(false);
    const [user, setUser] = useState(null);

    // Interaction State
    const [likesCount, setLikesCount] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [avgRating, setAvgRating] = useState(0);
    const [ratingCount, setRatingCount] = useState(0);
    const [userRating, setUserRating] = useState(0);

    // Normalize events
    const eventsList = Array.isArray(event) ? event : (event ? [event] : []);
    const currentEvent = eventsList[currentIndex];

    // Reset index when event data changes significantly (e.g. switching context)
    // We check if the current event is still valid in the new list, if not reset to 0
    useEffect(() => {
        if (currentIndex >= eventsList.length) {
            setCurrentIndex(0);
        }
    }, [eventsList, currentIndex]);

    useEffect(() => {
        const storedUser = localStorage.getItem('mexi_user');
        if (storedUser) setUser(JSON.parse(storedUser));
    }, []);

    // Sync interactions with current event data
    useEffect(() => {
        if (currentEvent) {
            setLikesCount(currentEvent.likes_count || 0);
            setIsLiked(currentEvent.user_liked || false);
            setAvgRating(currentEvent.average_rating || 0);
            setRatingCount(currentEvent.rating_count || 0);
            setUserRating(currentEvent.user_rating || 0);
        }
    }, [currentEvent]);

    // Force expand if prop is true
    useEffect(() => {
        if (forceExpand && currentEvent) {
            setIsExpanded(true);
        }
    }, [forceExpand, currentEvent]);

    useEffect(() => {
        if (isExpanded && currentEvent) {
            fetchComments(currentEvent.id);
        }
    }, [isExpanded, currentEvent]);

    const handleLike = (e) => {
        e?.stopPropagation();
        if (!user) {
            alert("Please login to like events");
            return;
        }

        SoundManager.play('pop');

        const newLiked = !isLiked;
        // Optimistic update
        setIsLiked(newLiked);
        setLikesCount(prev => newLiked ? prev + 1 : prev - 1);

        const token = localStorage.getItem('mexi_token');
        fetch('http://localhost/mexi-events/api/interact.php', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ action: 'like', event_id: currentEvent.id })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                setLikesCount(data.likes_count);
            } else {
                // Revert
                setIsLiked(!newLiked);
                setLikesCount(prev => !newLiked ? prev + 1 : prev - 1);
            }
        })
        .catch(() => {
            setIsLiked(!newLiked);
            setLikesCount(prev => !newLiked ? prev + 1 : prev - 1);
        });
    };

    const handleRate = (rating) => {
        if (!user) {
            alert("Please login to rate events");
            return;
        }

        SoundManager.play('success');

        // Optimistic update for user rating only
        setUserRating(rating);

        const token = localStorage.getItem('mexi_token');
        fetch('http://localhost/mexi-events/api/interact.php', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ action: 'rate', event_id: currentEvent.id, rating })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                setAvgRating(data.average_rating);
                setRatingCount(data.rating_count);
            }
        });
    };

    const fetchComments = (eventId) => {
        setCommentsLoading(true);
        fetch(`http://localhost/mexi-events/api/comments.php?event_id=${eventId}`)
            .then(res => res.json())
            .then(data => {
                setComments(data.data || []);
                setCommentsLoading(false);
            })
            .catch(err => {
                console.error(err);
                setCommentsLoading(false);
            });
    };

    const handlePostComment = (e) => {
        e.preventDefault();
        if (!newComment.trim() || !user) return;

        const optimisticComment = {
            id: Date.now(), // temporary ID
            comment: newComment,
            username: user.username,
            created_at: new Date().toISOString(),
            isOptimistic: true
        };

        setComments([optimisticComment, ...comments]);
        setNewComment('');

        const token = localStorage.getItem('mexi_token');

        fetch('http://localhost/mexi-events/api/comments.php', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                event_id: currentEvent.id,
                comment: optimisticComment.comment
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                // Replace optimistic comment with real one
                setComments(prev => prev.map(c => c.id === optimisticComment.id ? data.comment : c));
            } else {
                // Revert on error
                alert('Failed to post comment');
                setComments(prev => prev.filter(c => c.id !== optimisticComment.id));
            }
        })
        .catch(() => {
            setComments(prev => prev.filter(c => c.id !== optimisticComment.id));
        });
    };

    if (!visible) return null;

    // Calculate position for mini card
    const isRight = position.x < window.innerWidth / 2;
    const isBottom = position.y > window.innerHeight / 2;
    
    const miniCardStyle = {
        [isRight ? 'left' : 'right']: isRight ? position.x + 30 : window.innerWidth - position.x + 30,
        [isBottom ? 'bottom' : 'top']: isBottom ? window.innerHeight - position.y + 10 : position.y + 10,
    };

    const nextSlide = (e) => {
        e?.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % eventsList.length);
    };

    const prevSlide = (e) => {
        e?.stopPropagation();
        setCurrentIndex((prev) => (prev - 1 + eventsList.length) % eventsList.length);
    };

    // --- EXPANDED VIEW ---
    if (isExpanded && currentEvent) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 md:p-8">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-slate-900 w-full max-w-6xl h-[90vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row border border-slate-700 relative"
                >
                    <button 
                        onClick={() => setIsExpanded(false)}
                        className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-mexi-pink text-white rounded-full transition-colors"
                    >
                        <Minimize2 size={24} />
                    </button>

                    {/* Left: Media & Details */}
                    <div className="w-full md:w-2/3 h-1/2 md:h-full flex flex-col relative bg-black">
                        <div className="flex-1 relative overflow-hidden group">
                             {currentEvent.image_url && currentEvent.image_url.match(/\.(mp4|webm)$/i) ? (
                                <video src={currentEvent.image_url} className="w-full h-full object-contain bg-black" controls autoPlay />
                            ) : (
                                <img 
                                    src={currentEvent.image_url || 'https://via.placeholder.com/800'} 
                                    alt={currentEvent.event_title} 
                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent pointer-events-none"></div>
                            
                            <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
                                <h1 className="text-4xl md:text-5xl font-black text-white mb-2 drop-shadow-lg">{currentEvent.event_title}</h1>
                                <div className="flex items-center gap-4 text-mexi-pink font-bold uppercase tracking-widest mb-4">
                                    <span>{currentEvent.state_name}</span>
                                    <span>•</span>
                                    <span>{currentEvent.event_date}</span>
                                </div>
                                
                                <div className="flex flex-wrap items-center gap-6 mb-6">
                                    <button 
                                        onClick={handleLike} 
                                        className="flex items-center gap-2 bg-slate-800/50 hover:bg-slate-700 px-4 py-2 rounded-full transition-all group/like"
                                    >
                                        <Heart 
                                            size={24} 
                                            className={`transition-colors ${isLiked ? "fill-mexi-pink text-mexi-pink" : "text-white group-hover/like:text-mexi-pink"}`} 
                                        />
                                        <span className="text-white font-bold">{likesCount} Likes</span>
                                    </button>

                                    <div className="flex items-center gap-3 bg-slate-800/50 px-4 py-2 rounded-full">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-400 uppercase font-bold">Average Rating</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-white font-bold text-lg">{avgRating.toFixed(1)}</span>
                                                <StarRating rating={avgRating} readonly={true} size={16} count={ratingCount} />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-3 bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700 hover:border-mexi-gold transition-colors">
                                        <span className="text-xs text-gray-400 uppercase font-bold mr-2">Your Rating:</span>
                                        <StarRating rating={userRating} onRate={handleRate} size={20} />
                                    </div>
                                </div>

                                <p className="text-gray-300 text-lg leading-relaxed max-w-3xl line-clamp-3 md:line-clamp-none mb-6">
                                    {currentEvent.description}
                                </p>
                                
                                {currentEvent.official_site_url && (
                                    <a 
                                        href={currentEvent.official_site_url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-mexi-pink to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white rounded-full font-bold shadow-lg shadow-pink-900/30 transition-all hover:scale-105 active:scale-95"
                                    >
                                        Visit Official Site <ExternalLink size={18} />
                                    </a>
                                )}
                            </div>
                        </div>

                         {/* Carousel Controls (Expanded) */}
                         {eventsList.length > 1 && (
                            <>
                                <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-mexi-pink text-white rounded-full backdrop-blur-sm transition-all">
                                    <ChevronLeft size={32} />
                                </button>
                                <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-mexi-pink text-white rounded-full backdrop-blur-sm transition-all">
                                    <ChevronRight size={32} />
                                </button>
                            </>
                        )}
                    </div>

                    {/* Right: Comments Section */}
                    <div className="w-full md:w-1/3 h-1/2 md:h-full bg-slate-800 border-l border-slate-700 flex flex-col">
                        <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-800 z-10">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <MessageSquare className="text-mexi-pink" /> Discussion
                            </h3>
                            <span className="text-sm text-gray-400">{comments.length} comments</span>
                        </div>

                        {/* Comments List */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
                            {commentsLoading ? (
                                <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mexi-pink"></div></div>
                            ) : comments.length === 0 ? (
                                <div className="text-center py-10 text-gray-500">
                                    <MessageSquare size={48} className="mx-auto mb-4 opacity-20" />
                                    <p>No comments yet.</p>
                                    <p className="text-sm">Be the first to share your thoughts!</p>
                                </div>
                            ) : (
                                comments.map((comment) => (
                                    <div key={comment.id} className={`flex gap-3 ${comment.isOptimistic ? 'opacity-50' : ''}`}>
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-mexi-pink flex items-center justify-center text-white font-bold text-sm shrink-0">
                                            {comment.username.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-baseline justify-between mb-1">
                                                <span className="font-bold text-white">{comment.username}</span>
                                                <span className="text-xs text-gray-500">{new Date(comment.created_at).toLocaleDateString()}</span>
                                            </div>
                                            <p className="text-gray-300 text-sm leading-relaxed bg-slate-700/50 p-3 rounded-r-xl rounded-bl-xl">
                                                {comment.comment}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Comment Input */}
                        <div className="p-4 bg-slate-900 border-t border-slate-700">
                            <form onSubmit={handlePostComment} className="relative">
                                <input 
                                    type="text" 
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder={user ? "Write a comment..." : "Login to comment"}
                                    disabled={!user}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-full py-3 pl-4 pr-12 text-white focus:outline-none focus:border-mexi-pink disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                                <button 
                                    type="submit" 
                                    disabled={!newComment.trim() || !user}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-mexi-pink hover:bg-slate-700 rounded-full transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                                >
                                    <Send size={20} />
                                </button>
                            </form>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    // --- MINI CARD VIEW ---
    return (
        <div 
            className="fixed z-50 bg-slate-900/95 backdrop-blur-sm border border-slate-700 rounded-xl shadow-2xl p-4 w-80 text-white transition-opacity duration-300"
            style={miniCardStyle}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            {isLocked && (
                <button 
                    onClick={onClose}
                    className="absolute top-2 right-2 p-1 bg-slate-800 rounded-full hover:bg-mexi-pink transition-colors z-20"
                    aria-label="Close"
                >
                    <X size={16} />
                </button>
            )}

            {loading ? (
                 <div className="flex justify-center items-center h-32">
                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mexi-pink"></div>
                 </div>
            ) : error ? (
                <div className="text-center py-4">
                    <p className="text-gray-400">{error}</p>
                </div>
            ) : currentEvent ? (
                <div className="relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => setIsExpanded(true)}
                            className="cursor-pointer group/card"
                        >
                            <div className="w-full h-40 mb-3 overflow-hidden rounded-lg bg-slate-800 relative group">
                                {currentEvent.image_url && currentEvent.image_url.match(/\.(mp4|webm)$/i) ? (
                                    <video src={currentEvent.image_url} className="w-full h-full object-cover" autoPlay muted loop />
                                ) : (
                                    <img 
                                        src={currentEvent.image_url || 'https://via.placeholder.com/300'} 
                                        alt={currentEvent.event_title} 
                                        className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                                        onError={(e) => {e.target.src = 'https://via.placeholder.com/300?text=No+Image'}}
                                    />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent group-hover/card:opacity-80 transition-opacity"></div>
                                <span className="absolute bottom-2 left-2 text-xs bg-slate-700/80 px-2 py-1 rounded text-gray-200 uppercase tracking-wider backdrop-blur-sm">
                                    {currentIndex + 1} / {eventsList.length}
                                </span>
                                
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity">
                                    <span className="bg-black/50 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 backdrop-blur-sm border border-white/20">
                                        <Maximize2 size={12} /> Click to Expand
                                    </span>
                                </div>
                            </div>
                            
                            <h3 className="text-xl font-bold mb-1 text-mexi-pink line-clamp-1 group-hover/card:text-white transition-colors">
                                {currentEvent.event_title}
                            </h3>
                            
                            <div className="flex justify-between items-end mb-2">
                                <div className="flex flex-col">
                                    <span className="text-xs text-mexi-pink font-bold uppercase tracking-wider">{currentEvent.state_name}</span>
                                    <span className="text-[10px] text-gray-500 font-mono">{currentEvent.event_date}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1 text-xs text-gray-400">
                                        <Heart size={12} className={isLiked ? "fill-mexi-pink text-mexi-pink" : ""} /> 
                                        {likesCount}
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-gray-400">
                                        <StarRating rating={avgRating} readonly={true} size={12} count={0} />
                                        <span>({ratingCount})</span>
                                    </div>
                                </div>
                            </div>
                            
                            <p className="text-sm mb-4 text-gray-300 line-clamp-3 leading-relaxed h-[4.5em]">
                                {currentEvent.description}
                            </p>
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Arrows */}
                    {eventsList.length > 1 && (
                        <>
                            <button 
                                onClick={prevSlide}
                                className="absolute left-0 top-[80px] -translate-y-1/2 -translate-x-2 p-1 bg-slate-800/80 hover:bg-mexi-pink text-white rounded-full shadow-lg transition-all z-10"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <button 
                                onClick={nextSlide}
                                className="absolute right-0 top-[80px] -translate-y-1/2 translate-x-2 p-1 bg-slate-800/80 hover:bg-mexi-pink text-white rounded-full shadow-lg transition-all z-10"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </>
                    )}
                </div>
            ) : (
                <div className="text-center py-4">
                    <p className="text-gray-400">No hay eventos próximos en este estado.</p>
                </div>
            )}
        </div>
    );
}
