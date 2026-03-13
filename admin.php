<?php
include 'includes/conexion.php';

$mensaje = '';
$tipo_mensaje = '';

// Manejar inserción
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'add') {
    // Validaciones
    $titulo = filter_var($_POST['titulo'], FILTER_SANITIZE_STRING);
    $descripcion = filter_var($_POST['descripcion'], FILTER_SANITIZE_STRING);
    $estado = filter_var($_POST['estado'], FILTER_SANITIZE_STRING);
    $fecha = $_POST['fecha'];
    $ubicacion = filter_var($_POST['ubicacion'], FILTER_SANITIZE_STRING);
    $categoria = filter_var($_POST['categoria'], FILTER_SANITIZE_STRING);
    
    // Manejo de imagen
    $imagen_url = '';
    if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] === 0) {
        $allowed = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        $filename = $_FILES['imagen']['name'];
        $ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
        
        if (in_array($ext, $allowed)) {
            $new_name = uniqid() . '.' . $ext;
            $destination = 'assets/uploads/' . $new_name;
            
            if (move_uploaded_file($_FILES['imagen']['tmp_name'], $destination)) {
                $imagen_url = $destination;
            } else {
                $mensaje = "Error al subir la imagen.";
                $tipo_mensaje = "error";
            }
        } else {
            $mensaje = "Tipo de archivo no permitido.";
            $tipo_mensaje = "error";
        }
    }

    if (empty($mensaje)) {
        try {
            $stmt = $pdo->prepare("INSERT INTO destinos (titulo, descripcion, estado, fecha, ubicacion, categoria, imagen_url) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$titulo, $descripcion, $estado, $fecha, $ubicacion, $categoria, $imagen_url]);
            $mensaje = "Destino agregado exitosamente.";
            $tipo_mensaje = "success";
        } catch (PDOException $e) {
            $mensaje = "Error en la base de datos: " . $e->getMessage();
            $tipo_mensaje = "error";
        }
    }
}

// Manejar eliminación
if (isset($_GET['delete'])) {
    $id = filter_var($_GET['delete'], FILTER_VALIDATE_INT);
    if ($id) {
        try {
            // Primero obtener la imagen para borrarla
            $stmt = $pdo->prepare("SELECT imagen_url FROM destinos WHERE id = ?");
            $stmt->execute([$id]);
            $row = $stmt->fetch();
            
            if ($row && file_exists($row['imagen_url'])) {
                unlink($row['imagen_url']);
            }
            
            $stmt = $pdo->prepare("DELETE FROM destinos WHERE id = ?");
            $stmt->execute([$id]);
            $mensaje = "Destino eliminado.";
            $tipo_mensaje = "success";
        } catch (PDOException $e) {
            $mensaje = "Error al eliminar: " . $e->getMessage();
            $tipo_mensaje = "error";
        }
    }
}

// Obtener todos los destinos para la tabla
$destinos = $pdo->query("SELECT * FROM destinos ORDER BY created_at DESC")->fetchAll();
?>

<?php include 'includes/header.php'; ?>

