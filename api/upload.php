<?php
ini_set('display_errors', 0);
error_reporting(E_ALL & ~E_NOTICE);
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
    // Check if POST max size was exceeded
    if (empty($_FILES) && empty($_POST) && isset($_SERVER['CONTENT_TYPE']) && $_SERVER['CONTENT_LENGTH'] > 0) {
        http_response_code(400);
        $maxSize = ini_get('post_max_size');
        echo json_encode(['error' => "File exceeds post_max_size limit of $maxSize"]);
        exit;
    }
    
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
    // Handle generic video/octet-stream edge cases
    elseif (strpos($mimeType, 'video/') === 0 && strpos($fileType, 'video/') === 0) {
        // If both finfo and browser say it's video, trust it (slightly risky but better UX)
        $isValid = true;
    }
}

if (!$isValid) {
     http_response_code(400);
     echo json_encode([
         'error' => 'Invalid file content. Expected ' . ($allowedMimes[$fileExt] ?? 'unknown') . ', got ' . $mimeType,
         'debug' => ['ext' => $fileExt, 'mime' => $mimeType, 'browser_type' => $fileType]
     ]);
     exit;
}

    if ($fileError === 0) {
        if ($fileSize < 50000000) { // 50MB limit
            $fileNameNew = uniqid('', true) . "." . $fileExt;
            $uploadDir = __DIR__ . '/../public/uploads/';
            
            // Create dir if not exists
            if (!file_exists($uploadDir)) {
                if (!mkdir($uploadDir, 0777, true)) {
                    http_response_code(500);
                    echo json_encode(['error' => 'Failed to create upload directory']);
                    exit;
                }
            }
            
            $fileDestination = $uploadDir . $fileNameNew;
            
            if (move_uploaded_file($fileTmpName, $fileDestination)) {
                // Return the URL
                // Use HTTP_HOST to adapt to whatever port the server is running on (e.g. 8000)
                $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http";
                $host = $_SERVER['HTTP_HOST'];
                $url = "$protocol://$host/mexi-events/public/uploads/$fileNameNew";
                
                echo json_encode(['success' => true, 'url' => $url, 'type' => strpos($fileType, 'video') !== false ? 'video' : 'image']);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Failed to move uploaded file. Check permissions or path. Path: ' . $fileDestination]);
            }
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'File is too large (Limit: 50MB)']);
        }
    } else {
        http_response_code(500);
        $errorMessages = [
            UPLOAD_ERR_INI_SIZE => 'The uploaded file exceeds the upload_max_filesize directive in php.ini',
            UPLOAD_ERR_FORM_SIZE => 'The uploaded file exceeds the MAX_FILE_SIZE directive that was specified in the HTML form',
            UPLOAD_ERR_PARTIAL => 'The uploaded file was only partially uploaded',
            UPLOAD_ERR_NO_FILE => 'No file was uploaded',
            UPLOAD_ERR_NO_TMP_DIR => 'Missing a temporary folder',
            UPLOAD_ERR_CANT_WRITE => 'Failed to write file to disk',
            UPLOAD_ERR_EXTENSION => 'A PHP extension stopped the file upload',
        ];
        $message = $errorMessages[$fileError] ?? 'Unknown upload error';
        echo json_encode(['error' => 'Upload error: ' . $message]);
    }
?>
