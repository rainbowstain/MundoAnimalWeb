// Funcionalidad del buscador de alimentos
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar la interfaz con los datos
    initFoodFinder();

    // Configurar el buscador
    setupSearch();
    
    // Inicializar tooltips para las insignias de calidad
    initQualityTooltips();
});

// Inicializar el buscador de alimentos
function initFoodFinder() {
    // Cargar datos para cada categoría
    loadCatFoods();
    loadDogFoods();
    loadMedicatedFoods();
    loadExoticFoods();
    
    // Configurar interacciones para las tarjetas
    setupCardInteractions();
    
    // Configurar interacciones para las insignias de calidad
    setupQualityBadges();
}

// Inicializar tooltips para las insignias de calidad
function initQualityTooltips() {
    // Verificar si Bootstrap está disponible
    if (typeof bootstrap !== 'undefined') {
        const qualityBadges = document.querySelectorAll('.quality-badge');
        qualityBadges.forEach(badge => {
            const quality = badge.textContent;
            if (calidadesInfo[quality]) {
                badge.setAttribute('data-bs-toggle', 'tooltip');
                badge.setAttribute('data-bs-placement', 'top');
                badge.setAttribute('data-bs-title', calidadesInfo[quality]);
                new bootstrap.Tooltip(badge);
            }
        });
    }
}

// Cargar alimentos para gatos
function loadCatFoods() {
    const container = document.getElementById('gatos-brands');
    const comingSoonContainer = document.getElementById('gatos-proximamente');
    
    if (!container || !comingSoonContainer) return;
    
    // Limpiar contenedores
    container.innerHTML = '';
    comingSoonContainer.innerHTML = '';
    
    // Definir el orden de calidades de mayor a menor (S, A, B, C, F)
    const ordenCalidades = ['S', 'A', 'B', 'C', 'F'];
    
    // Cargar marcas por categoría en el orden definido
    ordenCalidades.forEach(calidad => {
        // Verificar si existe la categoría en los datos
        if (productosData.gatos.categorias[calidad]) {
            const marcas = productosData.gatos.categorias[calidad];
            
            marcas.forEach(marca => {
                const brandCard = document.createElement('div');
                brandCard.className = `brand-card quality-${calidad}`;
                brandCard.dataset.brand = marca.toLowerCase();
                brandCard.dataset.quality = calidad;
                brandCard.dataset.type = 'gato';
                
                brandCard.innerHTML = `
                    <div class="quality-indicator ${calidad}" title="${getQualityTitle(calidad)}">${calidad}</div>
                    <span class="brand-name">${marca}</span>
                `;
                
                container.appendChild(brandCard);
            });
        }
    });
    
    // Cargar marcas próximamente
    productosData.gatos.proximamente.forEach(marca => {
        const badge = document.createElement('span');
        badge.className = 'coming-soon-badge';
        badge.textContent = marca;
        
        comingSoonContainer.appendChild(badge);
    });
}

// Cargar alimentos para perros
function loadDogFoods() {
    const container = document.getElementById('perros-brands');
    
    if (!container) return;
    
    // Limpiar contenedor
    container.innerHTML = '';
    
    // Definir el orden de calidades de mayor a menor (S, A, B, C, F)
    const ordenCalidades = ['S', 'A', 'B', 'C', 'F'];
    
    // Cargar marcas por categoría en el orden definido
    ordenCalidades.forEach(calidad => {
        // Verificar si existe la categoría en los datos
        if (productosData.perros.categorias[calidad]) {
            const marcas = productosData.perros.categorias[calidad];
            
            marcas.forEach(marca => {
                const brandCard = document.createElement('div');
                brandCard.className = `brand-card quality-${calidad}`;
                brandCard.dataset.brand = marca.toLowerCase();
                brandCard.dataset.quality = calidad;
                brandCard.dataset.type = 'perro';
                
                brandCard.innerHTML = `
                    <div class="quality-indicator ${calidad}" title="${getQualityTitle(calidad)}">${calidad}</div>
                    <span class="brand-name">${marca}</span>
                `;
                
                container.appendChild(brandCard);
            });
        }
    });
}

