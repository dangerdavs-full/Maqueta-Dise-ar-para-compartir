document.addEventListener('DOMContentLoaded', () => {
    // ---- Estado Global ----
    let isDarkMode = false;
    let isHighContrast = false;
    let isLargeText = false;
    let isVisualAlert = false;

    const body = document.body;
    
    // ---- Elementos de Accesibilidad y WOW ----
    const btnTheme = document.getElementById('btn-theme');
    const btnTextSize = document.getElementById('btn-text-size');
    const btnVisualAlert = document.getElementById('btn-visual-alert');
    const btnMic = document.getElementById('mic-btn');
    const btnAi = document.getElementById('ai-btn');
    const sentimentIndicator = document.getElementById('sentiment-indicator');
    
    // Botón de Contraste (Theme Toggler)
    btnTheme.addEventListener('click', () => {
        if (!isDarkMode && !isHighContrast) {
            // Light -> Dark
            isDarkMode = true;
            body.classList.remove('light-mode');
            body.classList.add('dark-mode');
            btnTheme.innerHTML = '<i class="ph ph-sun"></i> Luz';
            btnTheme.classList.add('active-tool');
        } else if (isDarkMode && !isHighContrast) {
            // Dark -> High Contrast
            isHighContrast = true;
            body.classList.remove('dark-mode');
            body.classList.add('high-contrast');
            btnTheme.innerHTML = '<i class="ph ph-eye"></i> Alto Cont.';
        } else {
            // High -> Light
            isDarkMode = false;
            isHighContrast = false;
            body.classList.remove('high-contrast');
            body.classList.add('light-mode');
            btnTheme.innerHTML = '<i class="ph ph-moon"></i> Contraste';
            btnTheme.classList.remove('active-tool');
        }
    });

    // Botón de Tamaño de Texto
    btnTextSize.addEventListener('click', () => {
        isLargeText = !isLargeText;
        if (isLargeText) {
            body.classList.add('large-text');
            btnTextSize.classList.add('active-tool');
        } else {
            body.classList.remove('large-text');
            btnTextSize.classList.remove('active-tool');
        }
    });

    // Botón de Alerta Visual (Accesibilidad auditiva)
    btnVisualAlert.addEventListener('click', () => {
        isVisualAlert = !isVisualAlert;
        if (isVisualAlert) {
            body.classList.add('visual-alert-active');
            btnVisualAlert.classList.add('active-tool');
            
            // Simular que llega un nuevo mensaje no leido a otro chat
            const nonActiveChat = document.querySelector('.chat-item:not(.active)');
            if(nonActiveChat) {
                nonActiveChat.classList.add('unread');
                if(!nonActiveChat.querySelector('.unread-badge')) {
                    const badge = document.createElement('span');
                    badge.className = 'unread-badge';
                    badge.innerText = '1';
                    nonActiveChat.appendChild(badge);
                }
            }

        } else {
            body.classList.remove('visual-alert-active');
            btnVisualAlert.classList.remove('active-tool');
        }
    });

    // ---- Chat Interactions ----
    const chatItems = document.querySelectorAll('.chat-item');
    
    // Función global para que funcione el onclick del HTML
    window.selectChat = function(element, name) {
        // Remover activo de todos
        chatItems.forEach(item => item.classList.remove('active'));
        // Poner activo al seleccionado
        element.classList.add('active');
        element.classList.remove('unread');
        
        // Quitar el badge de no leido si lo tuviera
        const badge = element.querySelector('.unread-badge');
        if(badge) badge.remove();

        // Actualizar Cabecera de chat Activo
        document.getElementById('active-name').innerText = name;
        const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        document.getElementById('active-initials').innerText = initials;

        // Limpiar area de chats (simulacion)
        const container = document.getElementById('messages-container');
        container.innerHTML = `<div class="message-date">Hoy</div>
            <div class="message incoming">
                <div class="bubble">Hola, estoy conectando con el agente asignado.</div>
            </div>`;
    };

    // ---- Envío de Mensajes y Quick Replies ----
    const messageInput = document.getElementById('message-input');
    const sendBtn = document.getElementById('send-btn');
    const messagesContainer = document.getElementById('messages-container');

    function sendMessage(text) {
        if (!text.trim()) return;

        // Crear div del mensaje saliente
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message outgoing';
        msgDiv.innerHTML = `<div class="bubble">${text}</div>`;
        
        // Animacion en el contenedor
        messagesContainer.appendChild(msgDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Limpiar input
        messageInput.value = '';

        // Simular respuesta despues de 2 segundos (Simulacion demo)
        setTimeout(() => {
            const replyDiv = document.createElement('div');
            replyDiv.className = 'message incoming';
            
            // Randomizar una respuesta para el demo de "WOW"
            const responses = [
                { text: "Entendido, muchas gracias por la información 😊", sent: "happy", icon: "ph-smiley" },
                { text: "No me parece bien, esperaba otra cosa.", sent: "angry", icon: "ph-smiley-sad" },
                { text: "De acuerdo. ¿Qué procede ahora?", sent: "neutral", icon: "ph-smiley-meh" }
            ];
            const rand = responses[Math.floor(Math.random() * responses.length)];

            replyDiv.innerHTML = `<div class="bubble">
                ${rand.text}
                <button class="speaker-btn" aria-label="Escuchar mensaje" onclick="readMessage(this)" title="Leído por el ordenador"><i class="ph-fill ph-speaker-high"></i></button>
            </div>`;
            messagesContainer.appendChild(replyDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;

            // Actualizar Sentimiento
            if (sentimentIndicator) {
                sentimentIndicator.className = `sentiment-badge ${rand.sent}`;
                sentimentIndicator.innerHTML = `<i class="ph ${rand.icon}"></i> ${rand.sent.charAt(0).toUpperCase() + rand.sent.slice(1)}`;
            }

        }, 2000);
    }

    sendBtn.addEventListener('click', () => {
        sendMessage(messageInput.value);
    });

    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage(messageInput.value);
        }
    });

    // Exponer para quick replies
    window.insertQuickReply = function(text) {
        sendMessage(text);
    };

    // ---- WOW: ASISTENTE DE IA SIMULADO ----
    if (btnAi) {
        btnAi.addEventListener('click', () => {
            if (btnAi.classList.contains('thinking')) return;
            btnAi.classList.add('thinking');
            messageInput.placeholder = "IA Sugiriendo...";
            messageInput.disabled = true;

            setTimeout(() => {
                btnAi.classList.remove('thinking');
                messageInput.placeholder = "Escribe un mensaje...";
                messageInput.disabled = false;
                
                // Efecto de escribir como IA
                const suggestedText = "¡Claro que sí! Nuestra sucursal principal abre de Lunes a Viernes de 9:00 AM a 6:00 PM y los Sábados de 10:00 AM a 2:00 PM. ¿Te puedo ayudar con algo más?";
                let i = 0;
                messageInput.value = "";
                const typingObj = setInterval(() => {
                    if (i < suggestedText.length) {
                        messageInput.value += suggestedText.charAt(i);
                        i++;
                    } else {
                        clearInterval(typingObj);
                        messageInput.focus();
                    }
                }, 20); // Velocidad maquina escribir
            }, 1000);
        });
    }

    // ---- WOW: DICTADO POR VOZ (Web Speech API) ----
    if (btnMic) {
        let isRecording = false;
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.lang = 'es-MX';
            recognition.interimResults = false;

            recognition.onstart = function() {
                isRecording = true;
                btnMic.classList.add('recording');
                messageInput.placeholder = "Escuchando... habla ahora.";
            };

            recognition.onresult = function(event) {
                const transcript = event.results[0][0].transcript;
                messageInput.value = transcript;
            };

            recognition.onerror = function() {
                messageInput.placeholder = "Escribe un mensaje... (Error en micrófono)";
            };

            recognition.onend = function() {
                isRecording = false;
                btnMic.classList.remove('recording');
                if(!messageInput.value) messageInput.placeholder = "Escribe un mensaje...";
            };

            btnMic.addEventListener('click', () => {
                if (isRecording) {
                    recognition.stop();
                } else {
                    recognition.start();
                }
            });
        } else {
            // Fallback si navegador no soporta Speech-to-Text
            btnMic.addEventListener('click', () => alert("Tu navegador no soporta reconocimiento de voz nativo."));
        }
    }

    // ---- Navegación lateral ----
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navItems.forEach(n => n.classList.remove('active'));
            this.classList.add('active');
        });
    });
});

// ---- WOW: TEXT TO SPEECH (Lectura en Voz Alta) ----
// Global function to read the text inside the chat bubble
window.readMessage = function(btnElement) {
    if (!('speechSynthesis' in window)) {
        alert("Tu navegador no soporta síntesis de voz.");
        return;
    }

    // Get the parent bubble and extract plain text (ignore button HTML)
    const bubble = btnElement.parentElement;
    let textToRead = Array.from(bubble.childNodes)
        .filter(node => node.nodeType === Node.TEXT_NODE)
        .map(node => node.textContent)
        .join(' ');

    textToRead = textToRead.trim();

    // Setup speech
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = "es-MX";
    utterance.rate = 1.0;
    
    // UI Feedback
    btnElement.classList.add('reading');
    
    utterance.onend = function() {
        btnElement.classList.remove('reading');
    };
    utterance.onerror = function() {
        btnElement.classList.remove('reading');
    };

    window.speechSynthesis.speak(utterance);
};
