document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('formAltaEmpleado');
    const messageDiv = document.getElementById('message');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Validación de teléfono
        const telefono = form.telefono.value;
        if (!/^\d{10}$/.test(telefono)) {
            showMessage('El teléfono debe tener 10 dígitos numéricos', 'error');
            return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';

        try {
            const formData = new FormData(form);
            const response = await fetch('Php/altaPersonal.php', {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            if (data.success) {
                showMessage(data.message + '. ID Empleado: ' + form.idEmpleado.value, 'success');
                form.reset();
            } else {
                showMessage(data.message, 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showMessage('Error al conectar con el servidor', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-save"></i> Guardar Empleado';
        }
    });

    function showMessage(msg, type) {
        messageDiv.textContent = msg;
        messageDiv.className = `message ${type}`;
        setTimeout(() => messageDiv.textContent = '', 5000);
    }
});