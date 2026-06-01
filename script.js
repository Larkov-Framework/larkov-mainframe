// Load the YouTube IFrame Player API asynchronously
let tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
let firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

let player;
window.onYouTubeIframeAPIReady = function() {
    player = new YT.Player('yt-player', {
        height: '100%',
        width: '100%',
        videoId: 'Hfck2E6kWvg', // YOUR NEW VIDEO ID
        playerVars: {
            'playsinline': 1,
            'rel': 0,
            'controls': 0,
            'disablekb': 1,
            'origin': window.location.origin // CRITICAL FIX FOR LOCAL HOSTING
        },
        events: {
            'onStateChange': onPlayerStateChange,
            'onError': (event) => {
                console.error("YouTube Player Error Code:", event.data);
                // Attempt to force a reload if it fails
                setTimeout(() => player.loadVideoById('Hfck2E6kWvg'), 2000);
            }
        }
    });
}

function onPlayerStateChange(event) {
    const curtain = document.getElementById('video-curtain');
    // 1. When the video actually starts playing, fade out the curtain
    if (event.data === YT.PlayerState.PLAYING) {
        if (curtain) {
            curtain.style.opacity = '0';
            setTimeout(() => { curtain.style.display = 'none'; }, 300); // Wait for fade
        }
    }
    
    // 2. When the video ends
    if (event.data === YT.PlayerState.ENDED) {
        handleVideoEnded();
    }
}

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

shiftBtn.addEventListener('click', () => {
    ambientAudio.volume = 0.70;
    ambientAudio.play();
    splashScreen.style.opacity = '0';
    setTimeout(() => { splashScreen.style.display = 'none'; focusTerminal(); }, 500);
});

// Viewport click for terminal focus (ignoring sticky note clicks)
viewport.addEventListener('click', (e) => {
    if (!e.target.closest('.sticky-note-wrapper') && !e.target.closest('.sticky-modal')) {
        focusTerminal();
    }
});

// STICKY NOTE MODAL LOGIC
const stickyWrapper = document.querySelector('.sticky-note-wrapper');
const stickyModal = document.getElementById('sticky-modal');
const closeModal = document.getElementById('close-modal');

stickyWrapper.addEventListener('click', (e) => {
    e.stopPropagation();
    stickyModal.classList.remove('hidden');
});

closeModal.addEventListener('click', (e) => {
    e.stopPropagation();
    stickyModal.classList.add('hidden');
});

window.addEventListener('click', (e) => {
    if (e.target === stickyModal) {
        stickyModal.classList.add('hidden');
    }
});

window.addEventListener('DOMContentLoaded', () => { 
    function triggerGlitch() {
        const uniqueTimestamp = new Date().getTime();
        viewport.style.backgroundImage = `url('coworker.gif?v=${uniqueTimestamp}')`;
        viewport.style.backgroundSize = "100% 100%";
        setTimeout(() => {
            viewport.style.backgroundImage = "url('ROOM-LF.png')";
            viewport.style.backgroundSize = "100% 100%";
        }, 6500);
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
                    
                    if (player && typeof player.playVideo === 'function') {
                        player.playVideo();
                        
                        // Failsafe: Drops the curtain automatically after 1.5s just in case YouTube lags
                        setTimeout(() => {
                            if (curtain) {
                                curtain.style.opacity = '0';
                                setTimeout(() => { curtain.style.display = 'none'; }, 300);
                            }
                        }, 1500);
                    }
                }
            }, 250);
        } else if (['hi', 'helo', 'hey', 'sup', 'wasup', 'whats up', 'wats up'].some(greet => userCommand.includes(greet)) || userCommand.startsWith('h')) {
            historicalRow.textContent = `NODE04> I CAN SEE YOU WATCHING.`;
            historicalRow.style.color = '#ff3333';
            historyContainer.appendChild(historicalRow);
        } else {
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

// Custom Terminal Controls mapped to YouTube API
document.addEventListener('keydown', (e) => {
    if (terminalVideoContainer.style.display === 'block' && player) {
        switch(e.key.toLowerCase()) {
            case ' ': // Space: Play/Pause
                e.preventDefault();
                const state = player.getPlayerState();
                if (state === YT.PlayerState.PLAYING) {
                    player.pauseVideo();
                } else {
                    player.playVideo();
                }
                break;
            case 'arrowright': // Right Arrow: Forward 10s
                player.seekTo(player.getCurrentTime() + 10, true);
                break;
            case 'arrowleft': // Left Arrow: Rewind 10s
                player.seekTo(player.getCurrentTime() - 10, true);
                break;
            case 's': // S: Skip to end
                player.seekTo(player.getDuration() - 1, true);
                break;
        }
    }
});