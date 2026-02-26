<?php
include 'includes/conexion.php';

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
$mensaje = '';

// Manejar envío de comentario
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'comentar') {
    $usuario = filter_var($_POST['usuario'], FILTER_SANITIZE_STRING);
    $comentario = filter_var($_POST['comentario'], FILTER_SANITIZE_STRING);
    $calificacion = (int)$_POST['calificacion'];
    $destino_id = (int)$_POST['destino_id'];

    if ($usuario && $comentario && $calificacion && $destino_id) {
        try {
            $stmt = $pdo->prepare("INSERT INTO comentarios (destino_id, usuario, comentario, calificacion) VALUES (?, ?, ?, ?)");
            $stmt->execute([$destino_id, $usuario, $comentario, $calificacion]);
            $mensaje = "¡Gracias por tu comentario!";
        } catch (PDOException $e) {
            $mensaje = "Error al guardar comentario.";
        }
    }
}

// Obtener detalles del destino
try {
    $stmt = $pdo->prepare("SELECT * FROM destinos WHERE id = ?");
    $stmt->execute([$id]);
    $destino = $stmt->fetch();

    if (!$destino) {
        header("Location: index.php");
        exit;
    }

    // Obtener comentarios
    $stmt_comentarios = $pdo->prepare("SELECT * FROM comentarios WHERE destino_id = ? ORDER BY created_at DESC");
    $stmt_comentarios->execute([$id]);
    $comentarios = $stmt_comentarios->fetchAll();
    
    // Calcular promedio
    $promedio = 0;
    if (count($comentarios) > 0) {
        $total = 0;
        foreach ($comentarios as $c) {
            $total += $c['calificacion'];
        }
        $promedio = round($total / count($comentarios), 1);
    }

} catch (PDOException $e) {
    die("Error: " . $e->getMessage());
}
?>

<?php include 'includes/header.php'; ?>

