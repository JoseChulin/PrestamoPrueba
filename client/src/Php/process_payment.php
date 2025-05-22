<?php
require_once 'conexion.php';

header('Content-Type: application/json');

try {
    // Validar datos recibidos
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['loanId'], $data['paymentId'], $data['amount'])) {
        throw new Exception('Datos incompletos para procesar el pago');
    }

    $loanId = (int)$data['loanId'];
    $paymentId = (int)$data['paymentId'];
    $amount = (float)$data['amount'];

    // Obtener conexión
    $db = Db::conectar();
    
    // Iniciar transacción
    $db->beginTransaction();

    // 1. Actualizar estado del pago en calendariopagos
    $stmt = $db->prepare("UPDATE calendariopagos SET estado = 1, montoPagado = ? WHERE idPago = ?");
    $stmt->execute([$amount, $paymentId]);

    // 2. Verificar si es el último pago pendiente del préstamo
    $stmt = $db->prepare("SELECT COUNT(*) as pendientes 
                         FROM calendariopagos 
                         WHERE idPrestamo = ? AND estado = 0");
    $stmt->execute([$loanId]);
    $result = $stmt->fetch();
    $pendingPayments = $result['pendientes'];

    // 3. Si no hay pagos pendientes, actualizar estado del préstamo a finalizado (2)
    if ($pendingPayments == 0) {
        $stmt = $db->prepare("UPDATE prestamos SET estado = 4 WHERE idPrestamo = ?");
        $stmt->execute([$loanId]);
    }

    // 4. Obtener el último ID de transacción para incrementarlo
    $stmt = $db->query("SELECT MAX(idTransaccion) as max_id FROM pagos");
    $result = $stmt->fetch();
    $newTransactionId = $result['max_id'] ? $result['max_id'] + 1 : 1;

    // 5. Generar referencia única
    $reference = 'PAGO' . strtoupper(uniqid());

    // 6. Insertar nuevo registro en pagos
    $stmt = $db->prepare("INSERT INTO pagos (idTransaccion, idPago, montoPago, fechaPago, referencia, estado) 
                         VALUES (?, ?, ?, CURDATE(), ?, 1)");
    $stmt->execute([$newTransactionId, $paymentId, $amount, $reference]);

    // Confirmar transacción
    $db->commit();

    // Obtener información del préstamo para la respuesta
    $stmt = $db->prepare("SELECT p.*, u.nombreCliente 
                         FROM prestamos p
                         JOIN usuarios u ON p.idUsuario = u.idUsuario
                         WHERE p.idPrestamo = ?");
    $stmt->execute([$loanId]);
    $loanInfo = $stmt->fetch();

    // Agregar información sobre si fue el último pago
    $isLastPayment = ($pendingPayments == 0);

    echo json_encode([
        'success' => true,
        'message' => 'Pago procesado correctamente' . ($isLastPayment ? ' (Préstamo finalizado)' : ''),
        'payment' => [
            'transactionId' => $newTransactionId,
            'reference' => $reference,
            'amount' => $amount,
            'date' => date('Y-m-d'),
            'loanInfo' => $loanInfo,
            'isLastPayment' => $isLastPayment
        ]
    ]);

} catch (PDOException $e) {
    if (isset($db)) {
        $db->rollBack();
    }
    error_log("Error en process_payment: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'Error al procesar el pago en la base de datos'
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>