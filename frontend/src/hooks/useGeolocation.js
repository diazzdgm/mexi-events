import { useState, useEffect } from 'react';

const STATE_NAME_TO_ID = {
  'aguascalientes': 'agu',
  'baja california sur': 'bcs',
  'baja california': 'bcn',
  'campeche': 'cam',
  'chiapas': 'chp',
  'chihuahua': 'chh',
  'ciudad de méxico': 'dif',
  'ciudad de mexico': 'dif',
  'cdmx': 'dif',
  'coahuila': 'coa',
  'colima': 'coi',
  'durango': 'dur',
  'estado de méxico': 'mex',
  'estado de mexico': 'mex',
  'guanajuato': 'gua',
  'guerrero': 'gro',
  'hidalgo': 'hid',
  'jalisco': 'jal',
  'michoacán': 'mic',
  'michoacan': 'mic',
  'morelos': 'mor',
  'nayarit': 'nay',
  'nuevo león': 'nle',
  'nuevo leon': 'nle',
  'oaxaca': 'oax',
  'puebla': 'pue',
  'querétaro': 'que',
  'queretaro': 'que',
  'quintana roo': 'roo',
  'san luis potosí': 'slp',
  'san luis potosi': 'slp',
  'sinaloa': 'sin',
  'sonora': 'son',
  'tabasco': 'tab',
  'tamaulipas': 'tam',
  'tlaxcala': 'tla',
  'veracruz': 'ver',
  'yucatán': 'yuc',
  'yucatan': 'yuc',
  'zacatecas': 'zac',
};

function mapStateNameToId(stateName) {
  if (!stateName) return null;
  const lower = stateName.toLowerCase();
  for (const key of Object.keys(STATE_NAME_TO_ID)) {
    if (lower.includes(key)) return STATE_NAME_TO_ID[key];
  }
  return null;
}

async function reverseGeocode(lat, lon) {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=es`;
  const res = await fetch(url, { headers: { 'User-Agent': 'mexi-events-app' } });
  const data = await res.json();
  return data.address?.state || data.address?.region || null;
}

export const useGeolocation = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('mexi_user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.state_id) {
        setLocation({
          state_id: user.state_id,
          country_code: user.country_code || 'MX',
          is_mexico: true,
        });
        setLoading(false);
        return;
      }
    }
    if (!navigator.geolocation) {
      setError('Geolocalización no soportada');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const stateName = await reverseGeocode(latitude, longitude);
          const stateId = mapStateNameToId(stateName);

          const locationData = {
            state_id: stateId,
            region: stateName,
            country_code: 'MX',
            is_mexico: true,
          };

          setLocation(locationData);
          if (storedUser && stateId) {
            const token = localStorage.getItem('mexi_token');
            fetch(import.meta.env.VITE_API_URL + '/api/geolocation.php', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
              body: JSON.stringify({ country_code: 'MX', state_id: stateId }),
            });

            const user = JSON.parse(storedUser);
            user.country_code = 'MX';
            user.state_id = stateId;
            localStorage.setItem('mexi_user', JSON.stringify(user));
          }
        } catch (err) {
          setError('Error al obtener ubicación');
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError('Permiso de ubicación denegado');
        setLoading(false);
      },
      { timeout: 10000 }
    );
  }, []);

  return { location, loading, error };
};
