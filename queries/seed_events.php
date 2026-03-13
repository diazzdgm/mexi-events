<?php
require_once __DIR__ . '/../includes/conexion.php';

try {
    $sql = "INSERT INTO mexico_events (state_name, event_title, event_date, description, image_url, official_site_url) VALUES 
    ('Oaxaca', 'Guelaguetza', '2025-07-15', 'Annual indigenous cultural festival celebrating Oaxacan traditions.', 'https://www.oaxaca.gob.mx/wp-content/uploads/2019/07/Guelaguetza-2019-1.jpg', 'https://www.oaxaca.gob.mx/'),
    ('Oaxaca', 'Night of the Radishes', '2025-12-23', 'Unique festival where artisans carve giant radishes into elaborate scenes.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/NocheRabanos2014_01.jpg/1200px-NocheRabanos2014_01.jpg', ''),
    ('Oaxaca', 'Mezcal Fair', '2025-07-20', 'Tasting and cultural event dedicated to the famous agave spirit.', 'https://upload.wikimedia.org/wikipedia/commons/e/e4/Feria_del_Mezcal.jpg', ''),
    
    ('Jalisco', 'International Mariachi Festival', '2025-08-28', 'World famous gathering of Mariachi bands in Guadalajara.', 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Mariachi_Vargas_de_Tecalitl%C3%A1n.jpg', ''),
    ('Jalisco', 'Guadalajara International Film Festival', '2025-03-10', 'One of the most important film festivals in Latin America.', 'https://upload.wikimedia.org/wikipedia/commons/6/6c/Festival_Internacional_de_Cine_en_Guadalajara.jpg', ''),
    ('Jalisco', 'October Festival', '2025-10-01', 'Month-long fair with concerts, food, and games.', 'https://mexiconewsdaily.com/wp-content/uploads/2019/10/fiestas-octubre.jpg', ''),

    ('Guanajuato', 'Cervantino Festival', '2025-10-10', 'International arts festival in honor of Miguel de Cervantes.', 'https://upload.wikimedia.org/wikipedia/commons/9/9f/Festival_Internacional_Cervantino.jpg', ''),
    ('Guanajuato', 'Hot Air Balloon Festival', '2025-11-14', 'One of the largest balloon festivals in the world held in Leon.', 'https://upload.wikimedia.org/wikipedia/commons/5/5e/FIG_Le%C3%B3n.jpg', ''),
    ('Guanajuato', 'Flower Carpet Festival', '2025-06-05', 'Streets decorated with colorful sawdust carpets for Corpus Christi.', 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Tapetes_Uriangato.jpg', '')
    
    ON DUPLICATE KEY UPDATE description=VALUES(description);";
    
    $pdo->exec($sql);
    echo "Added sample events successfully.\n";
    
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
