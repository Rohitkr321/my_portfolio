// ===== VOICE INTRODUCTION WIDGET =====
function initVoiceIntroduction() {
    const voiceToggle = document.getElementById('voice-intro-toggle');
    const voicePanel = document.getElementById('voice-intro-panel');
    const voiceClose = document.getElementById('voice-close');
    const playBtn = document.getElementById('play-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const stopBtn = document.getElementById('stop-btn');
    const voiceStatus = document.getElementById('voice-status');
    const progressFill = document.getElementById('voice-progress-fill');
    const currentTimeEl = document.getElementById('current-time');
    const totalTimeEl = document.getElementById('total-time');
    const autoplayCheckbox = document.getElementById('autoplay-checkbox');
    const volumeSlider = document.getElementById('volume-slider');
    const voiceIcon = document.getElementById('voice-icon');
    
    if (!voiceToggle || !voicePanel) return;
    
    let isPanelOpen = false;
    let utterance = null;
    let isPlaying = false;
    let isPaused = false;
    let progressInterval = null;
    let startTime = 0;
    let pausedTime = 0;
    let estimatedDuration = 0;
    
    // Introduction text
    const introText = "Hello! I'm Rohit Kumar, a Software Engineer L3 at General Aeronautics. With over 2 years of experience in full-stack development, I specialize in Node.js, React, and building scalable backend systems. I've contributed to multiple live drone applications, achieving 40 percent efficiency improvement and 35 percent performance optimization. Welcome to my portfolio!";
    
    // Check for autoplay preference
    const autoplayEnabled = localStorage.getItem('voiceAutoplay') === 'true';
    if (autoplayEnabled) {
        autoplayCheckbox.checked = true;
        // Auto-play after a delay
        setTimeout(() => {
            if (!sessionStorage.getItem('voicePlayed')) {
                playIntroduction();
                sessionStorage.setItem('voicePlayed', 'true');
            }
        }, 1500);
    }
    
    // Toggle panel
    voiceToggle.addEventListener('click', () => {
        isPanelOpen = !isPanelOpen;
        voicePanel.classList.toggle('active', isPanelOpen);
    });
    
    // Close panel
    if (voiceClose) {
        voiceClose.addEventListener('click', () => {
            isPanelOpen = false;
            voicePanel.classList.remove('active');
        });
    }
    
    // Play button
    playBtn.addEventListener('click', playIntroduction);
    
    // Pause button
    pauseBtn.addEventListener('click', pauseIntroduction);
    
    // Stop button
    stopBtn.addEventListener('click', stopIntroduction);
    
    // Autoplay checkbox
    autoplayCheckbox.addEventListener('change', (e) => {
        localStorage.setItem('voiceAutoplay', e.target.checked);
    });
    
    // Volume slider
    volumeSlider.addEventListener('input', (e) => {
        if (utterance) {
            utterance.volume = e.target.value / 100;
        }
    });
    
    function playIntroduction() {
        if ('speechSynthesis' in window) {
            // Stop any ongoing speech
            window.speechSynthesis.cancel();
            
            if (isPaused && utterance) {
                // Resume paused speech
                window.speechSynthesis.resume();
                isPaused = false;
                isPlaying = true;
                startTime = Date.now() - pausedTime;
                updateUIPlaying();
                startProgressAnimation();
                return;
            }
            
            // Create new utterance
            utterance = new SpeechSynthesisUtterance(introText);
            utterance.rate = 0.95; // Slightly slower for clarity
            utterance.pitch = 1;
            utterance.volume = volumeSlider.value / 100;
            utterance.lang = 'en-US';
            
            // Set voice to a good quality voice if available
            const voices = window.speechSynthesis.getVoices();
            const preferredVoice = voices.find(voice => 
                voice.name.includes('Google') || 
                voice.name.includes('Enhanced') ||
                voice.name.includes('Premium')
            ) || voices[0];
            
            if (preferredVoice) {
                utterance.voice = preferredVoice;
            }
            
            // Calculate estimated duration based on text length and speech rate
            // Average speech rate is ~150 words per minute, but we're using rate 0.95
            const words = introText.split(' ').length;
            estimatedDuration = (words / (150 * utterance.rate)) * 60 * 1000; // in milliseconds
            
            // Event handlers
            utterance.onstart = () => {
                isPlaying = true;
                isPaused = false;
                startTime = Date.now();
                pausedTime = 0;
                updateUIPlaying();
                startProgressAnimation();
            };
            
            // Track word boundaries for more accurate progress
            let charIndex = 0;
            utterance.onboundary = (event) => {
                if (event.name === 'word') {
                    charIndex = event.charIndex;
                    // Calculate progress based on character position
                    const textProgress = (charIndex / introText.length) * 100;
                    progressFill.style.width = textProgress + '%';
                    
                    // Update time based on actual progress
                    const elapsedTime = (textProgress / 100) * (estimatedDuration / 1000);
                    currentTimeEl.textContent = formatTime(elapsedTime);
                }
            };
            
            utterance.onend = () => {
                isPlaying = false;
                isPaused = false;
                stopProgressAnimation();
                progressFill.style.width = '100%';
                currentTimeEl.textContent = totalTimeEl.textContent;
                
                // Reset after a short delay
                setTimeout(() => {
                    progressFill.style.width = '0%';
                    currentTimeEl.textContent = '0:00';
                    updateUIIdle();
                }, 1000);
            };
            
            utterance.onerror = (event) => {
                console.error('Speech synthesis error:', event);
                voiceStatus.textContent = 'Error playing audio';
                stopProgressAnimation();
                updateUIIdle();
            };
            
            // Update total time display
            totalTimeEl.textContent = formatTime(estimatedDuration / 1000);
            
            // Start speaking
            window.speechSynthesis.speak(utterance);
        } else {
            alert('Sorry, your browser does not support text-to-speech.');
        }
    }
    
    function pauseIntroduction() {
        if (isPlaying && window.speechSynthesis.speaking) {
            window.speechSynthesis.pause();
            isPaused = true;
            isPlaying = false;
            pausedTime = Date.now() - startTime;
            stopProgressAnimation();
            voiceStatus.textContent = 'Paused';
            playBtn.style.display = 'flex';
            pauseBtn.style.display = 'none';
            voiceIcon.className = 'fas fa-volume-mute';
        }
    }
    
    function stopIntroduction() {
        window.speechSynthesis.cancel();
        isPlaying = false;
        isPaused = false;
        pausedTime = 0;
        stopProgressAnimation();
        updateUIIdle();
        progressFill.style.width = '0%';
        currentTimeEl.textContent = '0:00';
    }
    
    function updateUIPlaying() {
        voiceStatus.textContent = 'Playing...';
        playBtn.style.display = 'none';
        pauseBtn.style.display = 'flex';
        voiceIcon.className = 'fas fa-volume-up';
    }
    
    function updateUIIdle() {
        voiceStatus.textContent = 'Ready to play';
        playBtn.style.display = 'flex';
        pauseBtn.style.display = 'none';
        voiceIcon.className = 'fas fa-volume-up';
    }
    
    function startProgressAnimation() {
        // Clear any existing interval
        stopProgressAnimation();
        
        // Start new progress animation (as fallback if onboundary doesn't work)
        progressInterval = setInterval(() => {
            if (!isPlaying) {
                stopProgressAnimation();
                return;
            }
            
            const elapsed = Date.now() - startTime;
            const progress = Math.min((elapsed / estimatedDuration) * 100, 100);
            
            // Only update if onboundary is not updating (check if progress is behind)
            const currentProgress = parseFloat(progressFill.style.width) || 0;
            if (progress > currentProgress) {
                progressFill.style.width = progress + '%';
                currentTimeEl.textContent = formatTime(elapsed / 1000);
            }
            
            if (progress >= 100) {
                stopProgressAnimation();
            }
        }, 100); // Update every 100ms for smooth animation
    }
    
    function stopProgressAnimation() {
        if (progressInterval) {
            clearInterval(progressInterval);
            progressInterval = null;
        }
    }
    
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return mins + ':' + (secs < 10 ? '0' : '') + secs;
    }
    
    // Close panel when clicking outside
    document.addEventListener('click', (e) => {
        const widget = document.getElementById('voice-intro');
        if (!widget.contains(e.target) && isPanelOpen) {
            isPanelOpen = false;
            voicePanel.classList.remove('active');
        }
    });
    
    // Load voices (needed for some browsers)
    if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = () => {
            window.speechSynthesis.getVoices();
        };
    }
}

// Export for use
if (typeof window !== 'undefined') {
    window.initVoiceIntroduction = initVoiceIntroduction;
}

