<?php
include 'includes/conexion.php';

echo "Tables:\n";
$tables = $pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
print_r($tables);

echo "\nColumns in 'destinos':\n";
$columns = $pdo->query("DESCRIBE destinos")->fetchAll(PDO::FETCH_ASSOC);
print_r($columns);

if (in_array('mexico_events', $tables)) {
    echo "\nColumns in 'mexico_events':\n";
    $columns = $pdo->query("DESCRIBE mexico_events")->fetchAll(PDO::FETCH_ASSOC);
    print_r($columns);
} else {
    echo "\nTable 'mexico_events' does not exist.\n";
}
?>
