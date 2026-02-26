<?php
require_once __DIR__ . '/../includes/conexion.php';
try {
    $pdo->exec("ALTER TABLE users ADD COLUMN api_token VARCHAR(255)");
    echo "Added api_token column.\n";
} catch (PDOException $e) {
    echo "Column likely exists or error: " . $e->getMessage() . "\n";
}
?>
