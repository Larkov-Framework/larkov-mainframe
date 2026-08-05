window.decryptionMiniGameActive = false;
window.waveAlignerActive = false;
window.reportPromptActive = false;
window.currentReportingVideo = "";

window.currentFreq = 2;
window.currentAmp = 4;
window.targetFreq = 5;
window.targetAmp = 1;

window.waveAlignerElement = null;

function focusTerminal() { 
    if (!window.isMobile) {
        window.hiddenInput.focus({ preventScroll: true });
    }
}

window.hiddenInput.addEventListener('input', (e) => {
    let sanitizedValue = e.target.value.replace(/[<>]/g, '');
    window.hiddenInput.value = sanitizedValue; 
    window.displayText.textContent = sanitizedValue;
    window.scrollZone.scrollTop = window.scrollZone.scrollHeight;
});

window.hiddenInput.addEventListener('wheel', (e) => {
    window.scrollZone.scrollTop += e.deltaY;
});

function generateWaveString(freq, amp) {
    let wave = "";
    let spacer = "~".repeat(Math.max(1, 6 - freq));
    let peak = "/" + "_".repeat(Math.max(0, amp - 1)) + "\\";
    for (let i = 0; i < 4; i++) {
        wave += spacer + peak;
    }
    return wave;
}

function renderWaveAlignerState() {
    if (window.waveAlignerElement) {
        window.waveAlignerElement.remove();
    }

    const targetWave = generateWaveString(window.targetFreq, window.targetAmp);
    const currentWave = generateWaveString(window.currentFreq, window.currentAmp);
    
    let freqDiff = Math.abs(window.currentFreq - window.targetFreq);
    let ampDiff = Math.abs(window.currentAmp - window.targetAmp);
    let quality = Math.max(0, 100 - (freqDiff * 25) - (ampDiff * 25));

    const header = document.createElement('div');
    header.className = 'history-line';
    header.style.color = '#ffaa00';
    header.innerText = `NODE04> CARRIER SIGNAL INTERCEPTED. PHASE MATCH REQUIRED.\n\n` +
                       `TARGET SIGNAL:  ${targetWave}\n` +
                       `YOUR SIGNAL:    ${currentWave}\n\n` +
                       `CURRENT FREQUENCY : [ ${window.currentFreq} ]   (COMMAND: f [1-5])\n` +
                       `CURRENT AMPLITUDE : [ ${window.currentAmp} ]   (COMMAND: a [1-5])\n\n` +
                       `SIGNAL ALIGNMENT  : ${quality}% ${quality === 100 ? '(COHERENT)' : '(INCOHERENT)'}`;
    
    window.waveAlignerElement = header;
    window.historyContainer.appendChild(header);
    window.scrollZone.scrollTop = window.scrollZone.scrollHeight;

    if (quality === 100) {
        window.waveAlignerActive = false;
        window.waveAlignerElement = null;
        setTimeout(() => {
            const statusSteps = [
                "NODE04> [STABILIZING] STAGE 1: DEMODULATING CARRIER SIDEBANDS...",
                "NODE04> [STABILIZING] STAGE 2: ISOLATING MULTIPATH ATTENUATION...",
                "NODE04> [STABILIZING] STAGE 3: SYNCHRONIZING BIT-TRANSITION TIMING...",
                "NODE04> [STABILIZING] PHASE-LOCK ACQUIRED. EXTRACTING FRAME BUFFER...",
                "NODE04> [COMPLETE] DECRYPTION PROTOCOL SATISFIED. ROUTING AUDIO/VIDEO TO MONITOR..."
            ];
            let currentStepIndex = 0;
            const logInterval = setInterval(() => {
                if (currentStepIndex < statusSteps.length) {
                    const stepRow = document.createElement('p');
                    stepRow.className = 'history-line';
                    stepRow.textContent = statusSteps[currentStepIndex];
                    if (currentStepIndex === statusSteps.length - 1) {
                        stepRow.style.color = '#33ff33';
                    } else {
                        stepRow.style.color = '#ffaa00';
                    }
                    window.historyContainer.appendChild(stepRow);
                    window.scrollZone.scrollTop = window.scrollZone.scrollHeight;
                    currentStepIndex++;
                } else {
                    clearInterval(logInterval);
                    setTimeout(() => {
                        executeVideoPlayback('assets/terminal/CITY_SAFETY_ALERT_ANOMALY_7143_ntsc.mp4', 'video/mp4', '7143-dayton');
                    }, 1200);
                }
            }, 1200);
        }, 800);
    }
}

