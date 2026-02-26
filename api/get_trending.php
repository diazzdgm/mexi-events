<?php
ini_set('display_errors', 0);
error_reporting(E_ALL & ~E_NOTICE);
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

require_once __DIR__ . '/../includes/conexion.php';

try {
    // Get top 5 events by likes
    $sql = "SELECT 
                e.id, 
                e.event_title, 
                e.state_name, 
                e.image_url, 
                e.event_date,
                e.description,
                e.official_site_url,
                COUNT(l.id) as likes_count,
                (SELECT COALESCE(AVG(rating), 0) FROM event_ratings WHERE event_id = e.id) as average_rating
            FROM mexico_events e
            LEFT JOIN event_likes l ON e.id = l.event_id
            GROUP BY e.id
            ORDER BY likes_count DESC, average_rating DESC
            LIMIT 5";
            
    $stmt = $pdo->query($sql);
    $events = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Format numbers
    foreach ($events as &$event) {
        $event['likes_count'] = (int)$event['likes_count'];
        $event['average_rating'] = (float)$event['average_rating'];
    }
    
    echo json_encode(['data' => $events]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>