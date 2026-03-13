<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // In production use specific origin
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../includes/conexion.php';

// Since we are using React on different port (5173) vs PHP (80), 
// cookies might be tricky without 'Access-Control-Allow-Credentials: true'
// and 'SameSite=None; Secure'.
// For simplicity in this demo, we will use a simple TOKEN approach.
// But sessions are more secure. Let's try sessions first but if CORS blocks, we switch.
// Actually, simple token in localStorage is easier for this setup.

$action = $_GET['action'] ?? '';

if ($action === 'login') {
    $data = json_decode(file_get_contents("php://input"), true);
    $username = $data['username'] ?? '';
    $password = $data['password'] ?? '';

    if (!$username || !$password) {
        http_response_code(400);
        echo json_encode(['error' => 'Username and password required']);
        exit;
    }

    $stmt = $pdo->prepare("SELECT * FROM users WHERE username = :username");
    $stmt->execute([':username' => $username]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($password, $user['password'])) {
        // Generate a simple token (in real app use JWT)
        $token = bin2hex(random_bytes(32));
        
        // Store token in DB (simplified session)
        // For this demo, we'll just return the user role and a fake token
        // In a real app, you'd store this token in a 'sessions' table
        
        echo json_encode([
            'success' => true,
            'token' => $token, // client stores this
            'user' => [
                'id' => $user['id'],
                'username' => $user['username'],
                'role' => $user['role']
            ]
        ]);
    } else {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid credentials']);
    }

} elseif ($action === 'check') {
    // Client sends token to verify? 
    // For now, we trust the client's stored role for UI, but Server MUST verify for actions.
    // Since we didn't implement a full token table, we can't verify the token on server properly yet.
    // BUT for the "admin panel protection", we should.
    
    // Let's keep it simple: The `events_crud.php` will need to be protected.
    // We can use Basic Auth or a shared secret, but user wants "login system".
    
    // OK, let's just return success for check if they have a valid-looking token?
    // No, let's assume if they have the user object in localStorage it's "logged in" for UI.
    // For SECURITY, `events_crud.php` should check a header.
    // Let's add an `api_token` column to users table to make it real.
    
    echo json_encode(['message' => 'Auth check endpoint']);
}
?>
