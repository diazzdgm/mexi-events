-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 04-03-2026 a las 18:43:35
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `mexi_events`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comentarios`
--

CREATE TABLE `comentarios` (
  `id` int(11) NOT NULL,
  `destino_id` int(11) NOT NULL,
  `usuario` varchar(100) NOT NULL,
  `comentario` text NOT NULL,
  `calificacion` int(11) DEFAULT NULL CHECK (`calificacion` between 1 and 5),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comments`
--

CREATE TABLE `comments` (
  `id` int(11) NOT NULL,
  `event_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `comment` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `comments`
--

INSERT INTO `comments` (`id`, `event_id`, `user_id`, `comment`, `created_at`) VALUES
(2, 25, 9, 'sgs', '2026-02-26 21:28:39'),
(3, 41, 1, 'bhkj ', '2026-03-04 02:23:13'),
(4, 56, 10, 'está bien feo\\', '2026-03-04 04:00:37');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `destinos`
--

CREATE TABLE `destinos` (
  `id` int(11) NOT NULL,
  `titulo` varchar(100) NOT NULL,
  `descripcion` text NOT NULL,
  `estado` varchar(50) NOT NULL,
  `fecha` date NOT NULL,
  `ubicacion` varchar(150) NOT NULL,
  `categoria` varchar(50) NOT NULL,
  `imagen_url` varchar(255) DEFAULT NULL,
  `popularidad` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `destinos`
--

INSERT INTO `destinos` (`id`, `titulo`, `descripcion`, `estado`, `fecha`, `ubicacion`, `categoria`, `imagen_url`, `popularidad`, `created_at`) VALUES
(1, 'Festival Cervantino', 'El festival cultural más importante de América Latina.', 'Guanajuato', '2024-10-11', 'Guanajuato Capital', 'Cultural', 'uploads/cervantino.jpg', 85, '2026-02-26 00:05:01'),
(2, 'Día de Muertos', 'Celebración tradicional mexicana.', 'Michoacán', '2024-11-01', 'Pátzcuaro', 'Tradición', 'uploads/muertos.jpg', 95, '2026-02-26 00:05:01'),
(3, 'Guelaguetza', 'La máxima fiesta de los oaxaqueños.', 'Oaxaca', '2024-07-22', 'Auditorio Guelaguetza', 'Cultural', 'uploads/guelaguetza.jpg', 90, '2026-02-26 00:05:01');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `event_likes`
--

CREATE TABLE `event_likes` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `event_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `event_likes`
--

INSERT INTO `event_likes` (`id`, `user_id`, `event_id`, `created_at`) VALUES
(7, 9, 25, '2026-02-26 21:28:35'),
(8, 1, 27, '2026-02-27 04:08:56'),
(9, 1, 73, '2026-03-04 02:25:16'),
(10, 10, 56, '2026-03-04 04:00:22'),
(11, 1, 22, '2026-03-04 04:03:05'),
(12, 1, 23, '2026-03-04 04:03:08');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `event_ratings`
--

CREATE TABLE `event_ratings` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `event_id` int(11) NOT NULL,
  `rating` tinyint(4) NOT NULL CHECK (`rating` >= 1 and `rating` <= 5),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `event_ratings`
--

INSERT INTO `event_ratings` (`id`, `user_id`, `event_id`, `rating`, `created_at`, `updated_at`) VALUES
(9, 9, 25, 4, '2026-02-26 21:28:37', '2026-02-26 21:28:37'),
(10, 10, 56, 3, '2026-03-04 04:00:29', '2026-03-04 04:00:29');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mexico_events`
--

CREATE TABLE `mexico_events` (
  `id` int(11) NOT NULL,
  `state_name` varchar(100) NOT NULL,
  `event_title` varchar(255) NOT NULL,
  `event_date` date NOT NULL,
  `description` text DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `official_site_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `mexico_events`
--

INSERT INTO `mexico_events` (`id`, `state_name`, `event_title`, `event_date`, `description`, `image_url`, `official_site_url`, `created_at`) VALUES
(19, 'Chiapas', 'Fiesta Grande de Chiapa de Corzo', '2026-01-08', 'Es una de las festividades más antiguas de México, reconocida por la UNESCO. Los \"Parachicos\" recorren las calles con máscaras de madera esculpida, pelucas de ixtle y sarapes coloridos, bailando al ritmo de tambor y flauta de carrizo en honor a San Sebastián.', 'https://www.mexicodesconocido.com.mx/wp-content/uploads/2020/01/Fiesta-Grande-Chiapa-de-Corzo-HQ-19.jpg', 'https://www.chiapadecorzo.gob.mx/', '2026-02-26 19:00:02'),
(20, 'Chiapas', 'Festival Internacional Cervantino ', '2026-10-14', 'San Cristóbal de las Casas se convierte en un escenario gigante donde se presentan compañías de danza, teatro y música de todo el mundo. El ambiente destaca por la arquitectura colonial y la presencia de comunidades indígenas locales.', 'https://th.bing.com/th/id/OIP.eeQk73MGrG2Wl-txn92tCQHaD4?w=304&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3', 'https://www.turismochiapas.gob.mx/', '2026-02-26 19:01:04'),
(21, 'Chiapas', 'Feria de la Primavera y de la Paz', '2026-06-25', 'Celebrada en San Cristóbal, incluye desfiles de carros alegóricos, la coronación de la reina y eventos culturales que fusionan la tradición coleta con la modernidad.', 'https://th.bing.com/th/id/OIP.vJ0NS6Or1lBdt37iLR6ZQAHaFj?w=255&h=191&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3', 'https://www.google.com/search?q=https://www.dondehayferia.com/feria-de-la-primavera-y-de-la-paz-2024&authuser=2', '2026-02-26 19:03:37'),
(22, 'Quintana Roo', 'Festival de Jazz de la Riviera Maya', '2026-11-26', 'Un evento internacional gratuito que se realiza directamente en la arena de Playa del Carmen. Reúne a leyendas del jazz y nuevos talentos, creando una atmósfera bohemia bajo las estrellas del Caribe.', 'https://rivieramaya.mx/fotos/2018/08/riviera-maya-jazz-festival-2018.webp', 'https://www.google.com/search?q=https://rivieramayajazzfestival.com/&authuser=2', '2026-02-26 19:04:42'),
(23, 'Quintana Roo', 'Travesía Sagrada Maya', '2026-05-19', 'Cientos de canoeros recrean el peregrinaje ritual que realizaban los antiguos mayas desde Xcaret hasta Cozumel para adorar a la diosa Ixchel. Es una representación épica de fuerza física y espiritualidad prehispánica', 'https://storage.googleapis.com/gx-global-cms/events/77f0bba1-bea5-4786-91f7-ed703d0698f1.jpg', 'https://www.travesiasagradamaya.com.mx/', '2026-02-26 19:05:36'),
(24, 'Quintana Roo', 'Carnaval de Cozumel', '2026-02-19', 'Con más de 140 años de historia, destaca por sus \"comparsas\" (grupos de baile) que compiten con vestuarios de plumas y lentejuelas, además de carros alegóricos que recorren el malecón frente al mar turquesa.', 'https://static.wixstatic.com/media/d5097c_4acf503db3724ce0b267ff36a3104d98~mv2.jpg/v1/fill/w_863,h_835,fp_0.48_0.40,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Cozumel-Deep-Sea-Fishing-Charter-Guest-With-Big-Catch_edited.jpg', 'https://www.google.com/search?q=https://www.cozumel.travel/&authuser=2', '2026-02-26 19:06:40'),
(25, 'Yucatán', 'Paseo de las Ánimas', '2026-10-31', 'Miles de personas vestidas con el terno yucateco tradicional y rostros pintados como calaveras caminan en silencio desde el Cementerio General de Mérida. La ciudad se llena de altares con comida típica como el \"pib\"', 'https://th.bing.com/th/id/OIP.r7fdgXJ6Nq_5fCxV_pdlFwHaEB?w=316&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3', 'https://www.merida.gob.mx/animas/', '2026-02-26 19:08:49'),
(26, 'Yucatán', 'La Noche Blanca', '2026-06-13', 'Durante una noche completa, los museos, galerías y parques de Mérida abren sus puertas para conciertos, instalaciones de luz y teatro callejero, fomentando el \"arte a pie\" en el centro histórico.', 'https://www.merida.gob.mx/nocheblanca/assets/img/elements/2025/logo-nocheBlanca2025.png', 'https://www.merida.gob.mx/nocheblanca/', '2026-02-26 19:09:37'),
(27, 'Yucatán', 'Equinoccio de Primavera en Chichén Itzá', '2026-03-21', 'Miles de visitantes se reúnen para observar el descenso de Kukulcán (la serpiente emplumada), un efecto de luces y sombras creado por los antiguos mayas en la pirámide de El Castillo.', 'https://www.inah.gob.mx/images/banners/2026/20260204_banner_Rostros.jpg', 'https://www.inah.gob.mx/', '2026-02-26 19:10:40'),
(28, 'Campeche', 'Carnaval de Campeche', '2026-02-19', 'Es el más antiguo de México. Inicia con el \"Entierro del Mal Humor\" (representado por un muñeco de pirata) y destaca por el desfile de flores y el baile de \"El Sombrero\".', 'https://campeche.travel/wp-content/uploads/2020/02/logo-campeche-web-02.png', 'https://campeche.travel/', '2026-02-26 19:11:55'),
(29, 'Campeche', 'Festival del Centro Histórico', '2026-12-10', 'Conciertos de música de cámara, ópera y jazz se llevan a cabo dentro de los antiguos fuertes y murallas de la ciudad, aprovechando la acústica y el entorno fortificado frente al mar.', 'https://www.culturacampeche.mx/wp-content/uploads/2026/01/Captura-de-pantalla-2026-01-19-144040.png', 'https://www.culturacampeche.com/', '2026-02-26 19:12:51'),
(30, 'Campeche', 'Feria de San Román', '2026-09-17', 'Una celebración en honor al Cristo Negro de San Román. Incluye serenatas, fuegos artificiales y una gran feria popular con comida típica campechana como los panuchos y el pan de cazón.', 'http://localhost:8000/mexi-events/public/uploads/69a09bd7e6bd27.23584007.mp4', 'https://campeche.travel/eventos/', '2026-02-26 19:14:30'),
(32, 'Tabasco', 'Feria Tabasco', '2026-04-16', 'Una de las ferias con mayor afluencia en el país. El momento cumbre es la elección de la \"Flor de Oro\", donde representantes de cada municipio compiten en un certamen lleno de pasión regional y desfiles de barcos alegóricos.', 'https://th.bing.com/th/id/OIP.Iys8a7AfrM2wnFpQOUb-9wHaE8?w=269&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3', 'https://feriatabasco.com.mx/', '2026-02-26 19:17:08'),
(33, 'Tabasco', 'Festival del Chocolate', '2026-11-17', 'Villahermosa celebra la herencia del cacao. Chefs internacionales y productores locales ofrecen catas, talleres y exhibiciones sobre cómo el cacao de la Chontalpa se convierte en chocolate de alta gama.', 'https://th.bing.com/th/id/OIF.3UJjwDTiIvP9EnLfrfAe9A?w=286&h=191&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3', 'https://visitetabasco.com/', '2026-02-26 19:17:54'),
(34, 'Tabasco', 'Danza del Pocho', '2026-02-27', 'Parte del Carnaval de Tenosique, es una danza prehispánica considerada la \"más rara del mundo\". Los participantes se cubren con hojas, flores y lodo para representar la lucha entre el bien y el mal.', 'https://tenosique.gob.mx/wp-content/uploads/2025/01/Presidenta-de-Tenosique-1024x801.png', 'http://www.tenosique.gob.mx/', '2026-02-26 19:19:49'),
(35, 'Oaxaca', 'Guelaguetza', '2026-07-20', 'En el Cerro del Fortín, las delegaciones de las 8 regiones de Oaxaca presentan sus bailes más emblemáticos (como la Danza de la Pluma o la Flor de Piña), regalando productos de su tierra al público.', 'https://th.bing.com/th/id/OIP.7XIRSVwTPAqzQ0zOm-SbCAHaEK?w=328&h=184&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3', 'https://www.oaxaca.travel/', '2026-02-27 00:29:36'),
(36, 'Oaxaca', 'Noche de Rábanos', '2026-12-23', 'Los hortelanos y floricultores tallan figuras increíblemente detalladas en rábanos gigantes, representando escenas navideñas o de la cultura oaxaqueña, compitiendo en la plaza principal de la ciudad', 'https://th.bing.com/th/id/OIP.ZfWY7VkCS1JKs7oktEwq0wHaEK?w=308&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3', 'https://www.municipiodeoaxaca.gob.mx/', '2026-02-27 00:31:45'),
(37, 'Oaxaca', 'Festival del Mezcal', '2026-07-15', 'Realizado simultáneamente a la Guelaguetza, es el punto de encuentro para probar cientos de variedades de mezcal artesanal, conociendo el proceso desde el horneado de la piña de agave hasta el destilado', 'http://localhost:8000/mexi-events/public/uploads/69a0e71c5438a9.15936957.mp4', 'https://www.oaxaca.travel/', '2026-02-27 00:34:00'),
(38, 'Veracruz', 'Carnaval de Veracruz', '2026-06-17', 'Conocido por su energía inagotable y la \"quema del mal humor\". Los desfiles por el malecón incluyen enormes carros alegóricos y grupos de samba y salsa que mantienen la fiesta día y noche.', 'https://th.bing.com/th/id/OIP._6LUIutZCO7vw7jpBNOvnQHaEK?w=321&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3', 'https://www.bing.com/ck/a?!&&p=6e9ee4528b7433b10c12f52cefc6c1c07d49fad67e97651e983751c8af1f3602JmltdHM9MTc3MjA2NDAwMA&ptn=3&ver=2&hsh=4&fclid=08f3bb86-d2f8-68cc-2a3b-ac8cd30969f4&psq=Carnaval+de+Veracruz&u=a1aHR0cHM6Ly9jYXJuYXZhbGRldmVyYWNydXpvZmljaWFsLmN', '2026-02-27 00:38:54'),
(39, 'Veracruz', 'Cumbre Tajín', '2026-03-26', 'Se realiza en Papantla para celebrar la llegada de la primavera. Incluye rituales de los Voladores de Papantla, talleres de medicina tradicional totonaca y conciertos de talla internacional entre ruinas arqueológicas', 'https://www.festivalcumbretajin.com.mx/wp-content/uploads/2025/03/VoladoresTajin.png', 'https://www.festivalcumbretajin.com.mx/', '2026-02-27 00:39:59'),
(40, 'Veracruz', 'Fiestas de la Candelaria', '2026-02-19', 'La Virgen es paseada por el río Papaloapan en una procesión náutica. Simultáneamente, se realizan encuentros de jaraneros y \"fandangos\" donde se baila zapateado sobre tarimas de madera', 'https://th.bing.com/th/id/OIP.qCJI-6aZMIFD9jdNQthggAHaEK?w=289&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3', 'https://www.veracruz.gob.mx/', '2026-02-27 00:41:18'),
(41, 'Guerrero', 'Gala de Pirotecnia en Acapulco', '2026-12-31', 'Un espectáculo masivo donde más de 10 puntos de disparo a lo largo de la bahía iluminan el cielo simultáneamente para recibir el año nuevo, atrayendo a miles de turistas a la arena.', 'http://visitacapulco.travel/wp-content/uploads/2023/09/safe-travels.svg', 'https://visitacapulco.travel/', '2026-02-27 00:43:10'),
(42, 'Guerrero', 'Tianguis Turístico', '2026-04-17', 'El evento de negocios turísticos más importante de México. Aunque es profesional, genera una gran exhibición cultural de todos los estados de la república con stands monumentales y presentaciones artísticas', 'https://cdn.prod.website-files.com/6524a2b6073ef164e08daaad/69026aab96e130d8750ed3a6_logo_tt26_menu_es.svg', 'https://www.tianguisturistico.com/', '2026-02-27 00:44:08'),
(43, 'Guerrero', 'Feria de la Bandera en Iguala', '2026-02-28', 'Conmemora la creación del lábaro patrio. Incluye una exposición de banderas históricas, ferias ganaderas, palenque de artistas y un desfile cívico-militar de gran relevancia nacional.', 'https://guerrerotravel.com/assets/images/logo/logo2.png', 'https://guerrerotravel.com/', '2026-02-27 00:45:10'),
(44, 'Puebla', 'Feria de Puebla', '2026-05-21', 'Celebrada en la zona de los Fuertes, cuenta con una cartelera masiva de artistas, exposición industrial y ganadera, y el tradicional desfile del 5 de mayo que conmemora la batalla contra el ejército francés', 'https://feria.puebla.gob.mx/images/mientras/PRX_WALLPAPER.png', 'https://feria.puebla.gob.mx/', '2026-02-27 00:49:03'),
(45, 'Puebla', 'Festival de las Ideas', '2026-03-26', 'Un foro internacional realizado en el Auditorio Metropolitano donde líderes mundiales en ciencia, tecnología y arte comparten conferencias inspiradoras en un formato dinámico y visualmente impactante.', 'https://festivaldelasideas.mx/img/Conferencista%201.jpg', 'https://festivaldelasideas.mx/', '2026-02-27 00:49:57'),
(46, 'Puebla', 'Festival del Chile en Nogada', '2026-08-22', 'Durante la temporada de cosecha de la nuez de Castilla y la granada, los restaurantes de todo el estado compiten por presentar la mejor versión de este platillo histórico creado por las monjas agustinas', 'https://th.bing.com/th/id/OIP.n719Mocnu62P98agRal_LgHaEo?w=316&h=197&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3', 'https://guia.visitpuebla.mx/', '2026-02-27 00:51:43'),
(47, 'Morelos', 'Carnaval de Yautepec', '2026-02-21', 'Destaca por el icónico \"Brinco del Chinelo\". Los danzantes visten túnicas de terciopelo bordadas con perlas y lentejuelas, y sombreros altos con plumas, saltando al ritmo de bandas de viento locales', 'https://visitmorelos.mx//source/DESTINOS/TEPOZTLAN.png', 'https://visitmorelos.mx/experiencias/general/morelos-descubre-todas-las-maravillas-de-este-estado', '2026-02-27 00:53:36'),
(48, 'Morelos', 'Festival Amanecer', '2026-03-19', 'Un evento holístico y musical en Tepoztlán que celebra el equinoccio. Combina yoga, meditación, música étnica y la mística de las montañas del Tepozteco.', 'https://cdn.projectexpedition.com/photos/5f134c82e190a_sized.jpg', 'https://www.projectexpedition.com/location/mexico/state-of-mexico/tepoztlan/', '2026-02-27 00:55:09'),
(49, 'Morelos', 'Feria de la Primavera en Cuernavaca', '2026-04-23', 'Exposición de flores de la región (la ciudad de la eterna primavera), palenque de artistas nacionales, gastronomía local y juegos mecánicos en un ambiente familiar.', 'https://cuernavaca.gob.mx/wp-content/uploads/2026/01/WhatsApp-Image-2026-01-30-at-12.03.25-PM.jpeg', 'https://cuernavaca.gob.mx/', '2026-02-27 00:57:07'),
(50, 'Tlaxcala', 'La Noche que Nadie Duerme', '2026-08-14', 'En Huamantla, los artesanos decoran más de 7 kilómetros de calles con tapetes hechos de aserrín multicolor, flores y semillas para el paso de la Virgen de la Caridad.', 'https://www.culturatlaxcala.com.mx/wp-content/uploads/2026/01/carteleraSC_01-797x1024.jpg', 'https://www.tlaxcalasiexiste.com.mx/', '2026-02-27 16:04:30'),
(51, 'Tlaxcala', 'Carnaval de Tlaxcala', '2026-03-27', 'Es famoso por la elegancia de los \"Catrines\" (danzantes con máscaras de madera que imitan rostros europeos y levitas) y las cuadrillas que ejecutan bailes de salón de origen francés.', 'https://www.culturatlaxcala.com.mx/wp-content/uploads/2026/02/cartelera_SC_2daFeb_01-797x1024.jpg', 'https://culturatlaxcala.com.mx/ ', '2026-02-27 16:05:34'),
(52, 'Tlaxcala', 'Feria de Tlaxcala', '2026-10-26', 'Coincide con el Día de Muertos y destaca por sus corridas de toros, la \"Gran Feria de Tlaxcala\" con exposiciones textiles y gastronómicas de los municipios del estado.', 'https://feriastlaxcala.com.mx/wp-content/uploads/2024/08/teatro-del-pueblo-feria-tlaxcala-2024.jpg', 'https://feriastlaxcala.com.mx/feria-tlaxcala-2024/', '2026-02-27 16:06:39'),
(53, 'Mexico City', 'Gran Desfile de Día de Muertos', '2026-10-31', 'Un desfile masivo con marionetas gigantes, carros alegóricos decorados con cempasúchil y miles de voluntarios caracterizados, que recorre desde el Paseo de la Reforma hasta el Zócalo.', 'http://localhost:8000/mexi-events/public/uploads/69a1c176d1a306.26914877.jpg', 'https://www.mexicocity.cdmx.gob.mx/', '2026-02-27 16:08:36'),
(54, 'Mexico City', 'Festival Vive Latino', '2026-03-14', 'El corazón de la música latina. Durante dos días, el Foro Sol recibe a las bandas de rock, pop y música alternativa más importantes de Iberoamérica, con un ambiente de energía pura.', 'https://networksites.livenationinternational.com/networksites/3b1dnkvy/dia_vl26.webp', 'https://www.vivelatino.com.mx/', '2026-02-27 16:09:31'),
(55, 'Mexico City', 'Feria Internacional del Libro', '2026-01-26', 'Una enorme plaza pública llena de carpas editoriales, foros de discusión y música, donde se busca democratizar la lectura en pleno corazón político y cultural del país.', 'https://www.cultura.cdmx.gob.mx/storage/app/uploads/public/697/ac3/b1e/thumb_42078_880_495_0_0_crop.jpeg', 'https://www.cultura.cdmx.gob.mx/', '2026-02-27 16:10:31'),
(56, 'México', 'Festival Internacional Quimera', '2026-10-09', 'Metepec se llena de arte. Las calles se convierten en galerías y los escenarios albergan desde música clásica hasta rock, siempre con la icónica figura del Árbol de la Vida como estandarte.', 'https://festivalero.com.mx/wp-content/uploads/2025/09/552772789_1387102660083657_1389590754534193380_n-682x1024.jpg', 'https://festivalero.com.mx/festival-quimera-metepec-2025/', '2026-02-27 16:12:39'),
(57, 'Michoacán', 'Noche de Muertos en Pátzcuaro/Janitzio', '2026-11-01', 'Una atmósfera sagrada donde los cementerios se iluminan solo con velas y se llenan de flores. Las canoas de mariposa en el lago añaden un toque mágico único en el mundo.', 'https://th.bing.com/th/id/OIP.Gpgg1C39151e2oVBSeyaaQHaEU?w=322&h=187&c=7&r=0&o=7&pid=1.7&rm=3', 'https://www.mexicodesconocido.com.mx/dia-de-muertos-en-janitzio-michoacan.html', '2026-02-27 16:14:02'),
(58, 'Colima', 'Fiestas de Mayo en Manzanillo', '2026-05-13', 'Celebran el aniversario de la fundación del puerto con eventos deportivos náuticos, conciertos masivos en la playa y exposiciones comerciales en el malecón.', 'https://visitmanzanillo.mx/wp-content/uploads/2023/08/fiestas-de-mayo-1170x658.png', 'https://visitmanzanillo.mx/fiestas-de-mayo/', '2026-02-27 16:14:56'),
(59, 'Jalisco', 'Encuentro Internacional del Mariachi', '2026-08-19', 'Guadalajara retumba con las mejores agrupaciones de mariachi del mundo. Incluye galas en el Teatro Degollado y charrería, el deporte nacional por excelencia.', 'https://www.mexicodesconocido.com.mx/wp-content/uploads/2025/08/Sombreros-monos-Charros-Y-De-Mariachis_1200-900x668.jpg', 'https://www.mexicodesconocido.com.mx/encuentro-internacional-del-mariachi-y-la-charreria-en-jalisco.html', '2026-02-27 16:16:06'),
(60, 'Guanajuato', 'Festival Internacional Cervantino', '2026-10-15', 'Durante tres semanas, las plazas, callejones y teatros de Guanajuato capital ofrecen ópera, danza contemporánea, teatro de calle y conciertos de música electrónica y jazz.', 'https://th.bing.com/th/id/OIP.Ielki4jSsvO2cy8aeIHcRAHaEJ?w=328&h=184&c=7&r=0&o=7&pid=1.7&rm=3', 'https://festivalcervantino.gob.mx/', '2026-02-27 16:17:39'),
(61, 'Querétaro', 'Festival Santiago de Querétaro', '2026-07-21', 'Celebra el aniversario de la ciudad con eventos artísticos en los patios de museos y plazas barrocas, destacando conciertos de música clásica y danza folclórica.', 'https://th.bing.com/th/id/OIP.pqrwpG0k1KZXi9Sg1gTFEgHaE7?w=258&h=180&c=7&r=0&o=7&pid=1.7&rm=3', 'https://municipiodequeretaro.gob.mx/secretarias/secretaria-de-cultura/festivales/festival-aniversario-de-santiago-de-queretaro/', '2026-02-27 16:19:06'),
(62, 'Hidalgo', 'Feria de San Francisco Pachuca', '2026-10-14', 'Cuenta con pabellones turísticos y artesanales que muestran la riqueza de los 7 pueblos mágicos de Hidalgo, además de una de las carteleras de artistas más nutridas del centro del país.', 'https://tse4.mm.bing.net/th/id/OIP.WRLBK-eXbnA6KuJQc_7t4AHaEK?rs=1&pid=ImgDetMain&o=7&rm=3', 'https://www.bing.com/ck/a?!&&p=e50580ab4bb555a2b0b488c7619c6db031cf37b6decb69e7814996962105f8b9JmltdHM9MTc3MjE1MDQwMA&ptn=3&ver=2&hsh=4&fclid=08f3bb86-d2f8-68cc-2a3b-ac8cd30969f4&psq=Feria+de+San+Francisco+Pachuca&u=a1aHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL0Zlc', '2026-02-27 16:20:28'),
(63, 'Nayarit', 'Festival Gourmet International', '2026-11-19', 'Riviera Nayarit se convierte en la capital culinaria de México, recibiendo a chefs con estrellas Michelin que colaboran en los mejores resorts de Nuevo Vallarta y Punta Mita.', 'https://festivalgourmet.com.mx/wp-content/uploads/2025/07/Festival-Gourmet-Internacional-Puerto-vallarta-2025-1-1024x1024.jpg', 'https://www.festivalgourmet.com.mx/', '2026-02-27 16:21:14'),
(64, 'Aguascalientes', 'Feria Nacional de San Marcos', '2026-05-14', 'La feria más grande de México. Incluye el serial taurino más importante del continente, un casino legal, una zona de antros masiva y el Foro de las Estrellas gratuito.', 'https://feriasanmarcos.mx/wp-content/uploads/2024/03/AnyConv.com__Recurso-3.webp', 'https://feriasanmarcos.mx/', '2026-02-27 16:22:25'),
(65, 'San Luis Potosí', 'Xantolo', '2026-11-19', 'El Día de Muertos en la Huasteca Potosina. Es una fiesta de reencuentro con los ancestros con máscaras de madera, música de huapango y ofrendas monumentales en medio de la selva', 'https://www.mexicodesconocido.com.mx/wp-content/uploads/2023/10/Diseno-sin-titulo-8-900x506.jpg', 'https://www.mexicodesconocido.com.mx/xantolo.html', '2026-02-27 16:23:08'),
(66, 'Zacatecas', 'Festival Cultural Zacatecas', '2026-03-28', 'La ciudad de piedra cantera rosa se llena de escenarios. Grupos internacionales de música del mundo y jazz se presentan en la Plaza de Armas y en las plazas coloniales.', 'https://th.bing.com/th/id/OIP.iFSJki357V4KnRXOxNrFOQHaE8?w=254&h=180&c=7&r=0&o=7&pid=1.7&rm=3', 'https://culturazac.gob.mx/', '2026-02-27 16:24:22'),
(67, 'Tamaulipas', 'Feria Tamaulipas', '2026-10-24', 'En Ciudad Victoria, se reúne lo mejor de la ganadería, la agricultura de cítricos y el entretenimiento, destacando la música de conjunto norteño y la cuera tamaulipeca (vestimenta típica).', 'https://www.tamaulipas.gob.mx/feria/wp-content/uploads/sites/39/2025/10/Feria-2025_Espectaculos_1000x1088px_24-NODAL.webp', 'https://www.tamaulipas.gob.mx/feria/', '2026-02-27 16:25:14'),
(68, 'Nuevo León', 'Festival Pa\'l Norte', '2026-03-27', 'El Parque Fundidora recibe a más de 100 bandas internacionales. Es famoso por sus \"escenarios sorpresa\" y una producción audiovisual de nivel mundial con montañas de fondo.', 'https://www.tecatepalnorte.com/img/sideshow/royel-otis-pacifica.jpg', 'https://www.tecatepalnorte.com/', '2026-02-27 16:26:24'),
(69, 'Durango', 'FENADU', '2026-07-22', 'La Feria Nacional Durango celebra la fundación de la ciudad con una fuerte vocación ganadera, exposiciones de cine (por su herencia como \"tierra del cine\") y conciertos en su Velaria.', 'https://www.ticketstar.com.mx/Imagenes/Eventos/Carrucel_17-12-2025%2012-8-8.jpeg', 'https://www.ticketstar.com.mx/default.aspx', '2026-02-27 16:27:42'),
(70, 'Sinaloa', 'Carnaval Internacional de Mazatlán', '2026-02-17', 'Destaca por el \"Combate Naval\" (fuegos artificiales que simulan una batalla en el mar) y la coronación del Rey de la Alegría en el Estadio Teodoro Mariscal.', 'https://culturamazatlan.com/wp-content/uploads/2026/02/Captura-de-pantalla-2026-02-02-a-las-8.13.42-p.m.png', 'https://culturamazatlan.com/cartelera/domingo-de-carnaval/', '2026-02-27 16:28:25'),
(71, 'Coahuila', 'Feria de Saltillo', '2026-07-22', 'Resalta por su exposición de sarapes (el ícono de la ciudad), gastronomía de la región y una cartelera que atrae a visitantes de todo el noreste del país.', 'https://th.bing.com/th/id/OIP.JM-AKfy9k8ANfBlCd-77MwHaD8?w=328&h=180&c=7&r=0&o=7&pid=1.7&rm=3', 'https://www.dondehayferia.com/feria-saltillo-2025', '2026-02-27 16:29:20'),
(72, 'Chihuahua', 'Festival Internacional Chihuahua', '2026-10-26', 'Presenta espectáculos monumentales en el desierto y en las ciudades, trayendo artistas de renombre mundial para presentarse frente a la Catedral de Chihuahua o en Ciudad Juárez.', 'https://th.bing.com/th/id/OIP.lOH1RRFdwun09bqPvNZ0FAHaD4?w=200&h=200&c=10&o=6&pid=genserp&rm=2', 'https://www.culturachihuahua.com/fich', '2026-02-27 16:30:09'),
(73, 'Sonora', 'Expogan Sonora', '2026-04-30', 'En Hermosillo, es una celebración de la cultura vaquera, con una oferta gastronómica centrada en los mejores cortes de carne de México y presentaciones en el palenque.', 'https://expogansonora.org/images/40anos.png', 'https://expogansonora.org/', '2026-02-27 16:31:01'),
(74, 'Baja California Sur', 'Festival de Cine de Todos Santos', '2026-11-09', 'Enfocado en cine con sentido social y latinoamericano, se celebra en el pintoresco Teatro Cine Manuel Márquez de León en este pueblo mágico de artistas.', 'https://th.bing.com/th/id/OIP.HMoDGDv-LG12lyHkLb0ONAHaEF?w=314&h=180&c=7&r=0&o=7&pid=1.7&rm=3', 'https://filmmakers.festhome.com/es/festival/festival-internacional-de-cine-de-todos-los-santos', '2026-02-27 16:32:07'),
(75, 'Baja California', 'Baja Beach Fest', '2026-08-07', 'Un festival masivo en las playas de Rosarito que reúne a las estrellas globales del reggaetón y trap, atrayendo a un público internacional joven.', 'https://ewscripps.brightspotcdn.com/dims4/default/90a7edc/2147483647/strip/true/crop/1920x1080+0+0/resize/1280x720!/quality/90/?url=http%3A%2F%2Fewscripps-brightspot.s3.amazonaws.com%2Fc1%2F96%2Fe2215ffd41a79b4f1ca22a7aa172%2Fbbf25-main-lineup-flier-1920x', 'https://bajabeachfest.com/', '2026-02-27 16:33:05'),
(76, 'Chihuahua', 'Evento de chihuahua', '2026-03-28', 'descripción de prueba', 'https://tecmilenio.mx/sites/default/files/2020-09/Campus_Guadalupe_0.jpg', 'https://google.com', '2026-03-04 02:27:33');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','user') NOT NULL DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `api_token` varchar(255) DEFAULT NULL,
  `country_code` varchar(5) DEFAULT NULL,
  `state_id` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `role`, `created_at`, `api_token`, `country_code`, `state_id`) VALUES
