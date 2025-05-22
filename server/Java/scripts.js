document.addEventListener("DOMContentLoaded", () => {
  // Elementos del DOM
  const elements = {
    menuToggle: document.getElementById("menu-toggle"),
    sidebar: document.getElementById("sidebar"),
    userBtn: document.getElementById("user-btn"),
    userProfile: document.getElementById("user-profile"),
    logoutBtn: document.getElementById("logout-btn"),
    userName: document.getElementById("user-name"),
    profileName: document.getElementById("profile-name"),
    sections: {
      resumen: document.getElementById("resumen"),
      solicitudes: document.getElementById("solicitudes"),
      dudas: document.getElementById("dudas")
    },
    stats: {
      prestamosActivos: document.getElementById("prestamos-activos"),
      pagosHoy: document.getElementById("pagos-hoy"),
      morosidad: document.getElementById("morosidad")
    },
    solicitudesBody: document.getElementById("solicitudes-body"),
    dudasList: document.getElementById("dudas-list"),
    responderDudaModal: document.getElementById("responder-duda-modal"),
    dudaContent: document.getElementById("duda-content"),
    respuestaForm: document.getElementById("respuesta-form"),
    badgeSolicitudes: document.getElementById("badge-solicitudes"),
    badgeDudas: document.getElementById("badge-dudas")
  };

  // Estado de la aplicación
  let currentUser = null;
  let solicitudes = [];
  let dudas = [];

  // Inicialización
  init();

  async function init() {
    setupEventListeners();
    await loadUserData();
    loadResumenData();
    loadSolicitudes();
    loadDudas();
    loadPrestamosPrestamista();

     // Evento para actualizar
  document.getElementById('refresh-prestamos').addEventListener('click', loadPrestamosPrestamista);
}
  

  function setupEventListeners() {
    // Menú y navegación
    elements.menuToggle.addEventListener("click", toggleSidebar);
    elements.userBtn.addEventListener("click", toggleUserProfile);
    elements.logoutBtn.addEventListener("click", logout);
    
    // Navegación entre secciones
    document.querySelectorAll(".sidebar a").forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const sectionId = link.getAttribute("href").substring(1);
        showSection(sectionId);
      });
document.querySelectorAll(".btn-responder").forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const idDuda = btn.closest(".duda-item").dataset.id;
    mostrarModalResponder(idDuda);
  });
});
    });
    
    // Modal de dudas
    document.querySelector(".close-modal").addEventListener("click", closeModal);
    elements.respuestaForm.addEventListener("submit", handleRespuestaSubmit);
    
    // Cerrar modal al hacer clic fuera
    elements.responderDudaModal.addEventListener("click", (e) => {
      if (e.target === elements.responderDudaModal) {
        closeModal();
      }
    });
    document.getElementById('ver-historial-dudas').addEventListener('click', mostrarHistorialDudas);
  }

  // ==================== FUNCIONES PARA CARGAR DATOS ====================

  async function loadUserData() {
    try {
      const response = await fetch('Php/get_prestamista_data.php', {
        credentials: 'include'
      });
      
      if (!response.ok) throw new Error('Error en la respuesta del servidor');
      
      const data = await response.json();
      
      if (data.success) {
        currentUser = data.data;
        elements.userName.textContent = currentUser.name;
        elements.profileName.textContent = currentUser.name;
      } else {
        showError("Error al cargar datos del usuario");
      }
    } catch (error) {
      console.error("Error al cargar datos del usuario:", error);
      showError("Error de conexión al cargar datos del usuario");
    }
  }

  async function loadResumenData() {
    try {
      const response = await fetch('Php/get_resumen_prestamista.php', {
        credentials: 'include'
      });
      
      if (!response.ok) throw new Error('Error en la respuesta del servidor');
      
      const data = await response.json();
      
      if (data.success) {
        elements.stats.prestamosActivos.textContent = data.data.prestamosActivos;
        elements.stats.pagosHoy.textContent = data.data.pagosHoy;
        elements.stats.morosidad.textContent = data.data.morosidad;
      } else {
        showError("Error al cargar datos de resumen");
      }
    } catch (error) {
      console.error("Error al cargar resumen:", error);
      showError("Error de conexión al cargar resumen");
    }
  }

  async function loadSolicitudes() {
    try {
      showLoading(true);
      const response = await fetch('Php/get_solicitudes_revision.php', {
        credentials: 'include'
      });
      
      if (!response.ok) throw new Error('Error en la respuesta del servidor');
      
      const data = await response.json();
      
      if (data.success) {
        solicitudes = data.data;
        renderSolicitudes();
        elements.badgeSolicitudes.textContent = solicitudes.length;
      } else {
        showError("Error al cargar solicitudes");
      }
    } catch (error) {
      console.error("Error al cargar solicitudes:", error);
      showError("Error de conexión al cargar solicitudes");
    } finally {
      showLoading(false);
    }
  }

  async function loadDudas() {
    try {
      const response = await fetch('Php/get_dudas_clientes.php', {
        credentials: 'include'
      });
      
      if (!response.ok) throw new Error('Error en la respuesta del servidor');
      
      const data = await response.json();
      
      if (data.success) {
        dudas = data.data;
        renderDudas();
        elements.badgeDudas.textContent = dudas.length;
      } else {
        showError("Error al cargar dudas");
      }
    } catch (error) {
      console.error("Error al cargar dudas:", error);
      showError("Error de conexión al cargar dudas");
    }
  }

  // ==================== FUNCIONES PARA RENDERIZAR DATOS ====================

  function renderSolicitudes() {
    elements.solicitudesBody.innerHTML = solicitudes.map(solicitud => {
      const monto = formatMonto(solicitud.montoSolicitado);
      const fecha = formatDate(solicitud.fechaSolicitud);
      const docCount = solicitud.documentos?.length || 0;
      const prestamosAnteriores = solicitud.historial?.length || 0;
      const nombre = solicitud.nombreCliente || 'Cliente desconocido';

      return `
        <tr data-id="${solicitud.idPrestamo}">
          <td>${nombre}</td>
          <td>${monto}</td>
          <td>${solicitud.nombrePlan || 'Plan no especificado'}</td>
          <td>${fecha}</td>
          <td>
            <button class="btn btn-ver-docs" data-id="${solicitud.idPrestamo}">
              <i class="fas fa-file-alt"></i> Documentos (${docCount})
            </button>
          </td>
          <td>
            <button class="btn btn-ver-historial" data-id="${solicitud.idUsuario}">
              <i class="fas fa-history"></i> Historial (${prestamosAnteriores})
            </button>
          </td>
          <td class="actions">
            <button class="btn btn-aceptar" data-id="${solicitud.idPrestamo}">
              <i class="fas fa-check"></i> Aceptar
            </button>
            <button class="btn btn-rechazar" data-id="${solicitud.idPrestamo}">
              <i class="fas fa-times"></i> Rechazar
            </button>
          </td>
        </tr>
      `;
    }).join('');

    // Eventos a los botones
    addDocumentosEvents();
    addHistorialEvents();
    addActionEvents();
  }
  
  // Variables de paginación
