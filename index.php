<?php
include 'includes/conexion.php';

// Obtener destinos para el slider y el grid
try {
    $stmt = $pdo->query("SELECT * FROM destinos ORDER BY popularidad DESC LIMIT 6");
    $destinos_populares = $stmt->fetchAll();
    
    $stmt_todos = $pdo->query("SELECT * FROM destinos ORDER BY fecha DESC");
    $todos_destinos = $stmt_todos->fetchAll();
} catch (PDOException $e) {
    $error = "Error al cargar destinos: " . $e->getMessage();
}
?>

<?php include 'includes/header.php'; ?>

<!-- Hero Slider Section -->
<section id="inicio" class="relative h-[600px] bg-gray-900 text-white overflow-hidden">
    <!-- Slider Container -->
    <div class="slider-container h-full relative" id="hero-slider">
        <?php foreach ($destinos_populares as $index => $destino): ?>
        <div class="slide absolute inset-0 transition-opacity duration-1000 ease-in-out <?php echo $index === 0 ? 'opacity-100' : 'opacity-0'; ?>" style="background-image: url('<?php echo htmlspecialchars($destino['imagen_url']); ?>'); background-size: cover; background-position: center;">
            <div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div class="text-center px-4 max-w-4xl mx-auto transform translate-y-0 transition-transform duration-700">
                    <h1 class="text-5xl md:text-7xl font-bold mb-6 tracking-tight drop-shadow-lg"><?php echo htmlspecialchars($destino['titulo']); ?></h1>
                    <p class="text-xl md:text-2xl mb-8 font-light drop-shadow-md"><?php echo htmlspecialchars($destino['descripcion']); ?></p>
                    <a href="#destinos" class="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl border-2 border-green-500 hover:border-green-600">
                        Explorar Ahora <i class="fas fa-arrow-right ml-2"></i>
                    </a>
                </div>
            </div>
        </div>
        <?php endforeach; ?>
    </div>
    
    <!-- Slider Controls -->
    <button id="prev-slide" class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-40 text-white p-4 rounded-full transition-all duration-300 backdrop-blur-sm">
        <i class="fas fa-chevron-left fa-2x"></i>
    </button>
    <button id="next-slide" class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-40 text-white p-4 rounded-full transition-all duration-300 backdrop-blur-sm">
        <i class="fas fa-chevron-right fa-2x"></i>
    </button>
</section>