<div class="bg-gray-100 min-h-screen pb-12">
    <!-- Hero Header with Image -->
    <div class="relative h-[50vh] w-full overflow-hidden">
        <img src="<?php echo htmlspecialchars($destino['imagen_url']); ?>" alt="<?php echo htmlspecialchars($destino['titulo']); ?>" class="w-full h-full object-cover">
        <div class="absolute inset-0 bg-black bg-opacity-40 flex items-end">
            <div class="container mx-auto px-4 pb-12">
                <h1 class="text-5xl font-bold text-white mb-4 drop-shadow-lg"><?php echo htmlspecialchars($destino['titulo']); ?></h1>
                <div class="flex items-center text-white space-x-6 text-lg">
                    <span class="flex items-center"><i class="fas fa-map-marker-alt mr-2 text-red-500"></i> <?php echo htmlspecialchars($destino['ubicacion']); ?>, <?php echo htmlspecialchars($destino['estado']); ?></span>
                    <span class="flex items-center"><i class="far fa-calendar-alt mr-2 text-green-400"></i> <?php echo date('d M, Y', strtotime($destino['fecha'])); ?></span>
                    <span class="flex items-center bg-white bg-opacity-20 px-3 py-1 rounded-full backdrop-blur-sm">
                        <i class="fas fa-star text-yellow-400 mr-2"></i> <?php echo $promedio > 0 ? $promedio : 'Nuevo'; ?>
                    </span>
                </div>
            </div>
        </div>
    </div>

    <div class="container mx-auto px-4 -mt-10 relative z-10">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Main Content -->
            <div class="lg:col-span-2">
                <div class="bg-white rounded-xl shadow-lg p-8 mb-8">
                    <h2 class="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Acerca de este destino</h2>
                    <p class="text-gray-600 leading-relaxed text-lg mb-6">
                        <?php echo nl2br(htmlspecialchars($destino['descripcion'])); ?>
                    </p>
                    
                    <div class="flex flex-wrap gap-4 mt-8">
                        <span class="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                            <i class="fas fa-tag mr-2"></i><?php echo htmlspecialchars($destino['categoria']); ?>
                        </span>
                        <span class="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                            <i class="fas fa-fire mr-2"></i>Popularidad: <?php echo $destino['popularidad']; ?>
                        </span>
                    </div>
                </div>

                <!-- Comments Section -->
                <div class="bg-white rounded-xl shadow-lg p-8">
                    <h3 class="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                        <i class="far fa-comments mr-3 text-green-600"></i> Opiniones de Viajeros
                    </h3>

                    <?php if ($mensaje): ?>
                        <div class="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6" role="alert">
                            <p><?php echo $mensaje; ?></p>
                        </div>
                    <?php endif; ?>

                    <!-- Comment Form -->
                    <form action="detalle.php?id=<?php echo $id; ?>" method="POST" class="mb-10 bg-gray-50 p-6 rounded-lg border border-gray-200">
                        <input type="hidden" name="action" value="comentar">
                        <input type="hidden" name="destino_id" value="<?php echo $id; ?>">
                        
                        <h4 class="font-bold text-lg mb-4 text-gray-700">Deja tu opinión</h4>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label class="block text-gray-700 text-sm font-bold mb-2" for="usuario">Nombre</label>
                                <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-green-500" id="usuario" name="usuario" type="text" required placeholder="Tu nombre">
                            </div>
                            <div>
                                <label class="block text-gray-700 text-sm font-bold mb-2" for="calificacion">Calificación</label>
                                <select class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-green-500" id="calificacion" name="calificacion" required>
                                    <option value="5">⭐⭐⭐⭐⭐ Excelente</option>
                                    <option value="4">⭐⭐⭐⭐ Muy bueno</option>
                                    <option value="3">⭐⭐⭐ Bueno</option>
                                    <option value="2">⭐⭐ Regular</option>
                                    <option value="1">⭐ Malo</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="mb-4">
                            <label class="block text-gray-700 text-sm font-bold mb-2" for="comentario">Comentario</label>
                            <textarea class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-green-500" id="comentario" name="comentario" rows="3" required placeholder="Comparte tu experiencia..."></textarea>
                        </div>
                        
                        <button class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded transition-colors shadow-md" type="submit">
                            Publicar Comentario
                        </button>
                    </form>

                    <!-- Comments List -->
                    <div class="space-y-6">
                        <?php if (count($comentarios) > 0): ?>
                            <?php foreach ($comentarios as $comentario): ?>
                            <div class="border-b border-gray-100 pb-6 last:border-0">
                                <div class="flex items-center justify-between mb-2">
                                    <div class="flex items-center">
                                        <div class="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                                            <?php echo strtoupper(substr($comentario['usuario'], 0, 1)); ?>
                                        </div>
                                        <div class="ml-3">
                                            <p class="font-bold text-gray-800"><?php echo htmlspecialchars($comentario['usuario']); ?></p>
                                            <p class="text-xs text-gray-500"><?php echo date('d M, Y', strtotime($comentario['created_at'])); ?></p>
                                        </div>
                                    </div>
                                    <div class="text-yellow-400 text-sm">
                                        <?php for($i=0; $i<$comentario['calificacion']; $i++) echo '<i class="fas fa-star"></i>'; ?>
                                    </div>
                                </div>
                                <p class="text-gray-600 ml-12 italic">"<?php echo htmlspecialchars($comentario['comentario']); ?>"</p>
                            </div>
                            <?php endforeach; ?>
                        <?php else: ?>
                            <p class="text-center text-gray-500 py-8">No hay comentarios aún. ¡Sé el primero en opinar!</p>
                        <?php endif; ?>
                    </div>
                </div>
            </div>

            <!-- Sidebar -->
            <div class="lg:col-span-1">
                <div class="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                    <h3 class="font-bold text-xl mb-4 text-gray-800">¿Te interesa este evento?</h3>
                    <div class="space-y-4">
                        <button class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center shadow-md">
                            <i class="fas fa-ticket-alt mr-2"></i> Reservar Boletos
                        </button>
                        <button class="w-full bg-white border-2 border-gray-200 hover:border-green-500 text-gray-700 font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center">
                            <i class="far fa-heart mr-2 text-red-500"></i> Guardar en Favoritos
                        </button>
                    </div>
                    
                    <hr class="my-6 border-gray-200">
                    
                    <h4 class="font-bold text-gray-700 mb-3">Ubicación</h4>
                    <!-- Placeholder Map -->
                    <div class="bg-gray-200 h-48 rounded-lg flex items-center justify-center text-gray-500 mb-4 overflow-hidden relative group cursor-pointer">
                         <div class="absolute inset-0 bg-cover bg-center opacity-50 group-hover:opacity-70 transition-opacity" style="background-image: url('assets/img/map-placeholder.png');"></div>
                         <div class="relative z-10 flex flex-col items-center">
                             <i class="fas fa-map-marked-alt text-4xl mb-2 text-gray-600"></i>
                             <span class="font-bold">Ver en Mapa</span>
                         </div>
                    </div>
                    <p class="text-sm text-gray-500 text-center"><?php echo htmlspecialchars($destino['ubicacion']); ?></p>
                </div>
            </div>
        </div>
    </div>
</div>

<?php include 'includes/footer.php'; ?>
