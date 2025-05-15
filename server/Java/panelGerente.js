document.addEventListener("DOMContentLoaded", function() {
    // Elementos del DOM
    const menuToggle = document.getElementById("menu-toggle");
    const sidebar = document.getElementById("sidebar");
    const userBtn = document.getElementById("user-btn");
    const userProfile = document.getElementById("user-profile");
    const logoutBtn = document.getElementById("logout-btn");
    const loanModal = document.getElementById("loan-details-modal");
    const closeModal = document.querySelector(".close-modal");
    const reportForm = document.getElementById("report-form");
    
    // Variables de estado
    let currentUser = null;

    // Inicialización
    init();

    function init() {
        setupEventListeners();
        checkSession();
    }

    function setupEventListeners() {
        // Toggle sidebar
        if (menuToggle) menuToggle.addEventListener("click", toggleSidebar);
        
        // Toggle user profile
        if (userBtn) userBtn.addEventListener("click", toggleUserProfile);
        
        // Cerrar sesión
        if (logoutBtn) logoutBtn.addEventListener("click", logout);
        
        // Cerrar modal
        if (closeModal) closeModal.addEventListener('click', closeLoanModal);
        
        // Generar reporte
        if (reportForm) reportForm.addEventListener('submit', generateReportHandler);
        
        // Cerrar al hacer clic fuera
        window.addEventListener('click', handleOutsideClick);
    }

    async function checkSession() {
        try {
            const userResponse = await fetch('Php/get_employee_data.php', {
                credentials: 'include'
            });
            
            if (userResponse.status === 401) {
                window.location.href = "Login.html";
                return;
            }
            
            const userData = await userResponse.json();
            
            if (userData.success) {
                currentUser = userData.data;
                updateUserInfo();
                loadDashboardData();
                loadRecentLoans();
                loadLatePayments();
            } else {
                window.location.href = "Login.html";
            }
        } catch (error) {
            console.error('Error al verificar sesión:', error);
            window.location.href = "Login.html";
        }
    }

    function toggleSidebar() {
        sidebar.classList.toggle("active");
    }

    function toggleUserProfile(e) {
        e.stopPropagation();
        userProfile.classList.toggle("show");
    }

    async function logout() {
        try {
            await fetch('Php/logout.php', {
                credentials: 'include'
            });
            window.location.href = "Index.html";
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            window.location.href = "Index.html";
        }
    }

    function closeLoanModal() {
        loanModal.style.display = 'none';
    }

    function handleOutsideClick(e) {
        if (e.target === loanModal) {
            closeLoanModal();
        }
        if (userBtn && !userBtn.contains(e.target) && userProfile && !userProfile.contains(e.target)) {
            userProfile.classList.remove('show');
        }
    }

    function generateReportHandler(e) {
        e.preventDefault();
        const reportType = document.getElementById('report-type').value;
        const startDate = document.getElementById('start-date').value;
        const endDate = document.getElementById('end-date').value;
        
        if (!startDate || !endDate) {
            alert('Por favor seleccione un rango de fechas válido');
            return;
        }
        
        const url = `report_form.html?type=${reportType}&start=${startDate}&end=${endDate}`;
        window.open(url, '_blank');
    }

    function updateUserInfo() {
        if (!currentUser) return;
        
        if (document.getElementById('user-name')) {
            document.getElementById('user-name').textContent = currentUser.name;
        }
        if (document.getElementById('profile-name')) {
            document.getElementById('profile-name').textContent = currentUser.name;
        }
    }

    async function loadDashboardData() {
        try {
            const response = await fetch('Php/get_gerente_stats.php', {
                credentials: 'include'
            });
            
            if (response.status === 401) {
                window.location.href = "Login.html";
                return;
            }
            
            const data = await response.json();
            
            if (data.success) {
                if (document.getElementById('total-prestamos')) {
                    document.getElementById('total-prestamos').textContent = '$' + (data.data.prestamosActivos || '0');
                }
                if (document.getElementById('ingresos-mes')) {
                    document.getElementById('ingresos-mes').textContent = '$' + (data.data.ingresosMes || '0');
                }
                if (document.getElementById('morosidad')) {
                    document.getElementById('morosidad').textContent = (data.data.tasaMorosidad || '0') + '%';
                }
                if (document.getElementById('clientes-activos')) {
                    document.getElementById('clientes-activos').textContent = data.data.clientesActivos || '0';
                }
            }
        } catch (error) {
            console.error('Error al cargar estadísticas:', error);
        }
    }

    async function loadRecentLoans() {
        try {
            const response = await fetch('Php/get_recent_loans.php', {
                credentials: 'include'
            });
            
            if (response.status === 401) {
                window.location.href = "Login.html";
                return;
            }
            
            const data = await response.json();
            const loansList = document.getElementById('loans-list');
            
            if (data.success && loansList) {
                loansList.innerHTML = data.data.map(loan => {
                    const statusClass = loan.estado === 'Activo' ? 'active' : 
                                      (loan.estado === 'En mora' ? 'warning' : 'inactive');
                    
                    return `
                        <tr>
                            <td>${loan.id || 'N/A'}</td>
                            <td>${loan.cliente || 'N/A'}</td>
                            <td>$${loan.monto ? Number(loan.monto).toFixed(2) : '0.00'}</td>
                            <td><span class="status-badge ${statusClass}">${loan.estado || 'N/A'}</span></td>
                            <td class="actions-cell">
                                <button class="btn-action view-btn" data-id="${loan.id ? loan.id.replace('PR-', '') : ''}">
                                    <i class="fas fa-eye"></i> Ver
                                </button>
                            </td>
                        </tr>
                    `;
                }).join('');
                
                // Agregar eventos a los botones de ver
                document.querySelectorAll('.view-btn').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const loanId = this.getAttribute('data-id');
                        if (loanId) loadLoanDetails(loanId);
                    });
                });
            }
        } catch (error) {
            console.error('Error al cargar préstamos recientes:', error);
        }
    }

    async function loadLatePayments() {
        try {
            const response = await fetch('Php/get_late_payments.php', {
                credentials: 'include'
            });
            
            if (response.status === 401) {
                window.location.href = "Login.html";
                return;
            }
            
            const data = await response.json();
            const container = document.getElementById('late-payments-container');
            
            if (data.success && container) {
                container.innerHTML = data.data.map(payment => `
                    <div class="late-payment-item">
                        <div class="late-payment-header">
                            <span class="payment-id">${payment.idPrestamo || 'N/A'}</span>
                            <span class="days-late">${payment.diasRetraso || '0'} días de retraso</span>
                        </div>
                        <div class="late-payment-content">
                            <p><strong>Cliente:</strong> ${payment.cliente || 'N/A'}</p>
                            <p><strong>Monto pendiente:</strong> $${payment.montoPendiente ? Number(payment.montoPendiente).toFixed(2) : '0.00'}</p>
                            <p><strong>Fecha vencimiento:</strong> ${payment.fechaVencimiento || 'N/A'}</p>
                        </div>
                        <div class="late-payment-actions">
                            <button class="btn-action resolve-btn">
                                <i class="fas fa-check"></i> Registrar pago
                            </button>
                        </div>
                    </div>
                `).join('');
            }
        } catch (error) {
            console.error('Error al cargar pagos atrasados:', error);
        }
    }


