<?php
// Configuración de la base de datos (XAMPP local)
$host = 'localhost';
$port = '3306';
$dbname = 'mexi_events';
$username = 'root';
$password = '';

try {
    $dsn = "mysql:host=$host;dbname=$dbname;charset=utf8mb4";
    $pdo = new PDO($dsn, $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

} catch (PDOException $e) {
    error_log("Error de conexión: " . $e->getMessage());
    die("Lo sentimos, hubo un problema al conectar con la base de datos.");
}
?>
