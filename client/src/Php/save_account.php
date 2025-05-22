<?php
require_once 'conexion.php';
header('Content-Type: application/json');

session_start();

if (!isset($_SESSION['idUsuario'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'No autorizado']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

try {
    $db = Db::conectar();
    $userId = $_SESSION['idUsuario'];
    
    // Validar datos de entrada
    if (empty($data['bank']) || empty($data['accountNumber'])) {
        throw new Exception('Todos los campos son requeridos');
    }
    
    // Validar formato del número de cuenta (16-20 dígitos)
    if (!preg_match('/^\d{16,20}$/', $data['accountNumber'])) {
        throw new Exception('El número de cuenta debe contener entre 16 y 20 dígitos');
    }

    // Verificar si ya tiene una cuenta
    $stmt = $db->prepare("SELECT idCuenta FROM cuentabancaria WHERE idUsuario = ?");
    $stmt->execute([$userId]);
    $existingAccount = $stmt->fetch();

    if ($existingAccount) {
        // Actualizar cuenta existente
        $stmt = $db->prepare("
            UPDATE cuentabancaria 
            SET banco = ?, numeroCuenta = ?, fechaRegistro = NOW()
            WHERE idCuenta = ?
        ");
        $stmt->execute([$data['bank'], $data['accountNumber'], $existingAccount['idCuenta']]);
    } else {
        // Obtener el próximo ID disponible
        $stmt = $db->query("SELECT COALESCE(MAX(idCuenta), 0) FROM cuentabancaria");
        $maxId = $stmt->fetchColumn();
        $nextId = max(1, $maxId + 1); // Asegurar que el mínimo sea 1

        // Verificar que el ID no exista (por si hay huecos)
        $idExists = true;
        $attempts = 0;
        $maxAttempts = 10;
        
        while ($idExists && $attempts < $maxAttempts) {
            $stmt = $db->prepare("SELECT 1 FROM cuentabancaria WHERE idCuenta = ?");
            $stmt->execute([$nextId]);
            $idExists = $stmt->fetch();
            
            if ($idExists) {
                $nextId++;
                $attempts++;
            }
        }

        if ($attempts >= $maxAttempts) {
            throw new Exception('No se pudo asignar un ID único para la cuenta');
        }

        // Insertar nueva cuenta con el ID calculado
        $stmt = $db->prepare("
            INSERT INTO cuentabancaria 
            (idCuenta, idUsuario, banco, numeroCuenta, fechaRegistro)
            VALUES (?, ?, ?, ?, NOW())
        ");
        $stmt->execute([$nextId, $userId, $data['bank'], $data['accountNumber']]);
    }
    
    echo json_encode([
        'success' => true,
        'message' => 'Cuenta bancaria guardada exitosamente',
        'accountId' => $existingAccount ? $existingAccount['idCuenta'] : $nextId
    ]);
    
} catch (PDOException $e) {
    error_log("Error en save_account.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error de base de datos',
        'error' => $e->getMessage()
    ]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>