// Función para manejar la búsqueda de préstamos
async function searchLoans(searchTerm) {
    try {
        const response = await fetch(`Php/search_loans.php?searchTerm=${encodeURIComponent(searchTerm)}`, {
            credentials: 'include'
        });
        
        if (response.status === 401) {
            window.location.href = "Login.html";
            return;
        }
        
        const data = await response.json();
        const loansList = document.getElementById('loans-list');
        
        if (data.success && loansList) {
            if (data.data.length === 0) {
                loansList.innerHTML = '<tr><td colspan="5" class="no-results">No se encontraron préstamos</td></tr>';
                return;
            }
            
            loansList.innerHTML = data.data.map(loan => {
                const statusClass = loan.estado === 'Activo' ? 'active' : 
                                  (loan.estado === 'En mora' ? 'warning' : 'inactive');
                
                return `
                    <tr>
                        <td>${loan.id || 'N/A'}</td>
                        <td>${loan.cliente || 'N/A'}</td>
                        <td>$${loan.monto || '0.00'}</td>
                        <td><span class="status-badge ${statusClass}">${loan.estado || 'N/A'}</span></td>
                        <td class="actions-cell">
                            <button class="btn-action view-btn" data-id="${loan.id ? loan.id.replace('PR-', '') : ''}">
                                <i class="fas fa-eye"></i> Ver
                            </button>
                        </td>
                    </tr>
                `;
            }).join('');
            
            // Agregar eventos a los botones de ver
            document.querySelectorAll('.view-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const loanId = this.getAttribute('data-id');
                    if (loanId) loadLoanDetails(loanId);
                });
            });
        }
    } catch (error) {
        console.error('Error al buscar préstamos:', error);
    }
}

// Función para registrar un pago pendiente
async function registerPayment(paymentId) {
    try {
        const response = await fetch('Php/register_payment.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ idPago: paymentId }),
            credentials: 'include'
        });
        
        if (response.status === 401) {
            window.location.href = "Login.html";
            return;
        }
        
        const data = await response.json();
        
        if (data.success) {
            alert('Pago registrado correctamente');
            loadLatePayments(); // Recargar la lista de pagos incumplidos
        } else {
            alert('Error al registrar el pago: ' + (data.message || 'Intente nuevamente'));
        }
    } catch (error) {
        console.error('Error al registrar pago:', error);
        alert('Error de conexión al registrar el pago');
    }
}

