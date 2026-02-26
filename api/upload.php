<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Check for file
if (!isset($_FILES['file'])) {
    http_response_code(400);
    echo json_encode(['error' => 'No file uploaded']);
    exit;
}

$file = $_FILES['file'];
$fileName = $file['name'];
$fileTmpName = $file['tmp_name'];
$fileSize = $file['size'];
$fileError = $file['error'];
$fileType = $file['type'];

$fileExt = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
$allowed = ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'webm'];

// Use finfo to check MIME type server-side
$finfo = new finfo(FILEINFO_MIME_TYPE);
$mimeType = $finfo->file($fileTmpName);

$allowedMimes = [
    'jpg' => 'image/jpeg',
    'jpeg' => 'image/jpeg',
    'png' => 'image/png',
    'gif' => 'image/gif',
    'mp4' => 'video/mp4',
    'webm' => 'video/webm'
];

if (!in_array($fileExt, $allowed)) {
    http_response_code(400);
    echo json_encode(['error' => 'You cannot upload files of this type']);
    exit;
}

// Validate MIME type matches extension
$isValid = false;
if (array_key_exists($fileExt, $allowedMimes)) {
    if ($allowedMimes[$fileExt] === $mimeType) {
        $isValid = true;
    } 
    // Handle jpeg/jpg edge case
    elseif (($fileExt === 'jpg' || $fileExt === 'jpeg') && $mimeType === 'image/jpeg') {
        $isValid = true;
    }
}

if (!$isValid) {
     http_response_code(400);
     echo json_encode(['error' => 'Invalid file content']);
     exit;
}

if ($fileError === 0) {
        if ($fileSize < 50000000) { // 50MB limit
            $fileNameNew = uniqid('', true) . "." . $fileExt;
            $uploadDir = __DIR__ . '/../public/uploads/';
            
            // Create dir if not exists
            if (!file_exists($uploadDir)) {
                mkdir($uploadDir, 0777, true);
            }
            
            $fileDestination = $uploadDir . $fileNameNew;
            
            if (move_uploaded_file($fileTmpName, $fileDestination)) {
                // Return the URL
                // Assuming localhost/mexi-events/public/uploads/...
                $url = 'http://localhost/mexi-events/public/uploads/' . $fileNameNew;
                echo json_encode(['success' => true, 'url' => $url, 'type' => strpos($fileType, 'video') !== false ? 'video' : 'image']);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Failed to move uploaded file']);
            }
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'File is too large']);
        }
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'There was an error uploading your file']);
    }
?>
