import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AdminPanel from './components/AdminPanel.jsx'
import Login from './components/Login.jsx' // We can reuse the login component or just inline a check

const AdminApp = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('mexi_user');
        const token = localStorage.getItem('mexi_token');
        
        if (storedUser && token) {
            const parsedUser = JSON.parse(storedUser);
            if (parsedUser.role === 'admin') {
                setUser(parsedUser);
            } else {
                alert('Access Denied: You must be an administrator.');
                window.location.href = '/';
            }
        } else {
            window.location.href = '/';
        }
        setLoading(false);
    }, []);

    const handleBack = () => {
        window.location.href = '/';
    };

    if (loading) return <div className="text-white p-8">Checking access...</div>;

    if (!user) return null; // Will redirect

    return <AdminPanel onBack={handleBack} />;
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AdminApp />
  </StrictMode>,
)
