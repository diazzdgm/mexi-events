<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../includes/conexion.php';

$data = json_decode(file_get_contents("php://input"), true);
$username = $data['username'] ?? '';
$password = $data['password'] ?? '';

if (!$username || !$password) {
    http_response_code(400);
    echo json_encode(['error' => 'Username and password required']);
    exit;
}
if (strlen($username) < 3 || strlen($username) > 20) {
    http_response_code(400);
    echo json_encode(['error' => 'Username must be between 3 and 20 characters']);
    exit;
}
if (!preg_match('/^[a-zA-Z0-9_]+$/', $username)) {
    http_response_code(400);
    echo json_encode(['error' => 'Username can only contain letters, numbers, and underscores']);
    exit;
}
if (strlen($password) < 6) {
    http_response_code(400);
    echo json_encode(['error' => 'Password must be at least 6 characters long']);
    exit;
}
$stmt = $pdo->prepare("SELECT id FROM users WHERE username = :username");
$stmt->execute([':username' => $username]);
if ($stmt->fetch()) {
    http_response_code(409); // Conflict
    echo json_encode(['error' => 'Username already taken']);
    exit;
}

try {
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
    $sql = "INSERT INTO users (username, password, role) VALUES (:username, :password, 'user')";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':username' => $username,
        ':password' => $hashed_password
    ]);
    
    $user_id = $pdo->lastInsertId();
    $token = bin2hex(random_bytes(32));
    $update = $pdo->prepare("UPDATE users SET api_token = :token WHERE id = :id");
    $update->execute([':token' => $token, ':id' => $user_id]);

    echo json_encode([
        'success' => true,
        'message' => 'User registered successfully',
        'token' => $token,
        'user' => [
            'id' => $user_id,
            'username' => $username,
            'role' => 'user'
        ]
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Registration failed: ' . $e->getMessage()]);
}
?>
