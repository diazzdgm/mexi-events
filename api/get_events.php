<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // For development
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../includes/conexion.php';

// Check for user token (optional)
$userId = null;
$headers = function_exists('getallheaders') ? getallheaders() : [];
$authHeader = $headers['Authorization'] ?? ($_SERVER['HTTP_AUTHORIZATION'] ?? '');
$token = str_replace('Bearer ', '', $authHeader);

if ($token) {
    try {
        $stmt = $pdo->prepare("SELECT id FROM users WHERE api_token = :token");
        $stmt->execute([':token' => $token]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($user) {
            $userId = $user['id'];
        }
    } catch (PDOException $e) {
        // Ignore auth error, just treat as guest
    }
}

// Get state parameter
$state = isset($_GET['state']) ? trim($_GET['state']) : '';

if (empty($state)) {
    echo json_encode(['error' => 'State parameter is required']);
    exit;
}

try {
    // Prepare SQL statement with stats using JOINs instead of subqueries
    // We use LEFT JOIN on aggregated subqueries for best performance and correctness
    // to avoid Cartesian product issues when joining multiple one-to-many relationships.
    
    $sql = "SELECT 
                e.*,
                COALESCE(l.likes_count, 0) as likes_count,
                COALESCE(r.rating_count, 0) as rating_count,
                COALESCE(r.average_rating, 0) as average_rating,
                " . ($userId ? "CASE WHEN ul.id IS NOT NULL THEN 1 ELSE 0 END as user_liked," : "0 as user_liked,") . "
                " . ($userId ? "ur.rating as user_rating" : "NULL as user_rating") . "
            FROM mexico_events e
            LEFT JOIN (
                SELECT event_id, COUNT(*) as likes_count 
                FROM event_likes 
                GROUP BY event_id
            ) l ON e.id = l.event_id
            LEFT JOIN (
                SELECT event_id, COUNT(*) as rating_count, AVG(rating) as average_rating 
                FROM event_ratings 
                GROUP BY event_id
            ) r ON e.id = r.event_id
            " . ($userId ? "LEFT JOIN event_likes ul ON e.id = ul.event_id AND ul.user_id = :user_id_l" : "") . "
            " . ($userId ? "LEFT JOIN event_ratings ur ON e.id = ur.event_id AND ur.user_id = :user_id_r" : "") . "
            WHERE e.state_name = :state";
            
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':state', $state, PDO::PARAM_STR);
    if ($userId) {
        $stmt->bindParam(':user_id_l', $userId, PDO::PARAM_INT);
        $stmt->bindParam(':user_id_r', $userId, PDO::PARAM_INT);
    }
    $stmt->execute();
    
    $events = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Format numbers
    foreach ($events as &$event) {
        $event['likes_count'] = (int)$event['likes_count'];
        $event['rating_count'] = (int)$event['rating_count'];
        $event['average_rating'] = (float)$event['average_rating'];
        // Fix for JOIN aggregation logic
        // If user has not rated, MAX returns NULL, so cast to int might be 0, which is fine
        // But if user has not liked, MAX returns 0
        $event['user_liked'] = (bool)$event['user_liked'];
        $event['user_rating'] = $event['user_rating'] ? (int)$event['user_rating'] : null;
    }
    
    if (empty($events)) {
        // Return a structured response indicating no events but not an error per se
        echo json_encode(['message' => 'No hay eventos próximos en este estado', 'data' => []]);
    } else {
        echo json_encode(['data' => $events]);
    }
    
} catch (PDOException $e) {
    error_log("Database error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Internal server error']);
}
?>