let currentPage = 1;
const itemsPerPage = 10;
let allPrestamos = [];

async function loadPrestamosPrestamista() {
  try {
    showLoading(true);
    const response = await fetch('Php/get_prestamos_prestamista.php', {
      credentials: 'include'
    });
    
    if (!response.ok) throw new Error('Error en la respuesta del servidor');
    
    const data = await response.json();
    
    if (data.success) {
      allPrestamos = data.data;
      currentPage = 1; // Resetear a primera página
      renderPrestamosTable();

    } else {
      throw new Error(data.message || "Error al cargar préstamos");
    }
  } catch (error) {
    console.error("Error al cargar préstamos:", error);
    showError(error.message || "Error de conexión al cargar préstamos");
  } finally {
    showLoading(false);
  }
}

function renderPrestamosTable() {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const prestamosToShow = allPrestamos.slice(startIndex, endIndex);
  
  const tableContainer = document.getElementById('prestamos-container');
  
  tableContainer.innerHTML = `
    <table class="prestamos-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Cliente</th>
          <th>Monto</th>
          <th>Plan</th>
          <th>Fecha</th>
          <th>Estado</th>
          <th>Pagado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        ${prestamosToShow.map(prestamo => `
          <tr>
            <td>#${prestamo.idPrestamo}</td>
            <td>
              <div class="cliente-info">
                <strong>${prestamo.cliente}</strong>
                <small>${prestamo.telefono || 'N/A'}</small>
              </div>
            </td>
            <td>${formatMonto(prestamo.montoSolicitado)}</td>
            <td>${prestamo.nombrePlan}</td>
            <td>${formatDate(prestamo.fechaSolicitud)}</td>
            <td><span class="estado-badge estado-${prestamo.estado}">${getEstadoPrestamoText(prestamo.estado)}</span></td>
            <td>
              <div class="progress-container">
                <div class="progress-bar" style="width: ${(prestamo.total_pagado / prestamo.montoSolicitado * 100).toFixed(2)}%"></div>
                <span>${formatMonto(prestamo.total_pagado)}</span>
              </div>
            </td>
            <td>
              <button class="btn btn-sm btn-detalles" data-id="${prestamo.idPrestamo}">
                <i class="fas fa-eye"></i> Detalles
              </button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
  
  // Actualizar información de paginación
  updatePaginationInfo();
  
  // Eventos a los botones de detalles
  document.querySelectorAll('.btn-detalles').forEach(btn => {
    btn.addEventListener('click', () => {
      const idPrestamo = btn.dataset.id;
      showPrestamoDetails(idPrestamo);
    });
  });
}

