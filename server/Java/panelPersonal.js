// Espera a que el DOM esté completamente cargado antes de ejecutar el código
document.addEventListener("DOMContentLoaded", function() {
    // ========== DEFINICIÓN DE ELEMENTOS DEL DOM ========== //
    // Objeto que contiene referencias a todos los elementos HTML importantes
    const elements = {
        menuToggle: document.getElementById("menu-toggle"),         // Botón para alternar el menú lateral
        sidebar: document.getElementById("sidebar"),               // Barra lateral del menú
        userBtn: document.getElementById("user-btn"),              // Botón del perfil de usuario
        userProfile: document.getElementById("user-profile"),       // Contenedor del perfil de usuario
        logoutBtn: document.getElementById("logout-btn"),           // Botón de cierre de sesión
        userName: document.getElementById("user-name"),             // Nombre de usuario en el header
        profileName: document.getElementById("profile-name"),       // Nombre en el perfil
        userRoleDisplay: document.getElementById("user-role-display"), // Rol del usuario en el header
        profileRole: document.getElementById("profile-role"),       // Rol en el perfil
        employeeModal: document.getElementById("employee-profile-modal"), // Modal de perfil de empleado
        closeModal: document.querySelector(".close-modal"),         // Botón para cerrar el modal
        employeesList: document.getElementById("employees-list"),   // Lista de empleados en la tabla
        searchInput: document.getElementById("employee-search"),    // Campo de búsqueda de empleados
        searchBtn: document.getElementById("search-btn"),           // Botón de búsqueda
        addEmployeeBtn: document.getElementById("add-employee"),    // Botón para agregar empleado
        totalEmployees: document.getElementById("total-empleados")  // Contador de empleados totales
    };

    // ========== ESTADO DE LA APLICACIÓN ========== //
    // Objeto que almacena el estado actual de la aplicación
    const state = {
        currentUser: null,           // Datos del usuario actualmente logueado
        employees: [],               // Lista completa de empleados
        filteredEmployees: []        // Lista filtrada de empleados (para búsquedas)
    };

    // ========== INICIALIZACIÓN ========== //
    // Función principal que inicia la aplicación
    init();

    function init() {
        setupEventListeners();  // Configura todos los event listeners
        loadCurrentUser();      // Carga los datos del usuario actual
    }

    // ========== CONFIGURACIÓN DE EVENT LISTENERS ========== //
    function setupEventListeners() {
        // Eventos para el menú y navegación
        if (elements.menuToggle) elements.menuToggle.addEventListener("click", toggleSidebar);
        if (elements.userBtn) elements.userBtn.addEventListener("click", toggleUserProfile);
        if (elements.closeModal) elements.closeModal.addEventListener("click", closeEmployeeModal);
        
        // Eventos para la búsqueda de empleados
        if (elements.searchBtn) elements.searchBtn.addEventListener("click", searchEmployees);
        if (elements.searchInput) {
            elements.searchInput.addEventListener("keypress", function(e) {
                if (e.key === "Enter") searchEmployees(); // Buscar al presionar Enter
            });
        }
        
        // Evento para agregar empleado
        if (elements.addEmployeeBtn) elements.addEmployeeBtn.addEventListener("click", showAddEmployeeModal);
        
        // Eventos globales de clic
        window.addEventListener("click", handleGlobalClicks);
    }

    // Maneja clics fuera de elementos importantes para cerrarlos
    function handleGlobalClicks(e) {
        // Cerrar modal si se hace clic fuera de él
        if (e.target === elements.employeeModal) closeEmployeeModal();
        
        // Cerrar menú de usuario si se hace clic fuera de él
        if (!elements.userBtn.contains(e.target)){
            elements.userProfile.classList.remove("show");
        }
    }

    // ========== CARGA DE DATOS ========== //
    // Carga los datos del usuario actual desde el servidor
    async function loadCurrentUser() {
        try {
            const response = await fetchData('get_employee_data.php');
            state.currentUser = response.data;  // Almacena los datos del usuario
            updateUserUI();                    // Actualiza la interfaz con los datos
            loadEmployees();                   // Carga la lista de empleados
            loadDashboardStats();              // Carga las estadísticas del dashboard
        } catch (error) {
            console.error("Error al cargar usuario:", error);
            showNotification("Error al cargar datos del usuario", "error");
        }
    }

    // Carga la lista completa de empleados desde el servidor
    async function loadEmployees() {
        try {
            const response = await fetchData('get_employees_list.php');
            state.employees = response.data;               // Almacena todos los empleados
            state.filteredEmployees = [...state.employees]; // Copia para el filtrado
            renderEmployeesList();                          // Renderiza la lista
        } catch (error) {
            console.error("Error al cargar empleados:", error);
        }
    }

    // Carga las estadísticas para el dashboard
    async function loadDashboardStats() {
        try {
            const response = await fetchData('get_dashboard_stats.php');
            updateDashboardUI(response.data);  // Actualiza la UI con las estadísticas
        } catch (error) {
            console.error("Error al cargar estadísticas:", error);
            showNotification("Error al cargar estadísticas", "error");
        }
    }

    // ========== BÚSQUEDA DE EMPLEADOS ========== //
    // Función principal para buscar empleados
    async function searchEmployees() {
        const searchTerm = elements.searchInput.value.trim();
        
        // Si no hay término de búsqueda, mostrar todos los empleados
        if (!searchTerm) {
            state.filteredEmployees = [...state.employees];
            renderEmployeesList();
            return;
        }

        try {
            // Si el término es numérico, buscar por ID
            if (!isNaN(searchTerm)) {
                const response = await fetchData(`get_single_employee.php?id=${searchTerm}`);
                if (response.success) {
                    state.filteredEmployees = [response.data]; // Mostrar solo el empleado encontrado
                } else {
                    // Si no encuentra por ID, buscar por nombre
                    await searchEmployeesByName(searchTerm);
                }
            } else {
                // Buscar solo por nombre
                await searchEmployeesByName(searchTerm);
            }
            
            renderEmployeesList();  // Actualizar la lista mostrada
        } catch (error) {
            console.error("Error en búsqueda:", error);
            showNotification("Error al realizar la búsqueda", "error");
        }
    }

    // Busca empleados por nombre
    async function searchEmployeesByName(name) {
        try {
            const response = await fetchData(`search_employees.php?name=${encodeURIComponent(name)}`);
            state.filteredEmployees = response.data || [];  // Almacena resultados o array vacío
        } catch (error) {
            throw error;
        }
    }

    // ========== RENDERIZADO DE INTERFAZ ========== //
    // Actualiza la UI con los datos del usuario actual
    function updateUserUI() {
        if (!state.currentUser) return;

        // Actualizar header 
        if (elements.userName) elements.userName.textContent = state.currentUser.name;
        if (elements.profileName) elements.profileName.textContent = state.currentUser.name;
        if (elements.userRoleDisplay) elements.userRoleDisplay.textContent = state.currentUser.position;
        if (elements.profileRole) elements.profileRole.textContent = state.currentUser.position;

        // Actualizar modal de perfil
        updateEmployeeModal(state.currentUser);
    }

    // Renderiza la lista de empleados en la tabla
    function renderEmployeesList() {
        if (!elements.employeesList) return;

        // Mostrar mensaje si no hay resultados
        if (state.filteredEmployees.length === 0) {
            elements.employeesList.innerHTML = `
                <tr>
                    <td colspan="4" class="no-results">No se encontraron empleados</td>
                </tr>
            `;
            return;
        }

        // Generar las filas de la tabla para cada empleado
        elements.employeesList.innerHTML = state.filteredEmployees
            .map(employee => createEmployeeRow(employee))
            .join("");

        // Agregar eventos a los botones de acción
        document.querySelectorAll(".profile-btn").forEach(btn => {
            btn.addEventListener("click", () => showEmployeeDetails(btn.dataset.id));
        });
    }

    // Crea el HTML para una fila de empleado
    function createEmployeeRow(employee) {
        return `
            <tr>
                <td>${employee.nombreEmpleado}</td>
                <td>${employee.nombrePuesto}</td>
                <td>
                    <span class="status-badge active">Activo</span>
                </td>
                <td class="actions-cell">
                    <button class="btn-action profile-btn" data-id="${employee.idEmpleado}">
                        <i class="fas fa-user"></i> Perfil
                    </button>
                    <button class="btn-action edit-btn" data-id="${employee.idEmpleado}">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                </td>
            </tr>
        `;
    }

    // Actualiza las estadísticas en el dashboard
    function updateDashboardUI(stats) {
        if (elements.totalEmployees) elements.totalEmployees.textContent = stats.totalEmployees;
        if (elements.newEmployees) elements.newEmployees.textContent = stats.newEmployees;
    }

    // ========== GESTIÓN DE EMPLEADOS ========== //
    // Muestra los detalles de un empleado en el modal
    async function showEmployeeDetails(employeeId) {
        try {
            const response = await fetchData(`get_single_employee.php?id=${employeeId}`);
            updateEmployeeModal(response.data);  // Actualiza el modal con los datos
            openEmployeeModal();                // Abre el modal
        } catch (error) {
            console.error("Error al cargar detalles:", error);
            showNotification("Error al cargar detalles del empleado", "error");
        }
    }

    // Actualiza el modal con los datos del empleado
    function updateEmployeeModal(employee) {
        if (!employee || !elements.employeeModal) return;

        // Formatea la fecha de registro
        const formattedDate = formatDate(employee.fechaRegistro || employee.registrationDate);

        // Actualiza todos los campos del modal
        document.getElementById("profile-id").textContent = employee.idEmpleado || employee.id;
        document.getElementById("profile-fullname").textContent = employee.nombreEmpleado || employee.name;
        document.getElementById("profile-position").textContent = employee.nombrePuesto || employee.position;
        document.getElementById("profile-email").textContent = employee.correo || employee.email;
        document.getElementById("profile-phone").textContent = employee.telefono || employee.phone;
        document.getElementById("profile-date").textContent = formattedDate;
    }

    // Evento para el botón Editar que redirige a la página de edición
    document.addEventListener("click", function(e) {
        if (e.target.closest(".edit-btn")) {
            const employeeId = e.target.closest(".edit-btn").dataset.id;
            window.location.href = `EditarEmpleado.html?id=${employeeId}`;
        }
    });

    // Muestra el modal para agregar nuevo empleado (pendiente de implementar)
    function showAddEmployeeModal() {
        showNotification("Funcionalidad en desarrollo", "info");
    }

    // ========== FUNCIONES DE UTILIDAD ========== //
    // Realiza una petición fetch a un endpoint
    async function fetchData(endpoint) {
        const response = await fetch(`Php/${endpoint}`);
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        return await response.json();
    }

    // Formatea una fecha a formato legible
    function formatDate(dateString) {
        if (!dateString) return "N/A";
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    }

    // Muestra una notificación temporal
    function showNotification(message, type = "success") {
        const notification = document.createElement("div");
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // ========== FUNCIONES DE INTERFAZ ========== //
    // Alterna la visibilidad del menú lateral
    function toggleSidebar() {
        elements.sidebar.classList.toggle("active");
    }

    // Alterna la visibilidad del perfil de usuario
    function toggleUserProfile(e) {
        e.stopPropagation();
        elements.userProfile.classList.toggle("show");
    }

    // Abre el modal de empleado
    function openEmployeeModal() {
        elements.employeeModal.style.display = "flex";
    }

    // Cierra el modal de empleado
    function closeEmployeeModal() {
        elements.employeeModal.style.display = "none";
    }

    // Cierra la sesión del usuario
    function logout() {
        fetch('Php/logout.php')
            .then(() => window.location.href = "../index.html")
            .catch(() => window.location.href = "../index.html");
    }

    // Mensajes de depuración
    console.log("Aplicación inicializada correctamente");
    console.log("Elementos cargados:", elements);
});