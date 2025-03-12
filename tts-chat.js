document.addEventListener('DOMContentLoaded', function() {
    // Check if browser supports speech synthesis
    if ('speechSynthesis' in window) {
        console.log('Speech synthesis supported');
    } else {
        alert('Sorry, your browser does not support text to speech!');
        return;
    }

    // DOM elements
    const chatMessages = document.getElementById('chat-messages');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const toggleControls = document.getElementById('toggle-controls');
    const ttsControls = document.getElementById('tts-controls');
    const voiceSelect = document.getElementById('voice-select');
    const rate = document.getElementById('rate');
    const rateValue = document.getElementById('rate-value');
    const pitch = document.getElementById('pitch');
    const pitchValue = document.getElementById('pitch-value');
    const volume = document.getElementById('volume');
    const volumeValue = document.getElementById('volume-value');
    const autoSpeak = document.getElementById('auto-speak');
    
    // Speech synthesis
    const synth = window.speechSynthesis;
    let voices = [];

    // Sample user names (could be replaced with actual user data from your app)
    const users = ['You', 'Alice', 'Bob', 'Charlie'];
    const currentUser = 'You';

    // Populate voice list
    function populateVoiceList() {
        voices = synth.getVoices();
        
        voiceSelect.innerHTML = '';
        voices.forEach((voice, index) => {
            const option = document.createElement('option');
            option.textContent = `${voice.name} (${voice.lang})`;
            option.setAttribute('data-lang', voice.lang);
            option.setAttribute('data-name', voice.name);
            option.value = index;
            voiceSelect.appendChild(option);
        });
    }

    // Call once to initially populate
    populateVoiceList();
    
    // Chrome loads voices asynchronously
    if (synth.onvoiceschanged !== undefined) {
        synth.onvoiceschanged = populateVoiceList;
    }

    // Update values as sliders change
    rate.addEventListener('input', () => rateValue.textContent = rate.value);
    pitch.addEventListener('input', () => pitchValue.textContent = pitch.value);
    volume.addEventListener('input', () => volumeValue.textContent = volume.value);

    // Toggle TTS controls visibility
    toggleControls.addEventListener('click', () => {
        if (ttsControls.style.display === 'none') {
            ttsControls.style.display = 'block';
            toggleControls.textContent = 'Hide TTS Controls';
        } else {
            ttsControls.style.display = 'none';
            toggleControls.textContent = 'Show TTS Controls';
        }
    });

    // Speak the text with current settings
    function speak(text, userName) {
        // Cancel any ongoing speech
        synth.cancel();
        
        // Only speak if it's not the current user (don't speak your own messages)
        if (userName !== currentUser || (userName === currentUser && autoSpeak.checked)) {
            const utterance = new SpeechSynthesisUtterance(text);
            
            // Set properties from controls
            const selectedVoice = voices[voiceSelect.value];
            utterance.voice = selectedVoice;
            utterance.rate = parseFloat(rate.value);
            utterance.pitch = parseFloat(pitch.value);
            utterance.volume = parseFloat(volume.value);
            
            // Speak the text
            synth.speak(utterance);
        }
    }

    // Add a message to the chat
    function addMessage(text, isSent, userName) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isSent ? 'sent' : 'received'}`;
        
        const userNameDiv = document.createElement('div');
        userNameDiv.className = 'user-name';
        userNameDiv.textContent = userName;
        
        const textDiv = document.createElement('div');
        textDiv.textContent = text;
        
        const speakIcon = document.createElement('span');
        speakIcon.className = 'speak-icon';
        speakIcon.innerHTML = '🔊';
        speakIcon.title = 'Speak this message';
        speakIcon.onclick = () => speak(text, 'forced');  // 'forced' to ensure it speaks
        
        messageDiv.appendChild(userNameDiv);
        messageDiv.appendChild(textDiv);
        messageDiv.appendChild(speakIcon);
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Speak the message automatically if it's from others
        if (!isSent && autoSpeak.checked) {
            speak(text, userName);
        }
    }

    // Send message
    function sendMessage() {
        const text = messageInput.value.trim();
        if (text) {
            // Add user's message
            addMessage(text, true, currentUser);
            messageInput.value = '';
            
            // Simulate a response (in a real app, this would be from another user)
            setTimeout(() => {
                const randomUser = users[Math.floor(Math.random() * (users.length - 1)) + 1];
                const responses = [
                    "That's interesting!",
                    "I agree with you.",
                    "Could you explain more?",
                    "I have a different perspective on that.",
                    "Let's discuss this in our next call.",
                    "Thanks for sharing that information."
                ];
                const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                addMessage(randomResponse, false, randomUser);
            }, 1000);
        }
    }

    // Event listeners
    sendButton.addEventListener('click', sendMessage);
    
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Add a welcome message
    addMessage("Welcome to the Text-to-Speech Chat! Type a message and it will be spoken aloud.", false, "System");
}); 