function updatePaginationInfo() {
  const totalItems = allPrestamos.length;
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  
  document.getElementById('prestamos-info').textContent = 
    `Mostrando ${startItem}-${endItem} de ${totalItems} préstamos`;
  
  renderPaginationControls();
}

function renderPaginationControls() {
  const totalPages = Math.ceil(allPrestamos.length / itemsPerPage);
  const paginationControls = document.getElementById('pagination-controls');
  
  let controlsHTML = '';
  
  if (totalPages > 1) {
    // Botón Anterior
    controlsHTML += `
      <button class="page-btn" id="prev-page" ${currentPage === 1 ? 'disabled' : ''}>
        <i class="fas fa-chevron-left"></i>
      </button>`;
    
    // Páginas
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    if (startPage > 1) {
      controlsHTML += `<button class="page-btn" data-page="1">1</button>`;
      if (startPage > 2) {
        controlsHTML += `<span class="page-dots">...</span>`;
      }
    }
    
    for (let i = startPage; i <= endPage; i++) {
      controlsHTML += `
        <button class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">
          ${i}
        </button>`;
    }
    
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        controlsHTML += `<span class="page-dots">...</span>`;
      }
      controlsHTML += `<button class="page-btn" data-page="${totalPages}">${totalPages}</button>`;
    }
    
    // Botón Siguiente
    controlsHTML += `
      <button class="page-btn" id="next-page" ${currentPage === totalPages ? 'disabled' : ''}>
        <i class="fas fa-chevron-right"></i>
      </button>`;
  }
  
  paginationControls.innerHTML = controlsHTML;
  
  // Eventos de los controles de paginación
  document.querySelectorAll('.page-btn:not([id])').forEach(btn => {
    btn.addEventListener('click', () => {
      currentPage = parseInt(btn.dataset.page);
      renderPrestamosTable();
    });
  });
  
  document.getElementById('prev-page')?.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      renderPrestamosTable();
    }
  });
  
  document.getElementById('next-page')?.addEventListener('click', () => {
    const totalPages = Math.ceil(allPrestamos.length / itemsPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      renderPrestamosTable();
    }
  });
}

async function showPrestamoDetails(idPrestamo) {
  try {
    showLoading(true);
    
    // Obtener detalles completos del préstamo
    const response = await fetch(`Php/get_detalles_prestamo.php?idPrestamo=${idPrestamo}`, {
      credentials: 'include'
    });
    
    if (!response.ok) throw new Error('Error en la respuesta del servidor');
    
    const data = await response.json();
    
    if (data.success) {
      renderPrestamoModal(data.data);
    } else {
      throw new Error(data.message || "Error al cargar detalles");
    }
  } catch (error) {
    console.error("Error al mostrar detalles:", error);
    showError(error.message || "Error al cargar detalles del préstamo");
  } finally {
    showLoading(false);
  }
}

