document.addEventListener('DOMContentLoaded', () => {
    // --- Slider Logic ---
    const slides = document.querySelectorAll('#hero-slider .slide');
    let currentSlide = 0;
    const slideInterval = 5000; // 5 seconds

    function showSlide(index) {
        slides.forEach((slide, i) => {
            if (i === index) {
                slide.classList.remove('opacity-0');
                slide.classList.add('opacity-100');
            } else {
                slide.classList.remove('opacity-100');
                slide.classList.add('opacity-0');
            }
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }

    if (slides.length > 0) {
        setInterval(nextSlide, slideInterval);
        document.getElementById('prev-slide').addEventListener('click', prevSlide);
        document.getElementById('next-slide').addEventListener('click', nextSlide);
    }

    // --- Geolocation Logic ---
    const btnGeo = document.getElementById('btn-geo');
    const geoResult = document.getElementById('geo-result');
    const geoMessage = document.getElementById('geo-message');
    const nearbyEventsContainer = document.getElementById('nearby-events');

    if (btnGeo) {
        btnGeo.addEventListener('click', () => {
            if (!navigator.geolocation) {
                alert('La geolocalización no es soportada por tu navegador.');
                return;
            }

            btnGeo.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Buscando...';
            
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    
                    // En una app real, enviaríamos lat/lng al backend para buscar
                    // Por ahora, simularemos encontrando eventos cercanos
                    btnGeo.innerHTML = '<i class="fas fa-location-arrow mr-2"></i> Actualizar Ubicación';
                    geoResult.classList.remove('hidden');
                    geoMessage.textContent = `Ubicación encontrada: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
                    
                    // Simular respuesta del servidor
                    nearbyEventsContainer.innerHTML = `
                        <div class="bg-green-50 p-4 rounded-lg border border-green-200">
                            <h4 class="font-bold text-green-800">Eventos cercanos a ti</h4>
                            <p class="text-sm text-gray-600">Basado en tu ubicación actual.</p>
                            <ul class="mt-2 space-y-2">
                                <li class="flex items-center text-gray-700">
                                    <i class="fas fa-map-pin text-red-500 mr-2"></i>
                                    <span>Feria Local (a 2.5 km)</span>
                                </li>
                                <li class="flex items-center text-gray-700">
                                    <i class="fas fa-map-pin text-red-500 mr-2"></i>
                                    <span>Exposición de Arte (a 5.0 km)</span>
                                </li>
                            </ul>
                        </div>
                    `;
                },
                (error) => {
                    btnGeo.innerHTML = '<i class="fas fa-exclamation-triangle mr-2"></i> Error';
                    alert('Error al obtener ubicación: ' + error.message);
                }
            );
        });
    }

    // --- Chart.js Logic ---
    const ctx = document.getElementById('popularityChart');
    if (ctx && typeof chartData !== 'undefined') {
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: chartData.labels,
                datasets: [{
                    label: 'Popularidad de Destinos',
                    data: chartData.data,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(75, 192, 192, 0.6)',
                        'rgba(153, 102, 255, 0.6)',
                        'rgba(255, 159, 64, 0.6)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Destinos más populares este mes'
                    }
                }
            }
        });
    }

    // --- Mobile Menu ---
    const btnMenu = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');

    if (btnMenu && menu) {
        btnMenu.addEventListener('click', () => {
            menu.classList.toggle('hidden');
        });
    }

    // --- Navbar Scroll Effect ---
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 10) {
            navbar.classList.add('shadow-lg');
            navbar.classList.remove('shadow-none');
        } else {
            navbar.classList.remove('shadow-lg');
            navbar.classList.add('shadow-none');
        }
    });
});
