<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../includes/conexion.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $event_id = $_GET['event_id'] ?? null;
    if (!$event_id) {
        http_response_code(400);
        echo json_encode(['error' => 'Event ID required']);
        exit;
    }

    try {
        $stmt = $pdo->prepare("
            SELECT c.id, c.comment, c.created_at, u.username, u.role 
            FROM comments c 
            JOIN users u ON c.user_id = u.id 
            WHERE c.event_id = :event_id 
            ORDER BY c.created_at DESC
        ");
        $stmt->execute([':event_id' => $event_id]);
        $comments = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['data' => $comments]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
} elseif ($method === 'POST') {
    // Auth Check
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? '';
    $token = str_replace('Bearer ', '', $authHeader);

    if (!$token) {
        http_response_code(401);
        echo json_encode(['error' => 'Authorization required']);
        exit;
    }

    $data = json_decode(file_get_contents("php://input"), true);
    $event_id = $data['event_id'] ?? null;
    $comment = $data['comment'] ?? '';

    // Verify User and get username for response
    $stmt = $pdo->prepare("SELECT id, username FROM users WHERE api_token = :token");
    $stmt->execute([':token' => $token]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid token']);
        exit;
    }

    if (!$event_id || !trim($comment)) {
        http_response_code(400);
        echo json_encode(['error' => 'Event ID and comment are required']);
        exit;
    }

    try {
        $stmt = $pdo->prepare("INSERT INTO comments (event_id, user_id, comment) VALUES (:event_id, :user_id, :comment)");
        $stmt->execute([
            ':event_id' => $event_id,
            ':user_id' => $user['id'],
            ':comment' => htmlspecialchars($comment)
        ]);
        
        echo json_encode([
            'success' => true,
            'comment' => [
                'id' => $pdo->lastInsertId(),
                'comment' => htmlspecialchars($comment),
                'username' => $user['username'],
                'created_at' => date('Y-m-d H:i:s')
            ]
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}
?>
