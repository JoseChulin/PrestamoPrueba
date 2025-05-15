document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('.login-form');
    const errorMessage = document.getElementById('error-message');
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Mostrar estado de carga
        const submitBtn = loginForm.querySelector('.login-btn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Iniciando sesión...';
        
        // Obtener los datos del formulario
        const formData = new FormData(loginForm);
        
        // Enviar la solicitud al servidor
        fetch('Php/login.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Redirigir al panel correspondiente
                window.location.href = data.redirect;
            } else {
                // Mostrar mensaje de error
                errorMessage.textContent = data.message;
                errorMessage.style.display = 'block';
                
                // Restaurar el botón
                submitBtn.disabled = false;
                submitBtn.textContent = 'Login';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            errorMessage.textContent = 'Error al conectar con el servidor';
            errorMessage.style.display = 'block';
            
            // Restaurar el botón
            submitBtn.disabled = false;
            submitBtn.textContent = 'Login';
        });
    });
    
    // Ocultar mensaje de error cuando el usuario empiece a escribir
    const inputs = loginForm.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            if (errorMessage.style.display === 'block') {
                errorMessage.style.display = 'none';
            }
        });
    });
});