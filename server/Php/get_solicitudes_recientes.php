<?php
require_once 'conexion.php';

session_start();

if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true ) {
    http_response_code(401);
    exit(json_encode(['success' => false, 'message' => 'No autorizado']));
}

try {
    $db = Db::conectar();
    
    $query = "SELECT p.idPrestamo, p.montoSolicitado, p.fechaSolicitud, 
              CONCAT(u.nombreCliente, ' ', u.apellidoP) as cliente,
              CASE 
                WHEN u.telefono IS NULL THEN 'Nuevo cliente'
                ELSE 'Cliente existente'
              END as tipoCliente
              FROM prestamos p
              JOIN usuarios u ON p.idUsuario = u.idUsuario
              WHERE p.idEmpleado = :id AND p.estado = 0
              ORDER BY p.fechaSolicitud DESC
              LIMIT 5";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $_SESSION['user_id'], PDO::PARAM_INT);
    $stmt->execute();
    
    $solicitudes = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    header('Content-Type: application/json');
    echo json_encode([
        'success' => true,
        'data' => $solicitudes
    ]);
} catch (PDOException $e) {
    error_log("Error en get_solicitudes_recientes: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Error en el servidor']);
}
?>