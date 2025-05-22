document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const userDropdown = document.getElementById('userDropdown');
    const dropdownContent = document.getElementById('dropdownContent');
    const logoutBtn = document.getElementById('logoutBtn');
    const logoutModal = document.getElementById('logoutModal');
    const cancelBtn = document.querySelector('.cancel-btn');
    const confirmBtn = document.querySelector('.confirm-btn');
    const menuItems = document.querySelectorAll('.menu-item');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const paymentBtn = document.querySelector('.payment-btn');
    const repaymentSection = document.querySelector('.repayment');
    const addAccountBtn = document.querySelector('.add-card-btn');
    const mainContent = document.getElementById('main-content');
    
    // Variables globales
    let currentPaymentId = null;
    let currentLoanId = null;
    let currentPaymentAmount = 0;
    
    // Inicialización
    checkAuthStatus();
    loadUserData();
    setupEventListeners();
    
    // Configurar event listeners
    function setupEventListeners() {
        // Menú desplegable de usuario
        userDropdown.addEventListener('click', function() {
            dropdownContent.classList.toggle('show');
        });
        
        // Cerrar menú al hacer clic fuera
        window.addEventListener('click', function(event) {
            if (!event.target.matches('#userDropdown') && !event.target.closest('#userDropdown')) {
                dropdownContent.classList.remove('show');
            }
        });
        
        // Cerrar sesión
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logoutModal.style.display = 'flex';
        });
        
        cancelBtn.addEventListener('click', function() {
            logoutModal.style.display = 'none';
        });
        
        confirmBtn.addEventListener('click', function() {
            window.location.href = 'Php/logout.php';
        });
        
        // Menú lateral
        menuItems.forEach(item => {
            item.addEventListener('click', function() {
                menuItems.forEach(i => i.classList.remove('active'));
                this.classList.add('active');
            });
        });
        
        // Filtros de historial
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                loadUserData(); 
            });
        });
        
        // Botón para agregar cuenta bancaria
        addAccountBtn.addEventListener('click', function() {
            showAddAccountModal();
        });
    }
    
    // Verificar estado de autenticación
    function checkAuthStatus() {
        fetch('Php/check_auth.php')
            .then(response => response.json())
            .then(data => {
                if (!data.authenticated) {
                    window.location.href = 'Index.html';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                window.location.href = 'Index.html';
            });
    }
    
    // Cargar datos del usuario
    function loadUserData() {
        showLoading(true);
        
        fetch('Php/user_data.php')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al cargar datos');
                }
                return response.json();
            })
            .then(data => {
                if (data.error) {
                    throw new Error(data.error);
                }
                
                updateUserInfo(data.user);
                updateLoanInfo(data.loan, data.nextPayments);
                updatePaymentHistory(data.payments);
                updateLoanPlans(data.loanPlans, data.loan);
                
                showLoading(false);
            })
            .catch(error => {
                console.error('Error:', error);
                showError('Error al cargar los datos. Por favor recarga la página.');
                showLoading(false);
            });
    }
    
    // Actualizar información del usuario
    function updateUserInfo(user) {
        document.getElementById('usernameDisplay').textContent = user.name;
        
        if (user.account && user.account.number) {
            const first4 = user.account.number.substring(0, 4);
            const last4 = user.account.number.slice(-4);
            document.getElementById('cardNumber').textContent = `${first4} **** **** ${last4}`;
            document.getElementById('cardName').textContent = user.name.toUpperCase();
            
            // Mostrar banco en el dropdown
            const bankInfo = document.createElement('div');
            bankInfo.className = 'bank-info';
            bankInfo.innerHTML = `
                <i class="fas fa-university"></i>
                <span>${user.account.bank || 'Banco no especificado'}</span>
            `;
            dropdownContent.insertBefore(bankInfo, dropdownContent.firstChild);
        }
    }
    
    // Obtener iniciales del nombre
    function getInitials(name) {
        return name.split(' ')
            .map(part => part[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    }
    
    // Actualizar información del préstamo
    function updateLoanInfo(loan, nextPayments) {
        const repaymentDiv = document.querySelector('.repayment > div:first-child');
        
        if (loan && nextPayments && nextPayments.length > 0) {
            // Guardar datos para el pago
            const nextPayment = nextPayments.find(p => p.status === 0) || nextPayments[0];
            currentPaymentId = nextPayment.id;
            currentLoanId = loan.id;
            currentPaymentAmount = nextPayment.amount;
            
            // Crear calendario de pagos
            let calendarHTML = `
                <h3>Próximos Pagos</h3>
                <div class="payment-calendar">
            `;
            
            nextPayments.forEach(payment => {
                const daysDue = Math.floor((new Date(payment.date) - new Date()) / (1000 * 60 * 60 * 24));
                const statusClass = payment.status === 2 ? 'failed' : daysDue <= 3 ? 'warning' : '';
                const statusText = payment.status === 2 ? 'Vencido' : 
                                 daysDue <= 0 ? 'Hoy' : 
                                 daysDue <= 3 ? 'Próximo' : 'Pendiente';
                
                calendarHTML += `
                    <div class="payment-item ${statusClass}" data-payment-id="${payment.id}">
                        <div class="payment-date">${payment.date}</div>
                        <div class="payment-amount">${formatCurrency(payment.amount)}</div>
                        <div class="payment-status">${statusText}</div>
                    </div>
                `;
            });
            
            calendarHTML += `</div>`;
            repaymentDiv.innerHTML = calendarHTML;
            
            // Configurar botón de pago
            document.getElementById('paymentAmount').textContent = formatCurrency(nextPayment.amount);
            paymentBtn.disabled = false;
            paymentBtn.textContent = 'Realizar Pago';
            
            // Event listeners para items de pago
            document.querySelectorAll('.payment-item').forEach(item => {
                item.addEventListener('click', function() {
                    const paymentId = this.getAttribute('data-payment-id');
                    const payment = nextPayments.find(p => p.id == paymentId);
                    
                    if (payment) {
                        document.getElementById('paymentAmount').textContent = formatCurrency(payment.amount);
                        currentPaymentId = payment.id;
                        currentPaymentAmount = payment.amount;
                    }
                });
            });
        } else {
            repaymentDiv.innerHTML = `
                <h3>No tienes préstamos activos</h3>
                <p>Explora nuestros planes de préstamo</p>
            `;
            document.getElementById('paymentAmount').textContent = '$0.00';
            paymentBtn.disabled = true;
        }
    }
    
    // Mostrar planes de préstamo si no tiene
    function updateLoanPlans(plans, hasLoan) {
        const existingPlansSection = document.querySelector('.loan-plans');
        if (existingPlansSection) {
            existingPlansSection.remove();
        }
        
        if (hasLoan) return;
        
        const plansSection = document.createElement('div');
        plansSection.className = 'loan-plans';
        plansSection.innerHTML = `
            <h3>Planes de Préstamo Disponibles</h3>
            <div class="plans-grid">
                ${plans.map(plan => `
                    <div class="plan-card">
                        <h4>${plan.nombrePlan}</h4>
                        <p><i class="fas fa-percentage"></i> Tasa: ${plan.tasaInteres}%</p>
                        <p><i class="far fa-calendar-alt"></i> Plazo: ${plan.duracion} meses</p>
                        <p><i class="fas fa-money-bill-wave"></i> Monto: ${formatCurrency(plan.monto)}</p>
                        <button class="request-loan" data-plan="${plan.idPlan}">
                            <i class="fas fa-hand-holding-usd"></i> Solicitar
                        </button>
                    </div>
                `).join('')}
            </div>
        `;
        
        repaymentSection.appendChild(plansSection);
        
        // Event listeners para botones de solicitud
        document.querySelectorAll('.request-loan').forEach(btn => {
            btn.addEventListener('click', function() {
                const planId = this.getAttribute('data-plan');
                requestLoan(planId);
            });
        });
    }
    
    // Actualizar historial de pagos
    function updatePaymentHistory(payments) {
        const tbody = document.querySelector('#historyTable tbody');
        tbody.innerHTML = '';
        
        if (payments.length === 0) {
            const tr = document.createElement('tr');
            tr.innerHTML = '<td colspan="4" class="no-data">No hay registros de pagos</td>';
            tbody.appendChild(tr);
            return;
        }
        
        payments.forEach(payment => {
            const tr = document.createElement('tr');
            const paymentName = payment.reference ? 'Pago ' + payment.reference : 'Cuota programada';
            
            let statusClass = 'pending';
            let statusText = 'Pendiente';
            
            if (payment.status === 1) {
                statusClass = 'success';
                statusText = 'Completado';
            } else if (new Date(payment.date) < new Date() && payment.status === 0) {
                statusClass = 'failed';
                statusText = 'Atrasado';
            } else if (payment.status === 2) {
                statusClass = 'failed';
                statusText = 'Vencido';
            }
            
            tr.innerHTML = `
                <td>${paymentName}</td>
                <td>${payment.date}<br><small>${payment.paymentDate || ''}</small></td>
                <td>${formatCurrency(payment.amount)}<br>${payment.reference ? 'Ref: ' + payment.reference : ''}</td>
                <td class="status ${statusClass}">${statusText}</td>
            `;
            tbody.appendChild(tr);
        });
    }
    
    // Función para solicitar préstamo
    function requestLoan(planId) {
        showLoading(true);
        
        fetch('Php/request_loan.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ planId: planId })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showError('Solicitud de préstamo enviada con éxito', 'success');
                loadUserData();
            } else {
                showError(data.message || 'Error al solicitar préstamo');
            }
            showLoading(false);
        })
        .catch(error => {
            console.error('Error:', error);
            showError('Error al solicitar préstamo');
            showLoading(false);
        });
    }
    
    // Función para procesar pago

