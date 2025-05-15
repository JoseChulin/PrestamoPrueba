document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const employeeId = urlParams.get('id');
    const form = document.getElementById("edit-employee-form");
    const cancelBtn = document.getElementById("cancel-btn");

    if (!employeeId) {
        window.location.href = "Encargado.html";
        return;
    }

    // Cargar datos del empleado
    loadEmployeeData(employeeId);

    // Event listeners
    form.addEventListener("submit", saveEmployeeChanges);
    cancelBtn.addEventListener("click", () => window.location.href = "Encargado.html");

    async function loadEmployeeData(id) {
        try {
            const response = await fetch(`Php/get_single_employee.php?id=${id}`);
            const data = await response.json();
            
            if (data.success) {
                populateForm(data.data);
            } else {
                throw new Error(data.message || "Empleado no encontrado");
            }
        } catch (error) {
            console.error("Error al cargar datos:", error);
            alert("Error al cargar datos del empleado");
            window.location.href = "Encargado.html";
        }
    }

    function populateForm(employee) {
        document.getElementById("employee-id").value = employee.idEmpleado;
        document.getElementById("employee-name").value = employee.nombreEmpleado;
        document.getElementById("employee-position").value = employee.idTipoEmpleado;
        document.getElementById("employee-email").value = employee.correo;
        document.getElementById("employee-phone").value = employee.telefono;

    }

    async function saveEmployeeChanges(e) {
        e.preventDefault();
        
        const formData = {
            id: document.getElementById("employee-id").value,
            nombre: document.getElementById("employee-name").value,
            puesto: document.getElementById("employee-position").value,
            email: document.getElementById("employee-email").value,
            telefono: document.getElementById("employee-phone").value,
            password: document.getElementById("employee-password").value
        };

        try {
            const response = await fetch("Php/update_employee.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();
            
            if (result.success) {
                alert("Empleado actualizado correctamente");
                window.location.href = "Encargado.html";
            } else {
                throw new Error(result.message || "Error al actualizar");
            }
        } catch (error) {
            console.error("Error al guardar cambios:", error);
            alert(`Error: ${error.message}`);
        }
    }
});