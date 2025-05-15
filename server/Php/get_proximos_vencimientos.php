<?php
require_once 'conexion.php';

session_start();

if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true ) {
    http_response_code(401);
    exit(json_encode(['success' => false, 'message' => 'No autorizado']));
}

try {
    $db = Db::conectar();
    
    $hoy = date('Y-m-d');
    $manana = date('Y-m-d', strtotime('+1 day'));
    
    $query = "SELECT c.idPago, c.idPrestamo, c.fechaVencimiento, c.montoPago, 
              CONCAT(u.nombreCliente, ' ', u.apellidoP) as cliente
              FROM calendariopagos c
              JOIN prestamos p ON c.idPrestamo = p.idPrestamo
              JOIN usuarios u ON p.idUsuario = u.idUsuario
              WHERE c.estado = 0 AND p.idEmpleado = :id AND 
              (c.fechaVencimiento = :hoy OR c.fechaVencimiento = :manana)
              ORDER BY c.fechaVencimiento ASC
              LIMIT 5";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $_SESSION['user_id'], PDO::PARAM_INT);
    $stmt->bindParam(':hoy', $hoy);
    $stmt->bindParam(':manana', $manana);
    $stmt->execute();
    
    $vencimientos = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    header('Content-Type: application/json');
    echo json_encode([
        'success' => true,
        'data' => $vencimientos
    ]);
} catch (PDOException $e) {
    error_log("Error en get_proximos_vencimientos: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Error en el servidor']);
}
?>