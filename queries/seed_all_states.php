<?php
/**
 * Seed de eventos para los 32 estados de México
 * Ejecutar desde la raíz del proyecto: php queries/seed_all_states.php
 */
require_once __DIR__ . '/../includes/conexion.php';

$events = [

    // ── AGUASCALIENTES ──────────────────────────────────────────────────────
    ['Aguascalientes', 'Feria Nacional de San Marcos', '2026-04-20',
        'La feria más grande e importante de México con más de 190 años de historia, conciertos masivos, jaripeos, peleas de gallo y artesanías hidrocálidas.',
        'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=600&auto=format&fit=crop',
        'https://fnsm.mx/'],
    ['Aguascalientes', 'Festival de las Calaveras', '2026-10-31',
        'Celebración del Día de Muertos con desfile monumental de catrinas, altares de gran formato y actividades culturales en el centro histórico.',
        'https://images.unsplash.com/photo-1508361001413-7a9dca21d08a?q=80&w=600&auto=format&fit=crop',
        ''],

    // ── BAJA CALIFORNIA ─────────────────────────────────────────────────────
    ['Baja California', 'Festival de Vino y Gastronomía Valle de Guadalupe', '2026-07-10',
        'Degustación de vinos de la región con gastronomía de talla mundial en el corazón del Valle de Guadalupe, la Napa Valley de México.',
        'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=600&auto=format&fit=crop',
        ''],
    ['Baja California', 'Tijuana Innovadora', '2026-10-15',
        'El evento de innovación y tecnología más importante del noroeste de México, con conferencias, startups y cultura fronteriza.',
        'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop',
        ''],

    // ── BAJA CALIFORNIA SUR ─────────────────────────────────────────────────
    ['Baja California Sur', 'Avistamiento de Ballenas en San Ignacio', '2026-04-01',
        'Temporada de ballenas grises en la Laguna de San Ignacio, Patrimonio de la Humanidad, donde las ballenas se acercan a los pequeños botes.',
        'https://images.unsplash.com/photo-1568430462989-44163eb1752f?q=80&w=600&auto=format&fit=crop',
        ''],
    ['Baja California Sur', 'Festival del Dorado Los Cabos', '2026-05-15',
        'Torneo de pesca deportiva y festival marino en Los Cabos con competencias, música en vivo y gastronomía del mar.',
        'https://images.unsplash.com/photo-1504805572947-34fad45aed93?q=80&w=600&auto=format&fit=crop',
        ''],

    // ── CAMPECHE ────────────────────────────────────────────────────────────
    ['Campeche', 'Carnaval de Campeche', '2027-02-13',
        'Uno de los carnavales más coloridos y antiguos de México, con comparsas, disfraces espectaculares y música tropical en el malecón.',
        'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=600&auto=format&fit=crop',
        ''],
    ['Campeche', 'Festival de las Ánimas Campeche', '2026-10-31',
        'Celebración del Día de Muertos en la Zona Arqueológica de Edzná y el centro histórico amurallado de Campeche, con música y altares.',
        'https://images.unsplash.com/photo-1508361001413-7a9dca21d08a?q=80&w=600&auto=format&fit=crop',
        ''],

    // ── CHIAPAS ─────────────────────────────────────────────────────────────
    ['Chiapas', 'Feria de la Candelaria San Cristóbal', '2026-04-25',
        'Gran feria ganadera, artesanal y cultural en San Cristóbal de las Casas con tradiciones tzotziles y tzeltales de los Altos de Chiapas.',
        'https://images.unsplash.com/photo-1594911417539-77a28e5557b7?q=80&w=600&auto=format&fit=crop',
        ''],
    ['Chiapas', 'Festival de Cacao y Chocolate de Chiapas', '2026-07-18',
        'Celebración del cacao en Chiapas, cuna del chocolate mesoamericano, con degustaciones, talleres artesanales de chocolatería y música regional.',
        'https://images.unsplash.com/photo-1481391243133-f96216dcb5d2?q=80&w=600&auto=format&fit=crop',
        ''],

    // ── CHIHUAHUA ───────────────────────────────────────────────────────────
    ['Chihuahua', 'Barrancas del Cobre Adventure Fest', '2026-10-10',
        'Festival de aventura y turismo extremo en la Sierra Tarahumara con ciclismo, senderismo, escalada y cultura rarámuri.',
        'https://images.unsplash.com/photo-1533130061792-64b345e4a833?q=80&w=600&auto=format&fit=crop',
        ''],
    ['Chihuahua', 'Festival Cultural Chihuahua', '2026-08-01',
        'Festival multidisciplinario con espectáculos de artes escénicas, plásticas y musicales en la capital del estado más grande de México.',
        'https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?q=80&w=600&auto=format&fit=crop',
        ''],

    // ── COAHUILA ────────────────────────────────────────────────────────────
    ['Coahuila', 'Feria de la Vendimia de Parras', '2026-08-01',
        'Celebración vitivinícola en Parras de la Fuente, donde se encuentra la viticultura más antigua de América desde 1597.',
        'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=600&auto=format&fit=crop',
        ''],
    ['Coahuila', 'Festival Internacional de las Artes de Coahuila', '2026-05-20',
        'Festival cultural en Saltillo con teatro, danza, música y exposiciones de artes plásticas en la Capital Cultural del Norte.',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop',
        ''],

    // ── COLIMA ──────────────────────────────────────────────────────────────
    ['Colima', 'Feria de Todos Santos Colima', '2026-10-29',
        'Feria tradicional de la ciudad de Colima con artesanías de cocodrilo, tuba, gastronomía y música de marimba y tambora.',
        'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=600&auto=format&fit=crop',
        ''],
    ['Colima', 'Festival de la Tortuga Marina de Manzanillo', '2026-09-15',
        'Liberación de tortugas marinas en las playas de Manzanillo con talleres de conservación ambiental y avistamiento nocturno.',
        'https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=600&auto=format&fit=crop',
        ''],

    // ── DURANGO ─────────────────────────────────────────────────────────────
    ['Durango', 'Festival Internacional de Cine de Durango', '2026-07-05',
        'Muestra cinematográfica internacional en la tierra del cine de vaqueros mexicano, con proyecciones al aire libre y alfombra roja.',
        'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=600&auto=format&fit=crop',
        ''],
    ['Durango', 'Feria Nacional Francisco Villa', '2026-07-15',
        'Gran feria estatal con jaripeos, charreadas, exposición ganadera y conciertos masivos en la ciudad de Durango.',
        'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=600&auto=format&fit=crop',
        ''],

    // ── GUANAJUATO ──────────────────────────────────────────────────────────
    ['Guanajuato', 'Festival Internacional Cervantino', '2026-10-08',
        'El festival de artes más importante de América Latina, celebrado en los callejones y teatros de Guanajuato en honor a Cervantes.',
        'https://images.unsplash.com/photo-1590930337357-194d21695426?q=80&w=600&auto=format&fit=crop',
        'https://festivalcervantino.gob.mx/'],
    ['Guanajuato', 'Festival Internacional del Globo de León', '2026-11-12',
        'Uno de los festivales de globos aerostáticos más grandes del mundo, con más de 200 globos iluminando el cielo del Parque Metropolitano.',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop',
        ''],
    ['Guanajuato', 'Festival Día de Muertos en Guanajuato', '2026-10-31',
        'Espectáculo de videomapping, callejoneadas y altares monumentales en los icónicos callejones del centro histórico Patrimonio de la Humanidad.',
        'https://images.unsplash.com/photo-1508361001413-7a9dca21d08a?q=80&w=600&auto=format&fit=crop',
        ''],

    // ── GUERRERO ────────────────────────────────────────────────────────────
    ['Guerrero', 'Festival de la Cultura del Mar Acapulco', '2026-05-10',
        'Celebración costera en Acapulco con música tropical, gastronomía marina, buceo en el arrecife y los icónicos Clavadistas de La Quebrada.',
        'https://images.unsplash.com/photo-1504805572947-34fad45aed93?q=80&w=600&auto=format&fit=crop',
        ''],
    ['Guerrero', 'Torneo Internacional de Pesca Zihuatanejo', '2026-06-20',
        'Competencia de pesca deportiva de altura en las ricas aguas del Pacífico de Zihuatanejo con premios en efectivo y festival de mariscos.',
        'https://images.unsplash.com/photo-1568430462989-44163eb1752f?q=80&w=600&auto=format&fit=crop',
        ''],

    // ── HIDALGO ─────────────────────────────────────────────────────────────
    ['Hidalgo', 'Festival del Xantolo Huasteca', '2026-10-31',
        'La celebración del Día de Muertos más auténtica de la Huasteca Hidalguense con danzas de huehues, ofrendas colectivas y música de huapango.',
        'https://images.unsplash.com/photo-1508361001413-7a9dca21d08a?q=80&w=600&auto=format&fit=crop',
        ''],
    ['Hidalgo', 'Carnaval de Huejutla', '2026-04-05',
        'Desfile de comparsas y bailes tradicionales en la capital de la Huasteca Hidalguense con música de huapango arribeño.',
        'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=600&auto=format&fit=crop',
        ''],

    // ── JALISCO ─────────────────────────────────────────────────────────────
    ['Jalisco', 'Festival Internacional Mariachi y Charrería', '2026-08-28',
        'La celebración mundial del mariachi en Guadalajara, Patrimonio Cultural Inmaterial de la Humanidad, con serenatas y concursos.',
        'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?q=80&w=600&auto=format&fit=crop',
        ''],
    ['Jalisco', 'Feria Internacional del Libro de Guadalajara', '2026-11-28',
        'La reunión editorial más importante de Iberoamérica con más de 800,000 visitantes, miles de editoriales y autores de todo el mundo.',
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600&auto=format&fit=crop',
        'https://www.fil.com.mx/'],
    ['Jalisco', 'Festival del Tequila en la Cuna del Tequila', '2026-11-22',
        'Celebración en Tequila, Jalisco, con destilerías abiertas, recorridos en la ruta del agave, música de mariachi y degustaciones premium.',
        'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=600&auto=format&fit=crop',
        ''],

    // ── CIUDAD DE MÉXICO ────────────────────────────────────────────────────
    ['Mexico City', 'Gran Premio de México F1', '2026-10-25',
        'La Fórmula 1 regresa al Autódromo Hermanos Rodríguez con la pasión y el espectáculo del público mexicano y artistas internacionales.',
        'https://images.unsplash.com/photo-1529528753239-2a94562512f4?q=80&w=600&auto=format&fit=crop',
        'https://www.mexicogp.mx/'],
    ['Mexico City', 'Día de Muertos en el Zócalo', '2026-10-31',
        'Altar monumental, desfile de catrinas por Paseo de la Reforma y actividades culturales en el corazón histórico de la capital.',
        'https://images.unsplash.com/photo-1508361001413-7a9dca21d08a?q=80&w=600&auto=format&fit=crop',
        ''],
    ['Mexico City', 'Festival del Centro Histórico de México', '2026-03-27',
        'Festival de artes escénicas, música y cultura en los espacios históricos del corazón de la ciudad más grande de América Latina.',
        'https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?q=80&w=600&auto=format&fit=crop',
        ''],

    // ── ESTADO DE MÉXICO ────────────────────────────────────────────────────
    ['México', 'Festival de Globos de Cantoya en Metepec', '2026-10-18',
        'Festividad tradicional con el lanzamiento nocturno de globos de cantoya de papel iluminando el cielo sobre el pueblo mágico de Metepec.',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop',
        ''],
    ['México', 'Feria del Alfeñique de Toluca', '2026-10-28',
        'La feria más dulce de México donde artesanos crean figuras de azúcar en forma de calaveras, animales y objetos típicos del Día de Muertos.',
        'https://images.unsplash.com/photo-1508361001413-7a9dca21d08a?q=80&w=600&auto=format&fit=crop',
        ''],

    // ── MICHOACÁN ───────────────────────────────────────────────────────────
    ['Michoacán', 'Día de Muertos en Pátzcuaro y Janitzio', '2026-11-01',
        'La celebración más emotiva del Día de Muertos en México: velación en los panteones de la isla de Janitzio sobre el lago de Pátzcuaro.',
        'https://images.unsplash.com/photo-1508361001413-7a9dca21d08a?q=80&w=600&auto=format&fit=crop',
        ''],
    ['Michoacán', 'Festival Internacional de Órgano de Morelia', '2026-08-15',
        'Conciertos de música sacra y clásica en la majestuosa Catedral de Morelia y otras iglesias históricas de la Ciudad Patrimonio.',
        'https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?q=80&w=600&auto=format&fit=crop',
        ''],

    // ── MORELOS ─────────────────────────────────────────────────────────────
    ['Morelos', 'Carnaval de Tepoztlán', '2026-05-03',
        'La danza del Chinelo y festejo prehispánico-colonial en el pueblo mágico de Tepoztlán, con disfraces de burladores de conquistadores.',
        'https://images.unsplash.com/photo-1594911417539-77a28e5557b7?q=80&w=600&auto=format&fit=crop',
        ''],
    ['Morelos', 'Festival Cultural de Cuernavaca', '2026-04-12',
        'Celebración de las artes en la Ciudad de la Eterna Primavera con música en jardines históricos, danza y gastronomía morelense.',
        'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=600&auto=format&fit=crop',
        ''],

    // ── NAYARIT ─────────────────────────────────────────────────────────────
    ['Nayarit', 'Festival de Surf de Sayulita', '2026-07-20',
        'Competencia de surf en las olas de Sayulita, pueblo mágico surf-bohemio, con música en vivo, comida de playa y ambiente tropical.',
        'https://images.unsplash.com/photo-1504805572947-34fad45aed93?q=80&w=600&auto=format&fit=crop',
        ''],
    ['Nayarit', 'Semana del Arte Wixáritari', '2026-06-01',
        'Exposición y venta de artesanías huicholas en Tepic: el mítico arte de chaquira y estambre que representa la cosmovisión peyotero-solar.',
        'https://images.unsplash.com/photo-1594911417539-77a28e5557b7?q=80&w=600&auto=format&fit=crop',
        ''],

    // ── NUEVO LEÓN ──────────────────────────────────────────────────────────
    ['Nuevo León', 'Festival Santa Lucía Monterrey', '2026-09-10',
        'Festival de las artes a cielo abierto en el parque lineal Santa Lucía de Monterrey, con conciertos, danza, teatro y exposiciones.',
        'https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?q=80&w=600&auto=format&fit=crop',
        ''],
    ['Nuevo León', 'Feria Internacional del Libro de Monterrey', '2026-10-03',
        'Gran evento editorial y cultural en la Sultana del Norte con cientos de editoriales, autores nacionales e internacionales y foros literarios.',
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600&auto=format&fit=crop',
        ''],

    // ── OAXACA ──────────────────────────────────────────────────────────────
    ['Oaxaca', 'Guelaguetza', '2026-07-20',
        'La máxima fiesta de los oaxaqueños: danzas de los ocho valles, trajes típicos bordados y tradición en el Auditorio del Cerro del Fortín.',
        'https://images.unsplash.com/photo-1594911417539-77a28e5557b7?q=80&w=600&auto=format&fit=crop',
        'https://www.oaxaca.gob.mx/guelaguetza/'],
    ['Oaxaca', 'Noche de Rábanos', '2026-12-23',
        'Concurso único en el mundo donde artesanos tallan rábanos gigantes en elaboradas escenas: nativos, navideñas y de la historia oaxaqueña.',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop',
        ''],
    ['Oaxaca', 'Festival del Mezcal Oaxaqueño', '2026-07-25',
        'Degustación y cultura del mezcal artesanal: encuentro de maestros mezcaleros de todas las regiones de Oaxaca con música de banda y marimba.',
        'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=600&auto=format&fit=crop',
        ''],

    // ── PUEBLA ──────────────────────────────────────────────────────────────
    ['Puebla', 'Festival 5 de Mayo en Puebla', '2026-05-05',
        'Recreación histórica de la Batalla de Puebla de 1862, con danzas regionales, música de bandas y gastronomía poblana tradicional.',
        'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=600&auto=format&fit=crop',
        ''],
    ['Puebla', 'Festival de Talavera de Puebla', '2026-09-05',
        'Exposición y feria de la cerámica talavera de Puebla, Patrimonio Cultural Inmaterial de la Humanidad, con más de 400 años de tradición.',
        'https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?q=80&w=600&auto=format&fit=crop',
        ''],

    // ── QUERÉTARO ───────────────────────────────────────────────────────────
    ['Querétaro', 'Festival de Quesos y Vinos de Tequisquiapan', '2026-08-22',
        'Encuentro gastronómico en el pueblo mágico de Tequisquiapan con los mejores quesos artesanales y vinos del Bajío mexicano.',
        'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=600&auto=format&fit=crop',
        ''],
    ['Querétaro', 'Festival de la Vendimia del Semidesierto', '2026-08-05',
        'Celebración de la cosecha de uva en los viñedos del semidesierto queretano con catas de vino, gastronomía y conciertos al atardecer.',
        'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=600&auto=format&fit=crop',
        ''],

    // ── QUINTANA ROO ────────────────────────────────────────────────────────
    ['Quintana Roo', 'Festival del Caribe en Cancún', '2026-06-20',
        'Celebración de la música caribeña en Cancún con ritmos de salsa, cumbia, reggae y merengue, gastronomía del Caribe y arte al aire libre.',
        'https://images.unsplash.com/photo-1504805572947-34fad45aed93?q=80&w=600&auto=format&fit=crop',
        ''],
    ['Quintana Roo', 'Reef Check en el Arrecife de Cozumel', '2026-05-15',
        'Monitoreo del segundo arrecife de coral más grande del mundo y festival de conciencia ambiental en la isla de Cozumel.',
        'https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=600&auto=format&fit=crop',
        ''],

    // ── SAN LUIS POTOSÍ ─────────────────────────────────────────────────────
    ['San Luis Potosí', 'Semana Santa en Real de Catorce', '2026-04-02',
        'Peregrinación masiva y festividades religiosas en el mítico pueblo fantasma de Real de Catorce, lugar sagrado para los wixaritari.',
        'https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?q=80&w=600&auto=format&fit=crop',
        ''],
    ['San Luis Potosí', 'Festival de Danza Contemporánea SLP', '2026-09-01',
        'Muestra nacional e internacional de danza contemporánea en el icónico Teatro de la Paz y espacios públicos de San Luis Potosí.',
        'https://images.unsplash.com/photo-1594911417539-77a28e5557b7?q=80&w=600&auto=format&fit=crop',
        ''],

    // ── SINALOA ─────────────────────────────────────────────────────────────
    ['Sinaloa', 'Carnaval de Mazatlán', '2027-02-06',
        'El tercer carnaval más grande del mundo, con quema del Mal Humor, desfile de carros alegóricos, comparsas y artistas internacionales.',
        'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=600&auto=format&fit=crop',
        ''],
    ['Sinaloa', 'Festival Cultural Sinaloa', '2026-10-12',
        'Celebración de las artes y la cultura sinaloense con música de banda, teatro, exposiciones y gastronomía de mariscos en Culiacán.',
        'https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?q=80&w=600&auto=format&fit=crop',
        ''],

    // ── SONORA ──────────────────────────────────────────────────────────────
    ['Sonora', 'Festival del Desierto Sonora', '2026-04-25',
        'Celebración de la biodiversidad única del Desierto de Sonora con senderismo, astronomía nocturna y gastronomía de la cocina serrana.',
        'https://images.unsplash.com/photo-1533130061792-64b345e4a833?q=80&w=600&auto=format&fit=crop',
        ''],
    ['Sonora', 'Feria Ganadera de Hermosillo', '2026-11-05',
        'Exposición ganadera y agrícola con rodeos, palenque, artesanías de la cultura yoreme y productos regionales de la tierra del corte norteño.',
        'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=600&auto=format&fit=crop',
        ''],

    // ── TABASCO ─────────────────────────────────────────────────────────────
    ['Tabasco', 'Festival de Cacao y Chocolate de Tabasco', '2026-10-28',
        'Celebración del cacao tabasqueño — madre del chocolate— con degustaciones artesanales, talleres de chocolatería y música jarocha y tropical.',
        'https://images.unsplash.com/photo-1481391243133-f96216dcb5d2?q=80&w=600&auto=format&fit=crop',
        ''],
    ['Tabasco', 'Feria Tabasco en Villahermosa', '2026-04-25',
        'La feria más importante del sureste mexicano con exposición agropecuaria, pabellones artesanales, gastronomía de pejelagarto y conciertos.',
        'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=600&auto=format&fit=crop',
        ''],

    // ── TAMAULIPAS ──────────────────────────────────────────────────────────
    ['Tamaulipas', 'Pesca de Lobina en Guerrero Tamaulipas', '2026-03-28',
        'Torneo internacional de pesca de lobina en la presa Marte R. Gómez, reconocida mundialmente entre los pescadores deportivos.',
        'https://images.unsplash.com/photo-1568430462989-44163eb1752f?q=80&w=600&auto=format&fit=crop',
        ''],
    ['Tamaulipas', 'Festival Internacional de Jazz de Tampico', '2026-08-10',
        'El festival de jazz más importante del norte de México en el histórico puerto de Tampico con artistas nacionales e internacionales.',
        'https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?q=80&w=600&auto=format&fit=crop',
        ''],

    // ── TLAXCALA ────────────────────────────────────────────────────────────
    ['Tlaxcala', 'Carnaval de Tlaxcala Huehues', '2027-02-27',
        'Los carnavales más longevos de México con las danzas de huehues: disfraces burlones de conquistadores españoles y máscaras de madera.',
        'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=600&auto=format&fit=crop',
        ''],
    ['Tlaxcala', 'Festival de la Mole Tlaxcalteca', '2026-07-12',
        'Concurso y muestra gastronómica del mole negro, rojo y amarillo tlaxcalteca en el Museo Regional de Tlaxcala con degustaciones abiertas.',
        'https://images.unsplash.com/photo-1481391243133-f96216dcb5d2?q=80&w=600&auto=format&fit=crop',
        ''],

    // ── VERACRUZ ────────────────────────────────────────────────────────────
    ['Veracruz', 'Carnaval de Veracruz', '2027-02-13',
        'El carnaval más antiguo del continente americano, en el Puerto de Veracruz, con el pregón del Rey Momo, batallon de quema y comparsas.',
        'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=600&auto=format&fit=crop',
        ''],
    ['Veracruz', 'Festival del Café de Coatepec', '2026-11-20',
        'Degustación del mejor café de altura del mundo en el pueblo mágico de Coatepec, con baristas, cataciones, música de son jarocho y danzón.',
        'https://images.unsplash.com/photo-1481391243133-f96216dcb5d2?q=80&w=600&auto=format&fit=crop',
        ''],

    // ── YUCATÁN ─────────────────────────────────────────────────────────────
    ['Yucatán', 'Equinoccio de Primavera en Chichén Itzá', '2027-03-21',
        'El descenso de la Serpiente Emplumada: el juego de luz y sombra de Kukulcán en la pirámide El Castillo, Patrimonio de la Humanidad.',
        'https://images.unsplash.com/photo-1518182170546-0766ba6f9285?q=80&w=600&auto=format&fit=crop',
        'https://www.inah.gob.mx/zonas/146-zona-arqueologica-de-chichen-itza'],
    ['Yucatán', 'Hanal Pixán: Festival de las Ánimas en Mérida', '2026-10-31',
        'Celebración maya del Día de Muertos con altares de ofrenda, procesiones en el cementerio general y gastronomía yucateca de mukbil pollo.',
        'https://images.unsplash.com/photo-1508361001413-7a9dca21d08a?q=80&w=600&auto=format&fit=crop',
        ''],
    ['Yucatán', 'Mérida en Domingo', '2026-04-05',
        'Experiencia cultural semanal en el corazón de la Ciudad Blanca: bailes de jarana, recetas de cocina yucateca y exposición de artesanías mayas.',
        'https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?q=80&w=600&auto=format&fit=crop',
        ''],

    // ── ZACATECAS ───────────────────────────────────────────────────────────
    ['Zacatecas', 'Feria Nacional de Zacatecas', '2026-08-25',
        'Gran feria patronal en honor a la Virgen del Patrocinio con peleas de gallos, jaripeos, exposición artesanal y conciertos en la ciudad Patrimonio.',
        'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=600&auto=format&fit=crop',
        ''],
    ['Zacatecas', 'Festival Cultural Zacatecas', '2026-08-15',
        'Festividades culturales con teatro de calle, danza folclórica y música de cámara en los espacios históricos de la ciudad minera del siglo XVI.',
        'https://images.unsplash.com/photo-1590930337357-194d21695426?q=80&w=600&auto=format&fit=crop',
        ''],
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

    echo "✓ Se insertaron $count eventos correctamente.\n";

} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
