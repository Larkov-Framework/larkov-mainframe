const viewport = document.getElementById('viewport');
const stickyWrapper = document.querySelector('.sticky-note-wrapper');
const stickyModal = document.getElementById('sticky-modal');
const closeModal = document.getElementById('close-modal');
const coworkerTrigger = document.getElementById('coworker-trigger');
const punchclockTrigger = document.getElementById('punchclock-trigger');

function updateLayoutState() {
    const isFullscreen = !!(
        document.fullscreenElement || 
        document.webkitFullscreenElement || 
        document.mozFullScreenElement ||
        window.innerHeight === screen.height ||
        (Math.abs(window.innerWidth - screen.width) < 15 && Math.abs(window.innerHeight - screen.height) < 15)
    );
    if (isFullscreen) {
        document.body.classList.add('fullscreen-active');
        document.body.classList.remove('windowed-active');
    } else {
        document.body.classList.add('windowed-active');
        document.body.classList.remove('fullscreen-active');
    }
}

window.addEventListener('resize', updateLayoutState);
document.addEventListener('fullscreenchange', updateLayoutState);
window.addEventListener('DOMContentLoaded', updateLayoutState);

viewport.addEventListener('click', (e) => {
    if (document.body.classList.contains('cinematic-active')) return;
    if (!e.target.closest('.sticky-note-wrapper') && !e.target.closest('.sticky-modal') && !e.target.closest('.static-coworker-link') && !e.target.closest('.static-punchclock-link')) {
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
});

window.addEventListener('click', (e) => {
    if (e.target === stickyModal) {
        stickyModal.classList.add('hidden');
    }
});

if (coworkerTrigger) {
    coworkerTrigger.addEventListener('click', () => {
        if (document.querySelector('.jumping-text')) return;
        const isCompleted = localStorage.getItem('coworkerPanicCompleted') === 'true';
        if (isCompleted) {
            document.body.classList.add('cinematic-active');
            let currentStep = 0;
            const quietSteps = [
                "Man I hate him.",
                "I hate him so much."
            ];
            const msgContainer = document.createElement('div');
            msgContainer.className = 'jumping-text interactive chaotic-text-quiet';
            document.getElementById('viewport').appendChild(msgContainer);
            
            function renderQuietStep() {
                msgContainer.innerHTML = '';
                const text = quietSteps[currentStep];
                text.split('').forEach((char, i) => {
                    if (char === ' ') {
                        msgContainer.appendChild(document.createTextNode('\u00A0'));
                    } else {
                        const span = document.createElement('span');
                        span.textContent = char;
                        span.style.animationDelay = `${i * 0.01}s`;
                        msgContainer.appendChild(span);
                    }
                });
            }
            msgContainer.addEventListener('click', () => {
                currentStep++;
                if (currentStep < quietSteps.length) {
                    renderQuietStep();
                } else {
                    document.body.classList.remove('cinematic-active');
                    msgContainer.remove();
                    focusTerminal();
                }
            });
            renderQuietStep();
        } else {
            const panicSfx = new Audio('assets/environment/zoomin dramatic.mp3');
            panicSfx.volume = 0.80;
            panicSfx.play().catch(err => console.log(err));
            const viewportContainer = document.querySelector('.viewport-container');
            const roomViewport = document.getElementById('viewport');
            document.body.classList.add('cinematic-active');
            let currentStep = 0;
            const steps = [
                { text: "I hate him.", class: "chaotic-text-1", zoom: false, shake: "shaking-level-1", duration: 1500 },
                { text: "I hate him. I hate him.", class: "chaotic-text-1", zoom: false, shake: "shaking-level-1", duration: 1500 },
                { text: "I hate him. I hate him. I hate him.", class: "chaotic-text-2", zoom: true, shake: "shaking-level-2", duration: 1800 },
                { text: "I HATE HIM. I HATE HIM. I HATE HIM. I HATE HIM.", class: "chaotic-text-3", zoom: true, shake: "shaking-level-3", duration: 2200 },
                { text: "...", class: "chaotic-text-quiet", zoom: false, shake: false, duration: 1500 },
                { text: "I shouldn't look at him.", class: "chaotic-text-quiet", zoom: false, shake: false, duration: 2000 }
            ];
            const msgContainer = document.createElement('div');
            msgContainer.className = 'jumping-text no-clicks';
            document.getElementById('viewport').appendChild(msgContainer);
            
            function runSequence() {
                msgContainer.innerHTML = '';
                const stepData = steps[currentStep];
                msgContainer.className = `jumping-text no-clicks ${stepData.class}`;
                if (stepData.zoom) {
                    roomViewport.classList.add('zoomed-active');
                } else {
                    roomViewport.classList.remove('zoomed-active');
                }
                viewportContainer.classList.remove('shaking-level-1', 'shaking-level-2', 'shaking-level-3');
                if (stepData.shake) {
                    viewportContainer.classList.add(stepData.shake);
                }
                stepData.text.split('').forEach((char, i) => {
                    if (char === ' ') {
                        msgContainer.appendChild(document.createTextNode('\u00A0'));
                    } else {
                        const span = document.createElement('span');
                        span.textContent = char;
                        span.style.animationDelay = `${i * 0.01}s`;
                        msgContainer.appendChild(span);
                    }
                });
                setTimeout(() => {
                    currentStep++;
                    if (currentStep < steps.length) {
                        runSequence();
                    } else {
                        localStorage.setItem('coworkerPanicCompleted', 'true');
                        const hateTask = document.getElementById('task-hate');
                        if (hateTask) {
                            hateTask.classList.remove('hidden');
                            hateTask.classList.add('completed');
                        }
                        roomViewport.classList.remove('zoomed-active');
                        viewportContainer.classList.remove('shaking-level-1', 'shaking-level-2', 'shaking-level-3');
                        document.body.classList.remove('cinematic-active');
                        msgContainer.remove();
                        focusTerminal();
                    }
                }, stepData.duration);
            }
            runSequence();
        }
    });
}

if (punchclockTrigger) {
    punchclockTrigger.addEventListener('click', () => {
        if (document.body.classList.contains('cinematic-active')) return;
        if (document.querySelector('.jumping-text')) return;

        let completedCount = 0;
        if (localStorage.getItem('taskAnomalyCompleted') === 'true') completedCount++;
        if (localStorage.getItem('blackboxCompleted') === 'true') completedCount++;
        if (localStorage.getItem('tttCompleted') === 'true') completedCount++;
        if (localStorage.getItem('reportTaskCompleted') === 'true') completedCount++;

        let remaining = 4 - completedCount;

        document.body.classList.add('cinematic-active');
        const msgContainer = document.createElement('div');
        msgContainer.className = 'jumping-text interactive';
        document.getElementById('viewport').appendChild(msgContainer);

        let text = "";
        let isFinalShiftExit = false;

        if (remaining > 0) {
            msgContainer.style.color = "#ff3333";
            if (remaining === 1) {
                text = "1 hour left of this miserable position.";
            } else {
                text = `${remaining} hours left of this miserable position.`;
            }
        } else {
            msgContainer.style.color = "#ff3333";
            text = "Ugh. Time to go fucking home.";
            isFinalShiftExit = true;
        }

        text.split('').forEach((char, i) => {
            if (char === ' ') {
                msgContainer.appendChild(document.createTextNode('\u00A0'));
            } else {
                const span = document.createElement('span');
                span.textContent = char;
                span.style.animationDelay = `${i * 0.03}s`;
                msgContainer.appendChild(span);
            }
        });

        msgContainer.addEventListener('click', () => {
            msgContainer.remove();
            
            if (isFinalShiftExit) {
                localStorage.setItem('clockoutCompleted', 'true');
                const clockoutTask = document.getElementById('task-clockout');
                if (clockoutTask) {
                    clockoutTask.classList.add('completed');
                }
                
                const cutscene = document.querySelector('.cutscene-overlay');
                const cutsceneVideo = document.getElementById('cutscene-player');
                
                if (cutscene && cutsceneVideo) {
                    cutsceneVideo.src = 'assets/environment/HOME/nighty.mp4';
                    cutsceneVideo.style.display = 'block';
                    cutscene.classList.add('active');
                    cutsceneVideo.play();
                    
                    const ambient = document.getElementById('terminal-ambient');
                    if (ambient) {
                        let fadeInterval = setInterval(() => {
                            if (ambient.volume > 0.05) {
                                ambient.volume -= 0.05;
                            } else {
                                ambient.volume = 0;
                                ambient.pause();
                                clearInterval(fadeInterval);
                            }
                        }, 100);
                    }

                    cutsceneVideo.onended = () => {
                        window.location.href = 'house.html';
                    };
                }
            } else {
                document.body.classList.remove('cinematic-active');
                focusTerminal();
            }
        });
    });
}

window.addEventListener('DOMContentLoaded', () => { 
    let completedCount = 0;
    if (localStorage.getItem('taskAnomalyCompleted') === 'true') {
        completedCount++;
        const taskAnomaly = document.getElementById('task-anomaly');
        if (taskAnomaly) {
            taskAnomaly.classList.add('completed');
        }
    }

    if (localStorage.getItem('blackboxCompleted') === 'true') {
        completedCount++;
        const millerTask = document.getElementById('task-miller');
        if (millerTask) {
            millerTask.classList.add('completed');
        }
    }

    if (localStorage.getItem('tttCompleted') === 'true') {
        completedCount++;
        const tttTask = document.getElementById('task-7029');
        if (tttTask) {
            tttTask.classList.add('completed');
        }
    }

    if (localStorage.getItem('reportTaskCompleted') === 'true') {
        completedCount++;
        const reportTask = document.getElementById('task-report');
        if (reportTask) {
            reportTask.classList.add('completed');
        }
    }

    if (completedCount === 4) {
        const clockoutTask = document.getElementById('task-clockout');
        if (clockoutTask) {
            clockoutTask.classList.remove('hidden');
        }
    }

    if (localStorage.getItem('clockoutCompleted') === 'true') {
        const clockoutTask = document.getElementById('task-clockout');
        if (clockoutTask) {
            clockoutTask.classList.remove('hidden');
            clockoutTask.classList.add('completed');
        }
    }

    if (localStorage.getItem('coworkerPanicCompleted') === 'true') {
        const hateTask = document.getElementById('task-hate');
        if (hateTask) {
            hateTask.classList.remove('hidden');
            hateTask.classList.add('completed');
        }
    }

    function triggerGlitch() {
        const uniqueTimestamp = new Date().getTime();
        const glitchUrl = `assets/environment/coworker.gif?v=${uniqueTimestamp}`;
        const img = new Image();
        img.src = glitchUrl;
        img.onload = () => {
            viewport.style.backgroundImage = `url('${glitchUrl}')`;
            viewport.style.backgroundSize = "100% 100%";
            setTimeout(() => {
                viewport.style.backgroundImage = "url('assets/environment/ROOM-LF.png')";
                viewport.style.backgroundSize = "100% 100%";
            }, 6500);
        };
    }
    setTimeout(triggerGlitch, 5000);
});

if (window.settingsToggle && window.settingsPanel) {
    window.settingsToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        window.settingsPanel.toggle('hidden');
    });
}

if (window.settingsPanel) {
    window.settingsPanel.addEventListener('click', (e) => {
        e.stopPropagation();
    });
}

window.addEventListener('click', (e) => {
    if (window.settingsPanel && !window.settingsPanel.classList.contains('hidden')) {
        if (e.target !== window.settingsToggle && !window.settingsPanel.contains(e.target)) {
            window.settingsPanel.classList.add('hidden');
        }
    }
});

if (window.volumeSlider) {
    window.volumeSlider.value = window.savedVolume;
    window.volumeSlider.addEventListener('input', (e) => {
        const value = parseFloat(e.target.value);
        window.ambientAudio.volume = value;
        localStorage.setItem('ambientVolume', value);
        window.savedVolume = value;
    });
}