// Cargar alimentos medicados
function loadMedicatedFoods() {
    const container = document.getElementById('medicados-brands');
    
    if (!container) return;
    
    // Limpiar contenedor
    container.innerHTML = '';
    
    // Cargar marcas medicadas
    productosData.medicados.marcas.forEach(marca => {
        const brandCard = document.createElement('div');
        brandCard.className = 'brand-card quality-A';
        brandCard.dataset.brand = marca.toLowerCase();
        brandCard.dataset.type = 'medicado';
        
        // Truncar el nombre si es muy largo (solo para visualización)
        const displayName = marca.length > 15 ? marca.substring(0, 15) + '...' : marca;
        
        brandCard.innerHTML = `
            <div class="quality-indicator A" title="${getQualityTitle('A')}">A</div>
            <span class="brand-name" title="${marca}">${displayName}</span>
            <span class="badge bg-info">Medicado</span>
        `;
        
        container.appendChild(brandCard);
    });
}

// Cargar alimentos para mascotas exóticas
function loadExoticFoods() {
    // Cargar cada categoría de exóticos
    loadExoticCategory('peces', 'peces-foods');
    loadExoticCategory('erizos', 'erizos-foods');
    loadExoticCategory('pollos', 'pollos-foods');
    loadExoticCategory('conejos', 'conejos-foods');
    loadExoticCategory('tortugas', 'tortugas-foods');
}

// Cargar una categoría específica de alimentos exóticos
function loadExoticCategory(category, containerId) {
    const container = document.getElementById(containerId);
    
    if (!container) return;
    
    // Limpiar contenedor
    container.innerHTML = '';
    
    // Cargar alimentos de la categoría
    if (productosData.exoticos[category]) {
        productosData.exoticos[category].forEach(item => {
            const foodItem = document.createElement('div');
            foodItem.className = 'exotic-food-item';
            foodItem.dataset.item = item.toLowerCase();
            foodItem.dataset.category = category;
            
            foodItem.textContent = item;
            
            container.appendChild(foodItem);
        });
    }
}

// Obtener el título de la calidad
function getQualityTitle(quality) {
    const titles = {
        'S': 'Ultra Premium',
        'A': 'Super Premium',
        'B': 'Premium',
        'C': 'Estándar',
        'F': 'Económica'
    };
    
    return titles[quality] || '';
}

// Configurar la funcionalidad de búsqueda
function setupSearch() {
    const searchInput = document.getElementById('search-input');
    
    if (!searchInput) return;
    
    // Buscar mientras se escribe (después de 250ms de inactividad)
    let searchTimeout;
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            performSearch(searchInput.value);
            
            // Si el campo está vacío, resetear la búsqueda
            if (!searchInput.value.trim()) {
                resetSearch();
            }
        }, 250);
    });
    
    // Buscar al presionar Enter
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault(); // Evitar envío de formulario
            performSearch(searchInput.value);
        }
    });
}

// Realizar la búsqueda
function performSearch(query) {
    query = query.toLowerCase().trim();
    
    // Si la búsqueda está vacía y no hay calidad seleccionada, mostrar todo
    if (query === '' && !selectedQuality) {
        resetSearch();
        return;
    }
    
    // Si la búsqueda está vacía pero hay calidad seleccionada, solo filtrar por calidad
    if (query === '' && selectedQuality) {
        filterByQuality(selectedQuality);
        return;
    }
    
    // Búsqueda en tiempo real, no necesita botón de limpiar
    
    // Eliminar cualquier mensaje de no resultados existente
    document.querySelectorAll('.no-results-message').forEach(message => {
        message.remove();
    });
    
    // Restaurar textos originales antes de buscar
    document.querySelectorAll('.brand-name').forEach(name => {
        name.innerHTML = name.textContent;
    });
    
    document.querySelectorAll('.exotic-food-item').forEach(item => {
        item.innerHTML = item.textContent;
    });
    
    // Buscar en todas las marcas y productos
    searchBrands(query);
    searchExoticFoods(query);
    
    // Cambiar a la pestaña adecuada si la búsqueda es específica
    if (query.includes('gato') || query.includes('cat')) {
        document.getElementById('gatos-tab').click();
    } else if (query.includes('perro') || query.includes('dog')) {
        document.getElementById('perros-tab').click();
    } else if (query.includes('medic')) {
        document.getElementById('medicados-tab').click();
    } else if (
        query.includes('exot') || 
        query.includes('pez') || 
        query.includes('peces') || 
        query.includes('erizo') || 
        query.includes('pollo') || 
        query.includes('conejo') || 
        query.includes('tortuga')
    ) {
        document.getElementById('exoticos-tab').click();
    }
}