function renderPrestamoModal(prestamo) {
  const modal = document.getElementById('prestamo-modal');
  const modalContent = document.getElementById('prestamo-modal-content');
  
  modalContent.innerHTML = `
    <div class="modal-header">
      <h3>Detalles del Préstamo #${prestamo.idPrestamo}</h3>
      <span class="estado-badge estado-${prestamo.estado}">
        ${getEstadoPrestamoText(prestamo.estado)}
      </span>
    </div>
    
    <div class="modal-body">
      <div class="row">
        <div class="col">
          <h4><i class="fas fa-user"></i> Información del Cliente</h4>
          <div class="info-group">
            <label>Nombre:</label>
            <span>${prestamo.cliente}</span>
          </div>
          <div class="info-group">
            <label>Teléfono:</label>
            <span>${prestamo.telefono || 'N/A'}</span>
          </div>
        </div>
        
        <div class="col">
          <h4><i class="fas fa-file-invoice-dollar"></i> Detalles del Préstamo</h4>
          <div class="info-group">
            <label>Monto:</label>
            <span>${formatMonto(prestamo.montoSolicitado)}</span>
          </div>
          <div class="info-group">
            <label>Plan:</label>
            <span>${prestamo.nombrePlan}</span>
          </div>
          <div class="info-group">
            <label>Tasa de interés:</label>
            <span>${prestamo.tasaInteres}%</span>
          </div>
          <div class="info-group">
            <label>Fecha solicitud:</label>
            <span>${formatDate(prestamo.fechaSolicitud)}</span>
          </div>
        </div>
      </div>
      
      <div class="row">
        <div class="col">
          <h4><i class="fas fa-calendar-check"></i> Progreso de Pagos</h4>
          <div class="progress-summary">
            <div class="progress-container large">
              <div class="progress-bar" style="width: ${(prestamo.total_pagado / prestamo.montoSolicitado * 100).toFixed(2)}%"></div>
              <span>${((prestamo.total_pagado / prestamo.montoSolicitado) * 100).toFixed(2)}% completado</span>
            </div>
            <div class="progress-stats">
              <div class="stat">
                <span class="stat-label">Pagado:</span>
                <span class="stat-value">${formatMonto(prestamo.total_pagado)}</span>
              </div>
              <div class="stat">
                <span class="stat-label">Por pagar:</span>
                <span class="stat-value">${formatMonto(prestamo.montoSolicitado - prestamo.total_pagado)}</span>
              </div>
              <div class="stat">
                <span class="stat-label">Total:</span>
                <span class="stat-value">${formatMonto(prestamo.montoSolicitado)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="row">
        <div class="col">
          <h4><i class="fas fa-calendar-alt"></i> Próximos Pagos</h4>
          <div class="pagos-container">
            ${prestamo.proximos_pagos && prestamo.proximos_pagos.length > 0 ? 
              prestamo.proximos_pagos.map(pago => `
                <div class="pago-item ${pago.estado === 1 ? 'pagado' : ''}">
                  <div class="pago-fecha">${formatDate(pago.fechaVencimiento)}</div>
                  <div class="pago-monto">${formatMonto(pago.montoPago)}</div>
                  <div class="pago-estado">
                    <span class="estado-badge estado-${pago.estado}">
                      ${pago.estado === 1 ? 'Pagado' : 'Pendiente'}
                    </span>
                  </div>
                </div>
              `).join('') : 
              '<p>No hay pagos pendientes</p>'}
          </div>
        </div>
      </div>
    </div>
    
    <div class="modal-footer">
      <button class="btn btn-primary" id="ver-calendario-completo" data-id="${prestamo.idPrestamo}">
        <i class="fas fa-calendar-alt"></i> Ver calendario completo
      </button>
      <button class="btn btn-secondary" id="cerrar-modal">
        <i class="fas fa-times"></i> Cerrar
      </button>
    </div>
  `;
  
  // Mostrar modal
  modal.style.display = 'flex';
  
  // Evento para cerrar modal
  document.getElementById('cerrar-modal').addEventListener('click', () => {
    modal.style.display = 'none';
  });
  
  // Evento para ver calendario completo
  document.getElementById('ver-calendario-completo').addEventListener('click', () => {
    modal.style.display = 'none';
    verCalendarioCompleto(prestamo.idPrestamo);
  });
  
  // Cerrar al hacer clic fuera del contenido
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
}


function getEstadoPrestamoText(estado) {
  const estados = {
    1: 'Aprobado',
    2: 'En revisión',
    3: 'Rechazado',
    4: 'Pagado',
    5: 'En mora'
  };
  return estados[estado] || 'Desconocido';
}

