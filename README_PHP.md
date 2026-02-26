# Mexi-Events (PHP Version)

Plataforma de turismo dinámica y profesional desarrollada con PHP 8, MySQL, y Tailwind CSS.

## Requisitos
- Servidor Web (Apache/Nginx) con soporte para PHP 8.x
- MySQL 5.7+ o MariaDB
- Extensión PDO para PHP habilitada

## Instalación

1.  **Base de Datos:**
    - Crea una base de datos llamada `mexi_events` en tu servidor MySQL.
    - Importa el archivo `queries/database.sql` para crear las tablas y datos de ejemplo.

2.  **Configuración:**
    - El archivo de conexión se encuentra en `includes/conexion.php`.
    - Por defecto intenta conectar con:
        - Host: `localhost`
        - Usuario: `root`
        - Contraseña: `` (vacía)
        - Base de datos: `mexi_events`
    - Puedes configurar estas credenciales mediante variables de entorno o editando el archivo directamente.

3.  **Ejecución:**
    - Coloca la carpeta del proyecto en tu servidor web (ej. `htdocs` o `www`).
    - Accede a `http://localhost/mexi-events/` en tu navegador.

## Funcionalidades

### Frontend (Fase 3)
- **Diseño Responsivo:** Implementado con Tailwind CSS (Mobile-First).
- **Interactividad:**
    - Slider de destinos destacados.
    - Geolocalización para encontrar eventos cercanos.
    - Gráfico de popularidad con Chart.js.
    - Menú móvil interactivo.
- **Multimedia:** Soporte para video y audio.

### Backend (Fase 4)
- **Tecnologías:** PHP 8 y MySQL (PDO).
- **Gestión de Datos:**
    - Tabla `destinos` para lugares turísticos.
    - Tabla `comentarios` para reseñas de usuarios.
- **Panel de Administración (`admin.php`):**
    - Agregar nuevos destinos con subida de imágenes.
    - Eliminar destinos.
    - Validación de formularios (cliente y servidor).
- **Seguridad:** Protección contra inyecciones SQL y XSS.

## Estructura de Archivos
- `index.php`: Página principal.
- `admin.php`: Panel de administración.
- `detalle.php`: Vista detallada de destinos y comentarios.
- `assets/`: Recursos estáticos (CSS, JS, Imágenes, Uploads).
- `includes/`: Fragmentos de código reutilizables (Header, Footer, Conexión).
- `queries/`: Scripts SQL.
