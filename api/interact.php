<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../includes/conexion.php';

// --- AUTHENTICATION ---
$headers = function_exists('getallheaders') ? getallheaders() : [];
$authHeader = $headers['Authorization'] ?? ($_SERVER['HTTP_AUTHORIZATION'] ?? '');
$token = str_replace('Bearer ', '', $authHeader);

if (!$token) {
    http_response_code(401);
    echo json_encode(['error' => 'Authorization token required']);
    exit;
}

$userId = null;
try {
    $stmt = $pdo->prepare("SELECT id FROM users WHERE api_token = :token");
    $stmt->execute([':token' => $token]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid token']);
        exit;
    }
    $userId = $user['id'];
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Auth check failed']);
    exit;
}
// ---------------------

$data = json_decode(file_get_contents("php://input"), true);
$action = $data['action'] ?? '';
$eventId = $data['event_id'] ?? null;

if (!$eventId) {
    http_response_code(400);
    echo json_encode(['error' => 'Event ID required']);
    exit;
}

try {
    if ($action === 'like') {
        // Check if already liked
        $stmt = $pdo->prepare("SELECT id FROM event_likes WHERE user_id = ? AND event_id = ?");
        $stmt->execute([$userId, $eventId]);
        $exists = $stmt->fetch();

        if ($exists) {
            // Unlike
            $stmt = $pdo->prepare("DELETE FROM event_likes WHERE user_id = ? AND event_id = ?");
            $stmt->execute([$userId, $eventId]);
            $liked = false;
        } else {
            // Like
            $stmt = $pdo->prepare("INSERT INTO event_likes (user_id, event_id) VALUES (?, ?)");
            $stmt->execute([$userId, $eventId]);
            $liked = true;
        }

        // Get new count
        $stmt = $pdo->prepare("SELECT COUNT(*) as count FROM event_likes WHERE event_id = ?");
        $stmt->execute([$eventId]);
        $count = $stmt->fetch(PDO::FETCH_ASSOC)['count'];

        echo json_encode(['success' => true, 'liked' => $liked, 'likes_count' => $count]);

    } elseif ($action === 'rate') {
        $rating = $data['rating'] ?? null;
        if (!$rating || $rating < 1 || $rating > 5) {
            http_response_code(400);
            echo json_encode(['error' => 'Valid rating (1-5) required']);
            exit;
        }

        // Insert or Update
        $stmt = $pdo->prepare("INSERT INTO event_ratings (user_id, event_id, rating) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE rating = VALUES(rating)");
        $stmt->execute([$userId, $eventId, $rating]);

        // Get new stats
        $stmt = $pdo->prepare("SELECT COUNT(*) as count, AVG(rating) as avg FROM event_ratings WHERE event_id = ?");
        $stmt->execute([$eventId]);
        $stats = $stmt->fetch(PDO::FETCH_ASSOC);

        echo json_encode([
            'success' => true, 
            'user_rating' => $rating, 
            'rating_count' => $stats['count'], 
            'average_rating' => round($stats['avg'], 1)
        ]);

    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid action']);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>