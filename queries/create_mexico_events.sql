DROP TABLE IF EXISTS mexico_events;

CREATE TABLE mexico_events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    state_name VARCHAR(100) NOT NULL,
    event_title VARCHAR(255) NOT NULL,
    event_date DATE NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    official_site_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO mexico_events (state_name, event_title, event_date, description, image_url, official_site_url) VALUES
('Guanajuato', 'Festival Internacional Cervantino', '2024-10-11', 'El festival cultural más importante de América Latina, celebrado en las calles de Guanajuato.', 'https://images.unsplash.com/photo-1590930337357-194d21695426?q=80&w=600&auto=format&fit=crop', 'https://festivalcervantino.gob.mx/'),
('Oaxaca', 'Guelaguetza', '2024-07-22', 'La máxima fiesta de los oaxaqueños, llena de color, danza y tradición en el Cerro del Fortín.', 'https://images.unsplash.com/photo-1594911417539-77a28e5557b7?q=80&w=600&auto=format&fit=crop', 'https://www.oaxaca.gob.mx/guelaguetza/'),
('Jalisco', 'Feria Internacional del Libro de Guadalajara', '2024-11-30', 'La reunión editorial más importante de Iberoamérica y un extraordinario festival cultural.', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600&auto=format&fit=crop', 'https://www.fil.com.mx/'),
('Mexico City', 'Gran Premio de México F1', '2024-10-25', 'La emoción de la Fórmula 1 regresa al Autódromo Hermanos Rodríguez en la CDMX.', 'https://images.unsplash.com/photo-1529528753239-2a94562512f4?q=80&w=600&auto=format&fit=crop', 'https://www.mexicogp.mx/'),
('Yucatán', 'Equinoccio en Chichén Itzá', '2024-03-21', 'Observa el descenso de Kukulcán en la pirámide de El Castillo durante el equinoccio de primavera.', 'https://images.unsplash.com/photo-1518182170546-0766ba6f9285?q=80&w=600&auto=format&fit=crop', 'https://www.inah.gob.mx/zonas/146-zona-arqueologica-de-chichen-itza');