// Buscar en las marcas de alimentos
function searchBrands(query) {
    const brandCards = document.querySelectorAll('.brand-card');
    let hasResults = false;
    
    brandCards.forEach(card => {
        const brandName = card.dataset.brand;
        const animalType = card.dataset.type;
        const quality = card.dataset.quality;
        
        // Comprobar si coincide con la búsqueda
        const matchesBrand = brandName.includes(query);
        const matchesType = animalType.includes(query);
        const matchesQuality = quality.toLowerCase() === query || 
                               (calidadesInfo[quality] && calidadesInfo[quality].toLowerCase().includes(query));
        
        // Verificar si coincide con la calidad seleccionada
        const matchesSelectedQuality = !selectedQuality || quality === selectedQuality;
        
        // Mostrar u ocultar según coincidencia
        if ((matchesBrand || matchesType || matchesQuality) && matchesSelectedQuality) {
            card.classList.remove('filtered-out');
            card.style.display = 'flex';
            card.style.animation = 'fadeIn 0.3s ease forwards';
            
            // Resaltar coincidencias en el nombre de la marca
            if (matchesBrand) {
                const brandNameElement = card.querySelector('.brand-name');
                if (brandNameElement) {
                    const originalText = brandNameElement.textContent;
                    const highlightedText = originalText.replace(
                        new RegExp(query, 'gi'),
                        match => `<span class="highlight-text">${match}</span>`
                    );
                    brandNameElement.innerHTML = highlightedText;
                }
            }
            
            hasResults = true;
        } else {
            card.classList.add('filtered-out');
            card.style.display = 'none';
        }
    });
    
    return hasResults;
}

// Buscar en alimentos exóticos
function searchExoticFoods(query) {
    const exoticItems = document.querySelectorAll('.exotic-food-item');
    let hasResults = false;
    
    exoticItems.forEach(item => {
        const itemName = item.dataset.item;
        const category = item.dataset.category;
        
        // Comprobar si coincide con la búsqueda
        const matchesItem = itemName.includes(query);
        const matchesCategory = category.includes(query);
        
        // Mostrar u ocultar según coincidencia
        if (matchesItem || matchesCategory) {
            item.classList.remove('filtered-out');
            item.style.display = 'block';
            item.style.animation = 'fadeIn 0.3s ease forwards';
            
            // Resaltar coincidencias
            if (matchesItem) {
                const originalText = item.textContent;
                const highlightedText = originalText.replace(
                    new RegExp(query, 'gi'),
                    match => `<span class="highlight-text">${match}</span>`
                );
                item.innerHTML = highlightedText;
            }
            
            hasResults = true;
        } else {
            item.classList.add('filtered-out');
            item.style.display = 'none';
        }
    });
    
    // Mostrar u ocultar tarjetas de categorías según si tienen resultados
    const exoticCategories = document.querySelectorAll('.exotic-category-card');
    exoticCategories.forEach(category => {
        const visibleItems = category.querySelectorAll('.exotic-food-item:not(.filtered-out)');
        if (visibleItems.length === 0) {
            category.classList.add('filtered-out');
            category.style.display = 'none';
        } else {
            category.classList.remove('filtered-out');
            category.style.display = 'block';
            hasResults = true;
        }
    });
    
    return hasResults;
}

// Resetear la búsqueda para mostrar todos los elementos
function resetSearch() {
    // Asegurarse de que no hay calidad seleccionada
    selectedQuality = null;
    
    // Mostrar todas las marcas y restaurar textos originales
    document.querySelectorAll('.brand-card').forEach(card => {
        card.classList.remove('filtered-out');
        card.style.display = 'flex';
        
        // Restaurar el texto original del nombre de la marca
        const brandNameElement = card.querySelector('.brand-name');
        if (brandNameElement) {
            brandNameElement.innerHTML = brandNameElement.textContent;
        }
    });
    
    // Mostrar todos los alimentos exóticos y restaurar textos originales
    document.querySelectorAll('.exotic-food-item').forEach(item => {
        item.classList.remove('filtered-out');
        item.style.display = 'block';
        item.innerHTML = item.textContent;
    });
    
    // Mostrar todas las categorías exóticas
    document.querySelectorAll('.exotic-category-card').forEach(category => {
        category.classList.remove('filtered-out');
        category.style.display = 'block';
    });
    
    // Ocultar mensajes de no resultados
    document.querySelectorAll('.no-results-message').forEach(message => {
        message.remove();
    });
    
    // Ocultar botón de limpiar búsqueda
    const clearButton = document.getElementById('clear-search');
    if (clearButton) {
        clearButton.style.display = 'none';
    }
}