function makePayment() {
    if (!currentPaymentId || !currentLoanId) {
        showError('No se ha seleccionado un pago válido');
        return;
    }

    showLoading(true);
    paymentBtn.disabled = true;
    paymentBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';

    fetch('Php/process_payment.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            loanId: currentLoanId,
            paymentId: currentPaymentId,
            amount: currentPaymentAmount
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showPaymentReceipt(data.payment);
            loadUserData();
        } else {
            showError(data.message || 'Error al procesar pago');
        }
        paymentBtn.disabled = false;
        paymentBtn.textContent = 'Realizar Pago';
        showLoading(false);
    })
    .catch(error => {
        console.error('Error:', error);
        showError('Error al procesar pago');
        paymentBtn.disabled = false;
        paymentBtn.textContent = 'Realizar Pago';
        showLoading(false);
    });
}

function closeReceiptModal() {
    document.getElementById('receiptModal').style.display = 'none';
}

function showPaymentReceipt(paymentData) {
    // Eliminar modal existente si hay uno
    const existingModal = document.getElementById('receiptModal');
    if (existingModal) {
        existingModal.remove();
    }

    const receiptModal = document.createElement('div');
    receiptModal.id = 'receiptModal';
    receiptModal.className = 'modal';
    receiptModal.style.display = 'flex'; // Mostrar inmediatamente
    
    receiptModal.innerHTML = `
        <div class="modal-content receipt-content">
            <div class="receipt-header">
                <h3><i class="fas fa-receipt"></i> Comprobante de Pago</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="receipt-body">
                <div class="receipt-details">
                    <p><strong>Transacción:</strong> ${paymentData.transactionId || 'N/A'}</p>
                    <p><strong>Referencia:</strong> ${paymentData.reference || 'N/A'}</p>
                    <p><strong>Fecha:</strong> ${paymentData.date || 'N/A'}</p>
                    <p><strong>Monto:</strong> ${formatCurrency(paymentData.amount) || '$0.00'}</p>
                    <p><strong>Cliente:</strong> ${paymentData.loanInfo?.nombreCliente || 'N/A'}</p>
                </div>
            </div>
            <div class="receipt-footer">
                <button class="btn-print">
                    <i class="fas fa-print"></i> Imprimir
                </button>
                <button class="btn-close">
                    Cerrar
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(receiptModal);

    // Agregar event listeners
    receiptModal.querySelector('.close-modal').addEventListener('click', () => {
        receiptModal.remove();
    });
    
    receiptModal.querySelector('.btn-close').addEventListener('click', () => {
        receiptModal.remove();
    });
    
    receiptModal.querySelector('.btn-print').addEventListener('click', () => {
        printReceipt(paymentData);
    });
    
    // Cerrar al hacer clic fuera del contenido
    receiptModal.addEventListener('click', (e) => {
        if (e.target === receiptModal) {
            receiptModal.remove();
        }
    });
}

// Función para imprimir el comprobante
function printReceipt(paymentData) {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>Comprobante de Pago</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    h3 { color: #333; text-align: center; }
                    .receipt-details { margin: 20px 0; }
                    .receipt-details p { margin: 8px 0; }
                    strong { display: inline-block; width: 120px; }
                </style>
            </head>
            <body>
                <div class="receipt-content">
                    <h3>Comprobante de Pago</h3>
                    <div class="receipt-details">
                        <p><strong>Transacción:</strong> ${paymentData.transactionId || 'N/A'}</p>
                        <p><strong>Referencia:</strong> ${paymentData.reference || 'N/A'}</p>
                        <p><strong>Fecha:</strong> ${paymentData.date || 'N/A'}</p>
                        <p><strong>Monto:</strong> ${formatCurrency(paymentData.amount) || '$0.00'}</p>
                        <p><strong>Cliente:</strong> ${paymentData.loanInfo?.nombreCliente || 'N/A'}</p>
                    </div>
                </div>
                <script>
                    window.onload = function() {
                        setTimeout(function() {
                            window.print();
                            window.close();
                        }, 200);
                    };
                </script>
            </body>
        </html>
    `);
    printWindow.document.close();
}


