import {
    addToCart,
    getCartItemCount,
    getCookie,
    setCookie,
    showNotification
} from './utils.js?v=3126242222q1';

/**
 * Configuración del chatbot optimizada
 */
const CHATBOT_CONFIG = {
    maxRetries: 3,
    retryDelay: 1000,
    typingDelay: 20,
    messageMaxLength: 500,
    debounceDelay: 300,
    scrollThreshold: 100,
    notificationDuration: 4000,
    cacheTimeout: 300000 // 5 minutos
    // speechLang: 'es-PE' // Desactivado temporalmente (reconocimiento de voz)
};

/**
 * Estado global del chatbot mejorado
 */
const chatbotState = {
    isTyping: false,
    currentRetry: 0,
    isConnected: true,
    lastInteraction: Date.now(),
    cachedElements: {},

    // Métodos helper para mejor gestión del estado
    reset() {
        this.isTyping = false;
        this.currentRetry = 0;
        this.lastInteraction = Date.now();
    },

    updateInteraction() {
        this.lastInteraction = Date.now();
    },

    // Cache de elementos DOM para evitar búsquedas repetidas
    getElement(id) {
        if (!this.cachedElements[id] || !document.contains(this.cachedElements[id])) {
            this.cachedElements[id] = document.getElementById(id);
        }
        return this.cachedElements[id];
    }
};

function getMetaDom(nameMeta) {
    const metaTag = document.querySelector(`meta[name="${nameMeta}"]`);
    return metaTag ? metaTag.getAttribute("content") : null;
}

/**
 * Utilidades optimizadas
 */
