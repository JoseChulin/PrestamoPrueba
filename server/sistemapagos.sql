-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 16-05-2025 a las 04:40:30
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
-- Base de datos: `sistemapagos`
--
CREATE DATABASE IF NOT EXISTS `sistemapagos` DEFAULT CHARACTER SET ucs2 COLLATE ucs2_spanish_ci;
USE `sistemapagos`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `calendariopagos`
--

CREATE TABLE `calendariopagos` (
  `idPago` int(11) NOT NULL,
  `idPrestamo` int(11) NOT NULL,
  `numeroCouta` int(11) NOT NULL,
  `fechaVencimiento` date NOT NULL,
  `estado` int(11) NOT NULL,
  `montoPago` decimal(10,2) NOT NULL,
  `montoPagado` decimal(10,2) NOT NULL,
  `tasaInteres` int(11) NOT NULL,
  `fechaRegistro` date DEFAULT curdate()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `calendariopagos`
--

INSERT INTO `calendariopagos` (`idPago`, `idPrestamo`, `numeroCouta`, `fechaVencimiento`, `estado`, `montoPago`, `montoPagado`, `tasaInteres`, `fechaRegistro`) VALUES
(1, 1, 1, '2025-06-01', 1, 916.67, 916.67, 10, '2025-05-01'),
(2, 1, 2, '2025-07-01', 0, 916.67, 0.00, 10, '2025-05-01'),
(3, 1, 3, '2025-08-01', 0, 916.67, 0.00, 10, '2025-05-01'),
(4, 2, 1, '2025-06-05', 1, 2250.00, 2250.00, 8, '2025-05-05'),
(5, 2, 2, '2025-07-05', 0, 2250.00, 0.00, 8, '2025-05-05'),
(6, 5, 1, '2025-03-25', 1, 2416.67, 2416.67, 8, '2025-02-25'),
(7, 5, 2, '2025-04-25', 0, 2416.67, 0.00, 8, '2025-02-25'),
(8, 6, 1, '2025-04-15', 1, 3055.56, 3055.56, 6, '2025-03-15'),
(9, 6, 2, '2025-05-15', 0, 3055.56, 0.00, 6, '2025-03-15'),
(10, 7, 1, '2025-05-10', 1, 1083.33, 1083.33, 15, '2025-04-10'),
(11, 8, 1, '2025-06-18', 1, 1375.00, 1375.00, 10, '2025-05-18'),
(12, 8, 2, '2025-07-18', 0, 1375.00, 0.00, 10, '2025-05-18'),
(13, 9, 1, '2025-07-22', 1, 2583.33, 2583.33, 8, '2025-06-22'),
(14, 10, 1, '2025-08-30', 1, 3333.33, 3333.33, 6, '2025-07-30'),
(15, 11, 1, '2025-09-05', 1, 1358.33, 1358.33, 15, '2025-08-05'),
(16, 6, 1, '2025-05-22', 0, 2291.67, 0.00, 8, '2025-05-15'),
(17, 6, 2, '2025-05-29', 0, 2291.67, 0.00, 8, '2025-05-15'),
(18, 6, 3, '2025-06-05', 0, 2291.67, 0.00, 8, '2025-05-15'),
(19, 6, 4, '2025-06-12', 0, 2291.67, 0.00, 8, '2025-05-15'),
(20, 6, 5, '2025-06-19', 0, 2291.67, 0.00, 8, '2025-05-15'),
(21, 6, 6, '2025-06-26', 0, 2291.67, 0.00, 8, '2025-05-15'),
(22, 6, 7, '2025-07-03', 0, 2291.67, 0.00, 8, '2025-05-15'),
(23, 6, 8, '2025-07-10', 0, 2291.67, 0.00, 8, '2025-05-15'),
(24, 6, 9, '2025-07-17', 0, 2291.67, 0.00, 8, '2025-05-15'),
(25, 6, 10, '2025-07-24', 0, 2291.67, 0.00, 8, '2025-05-15'),
(26, 6, 11, '2025-07-31', 0, 2291.67, 0.00, 8, '2025-05-15'),
(27, 6, 12, '2025-08-07', 0, 2291.67, 0.00, 8, '2025-05-15'),
(28, 6, 13, '2025-08-14', 0, 2291.67, 0.00, 8, '2025-05-15'),
(29, 6, 14, '2025-08-21', 0, 2291.67, 0.00, 8, '2025-05-15'),
(30, 6, 15, '2025-08-28', 0, 2291.67, 0.00, 8, '2025-05-15'),
(31, 6, 16, '2025-09-04', 0, 2291.67, 0.00, 8, '2025-05-15'),
(32, 6, 17, '2025-09-11', 0, 2291.67, 0.00, 8, '2025-05-15'),
(33, 6, 18, '2025-09-18', 0, 2291.67, 0.00, 8, '2025-05-15'),
(34, 6, 19, '2025-09-25', 0, 2291.67, 0.00, 8, '2025-05-15'),
(35, 6, 20, '2025-10-02', 0, 2291.67, 0.00, 8, '2025-05-15'),
(36, 6, 21, '2025-10-09', 0, 2291.67, 0.00, 8, '2025-05-15'),
(37, 6, 22, '2025-10-16', 0, 2291.67, 0.00, 8, '2025-05-15'),
(38, 6, 23, '2025-10-23', 0, 2291.67, 0.00, 8, '2025-05-15'),
(39, 6, 24, '2025-10-30', 0, 2291.67, 0.00, 8, '2025-05-15');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cuentabancaria`
--

CREATE TABLE `cuentabancaria` (
  `idCuenta` int(11) NOT NULL,
  `idUsuario` int(11) NOT NULL,
  `banco` varchar(50) DEFAULT NULL,
  `numeroCuenta` varchar(20) DEFAULT NULL,
  `fechaRegistro` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `cuentabancaria`
--

INSERT INTO `cuentabancaria` (`idCuenta`, `idUsuario`, `banco`, `numeroCuenta`, `fechaRegistro`) VALUES
(1, 1, 'BBVA', '1234567890123456', '2025-05-01 10:00:00'),
(2, 2, 'Santander', '6543210987654321', '2025-05-05 11:30:00'),
(3, 3, 'Banamex', '9876543210123456', '2025-05-10 09:15:00'),
(4, 4, 'BBVA', '1111222233334444', '2025-01-15 10:00:00'),
(5, 5, 'Santander', '2222333344445555', '2025-02-20 11:30:00'),
(6, 6, 'Banamex', '3333444455556666', '2025-03-10 09:15:00'),
(7, 7, 'HSBC', '4444555566667777', '2025-04-05 14:20:00'),
(8, 8, 'ScotiaBank', '5555666677778888', '2025-05-12 16:45:00'),
(9, 9, 'Banorte', '6666777788889999', '2025-06-18 13:10:00'),
(10, 10, 'Banregio', '7777888899990000', '2025-07-22 15:30:00'),
(11, 11, 'Inbursa', '8888999900001111', '2025-08-30 12:00:00'),
(12, 12, 'Afirme', '9999000011112222', '2025-09-14 10:45:00'),
(13, 13, 'BanBajío', '0000111122223333', '2025-10-25 11:15:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `documentos`
--

CREATE TABLE `documentos` (
  `idDocumento` int(11) NOT NULL,
  `idPrestamo` int(11) NOT NULL,
  `idTipoDocumento` int(11) NOT NULL,
  `Documento` longblob NOT NULL,
  `fechaSubida` date DEFAULT curdate()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `documentos`
--

INSERT INTO `documentos` (`idDocumento`, `idPrestamo`, `idTipoDocumento`, `Documento`, `fechaSubida`) VALUES
(1, 1, 1, 0x2e2e2e6461746f732062696e6172696f732e2e2e, '2025-05-01'),
(2, 1, 2, 0x2e2e2e6461746f732062696e6172696f732e2e2e, '2025-05-01'),
(3, 2, 1, 0x2e2e2e6461746f732062696e6172696f732e2e2e, '2025-05-05'),
(4, 2, 3, 0x2e2e2e6461746f732062696e6172696f732e2e2e, '2025-05-05');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `empleado`
--

CREATE TABLE `empleado` (
  `idEmpleado` int(11) NOT NULL,
  `idTipoEmpleado` int(11) NOT NULL,
  `nombreEmpleado` varchar(50) DEFAULT NULL,
  `telefono` varchar(10) DEFAULT NULL,
  `correo` varchar(50) DEFAULT NULL,
  `fechaRegistro` date DEFAULT curdate()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `empleado`
--

INSERT INTO `empleado` (`idEmpleado`, `idTipoEmpleado`, `nombreEmpleado`, `telefono`, `correo`, `fechaRegistro`) VALUES
(1, 3, 'Jose Alexander', '9831231231', 'pp79118@gmail.com', '2025-05-12'),
(2, 1, 'Prestamista Uno', '9821231232', 'Prestamista@gmail.com', '2025-05-12'),
(3, 2, 'Gerente Uno', '9821234666', 'Gerente@gmail.com', '2025-05-12'),
(4, 1, 'Xie Ron', '9821231234', 'Prestamista2@gmail.com', '2025-05-13');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `loginempleados`
--

CREATE TABLE `loginempleados` (
  `idLoginEmpleado` int(11) NOT NULL,
  `idEmpleado` int(11) NOT NULL,
  `correo` varchar(30) NOT NULL,
  `contraseña` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `loginempleados`
--

INSERT INTO `loginempleados` (`idLoginEmpleado`, `idEmpleado`, `correo`, `contraseña`) VALUES
(1, 1, 'pp79118@gmail.com', 'Moca115@'),
(2, 2, 'Prestamista@gmail.com', 'Moca115@'),
(3, 3, 'Gerente@gmail.com', 'Moca115@'),
(4, 4, 'Prestamista2@gmail.com', 'Moca115@');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `loginusuarios`
--

CREATE TABLE `loginusuarios` (
  `idLoginUsuario` int(11) NOT NULL,
  `idUsuario` int(11) NOT NULL,
  `nombreUsuario` varchar(30) NOT NULL,
  `correo` varchar(30) NOT NULL,
  `contraseña` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `loginusuarios`
--

INSERT INTO `loginusuarios` (`idLoginUsuario`, `idUsuario`, `nombreUsuario`, `correo`, `contraseña`) VALUES
(1, 1, 'juan123', 'juan@example.com', 'Moca115@'),
(2, 2, 'maria456', 'maria@example.com', 'Moca115@'),
(3, 3, 'carlos789', 'carlos@example.com', 'Moca115@'),
(4, 4, 'ana101', 'ana@example.com', 'Moca115@'),
(5, 5, 'luis202', 'luis@example.com', 'Moca115@'),
(6, 6, 'sofia303', 'sofia@example.com', 'Moca115@'),
(7, 7, 'pedro404', 'pedro2@example.com', 'Moca115@'),
(8, 8, 'laura505', 'laura@example.com', 'Moca115@'),
(9, 9, 'jorge606', 'jorge@example.com', 'Moca115@'),
(10, 10, 'marta707', 'marta@example.com', 'Moca115@'),
(11, 11, 'david808', 'david@example.com', 'Moca115@'),
(12, 12, 'elena909', 'elena@example.com', 'Moca115@'),
(13, 13, 'pablo010', 'pablo@example.com', 'Moca115@');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notificaciones`
--

CREATE TABLE `notificaciones` (
  `idNotificacion` int(11) NOT NULL,
  `idUsuario` int(11) NOT NULL,
  `idEmpleado` int(11) NOT NULL,
  `mensaje` varchar(200) NOT NULL,
  `idTipoNotificacion` int(11) NOT NULL,
  `estado` int(11) NOT NULL,
  `fechaEnvio` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `notificaciones`
--

INSERT INTO `notificaciones` (`idNotificacion`, `idUsuario`, `idEmpleado`, `mensaje`, `idTipoNotificacion`, `estado`, `fechaEnvio`) VALUES
(1, 1, 2, 'Su préstamo ha sido aprobado', 1, 1, '2025-05-01 12:00:00'),
(2, 2, 2, 'Su préstamo ha sido aprobado', 1, 1, '2025-05-05 13:30:00'),
(3, 3, 2, 'Su préstamo está en revisión', 6, 1, '2025-05-10 10:15:00'),
(4, 1, 2, 'Recordatorio: Pago vence el 01/06/2025', 3, 0, '2025-05-25 09:00:00'),
(5, 4, 2, 'Disculpe no se como mandar mis documentos', 7, 1, '2025-05-15 12:22:33'),
(6, 10, 2, 'Su préstamo ha sido aprobado', 1, 1, '2025-05-15 14:17:04'),
(7, 3, 2, 'Su préstamo ha sido rechazado', 2, 1, '2025-05-15 14:29:36'),
(8, 5, 2, 'Su préstamo ha sido aprobado. Se han generado las fechas de pago.', 1, 1, '2025-05-15 15:53:37'),
(9, 4, 2, 'Respuesta a tu duda del 2025-05-15 12:22:33:\r\nTienes que ir al apartado de documentos en la sección de solicitud de prestamos...', 8, 0, '2025-05-15 20:25:10'),
(10, 11, 2, 'En que formato tienen que estar los documentos?', 7, 1, '2025-05-15 20:43:21'),
(11, 11, 2, 'Respuesta a tu duda del 2025-05-15 20:43:21:\nEn pdf', 8, 0, '2025-05-15 20:44:52');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pagos`
--

CREATE TABLE `pagos` (
  `idTransaccion` int(11) NOT NULL,
  `idPago` int(11) NOT NULL,
  `montoPago` decimal(10,2) NOT NULL,
  `fechaPago` date DEFAULT curdate(),
  `referencia` varchar(50) NOT NULL,
  `estado` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `pagos`
--

INSERT INTO `pagos` (`idTransaccion`, `idPago`, `montoPago`, `fechaPago`, `referencia`, `estado`) VALUES
(1, 1, 916.67, '2025-05-28', 'PAGO123456789', 1),
(2, 4, 2250.00, '2025-05-30', 'PAGO987654321', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `penalizaciones`
--

CREATE TABLE `penalizaciones` (
  `idPenalizacion` int(11) NOT NULL,
  `idPago` int(11) NOT NULL,
  `tasaInteres` int(11) NOT NULL,
  `descripcion` varchar(100) DEFAULT NULL,
  `fechaRegistro` date DEFAULT curdate()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `penalizaciones`
--

INSERT INTO `penalizaciones` (`idPenalizacion`, `idPago`, `tasaInteres`, `descripcion`, `fechaRegistro`) VALUES
(1, 2, 5, 'Interés por mora en pago', '2025-07-15');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `planesprestamos`
--

CREATE TABLE `planesprestamos` (
  `idPlan` int(11) NOT NULL,
  `nombrePlan` varchar(20) NOT NULL,
  `tasaInteres` int(11) NOT NULL,
  `duracion` int(11) NOT NULL,
  `monto` decimal(10,2) NOT NULL,
  `descripcion` varchar(100) DEFAULT NULL,
  `fechaRegistro` date DEFAULT curdate()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `planesprestamos`
--

INSERT INTO `planesprestamos` (`idPlan`, `nombrePlan`, `tasaInteres`, `duracion`, `monto`, `descripcion`, `fechaRegistro`) VALUES
(1, 'Plan Básico', 10, 12, 10000.00, 'Préstamo básico a 12 meses con tasa fija', '2025-01-15'),
(2, 'Plan Intermedio', 8, 24, 50000.00, 'Préstamo intermedio a 24 meses con tasa fija', '2025-01-15'),
(3, 'Plan Avanzado', 6, 36, 100000.00, 'Préstamo avanzado a 36 meses con tasa fija', '2025-01-15'),
(4, 'Plan Emergencia', 15, 6, 5000.00, 'Préstamo rápido para emergencias', '2025-03-10');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `prestamos`
--

CREATE TABLE `prestamos` (
  `idPrestamo` int(11) NOT NULL,
  `idUsuario` int(11) NOT NULL,
  `idPlan` int(11) NOT NULL,
  `idEmpleado` int(11) NOT NULL,
  `tasaInteres` int(11) NOT NULL,
  `plazoMeses` int(11) NOT NULL,
  `montoSolicitado` decimal(10,2) NOT NULL,
  `estado` int(11) NOT NULL,
  `fechaSolicitud` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `prestamos`
--

INSERT INTO `prestamos` (`idPrestamo`, `idUsuario`, `idPlan`, `idEmpleado`, `tasaInteres`, `plazoMeses`, `montoSolicitado`, `estado`, `fechaSolicitud`) VALUES
(1, 1, 1, 2, 10, 12, 10000.00, 2, '2025-05-01'),
(2, 2, 2, 2, 8, 24, 50000.00, 1, '2025-05-05'),
(3, 3, 3, 2, 6, 36, 100000.00, 3, '2025-05-10'),
(4, 1, 4, 2, 15, 6, 5000.00, 2, '2025-05-12'),
(5, 4, 1, 2, 10, 12, 12000.00, 1, '2025-01-20'),
(6, 5, 2, 2, 8, 24, 55000.00, 1, '2025-02-25'),
(7, 6, 3, 2, 6, 36, 110000.00, 2, '2025-03-15'),
(8, 7, 4, 2, 15, 6, 6000.00, 3, '2025-04-10'),
(9, 8, 1, 2, 10, 12, 15000.00, 1, '2025-04-18'),
(10, 9, 2, 2, 8, 24, 60000.00, 1, '2025-04-22'),
(11, 10, 3, 2, 6, 36, 120000.00, 2, '2025-07-30'),
(12, 11, 4, 2, 15, 6, 7000.00, 3, '2025-04-05'),
(13, 12, 1, 2, 10, 12, 18000.00, 1, '2025-03-20'),
(14, 13, 2, 2, 8, 24, 65000.00, 1, '2025-04-30');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipodocumento`
--

CREATE TABLE `tipodocumento` (
  `idTipoDocumento` int(11) NOT NULL,
  `descripcion` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `tipodocumento`
--

INSERT INTO `tipodocumento` (`idTipoDocumento`, `descripcion`) VALUES
(1, 'Identificación Oficial'),
(2, 'Comprobante de Domicilio'),
(3, 'Comprobante de Ingresos'),
(4, 'Estado de Cuenta Bancaria'),
(5, 'Contrato Firmado');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipoempleado`
--

CREATE TABLE `tipoempleado` (
  `idTipo` int(11) NOT NULL,
  `nombrePuesto` varchar(20) NOT NULL,
  `descripcion` varchar(100) DEFAULT NULL,
  `salarioBase` decimal(10,2) NOT NULL,
  `nivel` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `tipoempleado`
--

INSERT INTO `tipoempleado` (`idTipo`, `nombrePuesto`, `descripcion`, `salarioBase`, `nivel`) VALUES
(1, 'Prestamista', 'Prestamista, tiene el rol de rechazar o aceptar las solicitudes de prestamos. ', 10000.00, 'Sr'),
(2, 'Gerente', 'Gerente, administra los ingresos de la empresa', 15000.00, 'Sr'),
(3, 'Encargado', 'Encargado, Se encarga de gestionar a los empleados.', 15000.00, 'Sr');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tiposnotificacion`
--

CREATE TABLE `tiposnotificacion` (
  `idTipoNotificacion` int(11) NOT NULL,
  `descripcion` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `tiposnotificacion`
--

INSERT INTO `tiposnotificacion` (`idTipoNotificacion`, `descripcion`) VALUES
(1, 'Aprobación de Préstamo'),
(2, 'Rechazo de Préstamo'),
(3, 'Recordatorio de Pago'),
(4, 'Pago Atrasado'),
(5, 'Pago Recibido'),
(6, 'Cambio de Estado'),
(7, 'Dudas'),
(8, 'Respuesta');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `idUsuario` int(11) NOT NULL,
  `nombreCliente` varchar(30) NOT NULL,
  `nombreUsuario` varchar(30) NOT NULL,
  `correo` varchar(30) NOT NULL,
  `contraseña` varchar(30) NOT NULL,
  `apellidoM` varchar(20) NOT NULL,
  `apellidoP` varchar(20) NOT NULL,
  `telefono` varchar(10) DEFAULT NULL,
  `fechaRegistro` date DEFAULT curdate()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`idUsuario`, `nombreCliente`, `nombreUsuario`, `correo`, `contraseña`, `apellidoM`, `apellidoP`, `telefono`, `fechaRegistro`) VALUES
(1, 'Juan', 'juan123', 'juan@example.com', 'Moca115@', 'Pérez', 'Gómez', '5551234567', '2025-05-01'),
(2, 'María', 'maria456', 'maria@example.com', 'Moca115@', 'López', 'Martínez', '5557654321', '2025-05-05'),
(3, 'Carlos', 'carlos789', 'carlos@example.com', 'Moca115@', 'García', 'Rodríguez', '5559876543', '2025-05-10'),
(4, 'Ana', 'ana101', 'ana@example.com', 'Moca115@', 'Sánchez', 'López', '5552345678', '2025-01-15'),
(5, 'Luis', 'luis202', 'luis@example.com', 'Moca115@', 'Gómez', 'Fernández', '5553456789', '2025-02-20'),
(6, 'Sofía', 'sofia303', 'sofia@example.com', 'Moca115@', 'Díaz', 'Martínez', '5554567890', '2025-03-10'),
(7, 'Pedro', 'pedro404', 'pedro2@example.com', 'Moca115@', 'Hernández', 'García', '5555678901', '2025-04-05'),
(8, 'Laura', 'laura505', 'laura@example.com', 'Moca115@', 'Rodríguez', 'Pérez', '5556789012', '2025-05-12'),
(9, 'Jorge', 'jorge606', 'jorge@example.com', 'Moca115@', 'Martín', 'Sánchez', '5557890123', '2025-06-18'),
(10, 'Marta', 'marta707', 'marta@example.com', 'Moca115@', 'Jiménez', 'López', '5558901234', '2025-07-22'),
(11, 'David', 'david808', 'david@example.com', 'Moca115@', 'Ruiz', 'Gómez', '5559012345', '2025-08-30'),
(12, 'Elena', 'elena909', 'elena@example.com', 'Moca115@', 'Serrano', 'Fernández', '5550123456', '2025-09-14'),
(13, 'Pablo', 'pablo010', 'pablo@example.com', 'Moca115@', 'Torres', 'Díaz', '5551234501', '2025-10-25');

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vista_empleado_actual`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `vista_empleado_actual` (
`idEmpleado` int(11)
,`idTipoEmpleado` int(11)
,`nombreEmpleado` varchar(50)
,`telefono` varchar(10)
,`correo` varchar(50)
,`fechaRegistro` date
,`nombrePuesto` varchar(20)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vista_estadisticas_dashboard`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `vista_estadisticas_dashboard` (
`total_empleados` bigint(21)
,`quejas_pendientes` bigint(21)
,`nuevos_empleados` bigint(21)
,`evaluaciones_pendientes` int(2)
);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `voucherpago`
--

CREATE TABLE `voucherpago` (
  `idVoucher` int(11) NOT NULL,
  `idPago` int(11) NOT NULL,
  `urlDocumento` varchar(255) NOT NULL,
  `fechaRegistro` date DEFAULT curdate()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `voucherpago`
--

INSERT INTO `voucherpago` (`idVoucher`, `idPago`, `urlDocumento`, `fechaRegistro`) VALUES
(1, 1, '/vouchers/pago1_juan123.pdf', '2025-05-28'),
(2, 4, '/vouchers/pago2_maria456.pdf', '2025-05-30');

-- --------------------------------------------------------

--
-- Estructura para la vista `vista_empleado_actual`
--
DROP TABLE IF EXISTS `vista_empleado_actual`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vista_empleado_actual`  AS SELECT `e`.`idEmpleado` AS `idEmpleado`, `e`.`idTipoEmpleado` AS `idTipoEmpleado`, `e`.`nombreEmpleado` AS `nombreEmpleado`, `e`.`telefono` AS `telefono`, `e`.`correo` AS `correo`, `e`.`fechaRegistro` AS `fechaRegistro`, `te`.`nombrePuesto` AS `nombrePuesto` FROM (`empleado` `e` join `tipoempleado` `te` on(`e`.`idTipoEmpleado` = `te`.`idTipo`)) ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vista_estadisticas_dashboard`
--
DROP TABLE IF EXISTS `vista_estadisticas_dashboard`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vista_estadisticas_dashboard`  AS SELECT (select count(0) from `empleado`) AS `total_empleados`, (select count(0) from `notificaciones` where `notificaciones`.`idTipoNotificacion` = 6 and `notificaciones`.`estado` = 0) AS `quejas_pendientes`, (select count(0) from `empleado` where month(`empleado`.`fechaRegistro`) = month(curdate())) AS `nuevos_empleados`, 12 AS `evaluaciones_pendientes` ;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `calendariopagos`
--
ALTER TABLE `calendariopagos`
  ADD PRIMARY KEY (`idPago`),
  ADD KEY `fk_CalendarioPagos_Prestamos` (`idPrestamo`);

--
-- Indices de la tabla `cuentabancaria`
--
ALTER TABLE `cuentabancaria`
  ADD PRIMARY KEY (`idCuenta`),
  ADD KEY `fk_CuentaBancaria_Usuarios` (`idUsuario`);

--
-- Indices de la tabla `documentos`
--
ALTER TABLE `documentos`
  ADD PRIMARY KEY (`idDocumento`),
  ADD KEY `fk_Documentos_Prestamos` (`idPrestamo`),
  ADD KEY `fk_Documentos_TipoDocumento` (`idTipoDocumento`);

--
-- Indices de la tabla `empleado`
--
ALTER TABLE `empleado`
  ADD PRIMARY KEY (`idEmpleado`),
  ADD KEY `fk_Empleado_TipoEmpleado` (`idTipoEmpleado`);

--
-- Indices de la tabla `loginempleados`
--
ALTER TABLE `loginempleados`
  ADD PRIMARY KEY (`idLoginEmpleado`),
  ADD KEY `fk_LoginEmpleados_Empleado` (`idEmpleado`);

--
-- Indices de la tabla `loginusuarios`
--
ALTER TABLE `loginusuarios`
  ADD PRIMARY KEY (`idLoginUsuario`),
  ADD KEY `idUsuario` (`idUsuario`);

--
-- Indices de la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  ADD PRIMARY KEY (`idNotificacion`),
  ADD KEY `idUsuario` (`idUsuario`),
  ADD KEY `idEmpleado` (`idEmpleado`),
  ADD KEY `idTipoNotificacion` (`idTipoNotificacion`);

--
-- Indices de la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD PRIMARY KEY (`idTransaccion`),
  ADD KEY `idPago` (`idPago`);

--
-- Indices de la tabla `penalizaciones`
--
ALTER TABLE `penalizaciones`
  ADD PRIMARY KEY (`idPenalizacion`),
  ADD KEY `idPago` (`idPago`);

--
-- Indices de la tabla `planesprestamos`
--
ALTER TABLE `planesprestamos`
  ADD PRIMARY KEY (`idPlan`);

--
-- Indices de la tabla `prestamos`
--
ALTER TABLE `prestamos`
  ADD PRIMARY KEY (`idPrestamo`),
  ADD KEY `idUsuario` (`idUsuario`),
  ADD KEY `idPlan` (`idPlan`),
  ADD KEY `idEmpleado` (`idEmpleado`);

--
-- Indices de la tabla `tipodocumento`
--
ALTER TABLE `tipodocumento`
  ADD PRIMARY KEY (`idTipoDocumento`);

--
-- Indices de la tabla `tipoempleado`
--
ALTER TABLE `tipoempleado`
  ADD PRIMARY KEY (`idTipo`);

--
-- Indices de la tabla `tiposnotificacion`
--
ALTER TABLE `tiposnotificacion`
  ADD PRIMARY KEY (`idTipoNotificacion`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`idUsuario`);

--
-- Indices de la tabla `voucherpago`
--
ALTER TABLE `voucherpago`
  ADD PRIMARY KEY (`idVoucher`),
  ADD KEY `idPago` (`idPago`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `calendariopagos`
--
ALTER TABLE `calendariopagos`
  MODIFY `idPago` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT de la tabla `documentos`
--
ALTER TABLE `documentos`
  MODIFY `idDocumento` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  MODIFY `idNotificacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `calendariopagos`
--
ALTER TABLE `calendariopagos`
  ADD CONSTRAINT `fk_CalendarioPagos_Prestamos` FOREIGN KEY (`idPrestamo`) REFERENCES `prestamos` (`idPrestamo`);

--
-- Filtros para la tabla `cuentabancaria`
--
ALTER TABLE `cuentabancaria`
  ADD CONSTRAINT `fk_CuentaBancaria_Usuarios` FOREIGN KEY (`idUsuario`) REFERENCES `usuarios` (`idUsuario`);

--
-- Filtros para la tabla `documentos`
--
ALTER TABLE `documentos`
  ADD CONSTRAINT `fk_Documentos_Prestamos` FOREIGN KEY (`idPrestamo`) REFERENCES `prestamos` (`idPrestamo`),
  ADD CONSTRAINT `fk_Documentos_TipoDocumento` FOREIGN KEY (`idTipoDocumento`) REFERENCES `tipodocumento` (`idTipoDocumento`);

--
-- Filtros para la tabla `empleado`
--
ALTER TABLE `empleado`
  ADD CONSTRAINT `fk_Empleado_TipoEmpleado` FOREIGN KEY (`idTipoEmpleado`) REFERENCES `tipoempleado` (`idTipo`);

--
-- Filtros para la tabla `loginempleados`
--
ALTER TABLE `loginempleados`
  ADD CONSTRAINT `fk_LoginEmpleados_Empleado` FOREIGN KEY (`idEmpleado`) REFERENCES `empleado` (`idEmpleado`);

--
-- Filtros para la tabla `loginusuarios`
--
ALTER TABLE `loginusuarios`
  ADD CONSTRAINT `loginusuarios_ibfk_1` FOREIGN KEY (`idUsuario`) REFERENCES `usuarios` (`idUsuario`);

--
-- Filtros para la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  ADD CONSTRAINT `notificaciones_ibfk_1` FOREIGN KEY (`idUsuario`) REFERENCES `usuarios` (`idUsuario`),
  ADD CONSTRAINT `notificaciones_ibfk_2` FOREIGN KEY (`idEmpleado`) REFERENCES `empleado` (`idEmpleado`),
  ADD CONSTRAINT `notificaciones_ibfk_3` FOREIGN KEY (`idTipoNotificacion`) REFERENCES `tiposnotificacion` (`idTipoNotificacion`);

--
-- Filtros para la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD CONSTRAINT `pagos_ibfk_1` FOREIGN KEY (`idPago`) REFERENCES `calendariopagos` (`idPago`);

--
-- Filtros para la tabla `penalizaciones`
--
ALTER TABLE `penalizaciones`
  ADD CONSTRAINT `penalizaciones_ibfk_1` FOREIGN KEY (`idPago`) REFERENCES `calendariopagos` (`idPago`);

--
-- Filtros para la tabla `prestamos`
--
ALTER TABLE `prestamos`
  ADD CONSTRAINT `prestamos_ibfk_1` FOREIGN KEY (`idUsuario`) REFERENCES `usuarios` (`idUsuario`),
  ADD CONSTRAINT `prestamos_ibfk_2` FOREIGN KEY (`idPlan`) REFERENCES `planesprestamos` (`idPlan`),
  ADD CONSTRAINT `prestamos_ibfk_3` FOREIGN KEY (`idEmpleado`) REFERENCES `empleado` (`idEmpleado`);

--
-- Filtros para la tabla `voucherpago`
--
ALTER TABLE `voucherpago`
  ADD CONSTRAINT `voucherpago_ibfk_1` FOREIGN KEY (`idPago`) REFERENCES `calendariopagos` (`idPago`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
