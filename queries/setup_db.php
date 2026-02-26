<?php
// Include the connection file
require_once __DIR__ . '/../includes/conexion.php';

try {
    // Read the SQL file
    $sql = file_get_contents(__DIR__ . '/create_mexico_events.sql');
    
    // Execute the SQL
    $pdo->exec($sql);
    
    echo "Database table 'mexico_events' created and populated successfully.\n";
    
} catch (PDOException $e) {
    echo "Error executing SQL: " . $e->getMessage() . "\n";
}
?>
