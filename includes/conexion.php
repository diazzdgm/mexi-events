<?php
// Configuración de la base de datos
$host = 'sql302.infinityfree.com';
$port = '3306';
$dbname = 'if0_41704572_mexevents';
$username = 'if0_41704572';
$password = 'DIMdie94632211';

try {
    $dsn = "mysql:host=$host;dbname=$dbname;charset=utf8mb4";
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