// Variables para almacenar estados
let selectedQuality = null;
let cardTimeouts = {}; // Para almacenar los timeouts de las tarjetas

// Función para obtener la calidad de un badge (S, A, B, C, F)
function getQualityFromBadge(badge) {
    // Si el badge tiene texto expandido, solo tomamos la primera letra
    if (badge.querySelector('.quality-text')) {
        return badge.textContent.trim().charAt(0);
    }
    // Si no tiene texto expandido, el contenido es la letra
    return badge.textContent.trim();
}

// Función para obtener el título completo de una calidad
function getQualityTitle(quality) {
    switch(quality) {
        case 'S': return 'Ultra Premium';
        case 'A': return 'Super Premium';
        case 'B': return 'Premium';
        case 'C': return 'Estándar';
        case 'F': return 'Económica';
        case 'Todas': return 'Mostrar Todas';
        default: return '';
    }
}

// Configurar interacciones para los badges de calidad
function setupQualityBadges() {
    const qualityBadges = document.querySelectorAll('.quality-badge');
    
    qualityBadges.forEach(badge => {
        // Eliminar cualquier event listener previo para evitar duplicaciones
        const clonedBadge = badge.cloneNode(true);
        badge.parentNode.replaceChild(clonedBadge, badge);
        
        clonedBadge.addEventListener('click', function() {
            // Obtener la letra de calidad (S, A, B, C, F)
            const quality = getQualityFromBadge(this);
            console.log('Quality badge clicked:', quality);
            
            // Determinar si estamos seleccionando o deseleccionando
            const isDeselecting = (selectedQuality === quality);
            
            if (isDeselecting) {
                // Si ya está seleccionada, deseleccionar
                console.log('Deselecting quality:', quality);
                clearQualitySelection();
                showAllProducts();
                
                // Resetear estilos inline que puedan quedar
                this.style = '';
            } else {
                // Si no está seleccionada, seleccionar
                console.log('Selecting quality:', quality);
                clearQualitySelection(); // Limpiar selección anterior
                applyQualitySelection(quality); // Aplicar nueva selección
                filterProductsByQuality(quality); // Filtrar productos
            }
        });
    });
}

// Añadir interactividad a las tarjetas de marcas y badges de calidad
document.addEventListener('DOMContentLoaded', function() {
    // Añadir tooltips a los indicadores de calidad
    document.querySelectorAll('.quality-indicator').forEach(indicator => {
        const calidad = indicator.textContent;
        if (calidadesInfo[calidad]) {
            indicator.setAttribute('title', calidadesInfo[calidad]);
            indicator.setAttribute('data-bs-toggle', 'tooltip');
            indicator.setAttribute('data-bs-placement', 'top');
        }
    });
    
    // Inicializar tooltips de Bootstrap
    const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltips.forEach(tooltip => {
        new bootstrap.Tooltip(tooltip);
    });
    
    // Eventos de clic a los badges de calidad se configuran en setupQualityBadges()
    
    // Configurar interacciones para las tarjetas
    setupCardInteractions();
});