const ChatbotUtils = {
    // Debounce para evitar llamadas excesivas
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle para eventos de scroll
    throttle(func, limit) {
        let inThrottle;
        return function () {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Sanitización de texto para prevenir XSS
    sanitizeText(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    // Validador de JSON
    isValidJSON(str) {
        try {
            JSON.parse(str);
            return true;
        } catch (e) {
            return false;
        }
    }
};

/**
 * Función para crear delay
 */
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Función para mostrar notificaciones mejoradas
 */
function showChatNotification(message, type = 'info') {
    console.log(`[CHAT ${type.toUpperCase()}] ${message}`);
    // Se puede extender para mostrar notificaciones visuales
}

/**
 * Función para mostrar notificación compacta de producto agregado
 * Posicionada en la parte superior para no interferir con el chatbot
 * Con animaciones suaves de entrada y salida
 */
function showCompactProductNotification(productName, productImageUrl) {

    /**
     * Función auxiliar para animar la salida de notificaciones
     */
    const animateNotificationExit = (element, callback, isStatic = false) => {
        if (isStatic) {
            element.style.transform = 'translateY(-20px)';
            element.style.opacity = '0';
            setTimeout(() => {
                callback();
                element.style.transform = '';
                element.style.opacity = '';
            }, 300);
        } else {
            element.classList.remove('translate-y-0', 'opacity-100');
            element.classList.add('translate-y-[-120px]', 'opacity-0');
            setTimeout(() => {
                callback();
            }, 500);
        }
    };

    // Intentar usar la notificación estática del template primero
    const notification = document.getElementById('compact-product-notification');

    if (notification) {
        // Usar notificación estática del template
        const imageElement = document.getElementById('compact-notification-image');
        const messageElement = document.getElementById('compact-notification-message');
        const cartButton = document.getElementById('compact-open-cart-btn');

        if (imageElement && messageElement) {
            // Actualizar contenido
            imageElement.src = productImageUrl || '/placeholder.jpg';
            imageElement.alt = productName || 'Producto';
            messageElement.textContent = productName || 'Producto agregado';

            // Configurar botón del carrito
            if (cartButton) {
                cartButton.onclick = () => {
                    if (typeof openCart === 'function') {
                        openCart();
                    } else if (document.getElementById('openCart')) {
                        document.getElementById('openCart').click();
                    }
                    // Usar función auxiliar para animación de salida
                    animateNotificationExit(notification, () => {
                        notification.classList.add('hidden');
                    }, true);
                };
            }

            // Preparar para animación de entrada suave
            notification.style.transform = 'translateY(-20px)';
            notification.style.opacity = '0';
            notification.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'; // Easing más suave

            // Mostrar notificación con animación de entrada
            notification.classList.remove('hidden');

            // Animar entrada después de un frame para asegurar que el CSS se aplique
            requestAnimationFrame(() => {
                notification.style.transform = 'translateY(0)';
                notification.style.opacity = '1';
            });

            // Auto-ocultar con animación suave después de 4 segundos
            setTimeout(() => {
                if (!notification.classList.contains('hidden')) {
                    animateNotificationExit(notification, () => {
                        notification.classList.add('hidden');
                    }, true);
                }
            }, 4000);

            return;
        }
    }

    // Fallback: crear notificación dinámica (para otros temas)
    const existingNotification = document.querySelector('#compact-product-notification-dynamic');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Crear notificación compacta con animaciones mejoradas
    const dynamicNotification = document.createElement('div');
    dynamicNotification.id = 'compact-product-notification-dynamic';
    dynamicNotification.className = 'fixed top-4 right-4 z-[10000] max-w-sm transform translate-y-[-120px] opacity-0 transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)';

    dynamicNotification.innerHTML = `
        <div class="dynamic-notification-container">
            <div class="dynamic-image-container">
                <img src="${productImageUrl}" alt="Producto" class="dynamic-image">
            </div>
            <div class="dynamic-content">
                <div class="dynamic-header">
                    <svg class="dynamic-icon" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                    <span class="dynamic-label">Producto añadido</span>
                </div>
                <div class="dynamic-product-name">${productName}</div>
            </div>
            <button onclick="
                const notification = this.parentElement.parentElement;
                notification.classList.remove('translate-y-0', 'opacity-100');
                notification.classList.add('translate-y-[-120px]', 'opacity-0');
                setTimeout(() => {
                    document.getElementById('openCart')?.click(); 
                    if (notification.parentElement) notification.remove();
                }, 500);
            " class="dynamic-cart-button">
                Ver carrito
            </button>
        </div>
    `;

    document.body.appendChild(dynamicNotification);

    // Animación de entrada suave - deslizar desde arriba con delay más natural
    setTimeout(() => {
        dynamicNotification.classList.remove('translate-y-[-120px]', 'opacity-0');
        dynamicNotification.classList.add('translate-y-0', 'opacity-100');
    }, 100); // Delay ligeramente mayor para mejor percepción

    // Auto-eliminar con animación de salida suave después de 4 segundos
    setTimeout(() => {
        if (dynamicNotification && dynamicNotification.parentElement) {
            // Usar función auxiliar para consistencia
            animateNotificationExit(dynamicNotification, () => {
                if (dynamicNotification.parentElement) {
                    dynamicNotification.remove();
                }
            }, false);
        }
    }, 4000);
}

/**
 * Función para mostrar lista de productos de búsqueda en fila horizontal
 */
function showProductSearchResults(searchData) {
    if (!searchData || !searchData.products || !Array.isArray(searchData.products) || searchData.products.length === 0) {
        console.warn("Datos de búsqueda incompletos para mostrar productos");
        return;
    }

    const chatMessages = document.getElementById('chat-messages');
    if (!chatMessages) {
        console.warn("No se encontró el contenedor de mensajes del chat");
        return;
    }

    // Crear contenedor principal para los productos
    const messageElement = document.createElement('div');
    messageElement.className = 'flex justify-start my-2';
    messageElement.style.opacity = '1'; // Asegurar opacidad completa
    
    // Crear contenedor con scroll horizontal
    const productsContainer = document.createElement('div');
    productsContainer.className = 'w-full max-w-full overflow-x-auto';
    productsContainer.style.scrollbarWidth = 'thin';
    
    const productsList = document.createElement('div');
    productsList.className = 'flex gap-4 pb-2';
    productsList.style.minWidth = 'fit-content';

    // Generar card para cada producto
    searchData.products.forEach((product) => {
        const productId = product._id || product.id || product.productId || '';
        const productSlug = product.slug || '';
        const productTitle = product.title || 'Producto sin nombre';
        const productImage = (product.image_default && product.image_default[0]) || product.image || '/placeholder.jpg';
        const regularPrice = product.price?.regular || product.price_regular || 0;
        const salePrice = product.price?.sale || product.price_sale || 0;
        const hasSale = salePrice > 0 && salePrice < regularPrice;
        const displayPrice = hasSale ? salePrice : regularPrice;
        const isAvailable = product.is_available !== false;

        // Construir URL del producto
        const productUrl = productSlug 
            ? `/product/${productSlug}` 
            : `/search?query=${productId}`;

        // Escapar caracteres especiales
        const safeTitle = productTitle.replace(/'/g, "\\'").replace(/"/g, '&quot;');
        const safeImage = productImage.replace(/'/g, "\\'");
        const safeSlug = productSlug.replace(/'/g, "\\'");

        // Crear card de producto
        const productCard = document.createElement('div');
        productCard.className = 'flex-shrink-0 w-48 bg-white rounded-lg shadow-md overflow-hidden border border-gray-200';
        productCard.innerHTML = `
            <div class="relative h-[9rem] overflow-hidden">
                <a href="${productUrl}" class="block h-[9rem]">
                    <img 
                        src="${productImage}" 
                        alt="${safeTitle}"
                        class="w-full h-full object-cover hover:opacity-90 transition-opacity"
                        onerror="this.src='/placeholder.jpg'"
                    />
                </a>
                ${hasSale ? `
                    <span class="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                        OFERTA
                    </span>
                ` : ''}
            </div>
            <div class="p-3">
                <a href="${productUrl}" class="block hover:text-cyan-600 transition-colors mb-2">
                    <h4 class="text-sm font-semibold text-gray-800 line-clamp-2 min-h-[2.5rem]">
                        ${safeTitle}
                    </h4>
                </a>
                
                <div class="flex items-center gap-2 mb-3">
                    ${hasSale ? `
                        <span class="text-base font-bold text-red-600">S/ ${parseFloat(displayPrice).toFixed(2)}</span>
                        <span class="text-xs text-gray-400 line-through">S/ ${parseFloat(regularPrice).toFixed(2)}</span>
                    ` : `
                        <span class="text-base font-bold text-gray-800">S/ ${parseFloat(displayPrice).toFixed(2)}</span>
                    `}
                </div>
                
                <div class="flex gap-2">
                    <a 
                        href="${productUrl}"
                        class="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white text-center py-2 px-2 rounded-lg transition-colors text-xs font-medium flex items-center justify-center"
                        title="Ver detalles"
                    >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                    </a>
                    ${isAvailable ? `
                        <button 
                            onclick="addProductToCartFromCard('${productId}', '${safeTitle}', ${displayPrice}, '${safeImage}', '${safeSlug}')"
                            class="flex-1 bg-gray-800 hover:bg-gray-900 text-white py-2 px-2 rounded-lg transition-colors text-xs font-medium flex items-center justify-center"
                            title="Agregar al carrito"
                        >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                            </svg>
                        </button>
                    ` : `
                        <button 
                            disabled
                            class="flex-1 bg-gray-300 text-gray-500 py-2 px-2 rounded-lg text-xs font-medium cursor-not-allowed"
                            title="No disponible"
                        >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path>
                            </svg>
                        </button>
                    `}
                </div>
            </div>
        `;

        productsList.appendChild(productCard);
    });

    productsContainer.appendChild(productsList);
    messageElement.appendChild(productsContainer);
    chatMessages.appendChild(messageElement);

    // Hacer scroll hacia abajo
    setTimeout(() => {
        chatMessages.scrollTop = chatMessages.scrollHeight;
        if (chatMessages.scrollTo && 'scrollBehavior' in document.documentElement.style) {
            chatMessages.scrollTo({
                top: chatMessages.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, 100);
}

/**
 * Función para mostrar card de producto en el chat
 */
function showProductCard(productData) {
    if (!productData || !productData.id) {
        console.warn("Datos de producto incompletos para mostrar card");
        return;
    }

    const chatMessages = document.getElementById('chat-messages');
    if (!chatMessages) {
        console.warn("No se encontró el contenedor de mensajes del chat");
        return;
    }

    // Crear elemento de mensaje del bot
    const messageElement = document.createElement('div');
    messageElement.className = 'flex justify-start my-2';
    messageElement.style.opacity = '1'; // Asegurar opacidad completa
    
    // Construir URL del producto
    const productUrl = productData.slug 
        ? `/product/${productData.slug}` 
        : `/search?query=${productData.slug.replace('-', '')}`;
    
    // Formatear precio
    const formattedPrice = productData.price 
        ? `S/ ${parseFloat(productData.price).toFixed(2)}` 
        : 'Precio no disponible';
    
    // Verificar si tiene precio de oferta
    const hasSalePrice = productData.salePrice && 
                         productData.salePrice > 0 && 
                         productData.salePrice < productData.regularPrice;
    const displayPrice = hasSalePrice ? productData.salePrice : productData.price;
    const displayPriceFormatted = displayPrice ? `S/ ${parseFloat(displayPrice).toFixed(2)}` : formattedPrice;

    // Escapar caracteres especiales para evitar problemas con onclick
    const safeTitle = (productData.title || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');
    const safeImage = (productData.image || '').replace(/'/g, "\\'");
    const safeSlug = (productData.slug || '').replace(/'/g, "\\'");

    messageElement.innerHTML = `
        <div class="max-w-sm w-full bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            <div class="relative">
                <a href="${productUrl}" class="block">
                    <img 
                        src="${productData.image || '/placeholder.jpg'}" 
                        alt="${safeTitle || 'Producto'}"
                        class="w-full h-48 object-cover hover:opacity-90 transition-opacity"
                        onerror="this.src='/placeholder.jpg'"
                    />
                </a>
                ${hasSalePrice ? `
                    <span class="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        OFERTA
                    </span>
                ` : ''}
            </div>
            <div class="p-4">
                <a href="${productUrl}" class="block hover:text-cyan-600 transition-colors">
                    <h3 class="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                        ${safeTitle || 'Producto sin nombre'}
                    </h3>
                </a>
                
                ${productData.description ? `
                    <p class="text-sm text-gray-600 mb-3 line-clamp-2">
                        ${productData.description}
                    </p>
                ` : ''}
                
                <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center gap-2">
                        ${hasSalePrice ? `
                            <span class="text-lg font-bold text-red-600">${displayPriceFormatted}</span>
                            <span class="text-sm text-gray-400 line-through">S/ ${parseFloat(productData.regularPrice).toFixed(2)}</span>
                        ` : `
                            <span class="text-lg font-bold text-gray-800">${displayPriceFormatted}</span>
                        `}
                    </div>
                    ${productData.isAvailable === false ? `
                        <span class="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                            No disponible
                        </span>
                    ` : ''}
                </div>
                
                <div class="flex gap-2">
                    <a 
                        href="${productUrl}"
                        class="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white text-center py-2 px-4 rounded-lg transition-colors text-sm font-medium"
                    >
                        Ver detalles
                    </a>
                    ${productData.isAvailable !== false ? `
                        <button 
                            onclick="addProductToCartFromCard('${productData.id}', '${safeTitle}', ${productData.price || 0}, '${safeImage}', '${safeSlug}')"
                            class="flex-1 bg-gray-800 hover:bg-gray-900 text-white py-2 px-4 rounded-lg transition-colors text-sm font-medium"
                        >
                            Agregar al carrito
                        </button>
                    ` : ''}
                </div>
            </div>
        </div>
    `;

    chatMessages.appendChild(messageElement);
    
    // Hacer scroll hacia abajo
    setTimeout(() => {
        chatMessages.scrollTop = chatMessages.scrollHeight;
        if (chatMessages.scrollTo && 'scrollBehavior' in document.documentElement.style) {
            chatMessages.scrollTo({
                top: chatMessages.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, 100);
}

/**
 * Función global para agregar producto al carrito desde la card
 * Nota: Esta función debe ejecutarse dentro del contexto de DOMContentLoaded
 */
window.addProductToCartFromCard = function(productId, title, price, image, slug) {
    try {
        const productData = {
            price_regular: parseFloat(price) || 0,
            price_sale: parseFloat(price) || 0,
            title: title,
            image: image,
            id: productId,
            slug: slug,
            qty: 1
        };

        // Usar la función addToCart importada
        addToCart(productData, 1);
        
        // Actualizar contador del carrito
        const cantidadCartDiv = document.querySelector('.count-products');
        if (cantidadCartDiv) {
            const itemCount = getCartItemCount();
            cantidadCartDiv.textContent = itemCount;
        }
        
        // Mostrar notificación
        showCompactProductNotification(title, image);

        // Animar botón del carrito
        const btnCartToolBar = document.getElementById('openCart');
        if (btnCartToolBar) {
            btnCartToolBar.classList.add('animar-pulso');
            setTimeout(() => {
                btnCartToolBar.classList.remove('animar-pulso');
            }, 900);
        }
    } catch (error) {
        console.error('Error al agregar producto al carrito desde card:', error);
    }
};

/**
 * Función para mostrar botón de re-registro en el chat
 */
function showReRegistrationButton() {
    // Remover botón existente si lo hay
    const existingButton = document.getElementById('reregister-button-message');
    if (existingButton) {
        existingButton.remove();
    }

    const buttonMessageElement = document.createElement('div');
    buttonMessageElement.id = 'reregister-button-message';
    buttonMessageElement.className = 'flex justify-center my-4';
    buttonMessageElement.innerHTML = `
        <div class="reregister-container">
            <div class="reregister-icon-container">
                <svg class="reregister-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    <path d="M9 12l2 2 4-4"/>
                </svg>
            </div>
            <div class="reregister-content">
                <h3 class="reregister-title">Sesión expirada</h3>
                <p class="reregister-message">
                    Tu tiempo de conversación ha finalizado. Para continuar necesitas registrarte nuevamente.
                </p>
                <div class="reregister-buttons">
                    <button id="show-register-form-btn" class="reregister-button">
                        <svg class="reregister-button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14,2 14,8 20,8"/>
                            <line x1="16" y1="13" x2="8" y2="13"/>
                            <line x1="16" y1="17" x2="8" y2="17"/>
                            <polyline points="10,9 9,9 8,9"/>
                        </svg>
                        Registrarse nuevamente
                    </button>
                </div>
            </div>
        </div>
    `;

    const chatMessages = document.getElementById('chat-messages');
    if (chatMessages) {
        chatMessages.appendChild(buttonMessageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Agregar event listener al botón con animación y eliminación inmediata
        const registerBtn = document.getElementById('show-register-form-btn');
        if (registerBtn) {
            registerBtn.addEventListener('click', () => {
                // Eliminar inmediatamente para evitar que quede visible
                buttonMessageElement.remove();

                // Mostrar formulario de registro
                showRegistrationForm();
            });
        }
    }
}

/**
 * Función para mostrar el formulario de registro
 */
function showRegistrationForm() {
    const formContainer = document.getElementById('formContainer');
    const globalAnswers = document.getElementById('global_answers');
    const containerWelcomme = document.getElementById('container_welcomme');
    const welcomme = document.getElementById('welcomme');
    const into = document.getElementById('into');

    // Eliminar específicamente el botón de re-registro si existe
    const existingReregisterButton = document.getElementById('reregister-button-message');
    if (existingReregisterButton) {
        existingReregisterButton.remove();
    }

    // Mostrar formulario y ocultar chat
    formContainer?.classList.remove('hidden');
    globalAnswers?.classList.add('hidden');
    containerWelcomme?.classList.add('bg-cyan-950', 'h-full', 'absolute');

    // Resetear vista de bienvenida
    welcomme?.classList.add('hidden');
    into?.classList.remove('hidden');

    // Limpiar estado
    chatStatus = false;
    sessionStorage.removeItem('sessionSam');
    localStorage.removeItem('chatHistory');

    // Limpiar mensajes del chat completamente
    const chatMessages = document.getElementById('chat-messages');
    if (chatMessages) {
        chatMessages.innerHTML = '';
    }

    // Resetear historial en memoria de manera segura
    if (typeof chatHistory !== 'undefined') {
        chatHistory.length = 0; // Limpiar array existente
    } else {
        chatHistory = []; // Crear nuevo array si no existe
    }

    showChatNotification('Formulario de registro mostrado', 'info');
}

document.addEventListener('DOMContentLoaded', () => {
    const chatBubble = document.getElementById('chat-bubble');
    const chatWindow = document.getElementById('chat-window');
    const closeChat = document.getElementById('close-chat');
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const micButton = document.getElementById('mic-button');
    const cantidadCartDiv = document.querySelector('.count-products');
    const btnCartToolBar = document.getElementById('openCart');
    let isLoadingHistory = false;
    let chatHistory = [];
    let chatStatus = getCookie('sam_agent_status') === "true" ? true : false;

    const updateCartItemCount = () => {
        const itemCount = getCartItemCount();
        if (cantidadCartDiv) {
            cantidadCartDiv.textContent = itemCount;
        }
    };

    function addToCartFromBot(action, quantity) {
        const data = {
            "price_regular": action.price_regular,
            "price_sale": action.price_sale ?? action.price_regular,
            "title": action.title,
            "image": action.image,
            "id": action.productId,
            "slug": action.slug,
            "qty": quantity
        };

        addToCart(data, quantity);
        updateCartItemCount();

        // Mostrar notificación compacta mejorada (sin interferir con el chatbot)
        showCompactProductNotification(action.title, action.image);

        // Animar botón del carrito
        if (btnCartToolBar) {
            btnCartToolBar.classList.add('animar-pulso');
            setTimeout(() => {
                btnCartToolBar.classList.remove('animar-pulso');
            }, 900);
        }
    }

    try {
        const storedHistory = localStorage.getItem('chatHistory');
        if (storedHistory) {
            const parsedHistory = JSON.parse(storedHistory);

            // Verificar si es el nuevo formato con estructura de objeto
            if (parsedHistory && typeof parsedHistory === 'object') {
                if (parsedHistory.messages && Array.isArray(parsedHistory.messages)) {
                    // Nuevo formato
                    chatHistory = parsedHistory.messages;
                } else if (Array.isArray(parsedHistory)) {
                    // Formato antiguo - array directo
                    chatHistory = parsedHistory;
                } else {
                    throw new Error("Formato de historial no válido");
                }
            } else {
                throw new Error("Datos de historial corruptos");
            }
        } else {
            chatHistory = [];
        }
    } catch (e) {
        console.warn("Historial de chat corrupto, reiniciando:", e.message);
        chatHistory = [];
        localStorage.removeItem('chatHistory');
        showChatNotification('Historial de chat reiniciado', 'warning');
    }

    // Optimizar guardado del historial con debouncing y validación
    const saveChatToLocalStorage = ChatbotUtils.debounce(() => {
        try {
            // Limitar historial para evitar problemas de memoria (últimos 100 mensajes)
            const limitedHistory = chatHistory.slice(-100);

            const historyData = {
                version: '1.0',
                timestamp: Date.now(),
                messages: limitedHistory
            };

            localStorage.setItem('chatHistory', JSON.stringify(historyData));
        } catch (error) {
            console.error("Error al guardar historial:", error);

            // Si el error es por espacio, limpiar historial antiguo
            if (error.name === 'QuotaExceededError') {
                chatHistory = chatHistory.slice(-50); // Reducir a 50 mensajes
                try {
                    localStorage.setItem('chatHistory', JSON.stringify({
                        version: '1.0',
                        timestamp: Date.now(),
                        messages: chatHistory
                    }));
                    showChatNotification('Historial reducido por espacio limitado', 'warning');
                } catch (retryError) {
                    localStorage.removeItem('chatHistory');
                    showChatNotification('Error al guardar historial', 'error');
                }
            } else {
                showChatNotification('Error al guardar historial', 'error');
            }
        }
    }, 1000); // Debounce de 1 segundo para evitar guardados excesivos

    // Configurar botón de envío (anteriormente botón de micrófono)
    // El reconocimiento de voz está desactivado temporalmente
    console.log("Botón de micrófono configurado como botón de envío");

    // Cambiar apariencia del botón para indicar que es de envío
    if (micButton) {
        // Remover clases de micrófono y agregar clases de envío
        micButton.classList.remove('bg-red-500', 'animate-pulse', 'opacity-50');
        micButton.classList.add('bg-cyan-0', 'hover:bg-cyan-0');
        micButton.disabled = false;

        // Cambiar el título del botón
        micButton.title = 'Enviar mensaje (o presiona Enter)';

        // Configurar como botón de envío
        micButton.addEventListener('click', () => {
            const messageText = chatInput.value.trim();
            if (messageText) {
                handleSendMessage(messageText);
            } else {
                // Dar feedback si no hay texto
                chatInput.focus();
                chatInput.placeholder = 'Escribe un mensaje antes de enviar...';
                setTimeout(() => {
                    chatInput.placeholder = 'Escribe tu mensaje aquí...';
                }, 2000);
            }
        });
    }

    chatInput.placeholder = 'Escribe tu mensaje aquí...';

    /**
     * Función para asegurar que las burbujas siempre tengan opacidad completa (sin fade)
     */
    const ensureMessagesOpacity = () => {
        if (!chatMessages) return;

        // Obtener todos los mensajes (excluyendo elementos especiales como container_welcomme, typing-indicator, etc.)
        const messages = Array.from(chatMessages.children).filter(child => {
            const id = child.id;
            return !id || (!id.includes('container_welcomme') && !id.includes('typing-indicator') && !id.includes('reregister-button'));
        });

        // Asegurar que todos los mensajes tengan opacidad completa
        messages.forEach((messageElement) => {
            messageElement.style.opacity = '1';
        });
    };

    // Ejecutar al cargar y después de agregar nuevos mensajes
    if (chatMessages) {
        setTimeout(() => ensureMessagesOpacity(), 100);
    }

    // Optimizar apertura del chat con debouncing para evitar clics múltiples
    const toggleChatOptimized = ChatbotUtils.debounce(async () => {
        chatbotState.updateInteraction();
        chatWindow.classList.toggle('hidden');

        // Solo verificar token si no existe en sessionStorage y es necesario
        const sessionToken = sessionStorage.getItem('sessionSam');
        if (!sessionToken && chatStatus) {
            // Verificar token en background sin bloquear la UI
            checkTokenApi().catch(error => {
                console.error("Error al verificar token:", error);
                chatStatus = false;
                setCookie('sam_agent_status', false, 0);
                showChatNotification('Sesión expirada, necesitas registrarte nuevamente', 'warning');
            });
        }

        const isVisible = !chatWindow.classList.contains('hidden');

        if (isVisible) {
            chatWindow.classList.remove('scale-95', 'opacity-0');
            chatWindow.classList.add('scale-100', 'opacity-100');

            // Focus en el input para mejor UX con delay optimizado
            setTimeout(() => {
                if (chatInput && document.contains(chatInput)) {
                    chatInput.focus();
                }
                // Cargar historial solo si es necesario y hay datos válidos
                if (Array.isArray(chatHistory) && chatHistory.length > 0 && chatMessages.children.length === 0) {
                    loadChatFromLocalStorage();
                }
            }, 100);
        } else {
            chatWindow.classList.remove('scale-100', 'opacity-100');
            chatWindow.classList.add('scale-95', 'opacity-0');
        }
    }, CHATBOT_CONFIG.debounceDelay);

    chatBubble.addEventListener('click', toggleChatOptimized);

    closeChat.addEventListener('click', () => {
        chatWindow.classList.remove('scale-100', 'opacity-100');
        chatWindow.classList.add('scale-95', 'opacity-0');
        setTimeout(() => {
            chatWindow.classList.add('hidden');
        }, 300);
    });

    closeChat.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        localStorage.removeItem('chatHistory');
        chatMessages.innerHTML = '';
        chatHistory = [];
        showChatNotification('Historial eliminado', 'info');
    });

    const handleSendMessage = async (userMessageText) => {
        // Validaciones optimizadas
        if (!userMessageText?.trim() || chatbotState.isTyping) return;

        const sanitizedMessage = ChatbotUtils.sanitizeText(userMessageText.trim());

        // Validar longitud del mensaje
        if (sanitizedMessage.length > CHATBOT_CONFIG.messageMaxLength) {
            showChatNotification(`Mensaje muy largo. Máximo ${CHATBOT_CONFIG.messageMaxLength} caracteres.`, 'warning');
            return;
        }

        // Actualizar estado y limpiar input
        chatbotState.updateInteraction();
        addMessage(sanitizedMessage, 'user');
        chatInput.value = '';
        addTypingIndicator();

        try {
            const response = await fetchBotResponseWithRetry(sanitizedMessage);
            removeTypingIndicator();

            // Procesar respuesta de manera más robusta
            if (response?.message) {
                await typeMessage(response.message, 'bot');
            }

            // Ejecutar acción si existe y tiene un tipo válido
            if (response?.action && response.action.type !== null && response.action.type !== undefined) {
                executeChatAction(response.action);
            }

            // Reset del contador de reintentos en caso de éxito
            chatbotState.currentRetry = 0;

        } catch (error) {
            console.error("Error al contactar la API:", error);
            removeTypingIndicator();

            // Manejo mejorado de errores específicos
            if (error.message === "TOKEN_EXPIRED") {
                showReRegistrationButton();
                showChatNotification('Sesión expirada', 'warning');
                chatbotState.reset();
            } else if (error.name === 'NetworkError' || error.message.includes('fetch')) {
                addMessage("Problemas de conexión. Verifica tu internet e intenta nuevamente.", 'bot');
                showChatNotification('Error de red', 'error');
            } else {
                addMessage("Lo siento, estoy teniendo problemas técnicos. Intenta de nuevo en un momento.", 'bot');
                showChatNotification('Error del servicio', 'error');
            }
        }
    };

    /**
     * Añade efecto de escritura a los mensajes del bot
     */
    const typeMessage = async (text, sender) => {
        chatbotState.isTyping = true;
        const messageElement = createMessageElement(sender);
        const textElement = messageElement.querySelector('p');

        chatMessages.appendChild(messageElement);
        scrollToBottom();

        for (let i = 0; i < text.length; i++) {
            textElement.textContent += text[i];
            await delay(CHATBOT_CONFIG.typingDelay);
            smartScrollToBottom();
        }

        chatbotState.isTyping = false;
        
        // Aplicar efecto de desvanecimiento después de terminar de escribir
        if (typeof handleMessageFadeOnScroll === 'function') {
            setTimeout(() => handleMessageFadeOnScroll(), 50);
        }

        if (!isLoadingHistory) {
            chatHistory.push({
                sender,
                text,
                timestamp: Date.now()
            });
            saveChatToLocalStorage();
        }
    };

    /**
     * Crea un elemento de mensaje
     */
    const createMessageElement = (sender) => {
        const messageElement = document.createElement('div');
        messageElement.className = `flex ${sender === 'user' ? 'justify-end' : 'justify-start'}`;
        messageElement.style.opacity = '1'; // Asegurar opacidad completa
        // Agregar margen derecho para mensajes del usuario
        if (sender === 'user') {
            messageElement.style.marginRight = '0';
            messageElement.style.paddingRight = '0';
        }

        const bubbleClass = sender === 'user'
            ? 'rounded-xl text-sm px-4 py-2.5 max-w-[80%] gradient-bg-user text-white shadow-sm transition-all'
            : 'rounded-xl text-sm px-4 py-2.5 max-w-[80%] gradient-bg-sam text-white transition-all';

        messageElement.innerHTML = `<div class="max-w-xs text-sm px-4 py-2 ${bubbleClass}"><p></p></div>`;
        return messageElement;
    };

    /**
     * Hace scroll hacia abajo optimizado con mejor performance
     */
    const scrollToBottom = (smooth = true) => {
        if (!chatMessages) return;

        // Usar requestAnimationFrame para mejor performance
        requestAnimationFrame(() => {
            if (smooth && chatMessages.scrollTo && 'scrollBehavior' in document.documentElement.style) {
                chatMessages.scrollTo({
                    top: chatMessages.scrollHeight,
                    behavior: 'smooth'
                });
            } else {
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
        });
    };

    /**
     * Scroll inteligente optimizado con throttling
     */
    const smartScrollToBottom = ChatbotUtils.throttle((smooth = true) => {
        if (!chatMessages) return;

        const threshold = CHATBOT_CONFIG.scrollThreshold;
        const { scrollTop, clientHeight, scrollHeight } = chatMessages;
        const isNearBottom = scrollTop + clientHeight >= scrollHeight - threshold;

        if (isNearBottom) {
            scrollToBottom(smooth);
        }

        // Actualizar indicador de scroll de manera eficiente
        updateScrollIndicator();
    }, 50);

    /**
     * Actualiza el indicador visual de contenido superior
     */
    const updateScrollIndicator = () => {
        if (!chatMessages) return;

        const hasScrollContent = chatMessages.scrollTop > 20;

        if (hasScrollContent) {
            chatMessages.classList.add('has-scroll-content');
        } else {
            chatMessages.classList.remove('has-scroll-content');
        }
    };

    /**
     * Obtiene respuesta del bot con reintentos
     */
    const fetchBotResponseWithRetry = async (userMessage) => {
        for (let attempt = 1; attempt <= CHATBOT_CONFIG.maxRetries; attempt++) {
            try {
                return await fetchBotResponse(userMessage);
            } catch (error) {
                // Si el token expiró, no reintentar
                if (error.message === "TOKEN_EXPIRED") {
                    throw error;
                }

                // Para otros errores, reintentar
                if (attempt === CHATBOT_CONFIG.maxRetries) {
                    throw error;
                }
                await delay(CHATBOT_CONFIG.retryDelay * attempt);
                showChatNotification(`Reintentando... (${attempt}/${CHATBOT_CONFIG.maxRetries})`, 'info');
            }
        }
    };

    const addMessage = (text, sender) => {
        const messageElement = document.createElement('div');
        messageElement.className = `flex ${sender === 'user' ? 'justify-end' : 'justify-start'}`;
        messageElement.style.opacity = '1'; // Asegurar opacidad completa
        // Agregar margen derecho para mensajes del usuario
        if (sender === 'user') {
            messageElement.style.marginRight = '0';
            messageElement.style.paddingRight = '0';
        }
        const bubbleClass = sender === 'user'
            ? 'rounded-xl text-sm px-4 py-2.5 max-w-[80%] gradient-bg-user text-white shadow-sm transition-all'
            : 'rounded-xl text-sm px-4 py-2.5 max-w-[80%] gradient-bg-sam text-white  transition-all';
        messageElement.innerHTML = `<div class="max-w-xs text-sm px-4 py-2 ${bubbleClass}"><p>${text}</p></div>`;
        chatMessages.appendChild(messageElement);
        scrollToBottom();
        
        // Asegurar que el mensaje tenga opacidad completa
        ensureMessagesOpacity();

        if (!isLoadingHistory) {
            chatHistory.push({
                sender,
                text,
                timestamp: Date.now()
            });
            saveChatToLocalStorage();
        }
    };


    const loadChatFromLocalStorage = () => {
        // Verificar que chatHistory sea un array válido
        if (!Array.isArray(chatHistory)) {
            console.warn("chatHistory no es un array válido, reiniciando...");
            chatHistory = [];
            return;
        }

        isLoadingHistory = true;
        chatHistory.forEach(({ sender, text }) => {
            if (sender && text) {
                addMessage(text, sender);
            }
        });
        isLoadingHistory = false;
    };


    const addTypingIndicator = () => {
        const typingElement = document.createElement('div');
        typingElement.id = 'typing-indicator';
        typingElement.className = 'flex justify-start';
        typingElement.innerHTML = `
            <div class="max-w-xs px-4 py-2 bg-gray-700 text-white rounded-r-lg rounded-bl-lg">
                <div class="flex items-center space-x-1">
                    <span class="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
                    <span class="w-2 h-2 bg-cyan-400 rounded-full animate-pulse typing-delay-1"></span>
                    <span class="w-2 h-2 bg-cyan-400 rounded-full animate-pulse typing-delay-2"></span>
                </div>
            </div>`;
        chatMessages.appendChild(typingElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    const removeTypingIndicator = () => {
        document.getElementById('typing-indicator')?.remove();
    };

    /**
     * Verifica el token solo cuando es necesario
     * Ahora es más eficiente y no bloquea la apertura del chat
     */
    const checkTokenApi = async () => {
        const domain = getMetaDom("domain");
        const token = sessionStorage.getItem('sessionSam');

        // Si no hay token, no hacer la verificación
        if (!token) {
            setCookie('sam_agent_status', false, 0);
            return false;
        }

        try {
            const response = await fetch('https://api-sam-agent.creceidea.pe/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    domain: domain,
                    userMessage: '-'
                })
            });

            if (!response.ok) {
                // Token inválido, limpiar sesión
                setCookie('sam_agent_status', false, 0);
                sessionStorage.removeItem('sessionSam');
                localStorage.removeItem('chatHistory');
                showChatNotification('Sesión expirada, por favor registrate nuevamente', 'warning');
                return false;
            }
            return true;
        } catch (error) {
            console.error("Error checking token:", error);
            return false;
        }
    };

    /**
     * Verificación periódica del token (opcional)
     * Se ejecuta solo cuando el chat está activo y hay mensajes
     */
    const periodicTokenCheck = () => {
        const token = sessionStorage.getItem('sessionSam');
        const lastMessage = chatHistory[chatHistory.length - 1];

        // Solo verificar si hay token, hay mensajes y el último mensaje tiene más de 10 minutos
        if (token && lastMessage && chatHistory.length > 0) {
            const tenMinutesAgo = Date.now() - (10 * 60 * 1000);
            const lastMessageTime = lastMessage.timestamp || 0;

            if (lastMessageTime < tenMinutesAgo) {
                checkTokenApi().catch(() => {
                    // Si falla, no hacer nada, ya se maneja en checkTokenApi
                });
            }
        }
    };

    const fetchBotResponse = async (userMessage) => {
        const domain = getMetaDom("domain");
        const token = sessionStorage.getItem('sessionSam');

        const response = await fetch('https://api-sam-agent.creceidea.pe/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "x-tenant-id": domain,
                ...(token && { 'Authorization': `Bearer ${token}` })
            },
            body: JSON.stringify({
                text: userMessage,
                conversationId: "test-1",
                agentId: domain
            })
        });

        if (!response.ok) {
            // Limpiar estado de sesión expirada
            setCookie('sam_agent_status', false, 0);
            sessionStorage.removeItem('sessionSam');

            // Si es error de autenticación, mostrar botón de re-registro
            if (response.status === 401 || response.status === 403) {
                throw new Error("TOKEN_EXPIRED");
            }

            throw new Error("API_ERROR");
        }

        const data = await response.json();
        console.log('API Response:', data);
        
        // Reproducir audio si está disponible
        if (data?.audio_description) {
            AudioVisualizer.playAudioFromApi(data.audio_description);
        }
        
        return data;
    };

    const executeChatAction = (action) => {
        // Validar que la acción tenga un tipo válido
        if (!action || !action.type || action.type === null || action.type === undefined) {
            return;
        }
        
        const payload = action.payload || {};
        
        switch (action.type) {
            case 'add_to_cart':
                // Nuevo formato: payload contiene cart con array de products
                if (payload.cart && Array.isArray(payload.cart.products) && payload.cart.products.length > 0) {
                    const products = payload.cart.products;
                    
                    // Agregar cada producto del array al carrito
                    products.forEach((product, index) => {
                        // Validar que el producto tenga los datos mínimos necesarios
                        if (product.productId && product.title) {
                            const productData = {
                                price_regular: product.price_regular || 0,
                                price_sale: product.price_sale || product.valid_price || product.price_regular || 0,
                                title: product.title,
                                image: product.image || '/placeholder.jpg',
                                productId: product.productId || product.id,
                                slug: product.slug || ''
                            };
                            const quantity = product.qty || 1;
                            
                            addToCartFromBot(productData, quantity);
                            
                            // Mostrar notificación solo para el último producto agregado
                            if (index === products.length - 1) {
                                if (btnCartToolBar) {
                                    btnCartToolBar.classList.add('animar-pulso');
                                }
                            }
                        } else {
                            console.warn("Datos incompletos para agregar al carrito:", product);
                        }
                    });
                } else {
                    console.warn("Formato de carrito inválido o sin productos:", payload);
                }
                break;
            case 'search_product':
                // Mostrar lista de productos encontrados en fila horizontal
                showProductSearchResults(payload);
                break;
            case 'go_to_url':
                if (payload.url) {
                    window.location.href = payload.url;
                } else {
                    console.warn("URL no proporcionada para la acción go_to_url");
                }
                break;
            case 'show_product':
                // Mostrar card de producto en el chat
                showProductCard(payload);
                break;
            default:
                console.warn("Acción desconocida:", action.type, payload);
        }
    };

    // Optimizar eventos del input con debouncing y mejor UX
    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const message = chatInput.value.trim();
            if (message) {
                handleSendMessage(message);
            }
        }
    });

    // Mejorar UX con indicadores visuales
    chatInput.addEventListener('input', ChatbotUtils.debounce((e) => {
        const messageLength = e.target.value.length;
        const isNearLimit = messageLength > CHATBOT_CONFIG.messageMaxLength * 0.8;

        if (isNearLimit) {
            chatInput.style.borderColor = messageLength > CHATBOT_CONFIG.messageMaxLength ? '#ef4444' : '#f59e0b';
        } else {
            chatInput.style.borderColor = '';
        }
    }, 150));

    // Agregar indicador de scroll para mejor UX
    if (chatMessages) {
        const scrollIndicator = ChatbotUtils.throttle(() => {
            const { scrollTop, scrollHeight, clientHeight } = chatMessages;
            const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;

            // Mostrar indicador si hay contenido para hacer scroll
            if (scrollHeight > clientHeight) {
                chatMessages.dataset.scrollPercentage = Math.round(scrollPercentage);
            }
        }, 100);

        chatMessages.addEventListener('scroll', scrollIndicator);
    }

    // Event listener para el scroll del contenedor de mensajes
    chatMessages?.addEventListener('scroll', () => {
        updateScrollIndicator();
    });

    // Cargar historial solo si hay datos válidos
    if (Array.isArray(chatHistory) && chatHistory.length > 0) {
        loadChatFromLocalStorage();
    }

    // Visualizador de sonidos

    const AudioVisualizer = {
        // 1. CONFIGURACIÓN: Centralizamos valores que podríamos querer cambiar.
        config: {
            apiUrl: 'https://api-sam-agent.creceidea.pe/api/audio/from-description',
            fftSize: 256,
            bassFrequencyRange: [0, 5], // Rango de bins de frecuencia para los bajos
            pulseThreshold: 0.35, // Umbral normalizado (0-1) para el pulso
            waveThreshold: 0.5,   // Umbral normalizado (0-1) para las ondas
            waveCooldown: 12,     // Frames de espera entre ondas
            numWaves: 5,          // Número de elementos de onda a reutilizar (pooling)
        },

        // 2. ESTADO: Almacenamos aquí las variables dinámicas.
        state: {
            audioContext: null,
            analyser: null,
            source: null,
            animationId: null,
            waveCooldownTimer: 0,
            wavePoolIndex: 0,
            isPlaying: false,
        },

        // 3. ELEMENTOS DEL DOM: Cacheamos las referencias para no buscarlas repetidamente.
        elements: {
            // playButton: document.getElementById('play-api-button'),
            //  buttonText: document.querySelector('#play-api-button .button-text'),
            chatBubble: document.getElementById('chat-bubble'),
            wavesContainer: document.querySelector('.waves-container'),
            wavePool: [],
        },

        /**
         * Método de inicialización. Prepara el visualizador y los eventos.
         */
        init() {
            this.createWavePool();
        },

        /**
         * Crea un "pool" de elementos de onda para reutilizarlos.
         * Esto es MUCHO más performante que crear y destruir elementos en cada beat.
         */
        createWavePool() {
            for (let i = 0; i < this.config.numWaves; i++) {
                const wave = document.createElement("span");
                wave.className = "wave";
                this.elements.wavesContainer.appendChild(wave);
                // Al terminar la animación, la removemos para que pueda ser reutilizada.
                wave.addEventListener('animationend', () => wave.classList.remove('animate'));
                this.elements.wavePool.push(wave);
            }
        },

        /**
         * Detiene cualquier audio y animación en curso.
         */
        stopCurrent() {
            if (this.state.source) {
                this.state.source.stop(0);
                this.state.source.disconnect();
                this.state.source = null;
            }
            if (this.state.animationId) {
                cancelAnimationFrame(this.state.animationId);
                this.state.animationId = null;
            }
            this.elements.chatBubble.style.setProperty('--pulse-scale', 1);
            this.state.isPlaying = false;
        },

        /**
         * Configura el AnalyserNode para procesar el audio.
         */
        setupAnalyser() {
            this.state.analyser = this.state.audioContext.createAnalyser();
            this.state.analyser.fftSize = this.config.fftSize;
            this.state.source.connect(this.state.analyser);
        },

        /**
         * Obtiene y reproduce el audio desde la API.
         * @param {string} text - El texto a convertir en voz.
         */
        async playAudioFromApi(text) {
            if (this.state.isPlaying) {
                this.stopCurrent();
                return;
            }

            this.stopCurrent();
            this.setButtonState('loading');

            try {

                if (!this.state.audioContext) {
                    this.state.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                }

                const token = sessionStorage.getItem('sessionSam');
                const domain = getMetaDom("domain");
                const response = await fetch(this.config.apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        "x-tenant-id": domain,
                        ...(token && { 'Authorization': `Bearer ${token}` })
                    },
                    body: JSON.stringify({ audioDescription:text, agentId: domain })
                });

                if (!response.ok) throw new Error(`Error en la API: ${response.statusText}`);

                const arrayBuffer = await response.arrayBuffer();
                const audioBuffer = await this.state.audioContext.decodeAudioData(arrayBuffer);

                this.state.source = this.state.audioContext.createBufferSource();
                this.state.source.buffer = audioBuffer;

                this.setupAnalyser();
                this.state.source.connect(this.state.audioContext.destination);
                this.state.source.start(0);
                this.state.isPlaying = true;
                this.setButtonState('playing');

                // Reiniciamos el estado visual al terminar el audio.
                this.state.source.onended = () => {
                    this.stopCurrent();
                    this.setButtonState('default');
                };

                this.visualize();

            } catch (error) {
                console.error("Error al procesar el audio:", error);
                this.setButtonState('error', error.message);
                this.stopCurrent();
            }
        },

        /**
         * Gestiona el estado visual del botón (texto, deshabilitado, etc.)
         * @param {'loading'|'playing'|'error'|'default'} state 
         * @param {string} [message] - Mensaje opcional para el estado de error.
         */
        setButtonState(state, message = '') {
            const textMap = {
                loading: 'Cargando',
                playing: 'Detener',
                error: `Error: Reintentar`,
                default: 'Reproducir Audio'
            };
            //this.elements.buttonText.textContent = textMap[state];
            //this.elements.playButton.disabled = state === 'loading';
        },

        /**
         * Inicia el bucle de animación.
         */
        visualize() {
            const bufferLength = this.state.analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            let lastPeak = 0;

            const draw = () => {
                this.state.animationId = requestAnimationFrame(draw);
                this.state.analyser.getByteFrequencyData(dataArray);

                const [start, end] = this.config.bassFrequencyRange;
                const bassEnergy = dataArray.slice(start, end).reduce((acc, val) => acc + val, 0) / (end - start);

                // Normalizamos el valor de energía a un rango de 0-1 para un uso más fácil.
                const bassEnergyNormalized = bassEnergy / 255;

                // -- Actualización de Estilos vía Variables CSS (muy eficiente) --

                // 1. Pulso del icono
                const pulseScale = bassEnergyNormalized > this.config.pulseThreshold
                    ? 1 + (bassEnergyNormalized - this.config.pulseThreshold) * 0.25
                    : 1;
                this.elements.chatBubble.style.setProperty('--pulse-scale', pulseScale);

                // 2. Ondas expansivas
                if (this.state.waveCooldownTimer > 0) this.state.waveCooldownTimer--;

                if (bassEnergyNormalized > this.config.waveThreshold && bassEnergyNormalized > lastPeak && this.state.waveCooldownTimer === 0) {
                    this.triggerWave(bassEnergyNormalized);
                    lastPeak = bassEnergyNormalized;
                    this.state.waveCooldownTimer = this.config.waveCooldown;
                }

                lastPeak *= 0.98; // Decaimiento suave del último pico
            };
            draw();
        },

        /**
         * Activa una onda del pool.
         * @param {number} intensity - La intensidad normalizada (0-1) del bajo.
         */
        triggerWave(intensity) {
            const wave = this.elements.wavePool[this.state.wavePoolIndex];

            // Actualizamos la variable CSS de intensidad para esta onda específica.
            wave.style.setProperty('--bass-intensity', intensity);

            // Añadimos la clase para disparar la animación CSS.
            wave.classList.add('animate');

            // Avanzamos al siguiente elemento del pool para la próxima onda.
            this.state.wavePoolIndex = (this.state.wavePoolIndex + 1) % this.config.numWaves;
        },
    };

    AudioVisualizer.init();

    const formContainer = document.getElementById('formContainer');
    const spinnerContainer = document.getElementById('spinnerContainer');
    const form = document.getElementById('contactForm');
    const statusMessage = document.getElementById('statusMessage');
    const welcomme = document.getElementById('welcomme');
    const name_user = document.getElementById('name_user');
    const into = document.getElementById('into');
    const container_welcomme = document.getElementById('container_welcomme');
    const global_answers = document.getElementById('global_answers');


    if (chatStatus) {
        formContainer.classList.add('hidden');
        global_answers.classList.remove('hidden');
        container_welcomme.classList.remove('bg-cyan-950');
        container_welcomme.classList.remove('h-full');
        container_welcomme.classList.remove('absolute');
    } else {

        localStorage.removeItem('chatHistory');
    }


    form?.addEventListener('submit', async function (event) {
        event.preventDefault();

        formContainer?.classList.add('hidden');
        statusMessage.textContent = '';

        const domain = getMetaDom("domain");
        const formData = new FormData(form);
        const data = {
            email: formData.get('email'),
            name: formData.get('name'),
            source: "chatbot",
            terms_conditions: true,
            domain: domain
        };

        try {
            // Mostrar spinner específicamente antes de consultar el endpoint de suscripciones
            spinnerContainer?.classList.remove('hidden');

            const response = await fetch('https://api-clients.creceidea.pe/api/v1/subscriptions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            // Ocultar spinner inmediatamente después de recibir el token
            spinnerContainer?.classList.add('hidden');

            // Registro exitoso
            sessionStorage.setItem('sessionSam', result.token);
            statusMessage.textContent = '¡Datos enviados correctamente!';
            statusMessage.className = 'mt-4 text-center text-sm font-medium text-green-600';

            welcomme?.classList.remove('hidden');
            into?.classList.add('hidden');
            name_user.textContent = data.name;
            container_welcomme?.classList.remove('bg-cyan-950', 'h-full', 'absolute');

            try {
                // Mostrar typing indicator antes de llamar al endpoint question
                addTypingIndicator();

                const botResponse = await fetchBotResponse('Mi nombre es ' + data.name);

                // Remover typing indicator después de recibir la respuesta
                removeTypingIndicator();

                if (botResponse.message) {
                    await typeMessage(botResponse.message, 'bot');
                }
            } catch (error) {
                console.error("Error al obtener mensaje de bienvenida:", error);

                // Remover typing indicator en caso de error
                removeTypingIndicator();

                addMessage("¡Hola " + data.name + "! ¿En qué puedo ayudarte hoy?", 'bot');
            }

            setCookie('sam_agent_status', true, 1);
            setCookie('sam_agent_name', data.name, 1);

            // Actualizar estado global del chat
            chatStatus = true;
            global_answers?.classList.remove('hidden');

            form.reset();
            showChatNotification('Registro exitoso', 'success');

        } catch (error) {
            console.error('Error:', error);

            // Ocultar spinner en caso de error en el endpoint de suscripciones
            spinnerContainer?.classList.add('hidden');

            statusMessage.textContent = 'Hubo un error al enviar los datos. Intenta de nuevo.';
            statusMessage.className = 'mt-4 text-center text-sm font-medium text-red-600';
            formContainer?.classList.remove('hidden');
            showChatNotification('Error en el registro', 'error');
        } finally {
            // Asegurar que el spinner se oculte en cualquier caso
            spinnerContainer?.classList.add('hidden');
        }
    });

    // Verificación periódica del token cada 5 minutos (opcional)
    // Solo se ejecuta si hay actividad en el chat
    setInterval(() => {
        if (chatStatus && sessionStorage.getItem('sessionSam')) {
            periodicTokenCheck();
        }
    }, 5 * 60 * 1000); // 5 minutos

});