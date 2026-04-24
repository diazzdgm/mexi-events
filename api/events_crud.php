<?php
ini_set('display_errors', 0);
error_reporting(E_ALL & ~E_NOTICE);
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// --- AUTHENTICATION CHECK ---
$method = $_SERVER['REQUEST_METHOD'];

// Handle preflight OPTIONS request first
if ($method === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Allow GET without auth (public map)
if ($method !== 'GET') {
        require_once __DIR__ . '/../includes/conexion.php';

        // Check if database connection failed
        if (!isset($pdo)) {
            http_response_code(500);
            echo json_encode(['error' => 'Database connection failed']);
            exit;
        }

        $headers = function_exists('getallheaders') ? getallheaders() : [];
    $authHeader = $headers['Authorization'] ?? ($_SERVER['HTTP_AUTHORIZATION'] ?? '');
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
        require_once __DIR__ . '/../includes/conexion.php';
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
        $sql = "INSERT INTO mexico_events (state_name, event_title, event_date, description, image_url, audio_url, official_site_url)
                VALUES (:state_name, :event_title, :event_date, :description, :image_url, :audio_url, :official_site_url)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':state_name' => $data['state_name'],
            ':event_title' => $data['event_title'],
            ':event_date' => $data['event_date'],
            ':description' => $data['description'] ?? '',
            ':image_url' => $data['image_url'] ?? '',
            ':audio_url' => $data['audio_url'] ?? '',
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
                audio_url = :audio_url,
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
            ':audio_url' => $data['audio_url'] ?? '',
            ':official_site_url' => $data['official_site_url'] ?? ''
        ]);

        echo json_encode(['message' => 'Event updated successfully']);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function handleDelete($pdo) {
    // Try to get ID from multiple sources
    $id = $_GET['id'] ?? null;
    
    // If not in URL, try JSON body
    if (!$id) {
        $input = file_get_contents("php://input");
        if ($input) {
            $data = json_decode($input, true);
            $id = $data['id'] ?? null;
        }
    }

    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing event ID']);
        return;
    }

    try {
        // First check if event exists
        $stmt = $pdo->prepare("SELECT id FROM mexico_events WHERE id = :id");
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        
        if (!$stmt->fetch()) {
            http_response_code(404);
            echo json_encode(['error' => 'Event not found']);
            return;
        }

        // Delete related records first if foreign keys don't cascade automatically
        // (Optional: depending on your DB schema constraints)
        $pdo->prepare("DELETE FROM event_likes WHERE event_id = :id")->execute([':id' => $id]);
        $pdo->prepare("DELETE FROM event_ratings WHERE event_id = :id")->execute([':id' => $id]);
        $pdo->prepare("DELETE FROM comments WHERE event_id = :id")->execute([':id' => $id]);

        $stmt = $pdo->prepare("DELETE FROM mexico_events WHERE id = :id");
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        
        echo json_encode(['success' => true, 'message' => 'Event deleted successfully']);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}

function validateEventData($data) {
    return isset($data['state_name']) && isset($data['event_title']) && isset($data['event_date']);
}
?>
