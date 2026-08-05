window.activeVideoID = "";

document.addEventListener('keydown', (e) => {
    triggerHandMovement(e.key);
    if (window.terminalVideoContainer.style.display === 'block') {
        const nativeVid = document.getElementById('native-player');
        const ytFallbackWrapper = document.getElementById('yt-fallback-wrapper');
        const key = e.key.toLowerCase();
        if (nativeVid && nativeVid.style.display === 'block') {
            switch(key) {
                case ' ':
                    e.preventDefault();
                    if (nativeVid.paused) nativeVid.play(); else nativeVid.pause();
                    break;
                case 'arrowright':
                    e.preventDefault();
                    nativeVid.currentTime = Math.min(nativeVid.duration, nativeVid.currentTime + 10);
                    break;
                case 'arrowleft':
                    e.preventDefault();
                    nativeVid.currentTime = Math.max(0, nativeVid.currentTime - 10);
                    break;
                case 's':
                    e.preventDefault();
                    nativeVid.currentTime = nativeVid.duration - 1; 
                    break;
            }
        } 
        else if (ytFallbackWrapper && ytFallbackWrapper.style.display === 'block' && player && typeof player.getPlayerState === 'function') {
            switch(key) {
                case ' ':
                    e.preventDefault();
                    const state = player.getPlayerState();
                    if (state === YT.PlayerState.PLAYING) player.pauseVideo(); else player.playVideo();
                    break;
                case 'arrowright':
                    e.preventDefault();
                    player.seekTo(player.getCurrentTime() + 10, true);
                    break;
                case 'arrowleft':
                    e.preventDefault();
                    player.seekTo(player.getCurrentTime() - 10, true);
                    break;
                case 's':
                    e.preventDefault();
                    player.getDuration() - 1, true;
                    break;
            }
        }
    }
});

function executeVideoPlayback(srcFile, mimeType, videoID) {
    window.activeVideoID = videoID;
    
    const scrollZone = document.getElementById('scroll-zone');
    if (scrollZone) {
        scrollZone.style.display = 'none';
    }

    const curtain = document.getElementById('video-curtain');
    if (curtain) {
        curtain.style.display = 'block';
        curtain.style.opacity = '1';
    }
    window.terminalVideoContainer.style.display = 'block';
    
    const nativeVid = document.getElementById('native-player');
    const ytFallbackWrapper = document.getElementById('yt-fallback-wrapper');
    
    if (!nativeVid || !ytFallbackWrapper) return;
    
    if (srcFile) {
        nativeVid.src = srcFile;
        nativeVid.load();
    }

    ytFallbackWrapper.style.display = 'none';
    nativeVid.style.display = 'block';
    nativeVid.volume = 0.60;
    nativeVid.currentTime = 0;
    nativeVid.onended = handleVideoEnded; 

    nativeVid.onerror = () => {
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
        }
    };

    let playPromise = nativeVid.play();
    if (playPromise !== undefined) {
        playPromise.then(() => {
            setTimeout(() => {
                if (curtain) {
                    curtain.style.opacity = '0';
                    setTimeout(() => { curtain.style.display = 'none'; }, 300);
                }
            }, 500);
        }).catch(err => {
            console.log(err);
        });
    }
}

function handleVideoEnded() {
    window.terminalVideoContainer.style.display = 'none';
    
    const scrollZone = document.getElementById('scroll-zone');
    if (scrollZone) {
        scrollZone.style.display = 'flex';
    }

    const history = document.getElementById('terminal-history');
    if (history) {
        history.innerHTML = '';
    }

    if (window.activeVideoID === 'sector-04') {
        localStorage.setItem('blackboxCompleted', 'true');
        localStorage.setItem('video-sector-04-watched', 'true');
        const millerTask = document.getElementById('task-miller');
        if (millerTask) {
            millerTask.classList.add('completed');
        }

        let currentStep = 0;
        const thoughts = [
            "His playground now ?",
            "Have they even thought, maybe we deserve this."
        ];
        const msgContainer = document.createElement('div');
        msgContainer.className = 'jumping-text interactive';
        document.getElementById('viewport').appendChild(msgContainer);
        
        function renderThought() {
            msgContainer.innerHTML = '';
            const text = thoughts[currentStep];
            text.split('').forEach((char, i) => {
                if (char === ' ') {
                    msgContainer.appendChild(document.createTextNode('\u00A0'));
                } else {
                    const span = document.createElement('span');
                    span.textContent = char;
                    span.style.animationDelay = `${i * 0.02}s`;
                    span.style.color = "#ff3333";
                    msgContainer.appendChild(span);
                }
            });
        }
        
        msgContainer.addEventListener('click', () => {
            currentStep++;
            if (currentStep < thoughts.length) {
                renderThought();
            } else {
                msgContainer.remove();
                focusTerminal();
            }
        });
        renderThought();

    } else {
        localStorage.setItem('taskAnomalyCompleted', 'true');
        localStorage.setItem('video-7143-watched', 'true');
        const taskAnomaly = document.getElementById('task-anomaly');
        if (taskAnomaly) {
            taskAnomaly.classList.add('completed');
        }

        let currentStep = 0;
        const steps = [
            "Man... 7143 is really causing trouble out there.",
            "Not that I care.",
            "However, little do they know..."
        ];
        const msgContainer = document.createElement('div');
        msgContainer.className = 'jumping-text';
        document.getElementById('viewport').appendChild(msgContainer);
        
        function renderStep() {
            msgContainer.innerHTML = '';
            const text = steps[currentStep];
            msgContainer.className = 'jumping-text';
            
            text.split('').forEach((char, i) => {
                if (char === ' ') {
                    msgContainer.appendChild(document.createTextNode('\u00A0'));
                } else {
                    const span = document.createElement('span');
                    span.textContent = char;
                    span.style.animationDelay = `${i * 0.05}s`;
                    span.style.color = "#ff3333";
                    msgContainer.appendChild(span);
                }
            });
        }
        
        msgContainer.addEventListener('click', () => {
            currentStep++;
            if (currentStep < steps.length) {
                renderStep();
            } else {
                msgContainer.innerHTML = '%wp% *~& wp%t %wt$t ux{%w* w&|p}$ %~~]';
                msgContainer.className = 'jumping-text cipher-flash';
                
                const overlay = document.querySelector('.portal-overlay');
                if (overlay) {
                    overlay.style.opacity = '0.9';
                }

                setTimeout(() => {
                    if (overlay) {
                        overlay.style.opacity = '';
                    }
                    msgContainer.remove();
                    focusTerminal();
                }, 150);
            }
        });
        renderStep(); 
    }
}

function onPlayerStateChange(event) {
    const curtain = document.getElementById('video-curtain');
    if (event.data === YT.PlayerState.PLAYING) {
        if (curtain) {
            curtain.style.opacity = '0';
            setTimeout(() => { curtain.style.display = 'none'; }, 300);
        }
    }
    if (event.data === YT.PlayerState.ENDED) {
        handleVideoEnded();
    }
}