<?php
require_once __DIR__ . '/../includes/conexion.php';

try {
    $sql = file_get_contents(__DIR__ . '/create_interactions.sql');
    $pdo->exec($sql);
    echo "Interactions tables created successfully.";
} catch (PDOException $e) {
    echo "Error creating tables: " . $e->getMessage();
}
?>