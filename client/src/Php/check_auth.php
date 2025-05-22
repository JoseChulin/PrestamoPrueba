<?php
session_start();

// Verificar si la sesión está activa y el usuario autenticado
if (!isset($_SESSION['idUsuario']) || empty($_SESSION['idUsuario'])) {
    header('HTTP/1.1 401 Unauthorized');
    echo json_encode(['authenticated' => false, 'error' => 'No hay sesión activa']);
    exit;
}

// Verificar datos mínimos de sesión
if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    header('HTTP/1.1 403 Forbidden');
    echo json_encode(['authenticated' => false, 'error' => 'Sesión no autenticada']);
    exit;
}

// Si todo está bien
echo json_encode([
    'authenticated' => true,
    'user_id' => $_SESSION['idUsuario'],
    'user_name' => $_SESSION['user_name'] ?? '',
    'user_email' => $_SESSION['user_email'] ?? ''
]);
?>