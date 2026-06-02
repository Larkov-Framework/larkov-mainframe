// Load the YouTube IFrame Player API asynchronously
let tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
let firstScriptTag = document.getElementsByTagName('script')[0];
if (firstScriptTag) {
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
} else {
    document.head.appendChild(tag);
}

let player;
window.onYouTubeIframeAPIReady = function() {
    player = new YT.Player('yt-player', {
        height: '100%',
        width: '100%',
        videoId: 'Hfck2E6kWvg', 
        playerVars: { 'playsinline': 1, 'rel': 0, 'controls': 0, 'disablekb': 1, 'origin': window.location.origin },
        events: { 'onStateChange': onPlayerStateChange }
    });
};

// Consolidated keydown controls for both video players
document.addEventListener('keydown', (e) => {
    if (terminalVideoContainer.style.display === 'block') {
        const nativeVid = document.getElementById('native-player');
        const ytFallbackWrapper = document.getElementById('yt-fallback-wrapper');
        const key = e.key.toLowerCase();
        
        // --- PRIMARY: LOCAL NATIVE VIDEO CONTROLS ---
        if (nativeVid && nativeVid.style.display === 'block') {
            switch(key) {
                case ' ': // Space: Play/Pause
                    e.preventDefault();
                    if (nativeVid.paused) {
                        nativeVid.play();
                    } else {
                        nativeVid.pause();
                    }
                    break;
                case 'arrowright': // Forward 10s
                    e.preventDefault();
                    nativeVid.currentTime = Math.min(nativeVid.duration, nativeVid.currentTime + 10);
                    break;
                case 'arrowleft': // Rewind 10s
                    e.preventDefault();
                    nativeVid.currentTime = Math.max(0, nativeVid.currentTime - 10);
                    break;
                case 's': // Skip to end
                    e.preventDefault();
                    nativeVid.currentTime = nativeVid.duration - 1; 
                    break;
            }
        } 
        // --- FALLBACK: YOUTUBE CONTROLS ---
        else if (ytFallbackWrapper && ytFallbackWrapper.style.display === 'block' && player && typeof player.getPlayerState === 'function') {
            switch(key) {
                case ' ': // Space: Play/Pause
                    e.preventDefault();
                    const state = player.getPlayerState();
                    if (state === YT.PlayerState.PLAYING) {
                        player.pauseVideo();
                    } else {
                        player.playVideo();
                    }
                    break;
                case 'arrowright': // Forward 10s
                    e.preventDefault();
                    player.seekTo(player.getCurrentTime() + 10, true);
                    break;
                case 'arrowleft': // Rewind 10s
                    e.preventDefault();
                    player.seekTo(player.getCurrentTime() - 10, true);
                    break;
                case 's': // Skip to end
                    e.preventDefault();
                    player.seekTo(player.getDuration() - 1, true);
                    break;
            }
        }
    }
});

const hiddenInput = document.getElementById('hidden-terminal-input');
const displayText = document.getElementById('display-text');
const historyContainer = document.getElementById('terminal-history');
const scrollZone = document.getElementById('scroll-zone');
const ambientAudio = document.getElementById('terminal-ambient');
const splashScreen = document.getElementById('splash-screen');
const shiftBtn = document.getElementById('start-shift-trigger');
const terminalVideoContainer = document.getElementById('terminal-video-container');
const viewport = document.getElementById('viewport');

function focusTerminal() { 
    hiddenInput.focus();
}

// STICKY NOTE MODAL LOGIC
const stickyWrapper = document.querySelector('.sticky-note-wrapper');
const stickyModal = document.getElementById('sticky-modal');
const closeModal = document.getElementById('close-modal');

shiftBtn.addEventListener('click', () => {
    ambientAudio.volume = 0.70;
    ambientAudio.play();
    splashScreen.style.opacity = '0';
    setTimeout(() => { 
        splashScreen.style.display = 'none'; 
        focusTerminal(); 
        
        // STICKY NOTE WAKES UP THE INSTANT YOU CLICK "BEGIN SHIFT"
        stickyWrapper.classList.add('enabled');
    }, 500);
});