<!-- Main Content -->
<main class="container mx-auto px-4 py-16">

    <!-- Popularity Chart Section -->
    <section id="estadisticas" class="mb-20">
        <div class="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h2 class="text-3xl font-bold text-center mb-8 text-gray-800">Tendencias de Viaje <span class="text-green-600">2026</span></h2>
            <div class="relative h-[400px] w-full">
                <canvas id="popularityChart"></canvas>
            </div>
        </div>
    </section>

    <!-- Destinations Grid -->
    <section id="destinos" class="mb-20">
        <div class="flex justify-between items-end mb-10 border-b pb-4 border-gray-200">
            <div>
                <h2 class="text-4xl font-bold text-gray-800 mb-2">Destinos <span class="text-green-600">Imperdibles</span></h2>
                <p class="text-gray-500 text-lg">Explora los lugares más mágicos de México</p>
            </div>
            <div class="hidden md:block">
                <button class="text-green-600 font-semibold hover:text-green-800 transition-colors">Ver todos <i class="fas fa-long-arrow-alt-right ml-1"></i></button>
            </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <?php foreach ($todos_destinos as $destino): ?>
            <article class="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group border border-gray-100">
                <div class="relative h-64 overflow-hidden">
                    <img src="<?php echo htmlspecialchars($destino['imagen_url']); ?>" alt="<?php echo htmlspecialchars($destino['titulo']); ?>" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
                    <div class="absolute top-4 right-4 bg-white bg-opacity-90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-green-700 shadow-sm">
                        <i class="fas fa-star text-yellow-400 mr-1"></i> <?php echo $destino['popularidad']; ?> pts
                    </div>
                    <div class="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div class="absolute bottom-4 left-4 text-white">
                        <span class="bg-green-600 text-xs font-bold px-2 py-1 rounded mb-2 inline-block"><?php echo htmlspecialchars($destino['categoria']); ?></span>
                    </div>
                </div>
                
                <div class="p-6">
                    <div class="flex items-center text-sm text-gray-500 mb-3">
                        <i class="far fa-calendar-alt mr-2 text-green-500"></i>
                        <span><?php echo date('d M, Y', strtotime($destino['fecha'])); ?></span>
                        <span class="mx-2 text-gray-300">|</span>
                        <i class="fas fa-map-marker-alt mr-2 text-red-500"></i>
                        <span><?php echo htmlspecialchars($destino['estado']); ?></span>
                    </div>
                    
                    <h3 class="text-2xl font-bold mb-3 text-gray-800 group-hover:text-green-600 transition-colors"><?php echo htmlspecialchars($destino['titulo']); ?></h3>
                    <p class="text-gray-600 mb-6 line-clamp-3 leading-relaxed"><?php echo htmlspecialchars($destino['descripcion']); ?></p>
                    
                    <div class="flex justify-between items-center pt-4 border-t border-gray-100">
                        <a href="detalle.php?id=<?php echo $destino['id']; ?>" class="text-green-600 font-bold hover:text-green-800 transition-colors flex items-center group/btn">
                            Más Información 
                            <i class="fas fa-arrow-right ml-2 transform group-hover/btn:translate-x-1 transition-transform"></i>
                        </a>
                        <div class="flex space-x-2">
                            <button class="text-gray-400 hover:text-red-500 transition-colors"><i class="far fa-heart"></i></button>
                            <button class="text-gray-400 hover:text-blue-500 transition-colors"><i class="fas fa-share-alt"></i></button>
                        </div>
                    </div>
                </div>
            </article>
            <?php endforeach; ?>
        </div>
    </section>

    <!-- Geolocation Section -->
    <section id="mapa" class="bg-green-50 rounded-3xl p-10 mb-20 relative overflow-hidden">
        <div class="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-green-200 rounded-full opacity-50 blur-3xl"></div>
        <div class="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-blue-200 rounded-full opacity-50 blur-3xl"></div>
        
        <div class="relative z-10 text-center max-w-2xl mx-auto">
            <h2 class="text-3xl font-bold mb-6 text-gray-800">Descubre Eventos <span class="text-green-600">Cerca de Ti</span></h2>
            <p class="text-gray-600 mb-8 text-lg">Utiliza tu ubicación para encontrar las mejores experiencias turísticas a tu alrededor.</p>
            
            <button id="btn-geo" class="bg-gray-800 hover:bg-gray-900 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl flex items-center mx-auto transform hover:-translate-y-1">
                <i class="fas fa-location-arrow mr-3 animate-pulse"></i> Activar Geolocalización
            </button>
            
            <div id="geo-result" class="mt-8 hidden p-6 bg-white rounded-xl shadow-md border border-gray-100 transition-all duration-500">
                <p class="text-gray-700 font-medium flex items-center justify-center">
                    <i class="fas fa-check-circle text-green-500 mr-2 text-xl"></i>
                    <span id="geo-message">Ubicación detectada</span>
                </p>
                <div id="nearby-events" class="mt-4 grid grid-cols-1 gap-4">
                    <!-- Events will be injected here via JS -->
                </div>
            </div>
        </div>
    </section>

    <!-- Multimedia Section -->
    <section class="mb-20">
        <h2 class="text-3xl font-bold mb-8 text-center text-gray-800">Vive la <span class="text-green-600">Experiencia</span></h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="bg-black rounded-xl overflow-hidden shadow-2xl relative group">
                <video controls class="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity">
                    <source src="assets/video/promo.mp4" type="video/mp4">
                    Tu navegador no soporta el elemento de video.
                </video>
                <div class="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded animate-pulse">EN VIVO</div>
            </div>
            <div class="bg-gray-900 rounded-xl p-8 text-white shadow-2xl flex flex-col justify-center relative overflow-hidden">
                <div class="absolute inset-0 bg-gradient-to-br from-green-900 to-gray-900 opacity-90"></div>
                <div class="relative z-10">
                    <h3 class="text-2xl font-bold mb-6 flex items-center"><i class="fas fa-podcast mr-3 text-green-400"></i> Sonidos de México</h3>
                    <div class="space-y-6">
                        <div class="bg-white/10 p-4 rounded-lg backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-colors">
                            <p class="mb-2 font-medium">Mariachi Tradicional</p>
                            <audio controls class="w-full h-10 rounded">
                                <source src="assets/audio/mariachi.mp3" type="audio/mpeg">
                            </audio>
                        </div>
                        <div class="bg-white/10 p-4 rounded-lg backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-colors">
                            <p class="mb-2 font-medium">Son Jarocho</p>
                            <audio controls class="w-full h-10 rounded">
                                <source src="assets/audio/son.mp3" type="audio/mpeg">
                            </audio>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

</main>

<!-- Pass PHP data to JS for the chart -->
<script>
    const chartData = {
        labels: <?php echo json_encode(array_column($destinos_populares, 'titulo')); ?>,
        data: <?php echo json_encode(array_column($destinos_populares, 'popularidad')); ?>
    };
</script>

<?php include 'includes/footer.php'; ?>