paymentBtn.addEventListener('click', makePayment);
    
    // Mostrar modal para agregar cuenta bancaria
    function showAddAccountModal() {
        const modalHTML = `
            <div class="modal" id="accountModal">
                <div class="modal-content">
                    <h3>Agregar Cuenta Bancaria</h3>
                    <form id="accountForm">
                        <div class="form-group">
                            <label for="bankName">Banco</label>
                            <input type="text" id="bankName" name="bankName" required>
                        </div>
                        <div class="form-group">
                            <label for="accountNumber">Número de Cuenta</label>
                            <input type="text" id="accountNumber" name="accountNumber" required>
                        </div>
                        <div class="modal-buttons">
                            <button type="button" class="cancel-btn">Cancelar</button>
                            <button type="submit" class="confirm-btn">Guardar</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        const modalElement = document.createElement('div');
        modalElement.innerHTML = modalHTML;
        document.body.appendChild(modalElement);
        
        const modal = document.getElementById('accountModal');
        modal.style.display = 'flex';
        
        // Event listeners para el modal
        modal.querySelector('.cancel-btn').addEventListener('click', function() {
            modal.remove();
        });
        
        modal.querySelector('#accountForm').addEventListener('submit', function(e) {
            e.preventDefault();
            saveBankAccount(
                this.bankName.value,
                this.accountNumber.value
            );
        });
    }
    
    // Guardar cuenta bancaria
    function saveBankAccount(bankName, accountNumber) {
        showLoading(true);
        
        fetch('Php/save_account.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                bank: bankName,
                accountNumber: accountNumber
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showError('Cuenta bancaria guardada con éxito', 'success');
                loadUserData();
            } else {
                showError(data.message || 'Error al guardar cuenta');
            }
            document.getElementById('accountModal').remove();
            showLoading(false);
        })
        .catch(error => {
            console.error('Error:', error);
            showError('Error al guardar cuenta');
            document.getElementById('accountModal').remove();
            showLoading(false);
        });
    }
    
    // Mostrar/ocultar carga
    function showLoading(show) {
        const loading = document.getElementById('loading-spinner');
        
        if (show) {
            loading.style.display = 'flex';
            mainContent.style.opacity = '0.5';
            mainContent.style.pointerEvents = 'none';
        } else {
            loading.style.display = 'none';
            mainContent.style.opacity = '1';
            mainContent.style.pointerEvents = 'auto';
        }
    }
    
    // Mostrar mensaje de error/éxito
    function showError(message, type = 'error') {
        const errorEl = document.getElementById('error-message');
        errorEl.textContent = message;
        errorEl.className = type === 'error' ? 'error-message' : 'error-message success';
        errorEl.style.display = 'block';
        
        setTimeout(() => {
            errorEl.style.display = 'none';
        }, 5000);
    }
    
    // Formatear moneda
    function formatCurrency(amount) {
        return '$' + parseFloat(amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }

    // Configuración modificación cuenta bancaria
    function setupBankAccountModification() {
        // Botón de edición en la tarjeta
        const cardDisplay = document.querySelector('.card-display');
        if (cardDisplay) {
            const editBtn = document.createElement('button');
            editBtn.className = 'edit-account-btn';
            editBtn.innerHTML = '<i class="fas fa-pencil-alt"></i>';
            editBtn.title = 'Modificar cuenta';
            cardDisplay.appendChild(editBtn);
            
            editBtn.addEventListener('click', showEditBankAccountModal);
        }
    }

    function showEditBankAccountModal() {
        const modal = document.getElementById('bankAccountModal');
        const currentBank = document.getElementById('cardName').textContent;
        const currentAccount = document.getElementById('cardNumber').textContent.replace(/\*/g, '').replace(/\s/g, '');
        
        // Rellenar con datos actuales
        document.getElementById('editBankName').value = currentBank || '';
        document.getElementById('editAccountNumber').value = currentAccount || '';
        
        modal.style.display = 'flex';
    }

    // Llamar esta función al final del DOMContentLoaded
    setupBankAccountModification();
});