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
function mapRegionToStateId($region) {
    $mapping = [
        'Aguascalientes' => 'agu',
        'Baja California' => 'bcn',
        'Baja California Sur' => 'bcs',
        'Campeche' => 'cam',
        'Chiapas' => 'chp',
        'Chihuahua' => 'chh',
        'Coahuila' => 'coa',
        'Colima' => 'coi',
        'Mexico City' => 'dif',
        'Durango' => 'dur',
        'Guanajuato' => 'gua',
        'Guerrero' => 'gro',
        'Hidalgo' => 'hid',
        'Jalisco' => 'jal',
        'Mexico' => 'mex',
        'Michoacan' => 'mic',
        'Morelos' => 'mor',
        'Nayarit' => 'nay',
        'Nuevo Leon' => 'nle',
        'Oaxaca' => 'oax',
        'Puebla' => 'pue',
        'Queretaro' => 'que',
        'Quintana Roo' => 'roo',
        'San Luis Potosi' => 'slp',
        'Sinaloa' => 'sin',
        'Sonora' => 'son',
        'Tabasco' => 'tab',
        'Tamaulipas' => 'tam',
        'Tlaxcala' => 'tla',
        'Veracruz' => 'ver',
        'Yucatan' => 'yuc',
        'Zacatecas' => 'zac'
    ];
    foreach ($mapping as $key => $val) {
        if (stripos($region, $key) !== false) return $val;
    }
    return null;
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $ip = $_SERVER['REMOTE_ADDR'];
    if ($ip === '::1' || $ip === '127.0.0.1') {
        $ip = '189.203.0.0'; 
    }
    $apiUrl = "https://ipapi.co/{$ip}/json/";
    $response = @file_get_contents($apiUrl);
    
    if ($response) {
        $data = json_decode($response, true);
        
        $location = [
            'ip' => $ip,
            'country_code' => $data['country_code'] ?? 'Unknown',
            'country_name' => $data['country_name'] ?? 'Unknown',
            'region' => $data['region'] ?? 'Unknown',
            'city' => $data['city'] ?? 'Unknown',
            'state_id' => mapRegionToStateId($data['region'] ?? ''),
            'is_mexico' => ($data['country_code'] ?? '') === 'MX'
        ];
        
        echo json_encode(['success' => true, 'data' => $location]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to fetch location']);
    }

} elseif ($method === 'POST') {
    $headers = function_exists('getallheaders') ? getallheaders() : [];
    $authHeader = $headers['Authorization'] ?? ($_SERVER['HTTP_AUTHORIZATION'] ?? '');
    $token = str_replace('Bearer ', '', $authHeader);

    if (!$token) {
        http_response_code(401);
        echo json_encode(['error' => 'Authorization required']);
        exit;
    }

    $data = json_decode(file_get_contents("php://input"), true);
    $country_code = $data['country_code'] ?? null;
    $state_id = $data['state_id'] ?? null;

    try {
        $stmt = $pdo->prepare("UPDATE users SET country_code = :cc, state_id = :sid WHERE api_token = :token");
        $stmt->execute([
            ':cc' => $country_code,
            ':sid' => $state_id,
            ':token' => $token
        ]);
        
        echo json_encode(['success' => true, 'message' => 'Location updated']);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}
?>
