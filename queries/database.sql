-- Base de datos: mexi_events

CREATE DATABASE IF NOT EXISTS mexi_events;
USE mexi_events;

-- Tabla de Destinos (antes Events)
CREATE TABLE IF NOT EXISTS destinos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    descripcion TEXT NOT NULL,
    estado VARCHAR(50) NOT NULL,
    fecha DATE NOT NULL,
    ubicacion VARCHAR(150) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    imagen_url VARCHAR(255),
    popularidad INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de Comentarios
CREATE TABLE IF NOT EXISTS comentarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    destino_id INT NOT NULL,
    usuario VARCHAR(100) NOT NULL,
    comentario TEXT NOT NULL,
    calificacion INT CHECK (calificacion BETWEEN 1 AND 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (destino_id) REFERENCES destinos(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Datos de ejemplo
INSERT INTO destinos (titulo, descripcion, estado, fecha, ubicacion, categoria, imagen_url, popularidad) VALUES
('Festival Cervantino', 'El festival cultural más importante de América Latina.', 'Guanajuato', '2024-10-11', 'Guanajuato Capital', 'Cultural', 'uploads/cervantino.jpg', 85),
('Día de Muertos', 'Celebración tradicional mexicana.', 'Michoacán', '2024-11-01', 'Pátzcuaro', 'Tradición', 'uploads/muertos.jpg', 95),
('Guelaguetza', 'La máxima fiesta de los oaxaqueños.', 'Oaxaca', '2024-07-22', 'Auditorio Guelaguetza', 'Cultural', 'uploads/guelaguetza.jpg', 90);
