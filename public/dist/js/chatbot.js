import {
    getDataAttributes,
    addToCart,
    getCartItemCount

} from './utils.js?v=3126242222q1';

document.addEventListener('DOMContentLoaded', () => {
    const chatBubble = document.getElementById('chat-bubble');
    const chatWindow = document.getElementById('chat-window');
    const closeChat = document.getElementById('close-chat');
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const micButton = document.getElementById('mic-button');
    const cantidadCartDiv = document.querySelector('.count-products');

    const updateCartItemCount = () => {
        const itemCount = getCartItemCount();
        if (cantidadCartDiv) {
            cantidadCartDiv.textContent = itemCount;
        }
    };

    function addToCartFromBot(productId, quantity) {
        const buttons = document.querySelectorAll(`.add_to_cart[data-id="${productId}"]`);
        const btnCartToolBar = document.getElementById('openCart');

        if (!buttons.length) {
            console.warn(`No se encontró ningún botón con data-product-id="${productId}"`);
            return;
        }

        buttons.forEach(button => {
            const data = getDataAttributes(button);
            addToCart(data, quantity);
            btnCartToolBar.classList.add('animar-pulso');
            updateCartItemCount();
        });
        setTimeout(() => {
            btnCartToolBar.classList.remove('animar-pulso');
        }, 900);

    }


    let isListening = false;

    // Historial desde localStorage
    let chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];

    const saveChatToLocalStorage = () => {
        localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
    };

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition;

    if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.lang = 'es-PE';
        recognition.continuous = false;
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

    } else {
        console.warn("La API de reconocimiento de voz no está disponible.");
        micButton.disabled = true;
        chatInput.placeholder = 'Voz no soportada. Escribe tu mensaje.';
    }

    micButton.addEventListener('click', () => {
        if (isListening) {
            recognition.stop();
        } else {
            if (recognition) {
                chatInput.value = '';
                recognition.start();
            }
        }
    });

    chatBubble.addEventListener('click', () => {
        chatWindow.classList.toggle('hidden');
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
        const bubbleClass = sender === 'user' ? 'bg-cyan-500 text-white rounded-l-lg rounded-br-lg' : 'bg-gray-700 text-white rounded-r-lg rounded-bl-lg';
        messageElement.innerHTML = `<div class="max-w-xs px-4 py-2 ${bubbleClass}"><p>${text}</p></div>`;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        chatHistory.push({ sender, text });
        saveChatToLocalStorage();
    };

    const loadChatFromLocalStorage = () => {
        chatHistory.forEach(({ sender, text }) => {
            addMessage(text, sender);
        });
    };

    const addTypingIndicator = () => {
        const typingElement = document.createElement('div');
        typingElement.id = 'typing-indicator';
        typingElement.className = 'flex justify-start';
        typingElement.innerHTML = `<div class="max-w-xs px-4 py-2 bg-gray-700 text-white rounded-r-lg rounded-bl-lg"><div class="flex items-center space-x-1"><span class="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span><span class="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style="animation-delay:0.2s"></span><span class="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style="animation-delay:0.4s"></span></div></div>`;
        chatMessages.appendChild(typingElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    const removeTypingIndicator = () => {
        document.getElementById('typing-indicator')?.remove();
    };

    const fetchBotResponse = async (userMessage) => {
        const response = await fetch('http://localhost:3023/chatbot/question', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                domain: "inversionesvargas.creceidea.pe",
                userMessage
            })
        });
        if (!response.ok) throw new Error("API error");
        const data = await response.json();
        await fetchBotResponseVoice(data.assistantMessage.audio_description);
        return data.assistantMessage;
    };

    const fetchBotResponseVoice = async (text) => {
        try {
            const response = await fetch('http://localhost:3023/textvoice/speak', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text })
            });
            const blob = await response.blob();
            const audioUrl = URL.createObjectURL(blob);
            new Audio(audioUrl).play();
        } catch (e) {
            console.error("Error de voz:", e);
        }
    };

    const executeChatAction = (action) => {
        if (!action || !action.type) return;
        switch (action.type) {
            case 'add_to_cart':
                addToCartFromBot(action.productId, action.quantity)
                alert(`Producto agregado al carrito (${action.quantity})`);
                break;
            case 'go_to_url':
                window.location.href = action.url;
                break;
            case 'show_product':
                alert(`Mostrar producto: ${action.productId}`);
                break;
            default:
                console.warn("Acción desconocida:", action.type);
        }
    };

    document.getElementById('mic-button').addEventListener('click', () => {
        handleSendMessage(chatInput.value.trim());
    });

    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage(chatInput.value.trim());
        }
    });


    loadChatFromLocalStorage();

});