window.hiddenInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const userInput = window.hiddenInput.value.trim();
        const userCommand = userInput.toLowerCase();
        const parts = userCommand.split(' ');
        const historicalRow = document.createElement('p');
        historicalRow.className = 'history-line';
        
        const greetings = [
            'hi', 'hello', 'helo', 'hey', 'sup', 'wasup', 'whats up', 'wats up', 
            'yo', 'yoski', 'wat up', 'wat up twin', 'whats good' 
        ];
        const cleanCommand = userCommand.replace(/['’‘]/g, '');
        const isGreeting = greetings.some(greet => 
            cleanCommand === greet || 
            cleanCommand === greet + '?' || 
            cleanCommand.startsWith(greet + ' ')
        );

        if (window.reportPromptActive) {
            window.reportPromptActive = false;
            localStorage.setItem('report-' + window.currentReportingVideo, userInput);
            
            historicalRow.textContent = `NODE04> ANALYZING REPORT CONTENTS...`;
            historicalRow.style.color = '#33ff33';
            window.historyContainer.appendChild(historicalRow);
            
            let r1 = localStorage.getItem('report-larkov-7143') !== null;
            let r2 = localStorage.getItem('report-miller crash') !== null;
            let r3 = localStorage.getItem('report-larkov-7029') !== null;
            
            if (window.currentReportingVideo === 'larkov-7143') r1 = true;
            if (window.currentReportingVideo === 'miller crash') r2 = true;
            if (window.currentReportingVideo === 'larkov-7029') r3 = true;
            
            if (r1 && r2 && r3) {
                localStorage.setItem('reportTaskCompleted', 'true');
                const task = document.getElementById('task-report');
                if (task) task.classList.add('completed');
                
                let checkAnomaly = localStorage.getItem('taskAnomalyCompleted') === 'true';
                let checkMiller = localStorage.getItem('blackboxCompleted') === 'true';
                let checkTtt = localStorage.getItem('tttCompleted') === 'true';
                
                if (checkAnomaly && checkMiller && checkTtt) {
                    const clockout = document.getElementById('task-clockout');
                    if (clockout) clockout.classList.remove('hidden');
                }
            }
            
            setTimeout(() => {
                const loggedRow = document.createElement('p');
                loggedRow.className = 'history-line';
                loggedRow.textContent = `NODE04> REPORT SUBMISSION LOGGED SUCCESSFULLY.`;
                loggedRow.style.color = '#33ff33';
                window.historyContainer.appendChild(loggedRow);

                const evalRow = document.createElement('p');
                evalRow.className = 'history-line';
                evalRow.style.color = '#ff3333';
                evalRow.textContent = `NODE04> SYSTEM STATUS EVALUATION: ANALYSIS COMPLIANT.\n` +
                                      `NODE04> WARNING: BIOMETRIC SCAN IDENTIFIED LEVEL 3 COGNITIVE SKEW IN AGENT 7143. DISPENSING SEDATIVES.`;
                window.historyContainer.appendChild(evalRow);
                window.scrollZone.scrollTop = window.scrollZone.scrollHeight;
                focusTerminal();
            }, 1200);
        }
        else if (window.reportMenuSelectionActive) {
            window.reportMenuSelectionActive = false;
            const targetAssignment = window.reportAssignments[userCommand];
            
            if (targetAssignment) {
                if (targetAssignment.type === "fake") {
                    historicalRow.textContent = targetAssignment.message;
                    historicalRow.style.color = '#ff3333';
                    window.historyContainer.appendChild(historicalRow);
                } else {
                    const isUnlocked = localStorage.getItem(targetAssignment.unlockKey) === 'true';
                    if (!isUnlocked) {
                        historicalRow.textContent = `NODE04> ERROR: UNRESOLVED SECURE FILE CORRELATION. ANOMALOUS RECORD RECONNAISSANCE REQUIRED.`;
                        historicalRow.style.color = '#ffaa00';
                        window.historyContainer.appendChild(historicalRow);
                    } else {
                        const isAlreadySubmitted = localStorage.getItem('report-' + userCommand);
                        if (isAlreadySubmitted) {
                            historicalRow.textContent = `NODE04> INCIDENT REPORT ALREADY TRANSMITTED. RE-SUBMISSION NOT REQUIRED.`;
                            historicalRow.style.color = '#bb0000';
                            window.historyContainer.appendChild(historicalRow);
                        } else {
                            const descRow = document.createElement('p');
                            descRow.className = 'history-line';
                            descRow.style.color = '#33ff33';
                            descRow.innerText = `\nNODE04> RETRIEVING ARCHIVED DATA FOR FILE [${userCommand.toUpperCase()}]:\n\n${targetAssignment.description}\n`;
                            window.historyContainer.appendChild(descRow);

                            window.reportPromptActive = true;
                            window.currentReportingVideo = userCommand;
                            
                            const promptRow = document.createElement('p');
                            promptRow.className = 'history-line';
                            promptRow.style.color = '#00f0ff';
                            promptRow.textContent = targetAssignment.prompt;
                            window.historyContainer.appendChild(promptRow);
                            window.scrollZone.scrollTop = window.scrollZone.scrollHeight;
                        }
                    }
                }
            } else {
                historicalRow.textContent = `NODE04> ERROR: INCORRECT ASSIGNMENT DESIGNATION. CONNECTION SUSPENDED.`;
                historicalRow.style.color = '#ff3333';
                window.historyContainer.appendChild(historicalRow);
            }
        }
        else if (window.waveAlignerActive) {
            const partsAlign = userCommand.split(' ');
            const cmd = partsAlign[0];
            const val = parseInt(partsAlign[1]);

            if (cmd === 'freq' || cmd === 'f') {
                if (val >= 1 && val <= 5) {
                    window.currentFreq = val;
                    renderWaveAlignerState();
                } else {
                    historicalRow.textContent = `NODE04> INVALID FREQUENCY RANGE. INPUT 1-5.`;
                    window.historyContainer.appendChild(historicalRow);
                }
            } else if (cmd === 'amp' || cmd === 'a') {
                if (val >= 1 && val <= 5) {
                    window.currentAmp = val;
                    renderWaveAlignerState();
                } else {
                    historicalRow.textContent = `NODE04> INVALID AMPLITUDE RANGE. INPUT 1-5.`;
                    window.historyContainer.appendChild(historicalRow);
                }
            } else {
                historicalRow.textContent = `NODE04> INPUT ERROR. RE-ENTER 'f [1-5]' OR 'a [1-5]'.`;
                window.historyContainer.appendChild(historicalRow);
            }
        }
        else if (window.decryptionMiniGameActive) {
            if (cleanCommand === 'miller') {
                window.decryptionMiniGameActive = false;
                historicalRow.textContent = `NODE04> AUTHENTICATION SUCCESSFUL. REALIGNMENT STABLE.`;
                historicalRow.style.color = '#33ff33';
                window.historyContainer.appendChild(historicalRow);
                let linesPrinted = 0;
                
                const statusSteps = [
                    "NODE04> [STABILIZING] STAGE 1: DEMODULATING BLACKBOX FREQUENCIES...",
                    "NODE04> [STABILIZING] STAGE 2: RECONSTRUCTING CORRUPTED RADAR DATA...",
                    "NODE04> [STABILIZING] STAGE 3: FILTERING INTERCEPTED HELICOPTER LOGS...",
                    "NODE04> [STABILIZING] DE-SPIKING MAGNETIC REEL FLUX...",
                    "NODE04> [COMPLETE] AUDIO/VIDEO CONVERSION SUCCESSFUL. ROUTING TO DISPLAY..."
                ];
                
                const logInterval = setInterval(() => {
                    if (linesPrinted < statusSteps.length) {
                        const loopRow = document.createElement('p');
                        loopRow.className = 'history-line';
                        loopRow.textContent = statusSteps[linesPrinted];
                        if (linesPrinted === statusSteps.length - 1) {
                            loopRow.style.color = '#33ff33';
                        } else {
                            loopRow.style.color = '#ffaa00';
                        }
                        window.historyContainer.appendChild(loopRow);
                        window.scrollZone.scrollTop = window.scrollZone.scrollHeight;
                        linesPrinted++;
                    } else {
                        clearInterval(logInterval);
                        setTimeout(() => {
                            executeVideoPlayback('assets/terminal/MILLER_CRASH.webm', 'video/webm', 'sector-04');
                        }, 1200);
                    }
                }, 1200);
            } else {
                historicalRow.textContent = `NODE04> "${userCommand}" // REALIGNMENT FAILED. SEQUENCE COLLAPSED.`;
                historicalRow.style.color = '#ff3333';
                window.historyContainer.appendChild(historicalRow);
                const retryRow = document.createElement('p');
                retryRow.className = 'history-line';
                retryRow.textContent = `NODE04> SCRAMBLED AUTH-KEYWORD: [ L I R M E L ]`;
                retryRow.style.color = '#ffaa00';
                window.historyContainer.appendChild(retryRow);
            }
        }
        else {
            if (userCommand === '') {
                historicalRow.textContent = `AWAITING_INPUT_NODE04>`;
                window.historyContainer.appendChild(historicalRow);
            } else if (userCommand === '7143-dayton' || userCommand === '7413-dayton') { 
                window.waveAlignerActive = true;
                window.currentFreq = 2;
                window.currentAmp = 4;
                renderWaveAlignerState();
            } 
            else if (cleanCommand === 'sector 04') {
                window.decryptionMiniGameActive = true;
                historicalRow.textContent = `NODE04> [CRITICAL: SECURED COGNITIVE INTERCEPT DETECTED]`;
                historicalRow.style.color = '#ffaa00';
                window.historyContainer.appendChild(historicalRow);
                const instructionsRow = document.createElement('p');
                instructionsRow.className = 'history-line';
                instructionsRow.textContent = `NODE04> REALIGN CORES TO BYPASS SECURITY LOCKOUT.`;
                instructionsRow.style.color = '#ffaa00';
                window.historyContainer.appendChild(instructionsRow);
                const scrambledRow = document.createElement('p');
                scrambledRow.className = 'history-line';
                scrambledRow.textContent = `NODE04> SCRAMBLED AUTH-KEYWORD: [ L I R M E L ]`;
                scrambledRow.style.color = '#ffaa00';
                window.historyContainer.appendChild(scrambledRow);
            }
            else if (cleanCommand === 'report') {
                renderReportMenu();
            }
            else if (parts[0] === 'query') {
                const id = parts[1];
                if (!id) {
                    historicalRow.textContent = `NODE04> ERROR: SPECIFY TARGET EMPLOYEE IDENTIFIER.\n` +
                                                `NODE04> USAGE: query [security-id]`;
                    historicalRow.style.color = '#ff3333';
                    window.historyContainer.appendChild(historicalRow);
                } else if (id === '7143') {
                    historicalRow.textContent = `NODE04> ACCESSING DIRECTORY FILE: SPECIALIST_7143 [COMPLIANT]\n\n` +
                                                `  NAME: REDACTED\n` +
                                                `  DESIGNATION: COGNITIVE OPERATIVE (NODE_04)\n` +
                                                `  STATION: SECTOR_04 // DAYTON, OH\n\n` +
                                                `  DIAGNOSTIC HISTORY:\n` +
                                                `  - CYCLE 01: COMPLIANT.\n` +
                                                `  - CYCLE 02: COGNITIVE COLLAPSE\n` +
                                                `    (ATTEMPTED TERMINAL FORCE OVERRIDE).\n` +
                                                `  - CYCLE 03: REGISTRY RESET.\n` +
                                                `    COGNITIVE MEMORY-WIPE APPLIED.\n` +
                                                `  - CYCLE 04: PRESENT LOOP. MONITOR ACTIVE.\n` +
                                                `    SEDATIVE COMPLIANCE STABLE.`;
                    historicalRow.style.whiteSpace = 'pre-wrap';
                    historicalRow.style.color = '#33ff33';
                    window.historyContainer.appendChild(historicalRow);
                } else if (id === '0001') {
                    historicalRow.textContent = `NODE04> ACCESSING DIRECTORY FILE: UNKNOWN_NODE_0001 [CRITICAL_WARNING]\n\n` +
                                                `  WARNING: COGNITIVE DATA SET BLOCKED BY DIRECTIVES.\n` +
                                                `  EXTERNAL OBSERVER CORRELATION DETECTED\n` +
                                                `  ON PORTAL LAYER.\n` +
                                                `  THE WATCHER IS ACTIVE.\n` +
                                                `  PROCEED WITH COGNITIVE NEGLECT.`;
                    historicalRow.style.whiteSpace = 'pre-wrap';
                    historicalRow.style.color = '#ff3333';
                    window.historyContainer.appendChild(historicalRow);
                } else if (id === '7029') {
                    historicalRow.textContent = `NODE04> ACCESSING DIRECTORY FILE: ANOMALY_7029 [CONTAINED]\n\n` +
                                                `  NAME: TACTICAL DECISION SENTIENT GRID\n` +
                                                `  MEDIUM: ADHESIVE METALLIC STICKY NOTE\n` +
                                                `  STATUS: NON-THREATENING UNDER CONTINUOUS\n` +
                                                `  ROUTINE LOOPS.`;
                    historicalRow.style.whiteSpace = 'pre-wrap';
                    historicalRow.style.color = '#33ff33';
                    window.historyContainer.appendChild(historicalRow);
                } else {
                    historicalRow.textContent = `NODE04> SYSTEM DIRECTORY LOG: SPECIALIST ID [${id.toUpperCase()}] - ACCESS RESTRICTED.\n` +
                                                `NODE04> ERROR: SECURITY PRIVILEGE LEVEL INSUFFICIENT. REQUEST COGNITIVE OVERRIDE.`;
                    historicalRow.style.color = '#ff3333';
                    window.historyContainer.appendChild(historicalRow);
                }
            }
            else if (cleanCommand === 'help') {
                historicalRow.textContent = `NODE04> COMPATIBLE MAIN-FRAME PROTOCOLS:\n\n` +
                                            `  - help   : QUERY ACTIVE SYSTEM PROTOCOLS.\n` +
                                            `  - report : ACCESS LOCAL RECONNAISSANCE INCIDENT DATABASE.\n` +
                                            `  - query  : SEARCH CLASSIFIED REGISTRY BY SECURITY ID.\n` +
                                            `  - status : CHECK WORKSTATION METRICS AND COMPLIANCE.\n` +
                                            `  - clear  : CLEAR THE CONSOLE BUFFER.\n`;
                historicalRow.style.whiteSpace = 'pre';
                window.historyContainer.appendChild(historicalRow);
            }
            else if (cleanCommand === 'clear') {
                window.historyContainer.innerHTML = '';
                historicalRow.textContent = 'NODE04> CONSOLE BUFFER CLEARED.';
                historicalRow.style.color = '#33ff33';
                window.historyContainer.appendChild(historicalRow);
            }
            else if (cleanCommand === 'status') {
                historicalRow.textContent = `NODE04> SYSTEM COMPLIANCE METRICS:\n\n` +
                                            `  WORKSTATION  : TERMINAL_NODE_04 [SECTOR_04]\n` +
                                            `  STATION TEMP : 18.2 C [REGULATED]\n` +
                                            `  OXYGEN FLOW  : 97.4% [STABLE]\n` +
                                            `  ANP PROTOCOL : ACTIVE [LOGOUT OVERRIDE STANDBY]`;
                historicalRow.style.whiteSpace = 'pre';
                window.historyContainer.appendChild(historicalRow);
            }
            else if (isGreeting) {
                historicalRow.textContent = `NODE04> I CAN SEE YOU WATCHING.`;
                historicalRow.style.color = '#ff3333';
                window.historyContainer.appendChild(historicalRow);
            } else {
                historicalRow.textContent = `NODE04> ${userCommand} // DENIED`;
                window.historyContainer.appendChild(historicalRow);
            }
        }
        window.hiddenInput.value = '';
        window.displayText.textContent = '';
        window.scrollZone.scrollTop = window.scrollZone.scrollHeight;
    }
});