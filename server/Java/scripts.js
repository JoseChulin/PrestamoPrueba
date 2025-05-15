document.addEventListener("DOMContentLoaded", () => {
    // Elementos del DOM
    const toggleBtn = document.getElementById("menu-toggle");
    const sidebar = document.getElementById("sidebar");
    const userBtn = document.getElementById("user-btn");
    const userProfile = document.getElementById("user-profile");
    const userNameElements = document.querySelectorAll("#user-name, .profile-header h4");
    const userRoleElements = document.querySelectorAll(".user-role, .profile-header p");
    
    // Estado de la aplicación
    let prestamistaData = null;
    
    // Inicialización
    init();
    
    async function init() {
        setupEventListeners();
        await loadPrestamistaData();
        loadDashboardData();
        loadProximosVencimientos();
        loadSolicitudesRecientes();
    }
    
    function setupEventListeners() {
        // Toggle sidebar
        if (toggleBtn) toggleBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            sidebar.classList.toggle("active");
        });
        
        // Toggle user profile
        if (userBtn) userBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            userProfile.classList.toggle("visible");
        });
        
        // Cerrar menús al hacer clic fuera
        document.addEventListener("click", (e) => {
            if (!sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
                sidebar.classList.remove("active");
            }
            
            if (!userBtn.contains(e.target) && !userProfile.contains(e.target)) {
                userProfile.classList.remove("visible");
            }
        });
        
        // Prevenir que el clic dentro del sidebar cierre el menú
        if (sidebar) sidebar.addEventListener("click", (e) => {
            e.stopPropagation();
        });
        
        // Efecto de carga inicial
        document.body.style.opacity = "0";
        setTimeout(() => {
            document.body.style.transition = "opacity 0.5s ease";
            document.body.style.opacity = "1";
        }, 100);
    }
    
    async function loadPrestamistaData() {
        try {
            const response = await fetch('Php/get_prestamista_data.php');
            const data = await response.json();
            
            if (data.success) {
                prestamistaData = data.data;
                updateUserUI();
            }
        } catch (error) {
            console.error("Error al cargar datos del prestamista:", error);
        }
    }
    
    function updateUserUI() {
        if (!prestamistaData) return;
        
        // Actualizar nombre en todos los lugares
        userNameElements.forEach(el => {
            el.textContent = prestamistaData.name;
        });
        
        // Actualizar rol
        userRoleElements.forEach(el => {
            el.textContent = prestamistaData.position;
        });
    }
    
    async function loadDashboardData() {
        try {
            const response = await fetch('Php/get_prestamista_stats.php');
            const data = await response.json();
            
            if (data.success) {
                updateDashboardUI(data.data);
            }
        } catch (error) {
            console.error("Error al cargar estadísticas:", error);
        }
    }
    
    function updateDashboardUI(stats) {
        // Actualizar las tarjetas de estadísticas
        document.querySelector(".stat-card:nth-child(1) h3").textContent = stats.prestamosActivos;
        document.querySelector(".stat-card:nth-child(2) h3").textContent = stats.pagosHoy;
        document.querySelector(".stat-card:nth-child(3) h3").textContent = stats.morosidad;
        document.querySelector(".stat-card:nth-child(4) h3").textContent = stats.nuevasSolicitudes;
        
        // Actualizar badges en el menú
        document.querySelector(".sidebar li:nth-child(2) .badge").textContent = stats.nuevasSolicitudes;
        document.querySelector(".sidebar li:nth-child(3) .badge").textContent = stats.prestamosActivos;
    }
    
    async function loadProximosVencimientos() {
        try {
            const response = await fetch('Php/get_proximos_vencimientos.php');
            const data = await response.json();
            
            if (data.success) {
                renderProximosVencimientos(data.data);
            }
        } catch (error) {
            console.error("Error al cargar próximos vencimientos:", error);
        }
    }
    
    function renderProximosVencimientos(vencimientos) {
        const container = document.querySelector(".dashboard-card:nth-child(1) .card-content");
        
        if (vencimientos.length === 0) {
            container.innerHTML = '<p class="no-results">No hay pagos próximos a vencer</p>';
            return;
        }
        
        let html = '';
        
        vencimientos.forEach(vencimiento => {
            const fecha = new Date(vencimiento.fechaVencimiento);
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);
            
            let fechaTexto = '';
            if (fecha.toDateString() === hoy.toDateString()) {
                fechaTexto = 'Hoy, ' + fecha.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
            } else {
                fechaTexto = 'Mañana';
            }
            
            html += `
                <div class="due-item">
                    <div class="due-client">
                        <strong>${vencimiento.cliente}</strong>
                        <span>Préstamo #${vencimiento.idPrestamo}</span>
                    </div>
                    <div class="due-info">
                        <span class="due-amount">$${vencimiento.montoPago.toFixed(2)}</span>
                        <span class="due-date">${fechaTexto}</span>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
    }
    
    async function loadSolicitudesRecientes() {
        try {
            const response = await fetch('Php/get_solicitudes_recientes.php');
            const data = await response.json();
            
            if (data.success) {
                renderSolicitudesRecientes(data.data);
            }
        } catch (error) {
            console.error("Error al cargar solicitudes recientes:", error);
        }
    }
    
    function renderSolicitudesRecientes(solicitudes) {
        const container = document.querySelector(".dashboard-card:nth-child(2) .card-content");
        
        if (solicitudes.length === 0) {
            container.innerHTML = '<p class="no-results">No hay solicitudes recientes</p>';
            return;
        }
        
        let html = '';
        
        solicitudes.forEach(solicitud => {
            html += `
                <div class="request-item">
                    <div class="request-client">
                        <strong>${solicitud.cliente}</strong>
                        <span>${solicitud.tipoCliente}</span>
                    </div>
                    <div class="request-info">
                        <span class="request-amount">$${solicitud.montoSolicitado.toFixed(2)}</span>
                        <button class="action-btn" data-id="${solicitud.idPrestamo}">Revisar</button>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
        
        // Agregar eventos a los botones
        document.querySelectorAll(".action-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const prestamoId = btn.dataset.id;
                // Aquí puedes redirigir a la página de revisión o abrir un modal
                console.log("Revisar préstamo:", prestamoId);
            });
        });
    }
});