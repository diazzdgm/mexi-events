<?php
require __DIR__ . '/includes/conexion.php';
echo "OK\n";
echo $pdo->query("SELECT VERSION()")->fetchColumn() . "\n";
echo implode(',', $pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN));
