<?php
require_once __DIR__ . '/../includes/conexion.php';
try {
    $pdo->exec("ALTER TABLE users ADD COLUMN country_code VARCHAR(5) DEFAULT NULL, ADD COLUMN state_id VARCHAR(50) DEFAULT NULL");
    echo "Added location columns.\n";
} catch (PDOException $e) {
    echo "Column likely exists or error: " . $e->getMessage() . "\n";
}
?>