function init() {
    setupEventListeners();
    checkSession();
    
    // Event listener para el buscador de préstamos
    const searchInput = document.getElementById('loan-search');
    const searchButton = document.querySelector('#prestamos .search-bar button');
    
    if (searchInput && searchButton) {
        searchButton.addEventListener('click', () => {
            if (searchInput.value.trim()) {
                searchLoans(searchInput.value.trim());
            } else {
                loadRecentLoans(); // Volver a cargar los préstamos recientes si la búsqueda está vacía
            }
        });
        
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && searchInput.value.trim()) {
                searchLoans(searchInput.value.trim());
            }
        });
    }
    
    // Event listener para los botones de registrar pago 
    document.addEventListener('click', (e) => {
        if (e.target.closest('.resolve-btn')) {
            const paymentItem = e.target.closest('.late-payment-item');
            const paymentId = paymentItem ? paymentItem.dataset.paymentId : null;
            if (paymentId) {
                if (confirm('¿Está seguro que desea registrar este pago?')) {
                    registerPayment(paymentId);
                }
            }
        }
    });
}


async function loadLatePayments() {
    try {
        const response = await fetch('Php/get_late_payments.php', {
            credentials: 'include'
        });
        
        if (response.status === 401) {
            window.location.href = "Login.html";
            return;
        }
        
        const data = await response.json();
        const container = document.getElementById('late-payments-container');
        
        if (data.success && container) {
            container.innerHTML = data.data.map(payment => `
                <div class="late-payment-item" data-payment-id="${payment.idPago}">
                    <div class="late-payment-header">
                        <span class="payment-id">${payment.idPrestamo || 'N/A'}</span>
                        <span class="days-late">${payment.diasRetraso || '0'} días de retraso</span>
                        ${payment.pagosPosterioresPendientes > 0 ? 
                         `<span class="pending-after">(+${payment.pagosPosterioresPendientes} pagos pendientes)</span>` : ''}
                    </div>
                    <div class="late-payment-content">
                        <p><strong>Cliente:</strong> ${payment.cliente || 'N/A'}</p>
                        <p><strong>Cuota #:</strong> ${payment.cuota || 'N/A'}</p>
                        <p><strong>Monto pendiente:</strong> $${payment.montoPendiente || '0.00'}</p>
                        <p><strong>Fecha vencimiento:</strong> ${payment.fechaVencimiento || 'N/A'}</p>
                    </div>
                    <div class="late-payment-actions">
                        <button class="btn-action resolve-btn">
                            <i class="fas fa-check"></i> Registrar pago
                        </button>
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error al cargar pagos atrasados:', error);
    }
}

    async function loadLoanDetails(loanId) {
        try {
            const response = await fetch(`Php/get_loan_details.php?id=${loanId}`, {
                credentials: 'include'
            });
            
            if (response.status === 401) {
                window.location.href = "Login.html";
                return;
            }
            
            const data = await response.json();
            
            if (data.success && loanModal) {
                const { prestamo, pagos } = data.data;
                
                // Actualizar información del préstamo
                if (document.getElementById('loan-id')) {
                    document.getElementById('loan-id').textContent = prestamo.id || 'N/A';
                }
                if (document.getElementById('loan-client')) {
                    document.getElementById('loan-client').textContent = prestamo.cliente || 'N/A';
                }
                if (document.getElementById('loan-amount')) {
                    document.getElementById('loan-amount').textContent = prestamo.monto ? '$' + prestamo.monto : '$0.00';
                }
                if (document.getElementById('loan-rate')) {
                    document.getElementById('loan-rate').textContent = prestamo.tasaInteres || 'N/A';
                }
                if (document.getElementById('loan-term')) {
                    document.getElementById('loan-term').textContent = prestamo.plazo || 'N/A';
                }
                if (document.getElementById('loan-start')) {
                    document.getElementById('loan-start').textContent = prestamo.fechaInicio || 'N/A';
                }
                if (document.getElementById('loan-status')) {
                    const statusClass = prestamo.estado === 'Activo' ? 'active' : 'warning';
                    document.getElementById('loan-status').innerHTML = 
                        `<span class="status-badge ${statusClass}">${prestamo.estado || 'N/A'}</span>`;
                }
                
                // Actualizar historial de pagos
                const paymentsList = document.getElementById('payments-list');
                if (paymentsList) {
                    paymentsList.innerHTML = pagos.map(payment => {
                        const statusClass = payment.estado === 'Pagado' ? 'active' : 'warning';
                        return `
                            <tr>
                                <td>${payment.fechaVencimiento || 'N/A'}</td>
                                <td>$${payment.montoPago ? Number(payment.montoPago).toFixed(2) : '0.00'}</td>
                                <td><span class="status-badge ${statusClass}">${payment.estado || 'N/A'}</span></td>
                            </tr>
                        `;
                    }).join('');
                }
                
                // Mostrar el modal
                loanModal.style.display = 'flex';
            }
        } catch (error) {
            console.error('Error al cargar detalles del préstamo:', error);
        }
    }

    
});