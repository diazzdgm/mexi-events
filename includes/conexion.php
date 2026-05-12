<?php
// Detecta si estamos corriendo en InfinityFree (producción) o en XAMPP (local).
$isProd = isset($_SERVER['HTTP_HOST']) &&
          (strpos($_SERVER['HTTP_HOST'], 'fwh.is') !== false
           || strpos($_SERVER['HTTP_HOST'], 'infinityfree') !== false);

if ($isProd) {
    // InfinityFree
    $host = 'sql302.infinityfree.com';
    $port = '3306';
    $dbname = 'if0_41704572_mexevents';
    $username = 'if0_41704572';
    $password = 'DIMdie94632211';
} else {
    // XAMPP local
    $host = 'localhost';
    $port = '3306';
    $dbname = 'mexi_events';
    $username = 'root';
    $password = '';
}

try {
    $dsn = "mysql:host=$host;port=$port;dbname=$dbname;charset=utf8mb4";
    $pdo = new PDO($dsn, $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

} catch (PDOException $e) {
    error_log("Error de conexión: " . $e->getMessage());
    die("Lo sentimos, hubo un problema al conectar con la base de datos.");
}
?>
