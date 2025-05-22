<?php
require_once 'conexion.php';
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

session_start();

// Debug de sesión
file_put_contents('session_log.txt', print_r($_SESSION, true), FILE_APPEND);

if (!isset($_SESSION['idUsuario'])) {
    echo json_encode(['error' => 'Sesión no iniciada', 'session' => $_SESSION]);
    exit;
}

try {
    $db = Db::conectar();
    $userId = $_SESSION['idUsuario'];
    
    // 1. Datos básicos del usuario
    $stmt = $db->prepare("
        SELECT u.*, cb.banco, cb.numeroCuenta 
        FROM usuarios u
        LEFT JOIN cuentabancaria cb ON u.idUsuario = cb.idUsuario
        WHERE u.idUsuario = ?
    ");
    $stmt->execute([$userId]);
    $user = $stmt->fetch();

    if (!$user) {
        echo json_encode(['error' => 'Usuario no encontrado']);
        exit;
    }

    // 2. Préstamos activos (estado 1 = aprobado)
    $stmt = $db->prepare("
        SELECT p.*, pp.nombrePlan 
        FROM prestamos p
        JOIN planesprestamos pp ON p.idPlan = pp.idPlan
        WHERE p.idUsuario = ? AND p.estado = 1
    ");
    $stmt->execute([$userId]);
    $loan = $stmt->fetch();

    $nextPayments = [];
    $totalPaid = 0;

    if ($loan) {
        // 3. Próximos pagos (estado 0 = pendiente, 2 = vencido)
        $stmt = $db->prepare("
            SELECT * FROM calendariopagos 
            WHERE idPrestamo = ? AND (estado = 0 OR estado = 2)
            ORDER BY fechaVencimiento ASC
            LIMIT 5
        ");
        $stmt->execute([$loan['idPrestamo']]);
        $nextPayments = $stmt->fetchAll();

        // 4. Total pagado
        $stmt = $db->prepare("
            SELECT COALESCE(SUM(montoPagado), 0) as totalPagado 
            FROM calendariopagos 
            WHERE idPrestamo = ? AND estado = 1
        ");
        $stmt->execute([$loan['idPrestamo']]);
        $totalPaid = $stmt->fetchColumn();
    }

    // 5. Historial completo
    $stmt = $db->prepare("
        SELECT cp.*, p.fechaPago, p.referencia 
        FROM calendariopagos cp
        LEFT JOIN pagos p ON cp.idPago = p.idPago
        WHERE cp.idPrestamo IN (
            SELECT idPrestamo FROM prestamos WHERE idUsuario = ?
        )
        ORDER BY cp.fechaVencimiento DESC
    ");
    $stmt->execute([$userId]);
    $payments = $stmt->fetchAll();

    // 6. Planes de préstamo - SOLO LOS PLANES 1, 2, 3 y 4
    $stmt = $db->prepare("SELECT * FROM planesprestamos WHERE idPlan IN (1, 2, 3, 4)");
    $stmt->execute();
    $loanPlans = $stmt->fetchAll();

    echo json_encode([
        'user' => [
            'id' => $user['idUsuario'],
            'name' => $user['nombreCliente'],
            'email' => $user['correo'],
            'account' => [
                'bank' => $user['banco'] ?? null,
                'number' => $user['numeroCuenta'] ?? null
            ]
        ],
        'loan' => $loan ? [
            'id' => $loan['idPrestamo'],
            'plan' => $loan['nombrePlan'],
            'amount' => (float)$loan['montoSolicitado'],
            'interest' => (int)$loan['tasaInteres'],
            'term' => (int)$loan['plazoMeses'],
            'totalPaid' => (float)$totalPaid
        ] : null,
        'nextPayments' => array_map(function($p) {
            return [
                'id' => $p['idPago'],
                'date' => date('d M Y', strtotime($p['fechaVencimiento'])),
                'amount' => (float)$p['montoPago'],
                'status' => (int)$p['estado']
            ];
        }, $nextPayments),
        'payments' => array_map(function($p) {
            return [
                'id' => $p['idPago'],
                'date' => date('d M Y', strtotime($p['fechaVencimiento'])),
                'amount' => (float)$p['montoPago'],
                'status' => (int)$p['estado'],
                'paymentDate' => $p['fechaPago'] ? date('d M Y H:i', strtotime($p['fechaPago'])) : null,
                'reference' => $p['referencia']
            ];
        }, $payments),
        'loanPlans' => $loanPlans
    ]);

} catch (PDOException $e) {
    file_put_contents('error_log.txt', $e->getMessage(), FILE_APPEND);
    echo json_encode(['error' => 'Error en el servidor', 'details' => $e->getMessage()]);
}
?>