// Configurar interacciones para las tarjetas de marcas
function setupCardInteractions() {
    // Usar delegación de eventos para manejar todas las tarjetas, incluso las que se agregan dinámicamente
    document.addEventListener('click', function(event) {
        const card = event.target.closest('.brand-card');
        if (!card) return;
        
        // Limpiar cualquier timeout existente para esta tarjeta
        const cardId = card.dataset.brand;
        if (cardTimeouts[cardId]) {
            clearTimeout(cardTimeouts[cardId]);
        }
        
        // Remover la clase expanded de todas las tarjetas
        document.querySelectorAll('.brand-card.expanded').forEach(expandedCard => {
            if (expandedCard !== card) {
                expandedCard.classList.remove('expanded');
            }
        });
        
        // Agregar la clase expanded a esta tarjeta
        card.classList.add('expanded');
        
        // Establecer un timeout para remover la clase después de 2 segundos
        cardTimeouts[cardId] = setTimeout(() => {
            card.classList.remove('expanded');
            delete cardTimeouts[cardId];
        }, 2000);
    });
    
    // Manejar la navegación por teclado (tab)
    document.addEventListener('keyup', function(event) {
        if (event.key === 'Tab') {
            const focusedElement = document.activeElement;
            if (focusedElement && focusedElement.classList.contains('brand-card')) {
                const cardId = focusedElement.dataset.brand;
                
                // Limpiar cualquier timeout existente para esta tarjeta
                if (cardTimeouts[cardId]) {
                    clearTimeout(cardTimeouts[cardId]);
                }
                
                // Remover la clase expanded de todas las demás tarjetas
                document.querySelectorAll('.brand-card.expanded').forEach(expandedCard => {
                    if (expandedCard !== focusedElement) {
                        expandedCard.classList.remove('expanded');
                    }
                });
                
                // Agregar la clase expanded a esta tarjeta
                focusedElement.classList.add('expanded');
                
                // Establecer un timeout para remover la clase después de 2 segundos
                cardTimeouts[cardId] = setTimeout(() => {
                    focusedElement.classList.remove('expanded');
                    delete cardTimeouts[cardId];
                }, 2000);
            }
        }
    });
    
    // Hacer que las tarjetas sean enfocables con tab
    document.querySelectorAll('.brand-card').forEach(card => {
        card.setAttribute('tabindex', '0');
    });
}

// Limpiar toda la selección de calidad (visual y variable global)
function clearQualitySelection() {
    console.log('Clearing quality selection');
    
    // Resetear variable global
    selectedQuality = null;
    
    // Resetear apariencia visual de todos los badges
    document.querySelectorAll('.quality-badge').forEach(badge => {
        badge.classList.remove('selected');
        const existingText = badge.querySelector('.quality-text');
        if (existingText) {
            existingText.remove();
        }
    });
}

// Aplicar selección visual a los badges de una calidad
function applyQualitySelection(quality) {
    console.log('Applying quality selection:', quality);
    
    // Actualizar variable global
    selectedQuality = quality;
    
    // Destacar todos los badges con la misma calidad
    document.querySelectorAll('.quality-badge').forEach(badge => {
        // Para el botón "Todas"
        if (quality === 'Todas' && badge.classList.contains('quality-all')) {
            badge.classList.add('selected');
            
            // Añadir texto con el nombre completo
            if (!badge.querySelector('.quality-text')) {
                const qualityText = document.createElement('span');
                qualityText.className = 'quality-text';
                qualityText.textContent = ' - Mostrar Todas';
                badge.appendChild(qualityText);
            }
            return;
        }
        
        // Para los botones de calidad (S, A, B, C, F)
        if (getQualityFromBadge(badge) === quality) {
            // Añadir clase selected para activar las animaciones CSS
            badge.classList.add('selected');
            
            // Añadir texto con el nombre completo de la calidad
            if (!badge.querySelector('.quality-text')) {
                const qualityText = document.createElement('span');
                qualityText.className = 'quality-text';
                
                // Asignar el nombre completo de la calidad con el formato "S - Ultra Premium"
                switch(quality) {
                    case 'S':
                        qualityText.textContent = ' - Ultra Premium';
                        break;
                    case 'A':
                        qualityText.textContent = ' - Super Premium';
                        break;
                    case 'B':
                        qualityText.textContent = ' - Premium';
                        break;
                    case 'C':
                        qualityText.textContent = ' - Estándar';
                        break;
                    case 'F':
                        qualityText.textContent = ' - Económica';
                        break;
                    default:
                        qualityText.textContent = ' - ' + getQualityTitle(quality);
                }
                
                badge.appendChild(qualityText);
            }
        }
    });
}

// Redirigir a clearQualitySelection
function resetQualitySelection() {
    clearQualitySelection();
    // Asegurarse de que se muestren todos los productos
    showAllProducts();
}

