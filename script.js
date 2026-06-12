/**
 * CANJEA Y GANA - CONFIGURACIÓN
 * Esta sección es para que el dueño del negocio pueda personalizar la aplicación.
 */
const config = {
    // Los 4 premios que pueden salir. El sistema elegirá uno al azar cuando el usuario elija un sobre.
    premios: [
        "15% de Descuento",
        "Café Gratis",
        "2x1 en Medialunas",
        "10% Off en tu próxima compra"
    ],
    // Cantidad de sobres a mostrar
    cantidadSobres: 4,
    // Mensaje para animar a participar
    mensajePrincipal: "¡Elegí tu sobre de figuritas y descubrí tu premio para usar hoy en nuestro local!"
};

// Variables de estado
let juegoTerminado = false;
let premioGanado = "";

// Elementos del DOM
const packsContainer = document.querySelector('.packs-container');
const subtitleText = document.getElementById('subtitle-text');
const modal = document.getElementById('email-modal');
const closeBtn = document.querySelector('.close-btn');
const form = document.getElementById('claim-form');
const successMessage = document.getElementById('success-message');
const modalPrizeText = document.getElementById('modal-prize-text');
const resetBtn = document.getElementById('reset-btn');

// Inicialización
function init() {
    subtitleText.textContent = config.mensajePrincipal;
    renderPacks();
}

// Generar los sobres en el DOM
function renderPacks() {
    packsContainer.innerHTML = '';
    
    for (let i = 0; i < config.cantidadSobres; i++) {
        const pack = document.createElement('div');
        pack.className = 'pack-card';
        pack.dataset.index = i;
        
        pack.innerHTML = `
            <div class="card-face card-front">
            </div>
            <div class="card-face card-back">
                <div class="prize-icon">🏆</div>
                <div class="prize-title">¡GANASTE!</div>
                <div class="prize-value"></div>
                <button class="canjear-btn">Canjear</button>
            </div>
        `;
        
        // Event listener para voltear
        pack.addEventListener('click', () => handlePackClick(pack));
        
        // Event listener para el botón de canjear (usamos event delegation o directo al boton)
        const canjearBtn = pack.querySelector('.canjear-btn');
        canjearBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Evitar que el click se propague a la carta
            openModal();
        });
        
        packsContainer.appendChild(pack);
    }
}

// Manejar el clic en un sobre
function handlePackClick(packElement) {
    if (juegoTerminado || packElement.classList.contains('flipped')) return;
    
    juegoTerminado = true;
    
    // Seleccionar un premio al azar
    const randomPrizeIndex = Math.floor(Math.random() * config.premios.length);
    premioGanado = config.premios[randomPrizeIndex];
    
    // Actualizar el texto del premio en la carta de atrás
    const prizeValueElement = packElement.querySelector('.prize-value');
    prizeValueElement.textContent = premioGanado;
    
    // Voltear la carta clickeada
    packElement.classList.add('flipped');
    
    // Desactivar las demás cartas
    const allPacks = document.querySelectorAll('.pack-card');
    allPacks.forEach(p => {
        if (p !== packElement) {
            p.classList.add('inactive');
        }
    });
    
    // Mostrar botón de reinicio para pruebas
    setTimeout(() => {
        resetBtn.classList.remove('hidden');
    }, 1000);
}

// Manejo del Modal
function openModal() {
    modalPrizeText.textContent = premioGanado;
    modal.classList.add('active');
}

function closeModal() {
    modal.classList.remove('active');
}

closeBtn.addEventListener('click', closeModal);

// Cerrar al hacer click fuera del modal
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Manejo del formulario
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('user-email').value;
    
    if (email) {
        // Aquí se puede agregar la lógica para enviar el email a un servidor/API
        console.log("Email capturado:", email, "Premio:", premioGanado);
        
        // Simular envío exitoso
        form.classList.add('hidden');
        successMessage.classList.remove('hidden');
    }
});

// Botón de reinicio (útil para el dueño del local si quiere mostrarlo a varios clientes)
resetBtn.addEventListener('click', () => {
    juegoTerminado = false;
    premioGanado = "";
    form.reset();
    form.classList.remove('hidden');
    successMessage.classList.add('hidden');
    closeModal();
    resetBtn.classList.add('hidden');
    renderPacks();
});

// Inicialización finalizada

// Iniciar aplicación
document.addEventListener('DOMContentLoaded', init);
