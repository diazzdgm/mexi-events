<?php

require_once __DIR__ . '/../includes/conexion.php';

$events = [
    ['Aguascalientes', 'Festival Mítico de Aguascalientes', '2026-06-15',
        'Recorrido nocturno por los museos y callejones históricos de Aguascalientes con instalaciones de luz, arte urbano y música en vivo.',
        'https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?q=80&w=600&auto=format&fit=crop', ''],

    ['Baja California', 'Festival de Música Electrónica BajaMed', '2026-09-05',
        'Festival de música electrónica y arte digital en Ensenada con DJs internacionales y visuales proyectados sobre el océano Pacífico.',
        'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=600&auto=format&fit=crop', ''],

    ['Baja California Sur', 'Los Cabos Open de Tenis', '2026-10-20',
        'Torneo ATP de tenis en Los Cabos con los mejores jugadores del mundo bajo el sol del desierto y el mar de Cortés como telón de fondo.',
        'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=600&auto=format&fit=crop', ''],

    ['Campeche', 'Festival de Aves de Campeche', '2026-11-10',
        'Avistamiento de aves migratorias en los humedales y manglares de Campeche, con guías especializados y talleres de fotografía de naturaleza.',
        'https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=600&auto=format&fit=crop', ''],

    ['Chiapas', 'Festival de las Culturas Indígenas de Chiapas', '2026-09-12',
        'Muestra de las culturas tzeltal, tzotzil, ch\'ol y tojolabal con danza, música, gastronomía y artesanías en San Cristóbal de las Casas.',
        'https://images.unsplash.com/photo-1594911417539-77a28e5557b7?q=80&w=600&auto=format&fit=crop', ''],

    ['Chihuahua', 'Carrera de la Tarahumara en Urique', '2026-06-28',
        'La ultramaratón de montaña más famosa de México en el Cañón de Urique, donde los rarámuri corren descalzos distancias imposibles.',
        'https://images.unsplash.com/photo-1533130061792-64b345e4a833?q=80&w=600&auto=format&fit=crop', ''],

    ['Coahuila', 'Festival de la Guitarra de Saltillo', '2026-09-18',
        'Encuentro internacional de guitarristas en el Teatro García Carrillo de Saltillo con clases magistrales y conciertos al aire libre.',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop', ''],

    ['Colima', 'Festival del Fuego Volcán de Colima', '2026-07-04',
        'Celebración artística en torno al Volcán de Fuego de Colima con exposiciones, instalaciones de luz y cultura volcánica de la región.',
        'https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?q=80&w=600&auto=format&fit=crop', ''],

    ['Durango', 'Festival del Folclor Internacional de Durango', '2026-09-25',
        'Encuentro de grupos de danza folclórica de más de 20 países en la capital del estado más grande de México.',
        'https://images.unsplash.com/photo-1594911417539-77a28e5557b7?q=80&w=600&auto=format&fit=crop', ''],

    ['Guerrero', 'Festival de la Mariposa Monarca en Guerrero', '2026-11-10',
        'Observación de la llegada de la mariposa monarca a los bosques de oyamel de la sierra de Guerrero, con guías y senderismo.',
        'https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=600&auto=format&fit=crop', ''],

    ['Hidalgo', 'Festival del Pulque y la Cultura Hidalguense', '2026-08-08',
        'Celebración de la bebida prehispánica más antigua de México en los llanos de Apan, con haciendas pulqueras abiertas y música de banda.',
        'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=600&auto=format&fit=crop', ''],

    ['México', 'Festival de Arte Contemporáneo Toluca', '2026-09-20',
        'Exposición de arte contemporáneo en los Portales y el Centro Cultural Mexiquense de Toluca, con artistas emergentes del Estado de México.',
        'https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?q=80&w=600&auto=format&fit=crop', ''],

    ['Michoacán', 'Festival de la Mariposa Monarca en Michoacán', '2026-11-15',
        'Temporada de la mariposa monarca en los santuarios de Angangueo y El Rosario: millones de mariposas cubriendo los bosques de oyamel.',
        'https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=600&auto=format&fit=crop', ''],

    ['Morelos', 'Festival de Cine de Morelos', '2026-10-05',
        'Muestra de cine latinoamericano e independiente en Cuernavaca, con proyecciones en jardines históricos y foros con directores.',
        'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=600&auto=format&fit=crop', ''],

    ['Nayarit', 'Festival de Jazz del Pacífico en Tepic', '2026-08-20',
        'Festival de jazz y fusión tropical en la capital de Nayarit, con músicos del Pacífico mexicano y artistas internacionales.',
        'https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?q=80&w=600&auto=format&fit=crop', ''],

    ['Nuevo León', 'Monterrey International Music Fest', '2026-11-14',
        'El festival de música más grande del norte de México en el Estadio BBVA con artistas de talla mundial y escenarios simultáneos.',
        'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=600&auto=format&fit=crop', ''],

    ['Puebla', 'Festival de la China Poblana', '2026-09-16',
        'Desfile y celebración de la vestimenta y cultura de la China Poblana en el centro histórico de Puebla, símbolo de la identidad nacional.',
        'https://images.unsplash.com/photo-1594911417539-77a28e5557b7?q=80&w=600&auto=format&fit=crop', ''],

    ['Querétaro', 'Festival Internacional de Globos Aerostáticos de Querétaro', '2026-09-10',
        'Vuelos en globo aerostático al amanecer sobre los viñedos y el centro histórico de Santiago de Querétaro, Patrimonio de la Humanidad.',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop', ''],

    ['Quintana Roo', 'Festival de Jazz de Playa del Carmen', '2026-11-25',
        'Conciertos de jazz fusion y música del Caribe en la Quinta Avenida de Playa del Carmen con artistas de Cuba, Brasil y México.',
        'https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?q=80&w=600&auto=format&fit=crop', ''],

    ['San Luis Potosí', 'Festival del Huapango en la Huasteca', '2026-10-15',
        'Concurso y celebración del huapango huasteco en Ciudad Valles, con violín, jarana y guitarra quinta en las manos de los mejores trovadores.',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop', ''],

    ['Sinaloa', 'Festival Gastronómico del Mariscos de Mazatlán', '2026-07-12',
        'Degustación de los mejores mariscos del Pacífico mexicano en el malecón de Mazatlán: aguachile, ceviche, ostiones y camarón gigante.',
        'https://images.unsplash.com/photo-1481391243133-f96216dcb5d2?q=80&w=600&auto=format&fit=crop', ''],

    ['Sonora', 'Festival Internacional del Desierto de Altar', '2026-06-12',
        'Aventura en el desierto de dunas de arena más grande de América del Norte con sandboarding, campamentos y fotografía de paisajes lunares.',
        'https://images.unsplash.com/photo-1533130061792-64b345e4a833?q=80&w=600&auto=format&fit=crop', ''],

    ['Tabasco', 'Festival de la Música Tropical de Villahermosa', '2026-07-20',
        'Celebración de la música cumbia, salsa y tropical tabasqueña con orquestas en el malecón del río Grijalva de Villahermosa.',
        'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=600&auto=format&fit=crop', ''],

    ['Tamaulipas', 'Festival Internacional de las Aves en el Golfo', '2026-09-20',
        'Avistamiento de aves migratorias en la Laguna Madre de Tamaulipas, una de las rutas migratorias más importantes del continente americano.',
        'https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=600&auto=format&fit=crop', ''],

    ['Tlaxcala', 'Festival del Pulque de Tlaxcala', '2026-09-08',
        'Celebración del pulque tlaxcalteca en los campos de maguey de la región, con tinacales abiertos, música de chirimía y gastronomía local.',
        'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=600&auto=format&fit=crop', ''],

    ['Veracruz', 'Festival Internacional del Son Jarocho', '2026-12-08',
        'La reunión más importante del son jarocho en Tlacotalpan, Patrimonio de la Humanidad, con fandangos, jaranas y zapateado.',
        'https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?q=80&w=600&auto=format&fit=crop', ''],

    ['Zacatecas', 'Festival de Morismas de Bracho', '2026-08-28',
        'La representación más grande del mundo de la batalla entre moros y cristianos, con más de 10,000 participantes en Zacatecas.',
        'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=600&auto=format&fit=crop', ''],
];

try {
    $stmt = $pdo->prepare(
        "INSERT INTO mexico_events (state_name, event_title, event_date, description, image_url, official_site_url)
         VALUES (:state, :title, :date, :desc, :img, :url)"
    );

    $count = 0;
    foreach ($events as $e) {
        $stmt->execute([
            ':state' => $e[0],
            ':title' => $e[1],
            ':date'  => $e[2],
            ':desc'  => $e[3],
            ':img'   => $e[4],
            ':url'   => $e[5],
        ]);
        $count++;
    }

    echo "✓ Se insertaron $count eventos adicionales correctamente.\n";

} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
