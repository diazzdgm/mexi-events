<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mexi-Events - Descubre México</title>
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <!-- Custom CSS -->
    <link rel="stylesheet" href="assets/css/style.css">
    <!-- Chart.js -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body class="bg-gray-50 text-gray-800 font-sans">
    <nav class="bg-white shadow-lg fixed w-full z-50 transition-all duration-300" id="navbar">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
                <div class="flex items-center">
                    <a href="index.php" class="flex-shrink-0 flex items-center gap-2">
                        <i class="fas fa-map-marked-alt text-green-600 text-2xl"></i>
                        <span class="font-bold text-xl text-gray-800">Mexi<span class="text-green-600">Events</span></span>
                    </a>
                </div>
                <div class="hidden md:flex items-center space-x-8">
                    <a href="index.php" class="text-gray-600 hover:text-green-600 transition-colors duration-200 font-medium">Inicio</a>
                    <a href="#destinos" class="text-gray-600 hover:text-green-600 transition-colors duration-200 font-medium">Destinos</a>
                    <a href="#mapa" class="text-gray-600 hover:text-green-600 transition-colors duration-200 font-medium">Cerca de Ti</a>
                    <a href="admin.php" class="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                        <i class="fas fa-plus-circle mr-2"></i>Admin Panel
                    </a>
                </div>
                <!-- Mobile menu button -->
                <div class="md:hidden flex items-center">
                    <button id="mobile-menu-btn" class="text-gray-600 hover:text-green-600 focus:outline-none">
                        <i class="fas fa-bars text-2xl"></i>
                    </button>
                </div>
            </div>
        </div>
        <!-- Mobile Menu -->
        <div class="md:hidden hidden bg-white border-t" id="mobile-menu">
            <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <a href="index.php" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50">Inicio</a>
                <a href="#destinos" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50">Destinos</a>
                <a href="#mapa" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50">Cerca de Ti</a>
                <a href="admin.php" class="block px-3 py-2 rounded-md text-base font-medium text-green-600 font-bold hover:bg-gray-50">Admin Panel</a>
            </div>
        </div>
    </nav>
    <!-- Spacer for fixed navbar -->
    <div class="h-16"></div>
