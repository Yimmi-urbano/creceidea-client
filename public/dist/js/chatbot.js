import {
    addToCart,
    getCartItemCount,
    getCookie,
    setCookie
} from './utils.js?v=3126242222q1';

function getMetaDom(nameMeta) {
    const metaTag = document.querySelector(`meta[name="${nameMeta}"]`);
    return metaTag ? metaTag.getAttribute("content") : null;
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
    let isListening = false;
    let chatHistory = [];
    let chatStatus = getCookie('sam_agent_status') === "true" ? true : false;

    const updateCartItemCount = () => {
        const itemCount = getCartItemCount();
        if (cantidadCartDiv) {
            cantidadCartDiv.textContent = itemCount;
        }
    };

    function addToCartFromBot(action, quantity) {

        const data =
        {
            "price_regular": action.price_regular,
            "price_sale": action.price_sale ?? action.price_regular,
            "title": action.title,
            "image": action.image,
            "id": action.productId,
            "slug": action.slug,
            "qty": quantity
        }

        addToCart(data, quantity);
        updateCartItemCount();

        if (btnCartToolBar) {
            setTimeout(() => {
                btnCartToolBar.classList.remove('animar-pulso');
            }, 900);
        }
    }

    try {
        chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
    } catch (e) {
        console.warn("Historial de chat corrupto, reiniciando.");
        chatHistory = [];
    }

    const saveChatToLocalStorage = () => {
        localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
    };

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition;

    if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.lang = 'es-PE';
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onstart = () => {
            isListening = true;
            chatInput.placeholder = 'Escuchando...';
            micButton.classList.remove('bg-cyan-500', 'hover:bg-cyan-400');
            micButton.classList.add('bg-red-500', 'animate-pulse');
        };

        recognition.onend = () => {
            isListening = false;
            chatInput.placeholder = 'Escribe tu mensaje aquí...';
            micButton.classList.add('bg-cyan-500', 'hover:bg-cyan-400');
            micButton.classList.remove('bg-red-500', 'animate-pulse');
        };

        recognition.onresult = (event) => {
            let transcript = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                transcript += event.results[i][0].transcript;
            }
            chatInput.value = transcript;

            if (event.results[event.results.length - 1].isFinal) {
                const finalTranscript = event.results[event.results.length - 1][0].transcript.trim();
                if (finalTranscript) {
                    handleSendMessage(finalTranscript);
                }
            }
        };

        recognition.onerror = (event) => {
            console.error("Error de reconocimiento de voz:", event.error);
            chatInput.placeholder = 'Error al reconocer. Intenta de nuevo.';
        };

        micButton.addEventListener('click', () => {

            if (isListening) {
                recognition.stop();
                console.log('hola...')
            } else {
                chatInput.value = '';
                recognition.start();
            }
        });

    } else {
        console.warn("La API de reconocimiento de voz no está disponible.");
        micButton.disabled = false;
        chatInput.placeholder = 'Escribe tu mensaje.';
    }

    micButton.addEventListener('click', () => {

        handleSendMessage(chatInput.value.trim());

    });

    chatBubble.addEventListener('click', () => {
        chatWindow.classList.toggle('hidden');
        checkTokenApi()
        if (!chatWindow.classList.contains('hidden')) {
            chatWindow.classList.remove('scale-95', 'opacity-0');
            chatWindow.classList.add('scale-100', 'opacity-100');
        } else {
            chatWindow.classList.remove('scale-100', 'opacity-100');
            chatWindow.classList.add('scale-95', 'opacity-0');
        }
    });

    closeChat.addEventListener('click', () => {
        chatWindow.classList.remove('scale-100', 'opacity-100');
        chatWindow.classList.add('scale-95', 'opacity-0');
        setTimeout(() => chatWindow.classList.add('hidden'), 300);
    });

    closeChat.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        localStorage.removeItem('chatHistory');
        chatMessages.innerHTML = '';
        chatHistory = [];
    });

    const handleSendMessage = async (userMessageText) => {
        if (!userMessageText) return;
        addMessage(userMessageText, 'user');
        chatInput.value = '';
        addTypingIndicator();

        try {
            const response = await fetchBotResponse(userMessageText);
            const action = response.action;
            const message = response.message;
            removeTypingIndicator();
            addMessage(message, 'bot');

            if (action) executeChatAction(action);
        } catch (error) {
            console.error("Error al contactar la API:", error);
            removeTypingIndicator();
            addMessage("Lo siento, estoy teniendo problemas para conectarme.", 'bot');

        }
    };

    const addMessage = (text, sender) => {
        const messageElement = document.createElement('div');
        messageElement.className = `flex ${sender === 'user' ? 'justify-end' : 'justify-start'}`;
        const bubbleClass = sender === 'user'
            ? 'rounded-xl text-sm px-4 py-2.5 max-w-[80%] gradient-bg-user text-white shadow-sm transition-all'
            : 'rounded-xl text-sm px-4 py-2.5 max-w-[80%] gradient-bg-sam text-white  transition-all';
        messageElement.innerHTML = `<div class="max-w-xs text-sm px-4 py-2 ${bubbleClass}"><p>${text}</p></div>`;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        if (!isLoadingHistory) {
            chatHistory.push({ sender, text });
            saveChatToLocalStorage();
        }
    };


    const loadChatFromLocalStorage = () => {
        isLoadingHistory = true;
        chatHistory.forEach(({ sender, text }) => {
            addMessage(text, sender);
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
                    <span class="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style="animation-delay:0.2s"></span>
                    <span class="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style="animation-delay:0.4s"></span>
                </div>
            </div>`;
        chatMessages.appendChild(typingElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    const removeTypingIndicator = () => {
        document.getElementById('typing-indicator')?.remove();
    };

    const checkTokenApi = async () => {

        const domain = getMetaDom("domain");
        const token = sessionStorage.getItem('sessionSam');

        const response = await fetch('https://api-chat-live.creceidea.pe/chatbot/question', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` })
            },
            body: JSON.stringify({
                domain: domain,
                userMessage: '-'
            })
        });
        if (!response.ok) {
            setCookie('sam_agent_status', false, 0);
            localStorage.removeItem('chatHistory');
            throw new Error("API error");
        }


    }

    const fetchBotResponse = async (userMessage) => {
        const domain = getMetaDom("domain");
        const token = sessionStorage.getItem('sessionSam');

        const response = await fetch('https://api-chat-live.creceidea.pe/chatbot/question', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` })
            },
            body: JSON.stringify({
                domain: domain,
                userMessage
            })
        });
        if (!response.ok) {
            setCookie('sam_agent_status', false, 0)
            throw new Error("API error");
        }
        const data = await response.json();
        AudioVisualizer.playAudioFromApi(data.assistantMessage.audio_description);
        return data.assistantMessage;
    };

    const executeChatAction = (action) => {
        if (!action || !action.type) return;
        switch (action.type) {
            case 'add_to_cart':
                addToCartFromBot(action, action.quantity);
                btnCartToolBar.classList.add('animar-pulso');
                break;
            case 'go_to_url':
                window.location.href = action.url;
                break;
            case 'show_product':
                window.location.href = action.url;
                break;
            default:
                console.warn("Acción desconocida:", action.type);
        }
    };

    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage(chatInput.value.trim());
        }
    });

    loadChatFromLocalStorage();


    // Visualizador de sonidos

    const AudioVisualizer = {
        // 1. CONFIGURACIÓN: Centralizamos valores que podríamos querer cambiar.
        config: {
            apiUrl: 'https://api-chat-live.creceidea.pe/textvoice/speak',
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

                const token = sessionStorage.getItem('sessionToken');

                const response = await fetch(this.config.apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token && { 'Authorization': `Bearer ${token}` })
                    },
                    body: JSON.stringify({ text })
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


    form.addEventListener('submit', function (event) {

        event.preventDefault();
        formContainer.classList.add('hidden');
        spinnerContainer.classList.remove('hidden');
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

        fetch('https://api-clients.creceidea.pe/api/v1/subscriptions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(async (result) => {
                console.log(result.token)
                sessionStorage.setItem('sessionSam', result.token);
                statusMessage.textContent = '¡Datos enviados correctamente!';
                statusMessage.className = 'mt-4 text-center text-sm font-medium text-green-600';
                welcomme.classList.remove('hidden');
                into.classList.add('hidden');
                name_user.textContent = data.name;
                container_welcomme.classList.remove('bg-cyan-950');
                container_welcomme.classList.remove('h-full');
                container_welcomme.classList.remove('absolute');
                const response = await fetchBotResponse('Mi nombre es ' + data.name)
                const message = response.message;
                addMessage(message, 'bot');
                setCookie('sam_agent_status', true, 1);
                setCookie('sam_agent_name', data.name, 1)
                form.reset();
            })
            .catch(error => {
                console.error('Error:', error);
                statusMessage.textContent = 'Hubo un error al enviar los datos.';
                statusMessage.className = 'mt-4 text-center text-sm font-medium text-red-600';
                formContainer.classList.remove('hidden');
            })
            .finally(() => {

                spinnerContainer.classList.add('hidden');

            });

    });

});