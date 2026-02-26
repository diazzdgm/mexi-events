import { useState, useEffect } from 'react';

export const useGeolocation = () => {
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Check if user has saved location first (from login)
        const storedUser = localStorage.getItem('mexi_user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            if (user.state_id && user.country_code) {
                setLocation({
                    country_code: user.country_code,
                    state_id: user.state_id,
                    is_mexico: user.country_code === 'MX'
                });
                setLoading(false);
                return;
            }
        }

        // Fetch from API
        fetch('http://localhost/mexi-events/api/geolocation.php')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setLocation(data.data);
                    
                    // If logged in, auto-save this detected location
                    if (storedUser) {
                        const token = localStorage.getItem('mexi_token');
                        fetch('http://localhost/mexi-events/api/geolocation.php', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify({
                                country_code: data.data.country_code,
                                state_id: data.data.state_id
                            })
                        });
                        
                        // Update local storage
                        const user = JSON.parse(storedUser);
                        user.country_code = data.data.country_code;
                        user.state_id = data.data.state_id;
                        localStorage.setItem('mexi_user', JSON.stringify(user));
                    }
                } else {
                    setError('Failed to detect location');
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError('Connection error');
                setLoading(false);
            });
    }, []);

    return { location, loading, error };
};
