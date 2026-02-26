<?php
// Configuración de la base de datos
$host = '127.0.0.1';
$port = '3306';
$dbname = 'mexi_events';
$username = 'root';
$password = '';

try {
    $dsn = "mysql:host=$host;port=$port;dbname=$dbname;charset=utf8mb4";
    $pdo = new PDO($dsn, $username, $password);
    // ...
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    
} catch (PDOException $e) {
    // En caso de error, mostrar un mensaje amigable y registrar el error real
    error_log("Error de conexión: " . $e->getMessage());
    die("Lo sentimos, hubo un problema al conectar con la base de datos.");
}
?>