(1, 'admin', '$2y$10$bPBdU7OvhcQxpoBSs1ydAO17Sqx8IAb9mZkv7xze4Q1zh7nRKb57W', 'admin', '2026-02-26 02:38:31', '1d8b632d648b1245a2329930a6007e814466db8373902353f666e6c9ecce4ae4', 'MX', 'jal'),
(2, 'user', '$2y$10$wlmEXKf0cV3iHXyzO19rWeKTGskIAKXJw7y.9y4ayIKgGRAPRE5WW', 'user', '2026-02-26 02:38:31', NULL, NULL, NULL),
(3, 'Charlybrown27', '$2y$10$oUXALWdWFnmPrkjuvrff7uo3ZrX0zftNKPi1GDSNIzZBns5IM4rzy', 'user', '2026-02-26 02:49:20', '0916a0a8f0ce76a1002a843a98cfb958e2682ce6922f94ae7d0e05cc4cd66e13', NULL, NULL),
(6, 'CLYX', '$2y$10$58yTDloWtlnyIgd8Bz0kbufngmky7iKLwpvPbKrbfXKl1nPbPv7AW', 'user', '2026-02-26 03:35:08', '14a9099e2d72176f95a5534badce5cc9251696c7258ea912be35c33abc696da5', 'MX', 'yuc'),
(7, 'pepe', '$2y$10$iaHwcZysuRNt6GMKWFFmhO3frOpiQxe2N5VMdAQA7hsEGxaEODmri', 'user', '2026-02-26 03:54:15', 'dacd82e278d157541bcfe8c345d166459b93ffc993823c5e92289d308e636c6f', 'MX', 'jal'),
(8, 'pepe1', '$2y$10$LumLN4Cx1tVBj4957y6OyOGzQANpVkJIZo.lgFxcefZGRPT00w4gC', 'user', '2026-02-26 04:18:34', '009b34f8df888bad983c3db1f6a113a79fc9dbc9feb30a77ebd76a7d247e0e2a', 'MX', 'jal'),
(9, 'eileen27', '$2y$10$J3agwyUpPmSMHmuNaVCGNuwUz8T4WebUNM/80lGpD4P6SCE9TLb5W', 'user', '2026-02-26 21:28:10', '6e4d322112b0d3893f636fdb4a6a693269526ed7e374ffff08c3c6a13d2aa13b', 'MX', 'yuc'),
(10, 'eduardo123', '$2y$10$4E7cLbjDE8FzuIE9FtBBpuHPJW5aKks/nTFW657w/ntVDI8GfcGKG', 'user', '2026-03-04 03:59:57', 'b2d6eee31bd4a0cf2648ac1d307d977c0a92d0d5c9535deb101aff2e136745a1', 'MX', 'mex');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `comentarios`
--
ALTER TABLE `comentarios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `destino_id` (`destino_id`);

--
-- Indices de la tabla `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `event_id` (`event_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indices de la tabla `destinos`
--
ALTER TABLE `destinos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `event_likes`
--
ALTER TABLE `event_likes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_like` (`user_id`,`event_id`),
  ADD KEY `event_id` (`event_id`);

--
-- Indices de la tabla `event_ratings`
--
ALTER TABLE `event_ratings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_rating` (`user_id`,`event_id`),
  ADD KEY `event_id` (`event_id`);

--
-- Indices de la tabla `mexico_events`
--
ALTER TABLE `mexico_events`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `comentarios`
--
ALTER TABLE `comentarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `destinos`
--
ALTER TABLE `destinos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `event_likes`
--
ALTER TABLE `event_likes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `event_ratings`
--
ALTER TABLE `event_ratings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `mexico_events`
--
ALTER TABLE `mexico_events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=77;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `comentarios`
--
ALTER TABLE `comentarios`
  ADD CONSTRAINT `comentarios_ibfk_1` FOREIGN KEY (`destino_id`) REFERENCES `destinos` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `mexico_events` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `event_likes`
--
ALTER TABLE `event_likes`
  ADD CONSTRAINT `event_likes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `event_likes_ibfk_2` FOREIGN KEY (`event_id`) REFERENCES `mexico_events` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `event_ratings`
--
ALTER TABLE `event_ratings`
  ADD CONSTRAINT `event_ratings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `event_ratings_ibfk_2` FOREIGN KEY (`event_id`) REFERENCES `mexico_events` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
