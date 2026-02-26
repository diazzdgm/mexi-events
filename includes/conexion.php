<?php
// 1. Limpiamos el host (solo la IP) y definimos el puerto claramente
$host = '127.0.0.1'; 
$port = '3307'; 
$dbname = getenv('DB_NAME') ?: 'mexi_events';
$username = getenv('DB_USER') ?: 'root';
$password = getenv('DB_PASS') ?: '';

try {
    // 2. La cadena de conexión (DSN) DEBE llevar el puerto por separado con ;port=
    $dsn = "mysql:host=$host;port=$port;dbname=$dbname;charset=utf8mb4";
    
    $pdo = new PDO($dsn, $username, $password);
    
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    
    // Si quieres probar si conectó, puedes quitar el comentario a la siguiente línea:
    // echo "¡Conexión exitosa al puerto 3307!";

} catch (PDOException $e) {
    // 3. IMPORTANTE: He cambiado el mensaje para que te diga el error REAL en pantalla
    // Una vez que funcione, puedes volver a poner el mensaje "amigable"
    die("Fallo de conexión: " . $e->getMessage());
}
?>