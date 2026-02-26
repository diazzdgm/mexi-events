import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Edit, Plus, X, Save, Upload, Video, Image as ImageIcon, CheckCircle, AlertCircle, Eye, Heart, Star } from 'lucide-react';

export default function AdminPanel({ onBack }) {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingEvent, setEditingEvent] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [errors, setErrors] = useState({});
    const [viewMode, setViewMode] = useState('list'); // 'list' | 'carousel'
    const [carouselIndex, setCarouselIndex] = useState(0);

    const [formData, setFormData] = useState({
        state_name: '',
        event_title: '',
        event_date: '',
        description: '',
        image_url: '',
        official_site_url: ''
    });

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = () => {
        setLoading(true);
        // Admin needs to see all events, and CRUD API returns them.
        // But CRUD API currently doesn't return stats (likes/ratings).
        // I should probably update events_crud.php or just use get_events.php for the list view?
        // But get_events.php is per state.
        // Let's assume events_crud.php will be updated or we fetch stats separately?
        // Actually, for simplicity, I'll update events_crud.php to include stats in the GET list.
        fetch('http://localhost/mexi-events/api/events_crud.php')
            .then(res => res.json())
            .then(data => {
                setEvents(data.data || []);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    // --- Validation ---
    const validateField = (name, value) => {
        let error = '';
        if (name === 'state_name' && !value.trim()) error = 'State name is required';
        if (name === 'event_title' && !value.trim()) error = 'Event title is required';
        if (name === 'event_date' && !value) error = 'Date is required';
        if (name === 'description' && value.length < 10) error = 'Description must be at least 10 chars';
        
        setErrors(prev => ({ ...prev, [name]: error }));
        return error;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        validateField(name, value);
    };

    // --- File Upload ---
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file) => {
        const formData = new FormData();
        formData.append('file', file);

        // Simulate progress
        setUploadProgress(10);
        const interval = setInterval(() => {
            setUploadProgress(prev => Math.min(prev + 10, 90));
        }, 100);

        fetch('http://localhost/mexi-events/api/upload.php', {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            clearInterval(interval);
            setUploadProgress(100);
            if (data.success) {
                setFormData(prev => ({ ...prev, image_url: data.url }));
                setTimeout(() => setUploadProgress(0), 1000);
            } else {
                alert('Upload failed: ' + data.error);
                setUploadProgress(0);
            }
        })
        .catch(err => {
            clearInterval(interval);
            alert('Upload error');
            setUploadProgress(0);
        });
    };

    // --- CRUD ---
    const handleDelete = (id) => {
        if (!window.confirm('Are you sure you want to delete this event?')) return;

        fetch(`http://localhost/mexi-events/api/events_crud.php?id=${id}`, {
            method: 'DELETE'
        })
        .then(res => res.json())
        .then(() => {
            fetchEvents();
        });
    };

    const handleEdit = (event) => {
        setEditingEvent(event);
        setFormData(event);
        setIsAdding(false);
        setErrors({});
    };

    const handleAdd = () => {
        setEditingEvent(null);
        setFormData({
            state_name: '',
            event_title: '',
            event_date: '',
            description: '',
            image_url: '',
            official_site_url: ''
        });
        setIsAdding(true);
        setErrors({});
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validate all
        const newErrors = {};
        Object.keys(formData).forEach(key => {
            const err = validateField(key, formData[key]);
            if (err) newErrors[key] = err;
        });
        
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const method = isAdding ? 'POST' : 'PUT';
        const body = isAdding ? formData : { ...formData, id: editingEvent.id };

        fetch('http://localhost/mexi-events/api/events_crud.php', {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        })
        .then(res => res.json())
        .then(() => {
            setIsAdding(false);
            setEditingEvent(null);
            fetchEvents();
        });
    };

    // --- Carousel Logic ---
    const nextSlide = () => {
        setCarouselIndex((prev) => (prev + 1) % events.length);
    };
    
    const prevSlide = () => {
        setCarouselIndex((prev) => (prev - 1 + events.length) % events.length);
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white flex">
            {/* Sidebar Navigation */}
            <aside className="w-64 bg-slate-800 border-r border-slate-700 p-6 flex flex-col fixed h-full z-20">
                <h1 className="text-2xl font-bold text-mexi-pink mb-8">Admin Panel</h1>
                
                <nav className="flex-1 space-y-2">
                    <button 
                        onClick={() => { setViewMode('list'); setIsAdding(false); setEditingEvent(null); }}
                        className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${viewMode === 'list' && !isAdding && !editingEvent ? 'bg-mexi-pink text-white' : 'hover:bg-slate-700 text-gray-300'}`}
                    >
                        <div className="w-5 h-5 grid grid-cols-2 gap-0.5">
                            <div className="bg-current rounded-[1px]"></div>
                            <div className="bg-current rounded-[1px]"></div>
                            <div className="bg-current rounded-[1px]"></div>
                            <div className="bg-current rounded-[1px]"></div>
                        </div>
                        Events List
                    </button>
                    
                    <button 
                        onClick={() => { setViewMode('carousel'); setIsAdding(false); setEditingEvent(null); }}
                        className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${viewMode === 'carousel' ? 'bg-mexi-pink text-white' : 'hover:bg-slate-700 text-gray-300'}`}
                    >
                        <Eye size={20} />
                        Preview Carousel
                    </button>

                    <button 
                        onClick={handleAdd}
                        className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${isAdding ? 'bg-mexi-pink text-white' : 'hover:bg-slate-700 text-gray-300'}`}
                    >
                        <Plus size={20} />
                        Add New Event
                    </button>
                </nav>

                <button onClick={onBack} className="mt-auto w-full px-4 py-2 border border-slate-600 rounded hover:bg-slate-700 text-gray-400 hover:text-white transition">
                    Back to Map
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
                <header className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-white">
                        {isAdding ? 'Create New Event' : editingEvent ? 'Edit Event' : viewMode === 'carousel' ? 'Destinations Preview' : 'Manage Events'}
                    </h2>
                </header>

                {/* Form Section */}
                {(isAdding || editingEvent) && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-700 max-w-4xl mx-auto"
                    >
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Left Column: Inputs */}
                            <div className="space-y-4">
                                <div className="group">
                                    <label className="block text-sm font-medium text-gray-400 mb-1 flex justify-between">
                                        State Name
                                        {errors.state_name && <span className="text-red-400 text-xs flex items-center gap-1"><AlertCircle size={12}/> {errors.state_name}</span>}
                                    </label>
                                    <input 
                                        type="text" 
                                        name="state_name"
                                        value={formData.state_name}
                                        onChange={handleInputChange}
                                        className={`w-full bg-slate-900 border rounded-lg p-3 text-white focus:outline-none transition-colors ${errors.state_name ? 'border-red-500/50 focus:border-red-500' : 'border-slate-700 focus:border-mexi-pink'}`}
                                        placeholder="e.g. Oaxaca"
                                    />
                                </div>

                                <div className="group">
                                    <label className="block text-sm font-medium text-gray-400 mb-1 flex justify-between">
                                        Event Title
                                        {errors.event_title && <span className="text-red-400 text-xs flex items-center gap-1"><AlertCircle size={12}/> {errors.event_title}</span>}
                                    </label>
                                    <input 
                                        type="text" 
                                        name="event_title"
                                        value={formData.event_title}
                                        onChange={handleInputChange}
                                        className={`w-full bg-slate-900 border rounded-lg p-3 text-white focus:outline-none transition-colors ${errors.event_title ? 'border-red-500/50 focus:border-red-500' : 'border-slate-700 focus:border-mexi-pink'}`}
                                        placeholder="e.g. Guelaguetza"
                                    />
                                </div>

                                <div className="group">
                                    <label className="block text-sm font-medium text-gray-400 mb-1 flex justify-between">
                                        Date
                                        {errors.event_date && <span className="text-red-400 text-xs flex items-center gap-1"><AlertCircle size={12}/> {errors.event_date}</span>}
                                    </label>
                                    <input 
                                        type="date" 
                                        name="event_date"
                                        value={formData.event_date}
                                        onChange={handleInputChange}
                                        className={`w-full bg-slate-900 border rounded-lg p-3 text-white focus:outline-none transition-colors ${errors.event_date ? 'border-red-500/50 focus:border-red-500' : 'border-slate-700 focus:border-mexi-pink'}`}
                                    />
                                </div>
                                
                                <div className="group">
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Official Site URL</label>
                                    <input 
                                        type="text" 
                                        name="official_site_url"
                                        value={formData.official_site_url}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-mexi-pink"
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>

                            {/* Right Column: Upload & Preview */}
                            <div className="space-y-4">
                                <label className="block text-sm font-medium text-gray-400 mb-1">Media (Image/Video)</label>
                                
                                {/* Drag & Drop Area */}
                                <div 
                                    className={`relative border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center transition-all h-48 cursor-pointer ${dragActive ? 'border-mexi-pink bg-mexi-pink/10' : 'border-slate-600 bg-slate-900 hover:border-slate-500'}`}
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                    onClick={() => document.getElementById('file-upload').click()}
                                >
                                    <input 
                                        id="file-upload" 
                                        type="file" 
                                        className="hidden" 
                                        accept="image/*,video/*"
                                        onChange={handleFileSelect}
                                    />
                                    
                                    {formData.image_url ? (
                                        <div className="absolute inset-0 w-full h-full overflow-hidden rounded-xl group">
                                            {formData.image_url.match(/\.(mp4|webm)$/i) ? (
                                                <video src={formData.image_url} className="w-full h-full object-cover" autoPlay muted loop />
                                            ) : (
                                                <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                                            )}
                                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <p className="text-white font-medium flex items-center gap-2"><Edit size={16}/> Change Media</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <Upload className={`w-10 h-10 mb-3 ${dragActive ? 'text-mexi-pink' : 'text-gray-500'}`} />
                                            <p className="text-sm text-gray-400 text-center">
                                                Drag & Drop or <span className="text-mexi-pink font-semibold">Click to Upload</span>
                                            </p>
                                            <p className="text-xs text-gray-600 mt-2">Images or Videos (max 50MB)</p>
                                        </>
                                    )}

                                    {/* Progress Bar */}
                                    {uploadProgress > 0 && uploadProgress < 100 && (
                                        <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-700">
                                            <div 
                                                className="h-full bg-mexi-pink transition-all duration-300" 
                                                style={{ width: `${uploadProgress}%` }}
                                            ></div>
                                        </div>
                                    )}
                                </div>

                                <div className="group">
                                    <label className="block text-sm font-medium text-gray-400 mb-1 flex justify-between">
                                        Description
                                        {errors.description && <span className="text-red-400 text-xs flex items-center gap-1"><AlertCircle size={12}/> {errors.description}</span>}
                                    </label>
                                    <textarea 
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        className={`w-full bg-slate-900 border rounded-lg p-3 text-white focus:outline-none transition-colors h-32 resize-none ${errors.description ? 'border-red-500/50 focus:border-red-500' : 'border-slate-700 focus:border-mexi-pink'}`}
                                        placeholder="Describe the event..."
                                    />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="md:col-span-2 flex justify-end gap-3 pt-4 border-t border-slate-700">
                                <button 
                                    type="button" 
                                    onClick={() => { setIsAdding(false); setEditingEvent(null); }} 
                                    className="px-6 py-2.5 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="px-6 py-2.5 bg-gradient-to-r from-mexi-pink to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-lg font-bold shadow-lg shadow-pink-900/20 flex items-center gap-2"
                                >
                                    <Save size={18} /> {isAdding ? 'Create Event' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}

                {/* List View */}
                {!isAdding && !editingEvent && viewMode === 'list' && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 shadow-xl"
                    >
                        <table className="w-full text-left">
                            <thead className="bg-slate-900/50 text-gray-400 uppercase text-xs font-semibold tracking-wider">
                                <tr>
                                    <th className="p-6">Media</th>
                                    <th className="p-6">Event Details</th>
                                    <th className="p-6">Stats</th>
                                    <th className="p-6">Date</th>
                                    <th className="p-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700">
                                {loading ? (
                                    <tr><td colSpan="4" className="p-12 text-center text-gray-500">Loading events...</td></tr>
                                ) : events.length === 0 ? (
                                    <tr><td colSpan="4" className="p-12 text-center text-gray-500">No events found. Start by adding one!</td></tr>
                                ) : (
                                    events.map(event => (
                                        <tr key={event.id} className="hover:bg-slate-700/30 transition-colors group">
                                            <td className="p-6 w-32">
                                                <div className="w-20 h-14 rounded-lg overflow-hidden bg-slate-900 border border-slate-700">
                                                    {event.image_url ? (
                                                        event.image_url.match(/\.(mp4|webm)$/i) ? (
                                                            <video src={event.image_url} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <img src={event.image_url} alt="" className="w-full h-full object-cover" />
                                                        )
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-slate-600"><ImageIcon size={20}/></div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <h3 className="font-bold text-white text-lg">{event.event_title}</h3>
                                                <span className="text-sm text-mexi-pink font-medium">{event.state_name}</span>
                                                <p className="text-sm text-gray-400 mt-1 line-clamp-1">{event.description}</p>
                                            </td>
                                            <td className="p-6">
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex items-center gap-2 text-mexi-pink font-bold">
                                                        <Heart size={16} className="fill-mexi-pink" />
                                                        <span>{event.likes_count || 0}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-yellow-400 font-bold">
                                                        <Star size={16} className="fill-yellow-400" />
                                                        <span>{event.average_rating ? Number(event.average_rating).toFixed(1) : '0.0'}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-6 text-gray-400 font-mono text-sm">{event.event_date}</td>
                                            <td className="p-6 text-right">
                                                <div className="flex justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => handleEdit(event)} className="p-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors" title="Edit">
                                                        <Edit size={18} />
                                                    </button>
                                                    <button onClick={() => handleDelete(event.id)} className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors" title="Delete">
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </motion.div>
                )}

                {/* Carousel View */}
                {!isAdding && !editingEvent && viewMode === 'carousel' && (
                    <div className="flex flex-col items-center justify-center h-[60vh]">
                        {events.length > 0 ? (
                            <div className="relative w-full max-w-4xl h-96">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={carouselIndex}
                                        initial={{ opacity: 0, x: 100 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -100 }}
                                        transition={{ duration: 0.5 }}
                                        className="absolute inset-0 bg-slate-800 rounded-2xl overflow-hidden shadow-2xl border border-slate-700 flex"
                                    >
                                        <div className="w-1/2 h-full relative">
                                            {events[carouselIndex].image_url ? (
                                                 events[carouselIndex].image_url.match(/\.(mp4|webm)$/i) ? (
                                                    <video src={events[carouselIndex].image_url} className="w-full h-full object-cover" autoPlay muted loop />
                                                ) : (
                                                    <img src={events[carouselIndex].image_url} alt="" className="w-full h-full object-cover" />
                                                )
                                            ) : (
                                                <div className="w-full h-full bg-slate-900 flex items-center justify-center"><ImageIcon size={48} className="text-slate-700"/></div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-slate-800/50"></div>
                                        </div>
                                        <div className="w-1/2 p-8 flex flex-col justify-center">
                                            <span className="text-mexi-pink uppercase tracking-widest font-bold text-sm mb-2">{events[carouselIndex].state_name}</span>
                                            <h2 className="text-4xl font-black text-white mb-4 leading-tight">{events[carouselIndex].event_title}</h2>
                                            <p className="text-gray-300 mb-6 leading-relaxed">{events[carouselIndex].description}</p>
                                            <div className="mt-auto flex items-center justify-between text-sm text-gray-500 font-mono border-t border-slate-700 pt-4">
                                                <span>{events[carouselIndex].event_date}</span>
                                                <span>{carouselIndex + 1} / {events.length}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                                
                                {/* Controls */}
                                <button onClick={prevSlide} className="absolute left-[-60px] top-1/2 -translate-y-1/2 p-4 bg-slate-800 hover:bg-mexi-pink rounded-full text-white transition-all shadow-lg">
                                    ←
                                </button>
                                <button onClick={nextSlide} className="absolute right-[-60px] top-1/2 -translate-y-1/2 p-4 bg-slate-800 hover:bg-mexi-pink rounded-full text-white transition-all shadow-lg">
                                    →
                                </button>
                            </div>
                        ) : (
                            <p className="text-gray-500">No events to display.</p>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
