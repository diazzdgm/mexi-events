<?php
require __DIR__ . '/../includes/conexion.php';
$count = (int)$pdo->query("SELECT COUNT(*) FROM destinos")->fetchColumn();
if ($count === 0) {
    $stmt = $pdo->prepare("INSERT INTO destinos (titulo, descripcion, estado, fecha, ubicacion, categoria, imagen_url, popularidad) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute(['Festival Cervantino', 'El festival cultural más importante de América Latina.', 'Guanajuato', '2026-10-11', 'Guanajuato Capital', 'Cultural', null, 85]);
    $stmt->execute(['Día de Muertos', 'Celebración tradicional mexicana.', 'Michoacán', '2026-11-01', 'Pátzcuaro', 'Tradición', null, 95]);
    $stmt->execute(['Guelaguetza', 'La máxima fiesta de los oaxaqueños.', 'Oaxaca', '2026-07-22', 'Auditorio Guelaguetza', 'Cultural', null, 90]);
    echo "OK: datos de ejemplo insertados";
} else {
    echo "OK: ya existen destinos";
}
