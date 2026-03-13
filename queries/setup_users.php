<?php
require_once __DIR__ . '/../includes/conexion.php';

try {
    // 1. Create table
    $sql = "CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";
    
    $pdo->exec($sql);
    echo "Users table created successfully.\n";
    
    // 2. Insert default users
    // Admin: admin / admin123
    // User: user / user123
    
    $admin_pass = password_hash('admin123', PASSWORD_DEFAULT);
    $user_pass = password_hash('user123', PASSWORD_DEFAULT);
    
    $stmt = $pdo->prepare("INSERT INTO users (username, password, role) VALUES (:user, :pass, :role) ON DUPLICATE KEY UPDATE password=:pass");
    
    // Admin
    $stmt->execute([':user' => 'admin', ':pass' => $admin_pass, ':role' => 'admin']);
    echo "Admin user created (admin / admin123).\n";
    
    // User
    $stmt->execute([':user' => 'user', ':pass' => $user_pass, ':role' => 'user']);
    echo "Regular user created (user / user123).\n";
    
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
