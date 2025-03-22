// Decoración de patitas de alta calidad para Mundo Animal
document.addEventListener('DOMContentLoaded', function() {
    // Sistema de patitas decorativas de alta calidad
    function initPawPrints() {
        const pawTrail = document.getElementById('pawTrail');
        if (!pawTrail) return;
        
        // Limpiar el contenedor
        pawTrail.innerHTML = '';
        
        // Configuraciones para diferentes tamaños de patitas
        const pawSizes = [45, 55, 65, 75];
        const pawOpacities = [0.08, 0.11, 0.13, 0.10];
        
        // Crear caminito principal de patitas (esquina inferior izquierda a superior derecha)
        createPawTrail(pawTrail, 10, 90, 30, 15, 12, pawSizes, pawOpacities, 45);
        
        // Crear caminito secundario (parte superior a inferior derecha)
        createPawTrail(pawTrail, 40, 5, 85, 60, 10, pawSizes, pawOpacities, 120);
        
        // Crear caminito corto cerca del centro
        createPawTrail(pawTrail, 60, 40, 75, 50, 5, pawSizes, pawOpacities, 0);
    }
    
    // Crear un caminito de patitas con orientación coherente
    function createPawTrail(container, startX, startY, endX, endY, count, sizes, opacities, baseAngle) {
        // Calcular la dirección del camino
        const directionX = endX - startX;
        const directionY = endY - startY;
        const pathAngle = Math.atan2(directionY, directionX) * 180 / Math.PI;
        
        // Generar patitas a lo largo del camino
        for (let i = 0; i < count; i++) {
            // Posición a lo largo del camino
            const progress = i / (count - 1);
            const xPos = startX + directionX * progress;
            const yPos = startY + directionY * progress;
            
            // Pequeña variación en la posición para que no sea perfectamente recta
            const offsetX = (Math.random() - 0.5) * 5;
            const offsetY = (Math.random() - 0.5) * 5;
            
            // Orientación en la dirección del camino con pequeña variación
            // La patita debe apuntar en la dirección del camino
            const rotation = pathAngle + baseAngle + (Math.random() - 0.5) * 15;
            
            // Alternamos lados para simular pasos izquierda/derecha
            const sideOffset = (i % 2 === 0) ? 2 : -2;
            
            createPawPrint(
                container, 
                xPos + offsetX + sideOffset, 
                yPos + offsetY, 
                sizes, 
                opacities, 
                rotation, 
                i * 150
            );
        }
    }

    
    // Función para crear una huella de pata individual
    function createPawPrint(container, xPercent, yPercent, sizes, opacities, rotation, delay) {
        const paw = document.createElement('div');
        paw.classList.add('paw-print');
        
        // Seleccionar tamaño y opacidad aleatoria de las opciones
        const sizeIndex = Math.floor(Math.random() * sizes.length);
        const size = sizes[sizeIndex];
        const opacity = opacities[sizeIndex];
        
        // Aplicar estilo
        paw.style.left = `${xPercent}%`;
        paw.style.top = `${yPercent}%`;
        paw.style.width = `${size}px`;
        paw.style.height = `${size}px`;
        paw.style.opacity = opacity;
        paw.style.setProperty('--rotation', `${rotation}deg`);
        
        // Añadir sombra más definida para mayor profundidad
        paw.style.filter = `drop-shadow(0 3px 5px rgba(0,0,0,0.15))`;
        
        // Animaciones
        paw.style.animation = `fadeInPaw 1s ease forwards, floatPawprint ${6 + Math.random() * 6}s ease-in-out infinite`;
        paw.style.animationDelay = `${delay}ms, ${delay + 1000}ms`;
        
        container.appendChild(paw);
        
        return paw;
    }
    
    // Inicializar patitas cuando la página está completamente cargada
    initPawPrints();
    
    // Reajustar al cambiar el tamaño de la ventana
    window.addEventListener('resize', debounce(function() {
        initPawPrints();
    }, 250));
    
    // Función debounce para optimizar eventos frecuentes
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(function() {
                func.apply(context, args);
            }, wait);
        };
    }
});