<div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8 text-gray-800 border-b-2 border-green-500 pb-2 inline-block">Panel de Administración</h1>

    <?php if ($mensaje): ?>
        <div class="<?php echo $tipo_mensaje === 'success' ? 'bg-green-100 border-green-500 text-green-700' : 'bg-red-100 border-red-500 text-red-700'; ?> border-l-4 p-4 mb-6 rounded shadow-sm" role="alert">
            <p class="font-bold"><?php echo $tipo_mensaje === 'success' ? '¡Éxito!' : 'Error'; ?></p>
            <p><?php echo $mensaje; ?></p>
        </div>
    <?php endif; ?>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Formulario de Agregar -->
        <div class="lg:col-span-1">
            <div class="bg-white rounded-lg shadow-lg p-6 sticky top-24 border-t-4 border-green-500">
                <h2 class="text-xl font-bold mb-4 flex items-center text-gray-700">
                    <i class="fas fa-plus-circle mr-2 text-green-500"></i> Agregar Nuevo Destino
                </h2>
                
                <form action="admin.php" method="POST" enctype="multipart/form-data" class="space-y-4" id="addForm">
                    <input type="hidden" name="action" value="add">
                    
                    <div>
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="titulo">Título</label>
                        <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-green-500 transition-colors" id="titulo" name="titulo" type="text" required>
                    </div>

                    <div>
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="descripcion">Descripción</label>
                        <textarea class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-green-500 transition-colors" id="descripcion" name="descripcion" rows="3" required></textarea>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-gray-700 text-sm font-bold mb-2" for="estado">Estado</label>
                            <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-green-500 transition-colors" id="estado" name="estado" type="text" required>
                        </div>
                        <div>
                            <label class="block text-gray-700 text-sm font-bold mb-2" for="fecha">Fecha</label>
                            <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-green-500 transition-colors" id="fecha" name="fecha" type="date" required>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-gray-700 text-sm font-bold mb-2" for="ubicacion">Ubicación</label>
                            <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-green-500 transition-colors" id="ubicacion" name="ubicacion" type="text" required>
                        </div>
                        <div>
                            <label class="block text-gray-700 text-sm font-bold mb-2" for="categoria">Categoría</label>
                            <select class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-green-500 transition-colors" id="categoria" name="categoria" required>
                                <option value="Cultural">Cultural</option>
                                <option value="Naturaleza">Naturaleza</option>
                                <option value="Gastronomía">Gastronomía</option>
                                <option value="Aventura">Aventura</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="imagen">Imagen</label>
                        <div class="relative border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-green-500 transition-colors cursor-pointer" id="drop-zone">
                            <input type="file" name="imagen" id="imagen" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" required>
                            <div class="space-y-2">
                                <i class="fas fa-cloud-upload-alt text-3xl text-gray-400"></i>
                                <p class="text-sm text-gray-500">Arrastra una imagen o haz clic aquí</p>
                            </div>
                        </div>
                        <!-- Preview Container -->
                        <div id="image-preview" class="mt-4 hidden relative group">
                            <img src="" alt="Preview" class="w-full h-48 object-cover rounded-lg shadow-md">
                            <button type="button" id="remove-image" class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>

                    <button class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline transition-all duration-200 transform hover:-translate-y-1 shadow-md flex justify-center items-center" type="submit">
                        <i class="fas fa-save mr-2"></i> Guardar Destino
                    </button>
                </form>
            </div>
        </div>

        <!-- Lista de Destinos -->
        <div class="lg:col-span-2">
            <div class="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100">
                <div class="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 class="text-xl font-bold text-gray-700"><i class="fas fa-list mr-2 text-green-500"></i> Destinos Registrados</h2>
                    <span class="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full"><?php echo count($destinos); ?> Total</span>
                </div>
                
                <div class="overflow-x-auto">
                    <table class="min-w-full leading-normal">
                        <thead>
                            <tr>
                                <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Destino</th>
                                <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Ubicación</th>
                                <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Fecha</th>
                                <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($destinos as $destino): ?>
                            <tr class="hover:bg-gray-50 transition-colors">
                                <td class="px-5 py-5 border-b border-gray-200 text-sm">
                                    <div class="flex items-center">
                                        <div class="flex-shrink-0 w-10 h-10">
                                            <img class="w-full h-full rounded-full object-cover shadow-sm" src="<?php echo htmlspecialchars($destino['imagen_url']); ?>" alt="" />
                                        </div>
                                        <div class="ml-3">
                                            <p class="text-gray-900 whitespace-no-wrap font-semibold">
                                                <?php echo htmlspecialchars($destino['titulo']); ?>
                                            </p>
                                            <p class="text-gray-500 text-xs truncate w-32">
                                                <?php echo htmlspecialchars($destino['categoria']); ?>
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-5 py-5 border-b border-gray-200 text-sm">
                                    <p class="text-gray-900 whitespace-no-wrap"><?php echo htmlspecialchars($destino['ubicacion']); ?></p>
                                    <p class="text-gray-500 text-xs"><?php echo htmlspecialchars($destino['estado']); ?></p>
                                </td>
                                <td class="px-5 py-5 border-b border-gray-200 text-sm">
                                    <p class="text-gray-900 whitespace-no-wrap">
                                        <?php echo date('d M, Y', strtotime($destino['fecha'])); ?>
                                    </p>
                                </td>
                                <td class="px-5 py-5 border-b border-gray-200 text-sm">
                                    <div class="flex space-x-2">
                                        <button class="text-blue-600 hover:text-blue-900 transition-colors"><i class="fas fa-edit"></i></button>
                                        <a href="admin.php?delete=<?php echo $destino['id']; ?>" onclick="return confirm('¿Estás seguro de eliminar este destino?');" class="text-red-600 hover:text-red-900 transition-colors"><i class="fas fa-trash-alt"></i></a>
                                    </div>
                                </td>
                            </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>

<script src="assets/js/admin.js"></script>

<?php include 'includes/footer.php'; ?>