function renderDudas() {
    elements.dudasList.innerHTML = dudas.map(duda => `
      <div class="duda-item" data-id="${duda.idNotificacion}">
        <div class="duda-header">
          <span class="cliente">${duda.nombreCliente}</span>
          <span class="fecha">${formatDate(duda.fechaEnvio)}</span>
        </div>
        <div class="duda-mensaje">${duda.mensaje}</div>
        <button class="btn btn-responder" data-id="${duda.idNotificacion}">
          <i class="fas fa-reply"></i> Responder
        </button>
      </div>
    `).join('');
    
    document.querySelectorAll(".btn-responder").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const idDuda = btn.dataset.id;
        mostrarModalResponder(idDuda);
      });
    });
}

  // ==================== FUNCIONES PARA PROCESAR ACCIONES ====================

  async function procesarSolicitud(id, accion) {
    if (!confirm(`¿Estás seguro que deseas ${accion === 'aceptar' ? 'aceptar' : 'rechazar'} esta solicitud?`)) {
      return;
    }

    try {
      showLoading(true);
      
      const response = await fetch('Php/procesar_solicitud.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          idPrestamo: id,
          accion: accion
        }),
        credentials: 'include'
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `Error HTTP: ${response.status}`);
      }

      if (data.success) {
        showSuccess(`Solicitud ${accion === 'aceptar' ? 'aceptada' : 'rechazada'} correctamente`);
        
        // Recargar datos
        await Promise.all([
          loadSolicitudes(),
          loadResumenData()
        ]);
        
        // Si fue aceptada, mostrar detalles del calendario
        if (accion === 'aceptar') {
          const solicitudAceptada = solicitudes.find(s => s.idPrestamo == id);
          if (solicitudAceptada) {
            mostrarCalendarioGenerado(solicitudAceptada);
          }
        }
      } else {
        throw new Error(data.message || "Error en la respuesta del servidor");
      }
    } catch (error) {
      console.error(`Error al ${accion} solicitud:`, error);
      showError(error.message || "Error de conexión al procesar la solicitud");
    } finally {
      showLoading(false);
    }
  }

  function mostrarCalendarioGenerado(solicitud) {
    const modal = document.createElement('div');
    modal.className = 'custom-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close-modal">&times;</span>
        <h3><i class="fas fa-calendar-check"></i> Calendario de pagos generado</h3>
        <p>Se han programado ${solicitud.semanas} pagos semanales para el préstamo de ${solicitud.nombreCliente}</p>
        
        <div class="alert alert-success">
          <i class="fas fa-info-circle"></i> El cliente ha sido notificado y puede consultar su calendario de pagos.
        </div>
        
        <button class="btn btn-ver-calendario" data-id="${solicitud.idPrestamo}">
          <i class="fas fa-calendar-alt"></i> Ver calendario completo
        </button>
      </div>
    `;

    document.body.appendChild(modal);
    
    // Cerrar modal
    modal.querySelector('.close-modal').addEventListener('click', () => {
      document.body.removeChild(modal);
    });
    
    // Ver calendario completo
    modal.querySelector('.btn-ver-calendario').addEventListener('click', () => {
      document.body.removeChild(modal);
      verCalendarioCompleto(solicitud.idPrestamo);
    });
  }

  async function verCalendarioCompleto(idPrestamo) {
    try {
      showLoading(true);
      
      const response = await fetch(`Php/get_calendario.php?idPrestamo=${idPrestamo}`, {
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `Error HTTP: ${response.status}`);
      }

      if (data.success) {
        mostrarDetallesCalendario(data.data);
      } else {
        throw new Error(data.message || "Error al cargar calendario");
      }
    } catch (error) {
      console.error("Error al ver calendario:", error);
      showError(error.message || "Error al cargar el calendario");
    } finally {
      showLoading(false);
    }
  }

  function mostrarDetallesCalendario(calendario) {
    const modal = document.createElement('div');
    modal.className = 'custom-modal modal-lg';
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close-modal">&times;</span>
        <h3><i class="fas fa-calendar-alt"></i> Calendario de pagos</h3>
        
        <div class="table-responsive">
          <table class="calendario-table">
            <thead>
              <tr>
                <th># Cuota</th>
                <th>Fecha Vencimiento</th>
                <th>Monto</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              ${calendario.map(pago => `
                <tr class="estado-${pago.estado}">
                  <td>${pago.numeroCouta}</td>
                  <td>${formatDate(pago.fechaVencimiento)}</td>
                  <td>${formatMonto(pago.montoPago)}</td>
                  <td>${getEstadoPagoText(pago.estado)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    
    modal.querySelector('.close-modal').addEventListener('click', () => {
      document.body.removeChild(modal);
    });
  }

  function mostrarDocumentos(solicitud) {
    try {
      if (!solicitud || !solicitud.documentos) {
        throw new Error("No hay documentos disponibles");
      }

      // Crear modal de documentos
      const modal = document.createElement('div');
      modal.className = 'custom-modal';
      modal.innerHTML = `
        <div class="modal-content">
          <span class="close-modal">&times;</span>
          <h3><i class="fas fa-file-alt"></i> Documentos de ${solicitud.nombreCliente}</h3>
          <p>Préstamo: ${formatMonto(solicitud.montoSolicitado)} - ${solicitud.nombrePlan}</p>
          
          <div class="documentos-container">
            ${solicitud.documentos?.length > 0 ? 
              solicitud.documentos.map(doc => `
                <div class="documento-item">
                  <div class="doc-icon">
                    <i class="${getDocumentIcon(doc.tipoDocumento)}"></i>
                  </div>
                  <div class="doc-info">
                    <h4>${doc.tipoDocumento}</h4>
                    <p>Subido el: ${formatDate(doc.fechaSubida)}</p>
                    <button class="btn btn-ver-doc" data-id="${solicitud.idPrestamo}" data-type="${doc.tipoDocumento}">
                      <i class="fas fa-eye"></i> Ver documento
                    </button>
                  </div>
                </div>
              `).join('') : 
              '<p class="no-docs">No hay documentos adjuntos</p>'}
          </div>
        </div>
      `;

      document.body.appendChild(modal);
      
      // Cerrar modal
      modal.querySelector('.close-modal').addEventListener('click', () => {
        document.body.removeChild(modal);
      });
      
      // Evento para ver documentos
      modal.querySelectorAll('.btn-ver-doc').forEach(btn => {
        btn.addEventListener('click', () => verDocumento(
          btn.dataset.id, 
          btn.dataset.type
        ));
      });
      
    } catch (error) {
      console.error("Error al mostrar documentos:", error);
      showError("Error al cargar documentos");
    }
  }

  async function mostrarHistorial(solicitud) {
    try {
      if (!solicitud || !solicitud.historial) {
        throw new Error("No hay datos de historial disponibles");
      }

      const modal = document.createElement('div');
      modal.className = 'custom-modal';
      modal.innerHTML = `
        <div class="modal-content">
          <span class="close-modal">&times;</span>
          <h3><i class="fas fa-history"></i> Historial crediticio</h3>
          <p class="cliente-info">
            <strong>Cliente:</strong> ${solicitud.nombreCliente}<br>
            <strong>Préstamo actual:</strong> ${formatMonto(solicitud.montoSolicitado)} (${solicitud.nombrePlan})
          </p>
          
          <div class="historial-container">
            ${solicitud.historial.length > 0 ? 
              `<table class="historial-table">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Monto</th>
                    <th>Plan</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  ${solicitud.historial.map(prestamo => `
                    <tr>
                      <td>${formatDate(prestamo.fechaSolicitud)}</td>
                      <td>${formatMonto(prestamo.montoSolicitado)}</td>
                      <td>${prestamo.plan || 'N/A'}</td>
                      <td>
                        <span class="estado-badge estado-${prestamo.estado}">
                          ${getEstadoText(prestamo.estado)}
                        </span>
                      </td>
                      <td>
                        <button class="btn btn-sm btn-detalles" 
                                data-id="${prestamo.idPrestamo}"
                                title="Ver detalles">
                          <i class="fas fa-eye"></i>
                        </button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>` 
              : 
              '<div class="no-data">No se encontraron préstamos anteriores</div>'}
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(modal);
      
      // Cerrar modal
      modal.querySelector('.close-modal').addEventListener('click', () => {
        document.body.removeChild(modal);
      });
      
      // Eventos para botones de detalles
      modal.querySelectorAll('.btn-detalles').forEach(btn => {
        btn.addEventListener('click', () => {
          mostrarDetallesPrestamo(btn.dataset.id);
        });
      });
      
    } catch (error) {
      console.error("Error al mostrar historial:", error);
      showError(`Error: ${error.message}`);
    }
  }
  function renderDudas() {
    console.log("Renderizando dudas..."); 
    elements.dudasList.innerHTML = dudas.map(duda => `
        <div class="duda-item" data-id="${duda.idNotificacion}">
            <!-- ... resto del HTML ... -->
            <button class="btn btn-responder" data-id="${duda.idNotificacion}">
                <i class="fas fa-reply"></i> Responder
            </button>
        </div>
    `).join('');

    document.querySelectorAll(".btn-responder").forEach(btn => {
        console.log("Registrando evento para botón:", btn); 
        btn.addEventListener("click", function(e) {
            console.log("Botón clickeado!", this.dataset.id); 
            e.preventDefault();
            mostrarModalResponder(this.dataset.id);
        });
    });
}
function mostrarModalResponder(idDuda) {
    console.log("Mostrar modal para duda ID:", idDuda); 
    
    const duda = dudas.find(d => d.idNotificacion == idDuda);
    if (!duda) {
        console.error("Duda no encontrada con ID:", idDuda); 
        showError("No se encontró la duda seleccionada");
        return;
    }
    
    console.log("Duda encontrada:", duda); 
    
    // ... resto del código del modal ...
    
    elements.responderDudaModal.style.display = "block";
    console.log("Modal debería estar visible ahora"); 
}

async function mostrarHistorialDudas() {
    try {
        showLoading(true);
        const response = await fetch('Php/get_dudas_con_respuestas.php', {
            credentials: 'include'
        });
        
        if (!response.ok) throw new Error('Error en la respuesta del servidor');
        
        const data = await response.json();
        
        if (data.success) {
            renderHistorialDudas(data.data);
        } else {
            showError(data.message || "Error al cargar historial");
        }
    } catch (error) {
        console.error("Error al cargar historial:", error);
        showError("Error de conexión al cargar historial");
    } finally {
        showLoading(false);
    }
}

function renderHistorialDudas(clientes) {
    const container = document.createElement('div');
    container.className = 'historial-dudas-container';
    
    container.innerHTML = `
        <h3><i class="fas fa-history"></i> Historial de Dudas por Cliente</h3>
        ${clientes.map(cliente => `
            <div class="cliente-card">
                <div class="cliente-header">
                    <h4>${cliente.cliente}</h4>
                    <span>${cliente.dudas.length} ${cliente.dudas.length === 1 ? 'duda' : 'dudas'}</span>
                </div>
                
                <div class="dudas-list">
                    ${cliente.dudas.map(duda => `
                        <div class="duda-item ${duda.respuesta ? 'respondida' : 'pendiente'}">
                            <div class="duda-content">
                                <p class="duda-text">${duda.duda}</p>
                                <small class="duda-date">${formatDate(duda.fechaDuda)}</small>
                            </div>
                            
                            ${duda.respuesta ? `
                                <div class="respuesta-content">
                                    <p class="respuesta-text">${duda.respuesta}</p>
                                    <small class="respuesta-date">Respondido el ${formatDate(duda.fechaRespuesta)}</small>
                                </div>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('')}
    `;
    document.getElementById('dudas').appendChild(container);
    
}

  function mostrarModalResponder(idDuda) {
    const duda = dudas.find(d => d.idNotificacion == idDuda);
    if (!duda) {
        showError("No se encontró la duda seleccionada");
        return;
    }
    
    // Limpiar y llenar el modal
    elements.dudaContent.innerHTML = `
        <div class="duda-info">
            <p><strong>Cliente:</strong> ${duda.nombreCliente}</p>
            <p><strong>Teléfono:</strong> ${duda.telefono || 'No disponible'}</p>
            <p><strong>Fecha:</strong> ${duda.fechaFormateada || formatDate(duda.fechaEnvio)}</p>
        </div>
        <div class="duda-mensaje">
            <strong>Duda:</strong>
            <p>${duda.mensaje}</p>
        </div>
    `;
    
    // Actualizar el campo oculto con el ID
    document.getElementById("duda-id").value = idDuda;
    
    // Mostrar modal
    elements.responderDudaModal.style.display = "block";
    
    // Enfocar el área de respuesta
    document.getElementById("respuesta").focus();
}

async function loadDudas() {
    try {
        console.log("Cargando dudas...");
        const response = await fetch('Php/get_dudas_clientes.php', {
            credentials: 'include'
        });
        
        console.log("Respuesta recibida:", response); 
        if (!response.ok) throw new Error('Error en la respuesta del servidor');
        
        const data = await response.json();
        console.log("Datos recibidos:", data); 
        
        if (data.success) {
            dudas = data.data;
            console.log("Dudas cargadas:", dudas); 
            renderDudas();
            elements.badgeDudas.textContent = data.count || dudas.length;
        } else {
            showError("Error al cargar dudas");
        }
    } catch (error) {
        console.error("Error al cargar dudas:", error);
        showError("Error de conexión al cargar dudas");
    }
}
  async function handleRespuestaSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(elements.respuestaForm);
    const idDuda = formData.get("duda-id");
    const respuesta = formData.get("respuesta").trim();
    
    if (!respuesta) {
      showError("Por favor escribe una respuesta");
      return;
    }
    
    try {
      const response = await fetch('Php/responder_duda.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          idNotificacion: idDuda,
          respuesta: respuesta
        }),
        credentials: 'include'
      });
      
      if (!response.ok) throw new Error('Error en la respuesta del servidor');
      
      const data = await response.json();
      
      if (data.success) {
        showSuccess("Respuesta enviada correctamente");
        closeModal();
        loadDudas();
      } else {
        showError(data.message || "Error al enviar respuesta");
      }
    } catch (error) {
      console.error("Error al enviar respuesta:", error);
      showError("Error de conexión al enviar respuesta");
    }
  }

  // ==================== FUNCIONES AUXILIARES ====================

  function addDocumentosEvents() {
    document.querySelectorAll(".btn-ver-docs").forEach(btn => {
      btn.addEventListener("click", () => {
        const idPrestamo = btn.dataset.id;
        const solicitud = solicitudes.find(s => s.idPrestamo == idPrestamo);
        if (solicitud) mostrarDocumentos(solicitud);
      });
    });
  }

  function addHistorialEvents() {
    document.querySelectorAll(".btn-ver-historial").forEach(btn => {
      btn.addEventListener("click", () => {
        const idUsuario = btn.dataset.id;
        const solicitud = solicitudes.find(s => s.idUsuario == idUsuario);
        if (solicitud) mostrarHistorial(solicitud);
      });
    });
  }

  function addActionEvents() {
    document.querySelectorAll(".btn-aceptar").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        procesarSolicitud(btn.dataset.id, 'aceptar');
      });
    });
    
    document.querySelectorAll(".btn-rechazar").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        procesarSolicitud(btn.dataset.id, 'rechazar');
      });
    });
  }

  // ==================== FUNCIONES DE UTILIDAD ====================

  function formatMonto(monto) {
    // Convertir a número y manejar casos null/undefined/string
    const num = typeof monto === 'string' ? 
                parseFloat(monto.replace(/[^0-9.-]/g, '')) : 
                Number(monto) || 0;
    
    // Formatear como moneda
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2
    }).format(num);
  }

  function formatDate(dateString) {
    if (!dateString) return 'Fecha no disponible';
    
    const options = { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  }

  function getEstadoText(estado) {
    const estados = {
      1: 'Aprobado',
      2: 'En revisión',
      3: 'Rechazado',
      4: 'Pagado',
      5: 'En mora',
      6: 'Cancelado',
      7: 'Refinanciado'
    };
    
    return estados[estado] || `Estado desconocido (${estado})`;
  }

  function getEstadoPagoText(estado) {
    const estados = {
      0: 'Pendiente',
      1: 'Pagado',
      2: 'En mora',
      3: 'Cancelado'
    };
    return estados[estado] || 'Desconocido';
  }

  function getDocumentIcon(tipoDocumento) {
    const icons = {
      'Identificación Oficial': 'fas fa-id-card',
      'Comprobante de Domicilio': 'fas fa-home',
      'Comprobante de Ingresos': 'fas fa-file-invoice-dollar',
      'Estado de Cuenta Bancaria': 'fas fa-piggy-bank',
      'Contrato Firmado': 'fas fa-file-signature'
    };
    return icons[tipoDocumento] || 'fas fa-file';
  }

  function showLoading(show) {
    const loader = document.getElementById('loading-indicator') || 
      document.createElement('div');
    
    if (show) {
      loader.id = 'loading-indicator';
      loader.innerHTML = '<div class="spinner"></div><p>Cargando...</p>';
      loader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        color: white;
      `;
      document.body.appendChild(loader);
    } else {
      if (document.getElementById('loading-indicator')) {
        document.body.removeChild(loader);
      }
    }
  }

  function showError(message) {
    alert(`Error: ${message}`);
  }

  function showSuccess(message) {
    alert(`Éxito: ${message}`);
  }

  function toggleSidebar() {
    elements.sidebar.classList.toggle("active");
  }

  function toggleUserProfile() {
    elements.userProfile.classList.toggle("visible");
  }

  function showSection(sectionId) {
    // Ocultar todas las secciones
    Object.values(elements.sections).forEach(section => {
      section.style.display = "none";
    });
    
    // Mostrar la sección seleccionada
    if (elements.sections[sectionId]) {
      elements.sections[sectionId].style.display = "block";
    }
    
    // Actualizar menú activo
    document.querySelectorAll(".sidebar li").forEach(item => {
      item.classList.remove("active");
    });
    
    const activeItem = document.querySelector(`.sidebar a[href="#${sectionId}"]`).parentElement;
    activeItem.classList.add("active");
  }

  function closeModal() {
    elements.respuestaForm.reset();
    elements.responderDudaModal.style.display = "none";
  }

  function logout() {
    window.location.href = "Php/logout.php";
  }
});