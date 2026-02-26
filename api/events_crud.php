<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../includes/conexion.php';

// --- AUTHENTICATION CHECK ---
$method = $_SERVER['REQUEST_METHOD'];

// Allow GET without auth (public map)
if ($method !== 'GET') {
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? '';
    $token = str_replace('Bearer ', '', $authHeader);

    if (!$token) {
        http_response_code(401);
        echo json_encode(['error' => 'Authorization token required']);
        exit;
    }

    // Verify token and role
    try {
        $stmt = $pdo->prepare("SELECT role FROM users WHERE api_token = :token");
        $stmt->execute([':token' => $token]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user || $user['role'] !== 'admin') {
            http_response_code(403);
            echo json_encode(['error' => 'Forbidden: Admin access required']);
            exit;
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Auth check failed']);
        exit;
    }
}
// ----------------------------

switch ($method) {
    case 'GET':
        handleGet($pdo);
        break;
    case 'POST':
        handlePost($pdo);
        break;
    case 'PUT':
        handlePut($pdo);
        break;
    case 'DELETE':
        handleDelete($pdo);
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}

function handleGet($pdo) {
    try {
        if (isset($_GET['id'])) {
            $stmt = $pdo->prepare("SELECT * FROM mexico_events WHERE id = :id");
            $stmt->bindParam(':id', $_GET['id'], PDO::PARAM_INT);
            $stmt->execute();
            $data = $stmt->fetch(PDO::FETCH_ASSOC);
        } else {
            $sql = "SELECT e.*, 
                    (SELECT COUNT(*) FROM event_likes WHERE event_id = e.id) as likes_count,
                    (SELECT COALESCE(AVG(rating), 0) FROM event_ratings WHERE event_id = e.id) as average_rating
                    FROM mexico_events e ORDER BY created_at DESC";
            $stmt = $pdo->query($sql);
            $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        }
        echo json_encode(['data' => $data]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function handlePost($pdo) {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!validateEventData($data)) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing required fields']);
        return;
    }

    try {
        $sql = "INSERT INTO mexico_events (state_name, event_title, event_date, description, image_url, official_site_url) 
                VALUES (:state_name, :event_title, :event_date, :description, :image_url, :official_site_url)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':state_name' => $data['state_name'],
            ':event_title' => $data['event_title'],
            ':event_date' => $data['event_date'],
            ':description' => $data['description'] ?? '',
            ':image_url' => $data['image_url'] ?? '',
            ':official_site_url' => $data['official_site_url'] ?? ''
        ]);
        
        echo json_encode(['message' => 'Event created successfully', 'id' => $pdo->lastInsertId()]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function handlePut($pdo) {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!isset($data['id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing event ID']);
        return;
    }

    try {
        $sql = "UPDATE mexico_events SET 
                state_name = :state_name, 
                event_title = :event_title, 
                event_date = :event_date, 
                description = :description, 
                image_url = :image_url, 
                official_site_url = :official_site_url 
                WHERE id = :id";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':id' => $data['id'],
            ':state_name' => $data['state_name'],
            ':event_title' => $data['event_title'],
            ':event_date' => $data['event_date'],
            ':description' => $data['description'] ?? '',
            ':image_url' => $data['image_url'] ?? '',
            ':official_site_url' => $data['official_site_url'] ?? ''
        ]);

        echo json_encode(['message' => 'Event updated successfully']);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function handleDelete($pdo) {
    $data = json_decode(file_get_contents("php://input"), true);
    $id = $_GET['id'] ?? $data['id'] ?? null;

    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing event ID']);
        return;
    }

    try {
        $stmt = $pdo->prepare("DELETE FROM mexico_events WHERE id = :id");
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        
        echo json_encode(['message' => 'Event deleted successfully']);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function validateEventData($data) {
    return isset($data['state_name']) && isset($data['event_title']) && isset($data['event_date']);
}
?>