// Mostrar todos los productos
function showAllProducts() {
    console.log('Showing all products');
    
    const activeTab = document.querySelector('.tab-pane.active');
    if (!activeTab) return;
    
    // Mostrar todas las tarjetas de marcas con animación
    const allCards = activeTab.querySelectorAll('.brand-card');
    allCards.forEach(card => {
        card.classList.remove('filtered-out');
        card.style.display = 'flex';
        card.style.animation = 'fadeIn 0.3s ease forwards';
    });
    
    // Mostrar todos los productos dentro de cada marca
    activeTab.querySelectorAll('.product-item').forEach(product => {
        product.classList.remove('filtered-out');
        product.style.display = 'block';
        product.style.animation = 'fadeIn 0.3s ease forwards';
    });
    
    // Mostrar todos los alimentos exóticos si estamos en esa pestaña
    if (activeTab.id === 'exoticos') {
        activeTab.querySelectorAll('.exotic-food-item').forEach(item => {
            item.classList.remove('filtered-out');
            item.style.display = 'block';
            item.style.animation = 'fadeIn 0.3s ease forwards';
        });
    }
    
    // Ocultar mensajes de no resultados
    hideNoResultsMessage(activeTab);
    
    console.log('All products shown');
}

// Mostrar mensaje de no resultados
function showNoResultsMessage(container, message) {
    // Eliminar mensaje existente si hay uno
    hideNoResultsMessage(container);
    
    // Crear nuevo mensaje
    const noResultsMessage = document.createElement('div');
    noResultsMessage.className = 'no-results-message alert alert-info mt-3';
    noResultsMessage.innerHTML = `<i class="fas fa-info-circle me-2"></i> ${message}`;
    
    // Añadir al contenedor
    const targetContainer = container.querySelector('.brands-container') || container;
    targetContainer.appendChild(noResultsMessage);
    
    // Animar entrada
    noResultsMessage.style.animation = 'fadeIn 0.3s ease forwards';
}

// Ocultar mensaje de no resultados
function hideNoResultsMessage(container) {
    const noResultsMessage = container.querySelector('.no-results-message');
    if (noResultsMessage) {
        noResultsMessage.style.animation = 'fadeOut 0.3s ease forwards';
        setTimeout(() => {
            noResultsMessage.remove();
        }, 300);
    }
}

// Filtrar productos por calidad (función obsoleta - solo para compatibilidad)
function filterByQuality(quality) {
    console.log('Legacy filterByQuality called with:', quality);
    
    // Determinar si estamos seleccionando o deseleccionando
    const isDeselecting = (selectedQuality === quality);
    
    if (isDeselecting) {
        // Si ya está seleccionada, deseleccionar
        clearQualitySelection();
        showAllProducts();
    } else {
        // Si no está seleccionada, seleccionar
        clearQualitySelection(); // Limpiar selección anterior
        applyQualitySelection(quality); // Aplicar nueva selección
        filterProductsByQuality(quality); // Filtrar productos
    }
}

// Nueva función para filtrar productos por calidad
function filterProductsByQuality(quality) {
    console.log('Filtering products by quality:', quality);
    
    // Obtener la pestaña activa
    const activeTab = document.querySelector('.tab-pane.active');
    if (!activeTab) return;
    
    // No aplicar filtro a medicados
    if (activeTab.id === 'medicados') return;
    
    // Filtrar tarjetas por calidad con animación
    const allCards = activeTab.querySelectorAll('.brand-card');
    let hasResults = false;
    
    // Primero ocultar todas las tarjetas con animación
    allCards.forEach(card => {
        if (card.dataset.quality !== quality) {
            card.classList.add('filtered-out');
            card.style.animation = 'fadeOut 0.2s ease forwards';
            setTimeout(() => {
                card.style.display = 'none';
            }, 200);
        }
    });
    
    // Luego mostrar las que coinciden con la calidad
    setTimeout(() => {
        allCards.forEach(card => {
            if (card.dataset.quality === quality) {
                card.classList.remove('filtered-out');
                card.style.display = 'flex';
                card.style.animation = 'fadeIn 0.3s ease forwards';
                hasResults = true;
            }
        });
        
        // Mostrar mensaje si no hay resultados
        if (hasResults) {
            hideNoResultsMessage(activeTab);
        } else {
            showNoResultsMessage(activeTab, `No se encontraron alimentos de calidad ${quality}`);
        }
    }, 250);
}