// Viewport click for terminal focus (ignoring sticky note clicks)
viewport.addEventListener('click', (e) => {
    if (!e.target.closest('.sticky-note-wrapper') && !e.target.closest('.sticky-modal')) {
        focusTerminal();
    }
});

stickyWrapper.addEventListener('click', (e) => {
    e.stopPropagation();
    stickyModal.classList.remove('hidden');
});

closeModal.addEventListener('click', (e) => {
    e.stopPropagation();
    stickyModal.classList.add('hidden');
    // Redirect logic removed so you can stay in Node 04 for now
});

window.addEventListener('click', (e) => {
    if (e.target === stickyModal) {
        stickyModal.classList.add('hidden');
    }
});

window.addEventListener('DOMContentLoaded', () => { 
    function triggerGlitch() {
        const uniqueTimestamp = new Date().getTime();
        const glitchUrl = `coworker.gif?v=${uniqueTimestamp}`;
        
        // 1. Create an off-screen image object to preload the file
        const img = new Image();
        img.src = glitchUrl;
        
        // 2. Only swap the background after the image is fully downloaded
        img.onload = () => {
            viewport.style.backgroundImage = `url('${glitchUrl}')`;
            viewport.style.backgroundSize = "100% 100%";
            
            setTimeout(() => {
                viewport.style.backgroundImage = "url('ROOM-LF.png')";
                viewport.style.backgroundSize = "100% 100%";
            }, 6500);
        };
    }
    setTimeout(triggerGlitch, 5000);
});

hiddenInput.addEventListener('input', (e) => {
    let sanitizedValue = e.target.value.replace(/[<>]/g, '');
    hiddenInput.value = sanitizedValue; 
    displayText.textContent = sanitizedValue;
    scrollZone.scrollTop = scrollZone.scrollHeight;
});

hiddenInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const userCommand = hiddenInput.value.trim().toLowerCase();
        const historicalRow = document.createElement('p');
        historicalRow.className = 'history-line';
        
        // Obscure greetings list
        const greetings = [
            'hi', 'hello', 'helo', 'hey', 'sup', 'wasup', 'whats up', 'wats up', 
            'yo', 'yoski', 'wat up', 'wat up twin', 'whats good' 
        ];
        
        
        // Strip out any straight or curly apostrophes just for the check
        const cleanCommand = userCommand.replace(/['’‘]/g, '');
        
        // Check against the sanitized command
        const isGreeting = greetings.some(greet => 
            cleanCommand === greet || 
            cleanCommand === greet + '?' || 
            cleanCommand.startsWith(greet + ' ')
        );
        
        if (userCommand === '') {
            historicalRow.textContent = `AWAITING_INPUT_NODE04>`;
            historyContainer.appendChild(historicalRow);
        } else if (userCommand === '7143-dayton' || userCommand === '7413-dayton') { 
            historicalRow.textContent = `NODE04> INIT_DECRYPTION_PROTOCOL...`;
            historicalRow.style.color = '#33ff33';
            historyContainer.appendChild(historicalRow);
            
            let linesPrinted = 0;
            const printInterval = setInterval(() => {
                if (linesPrinted < 5) {
                    const loopRow = document.createElement('p');
                    loopRow.className = 'history-line';
                    loopRow.textContent = `NODE04> EXECUTING VIDEO DECRYPTION...`;
                    loopRow.style.color = '#33ff33';
                    historyContainer.appendChild(loopRow);
                    scrollZone.scrollTop = scrollZone.scrollHeight;
                    linesPrinted++;
                } else {
                    clearInterval(printInterval);
                    
                    // Reset curtain safely
                    const curtain = document.getElementById('video-curtain');
                    if (curtain) {
                        curtain.style.display = 'block';
                        curtain.style.opacity = '1';
                    }
                    
                    terminalVideoContainer.style.display = 'block';
                    
                    const nativeVid = document.getElementById('native-player');
                    const ytFallbackWrapper = document.getElementById('yt-fallback-wrapper');
                    
                    // Failsafe: Stops the script from crashing if HTML is missing
                    if (!nativeVid || !ytFallbackWrapper) {
                        console.error("CRITICAL ERROR: Missing video HTML elements!");
                        return;
                    }

                    // Code 3 = NO_SOURCE (The local file doesn't exist)
                    if (nativeVid.networkState === 3 || nativeVid.error) {
                        nativeVid.style.display = 'none';
                        ytFallbackWrapper.style.display = 'block';
                        
                        const dropCurtain = () => {
                            setTimeout(() => {
                                if (curtain) {
                                    curtain.style.opacity = '0';
                                    setTimeout(() => { curtain.style.display = 'none'; }, 300);
                                }
                            }, 1500);
                        };

                        // Bulletproof YouTube initialization
                        if (player && typeof player.playVideo === 'function') {
                            player.playVideo();
                            dropCurtain();
                        } else if (window.YT && typeof window.YT.Player === 'function') {
                            player = new YT.Player('yt-player', {
                                height: '100%', width: '100%', videoId: 'Hfck2E6kWvg',
                                playerVars: { 'playsinline': 1, 'rel': 0, 'controls': 0, 'disablekb': 1, 'origin': window.location.origin },
                                events: { 
                                    'onReady': (e) => { e.target.playVideo(); dropCurtain(); },
                                    'onStateChange': onPlayerStateChange 
                                }
                            });
                        } else {
                            console.error("YouTube API failed to load from Google's servers.");
                        }
                    } else {
                        ytFallbackWrapper.style.display = 'none';
                        nativeVid.style.display = 'block';
                        
                        nativeVid.currentTime = 0;
                        nativeVid.onended = handleVideoEnded; 
                        
                        let playPromise = nativeVid.play();
                        if (playPromise !== undefined) {
                            playPromise.then(() => {
                                setTimeout(() => {
                                    if (curtain) {
                                        curtain.style.opacity = '0';
                                        setTimeout(() => { curtain.style.display = 'none'; }, 300);
                                    }
                                }, 500);
                            }).catch(error => {
                                console.error("Browser blocked native playback:", error);
                            });
                        }
                    }
                }
            }, 250);
        } else if (isGreeting) {
            // Only triggers for actual greetings now!
            historicalRow.textContent = `NODE04> I CAN SEE YOU WATCHING.`;
            historicalRow.style.color = '#ff3333';
            historyContainer.appendChild(historicalRow);
        } else {
            // Everything else gets denied properly
            historicalRow.textContent = `NODE04> ${userCommand} // DENIED`;
            historyContainer.appendChild(historicalRow);
        }
        
        hiddenInput.value = '';
        displayText.textContent = '';
        scrollZone.scrollTop = scrollZone.scrollHeight;
    }
});

function handleVideoEnded() {
    terminalVideoContainer.style.display = 'none';
    let currentStep = 0;
    const steps = [
        "Man... 7143 is really causing trouble out there.",
        "Not that I care.",
        "However, little do they know..."
    ];
    const msgContainer = document.createElement('div');
    msgContainer.className = 'jumping-text';
    document.getElementById('viewport').appendChild(msgContainer);
    document.getElementById('task-anomaly').classList.add('completed');
    function renderStep() {
        msgContainer.innerHTML = '';
        const text = steps[currentStep];
        text.split('').forEach((char, i) => {
            if (char === ' ') {
                msgContainer.appendChild(document.createTextNode('\u00A0'));
            } else {
                const span = document.createElement('span');
                span.textContent = char;
                span.style.animationDelay = `${i * 0.05}s`;
                msgContainer.appendChild(span);
            }
        });
    }

    msgContainer.addEventListener('click', () => {
        currentStep++;
        if (currentStep < steps.length) {
            renderStep();
        } else {
            msgContainer.remove();
            focusTerminal();
        }
    });
    renderStep(); 
}

function onPlayerStateChange(event) {
    const curtain = document.getElementById('video-curtain');
    
    // 1. When the YouTube video actually starts playing, fade out the curtain
    if (event.data === YT.PlayerState.PLAYING) {
        if (curtain) {
            curtain.style.opacity = '0';
            setTimeout(() => { curtain.style.display = 'none'; }, 300);
        }
    }
    
    // 2. When the YouTube video ends, trigger your text sequence
    if (event.data === YT.PlayerState.ENDED) {
        handleVideoEnded();
    }
}
