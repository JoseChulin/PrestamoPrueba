-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 14-05-2025 a las 03:13:27
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

DROP TABLE IF EXISTS `calendariopagos`;
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
(5, 2, 2, '2025-07-05', 0, 2250.00, 0.00, 8, '2025-05-05');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cuentabancaria`
--

DROP TABLE IF EXISTS `cuentabancaria`;
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
(3, 3, 'Banamex', '9876543210123456', '2025-05-10 09:15:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `documentos`
--

DROP TABLE IF EXISTS `documentos`;
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

DROP TABLE IF EXISTS `empleado`;
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

DROP TABLE IF EXISTS `loginempleados`;
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

DROP TABLE IF EXISTS `loginusuarios`;
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
(3, 3, 'carlos789', 'carlos@example.com', 'Moca115@');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notificaciones`
--

DROP TABLE IF EXISTS `notificaciones`;
CREATE TABLE `notificaciones` (
  `idNotificacion` int(11) NOT NULL,
  `idUsuario` int(11) NOT NULL,
  `idEmpleado` int(11) NOT NULL,
  `mensaje` varchar(100) NOT NULL,
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
(4, 1, 2, 'Recordatorio: Pago vence el 01/06/2025', 3, 0, '2025-05-25 09:00:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pagos`
--

DROP TABLE IF EXISTS `pagos`;
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

DROP TABLE IF EXISTS `penalizaciones`;
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

DROP TABLE IF EXISTS `planesprestamos`;
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

DROP TABLE IF EXISTS `prestamos`;
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
(1, 1, 1, 2, 10, 12, 10000.00, 1, '2025-05-01'),
(2, 2, 2, 2, 8, 24, 50000.00, 1, '2025-05-05'),
(3, 3, 3, 2, 6, 36, 100000.00, 2, '2025-05-10'),
(4, 1, 4, 2, 15, 6, 5000.00, 3, '2025-05-12');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipodocumento`
--

DROP TABLE IF EXISTS `tipodocumento`;
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

DROP TABLE IF EXISTS `tipoempleado`;
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

DROP TABLE IF EXISTS `tiposnotificacion`;
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
(6, 'Cambio de Estado');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
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
(3, 'Carlos', 'carlos789', 'carlos@example.com', 'Moca115@', 'García', 'Rodríguez', '5559876543', '2025-05-10');

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vista_empleado_actual`
-- (Véase abajo para la vista actual)
--
DROP VIEW IF EXISTS `vista_empleado_actual`;
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
DROP VIEW IF EXISTS `vista_estadisticas_dashboard`;
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

DROP TABLE IF EXISTS `voucherpago`;
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

DROP VIEW IF EXISTS `vista_empleado_actual`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vista_empleado_actual`  AS SELECT `e`.`idEmpleado` AS `idEmpleado`, `e`.`idTipoEmpleado` AS `idTipoEmpleado`, `e`.`nombreEmpleado` AS `nombreEmpleado`, `e`.`telefono` AS `telefono`, `e`.`correo` AS `correo`, `e`.`fechaRegistro` AS `fechaRegistro`, `te`.`nombrePuesto` AS `nombrePuesto` FROM (`empleado` `e` join `tipoempleado` `te` on(`e`.`idTipoEmpleado` = `te`.`idTipo`)) ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vista_estadisticas_dashboard`
--
DROP TABLE IF EXISTS `vista_estadisticas_dashboard`;

DROP VIEW IF EXISTS `vista_estadisticas_dashboard`;
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
-- AUTO_INCREMENT de la tabla `documentos`
--
ALTER TABLE `documentos`
  MODIFY `idDocumento` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  MODIFY `idNotificacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

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
