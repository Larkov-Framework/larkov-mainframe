localStorage.setItem('watcherUnlocked', 'true');

window.reportAssignments = {
    "larkov-0001": {
        type: "real",
        unlockKey: "watcherUnlocked",
        title: "OBSERVER ANOMALY ANALYSIS [LARKOV-0001]",
        description: "No m@tt_r wh_t we do, ev_ry rep_rt we sub_it bec_mes c_rrupted sh_rtly th_re_fter... [SYS_ERR] ▒▒░\n\n+*@_# ~*%=*@ #~_ [==_#] ^+%_ e#= #*=[% @=@%+--+% — <=_%=* @# &%^#@=*_=_# =&_ %+^-==_%^+~_, <=_%=* @# =_#=_@=_+ @+b_#~_=_=@* %~_=@+%#@~_=%, ^*~ <=_%=* %~@ =*_=@* #%~_=@ [==_#^+_] %+_ %+=-_=@* &%^$ #_=%*^~@_ @~~]\n\n#% ~#=_ =_ ^*~@?#$=@~_=% ^= %_# %~~] %~+_=%, =_# ^= %_# -%~_=_=@ &%^+_=_~ @= %_# [===_@=]... ~*#$ %_# [=+] %_#=@ %_ [a _ _ _ e]... =_ %+^_%=%^~%_ @~_ =%_# =%^~%_ =_ [===]...\n\n@~_=% %+^_, #= %=~ #_=%*^=@ ^%#_=%*#_ ~%^+_ =~_ [= @ ~ @] &%^-=_ ~*#$=@ ~=^~%, %=^#*=@^-=%#_ &%~^ @~_ %+^= #_=_h_~ ^=~%^^#~@_ %~+_=^~#_ +~_=%-=% _%^~~_",
        prompt: "\nNODE04> MANDATORY TASK: SUBMIT OBSERVER ANOMALY ANALYSIS FOR FILE [LARKOV-0001].\nNODE04> INPUT EXTRA-DIMENSIONAL VOYEURISM DATA AND COGNITIVE INTERFERENCE BELOW:\n"
    },
    "larkov-7143": {
        type: "real",
        unlockKey: "taskAnomalyCompleted",
        title: "SUBJECT COGNITIVE COMPLIANCE INVENTORY [LARKOV-7143]",
        description: "LARKOV-7143\n\n{HIGH PRIORITY CASE}\n\nCurrent understanding of this entity remains incomplete. Existing limitations are known only in part.\n\n7143 is classified as EXTREMELY DANGEROUS — not due to any god-like capability, but because of its demonstrated incredible hostility, and hatred toward humanity. Along with its abnormal level of intelligence, which increasingly exceeds that of any previously recorded anomaly.\n\nThe origin of this hostility remains unknown. Current theories suggest a combination of severe psychological instability and trauma-related behavior patterns.\n\n7143 primarily targets isolated individuals. If the entity has identified you as a target, under no circumstances are you to acknowledge its presence.\n\nTo counteract this behavior, the ANP (ABSOLUTE NEGLECT PROTOCOL) was developed.\n\n7143 will not attack an individual who maintains complete non-engagement. Personnel should expect aggressive attempts at provocation, including close physical proximity, mimicry, verbal harassment, and behavioral imitation designed to force acknowledgment.\n\nDo not respond.\n\nDo not look directly at the entity.\n\nDo not verbally recognize its existence.\n\nAs long as ANP procedures are maintained without deviation, the entity has shown no history of direct assault.\n\nHowever, this is not the primary threat posed by 7143.\n\nThe entity possesses the ability to trap individuals within recorded documentation. Current research has failed to determine the exact mechanism. It is unknown whether the effect originates from:\n\n* the individual operating the recording device,\n* the subject being recorded,\n* the recording medium itself,\n* or another unidentified factor.\n\nFurther testing remains ongoing.\n\n*HAS BEEN ASSIGNED TO MULTIPLE AGENTS.*",
        prompt: "\nNODE04> MANDATORY TASK: SUBMIT COGNITIVE COMPLIANCE REPORT FOR FILE [LARKOV-7143].\nNODE04> INPUT WORKER COMPLIANCE METRICS AND BEHAVIORAL INVENTORY RESULTS BELOW:\n"
    },
    "miller crash": {
        type: "real",
        unlockKey: "blackboxCompleted",
        title: "FLIGHT RECORD ANALYSIS [MILLER CRASH]",
        description: "RECOVERED FLIGHT RECORDER CORE FROM SECTOR-04 CRASH SITE. DATA INTEGRITY EXCELLENT. SATELLITE RADAR TRAJECTORY LOGS CONFIRM CARRIER JET DISRUPTION BY MASSIVE ELECTROMAGNETIC FIELD COHESION ON THE SURFACE.",
        prompt: "\nNODE04> MANDATORY TASK: SUBMIT FLIGHT RECORD ANALYSIS FOR FILE [MILLER CRASH].\nNODE04> INPUT BLACKBOX DECRYPTION FINDINGS AND SITE RECONNAISSANCE REPORT BELOW:\n"
    },
    "larkov-7029": {
        type: "real",
        unlockKey: "tttCompleted",
        title: "SENTIENT GRID BEHAVIOR ANALYSIS [LARKOV-7029]",
        description: "This anomaly is confined within a standard adhesive sticky note, the entirety of its existence seemingly centered around the game “tic-tac-toe.” It was first discovered at a local arcade establishment, where civilians reported witnessing the sticky note verbally communicating — and on occasion, screaming — while engaged in gameplay. Witnesses also observed the note autonomously clearing previously marked X’s and O’s in preparation for subsequent matches.\n\nCurrent testing indicates that the entity is incapable of losing under normal conditions, consistently performing perfect moves regardless of opponent strategy. No recorded losses have occurred to date, though additional testing is ongoing to determine the extent of its capabilities and behavioral limitations.\n\nThe anomaly is presently classified as non-threatening. While it has displayed occasional aggressive or violent tendencies through vocal outbursts, there is no evidence suggesting it can currently breach the physical limitations of its medium. Should it somehow escape confinement, it is possible it could pose a low-level physical threat.\n\nAt this time, formal containment procedures are deemed unnecessary. The anomaly has been assigned to a field agent for continued observation and analysis.",
        prompt: "\nNODE04> MANDATORY TASK: SUBMIT SENTIENT GRID BEHAVIOR ANALYSIS FOR FILE [LARKOV-7029].\nNODE04> INPUT COGNITIVE DECISION-TREE TRAPS AND OBSERVATIONAL RESPONSES BELOW:\n"
    },
    "larkov-0100": {
        type: "fake",
        message: "NODE04> ERROR: COGNITIVE DATA SET ASSIGNED TO SPECIALIST VANCE (NODE_01). SECTOR LOCKOUT ACTIVE."
    },
    "larkov-0580": {
        type: "fake",
        message: "NODE04> ERROR: SUBSURFACE STRUCTURAL DEVIATION ASSIGNED TO GEOTECHNICAL UNIT. CLASSIFICATION RESTRICTED."
    },
    "larkov-0990": {
        type: "fake",
        message: "NODE04> ERROR: POWER GRID FLUX ASSIGNED TO MAIN-FRAME ENGINEERING DIVISION."
    }
};

window.reportMenuSelectionActive = false;

function renderReportMenu() {
    window.reportMenuSelectionActive = true;
    
    if (window.waveAlignerElement) {
        window.waveAlignerElement.remove();
    }
    
    const menuHeader = document.createElement('div');
    menuHeader.className = 'history-line';
    menuHeader.style.color = '#ffaa00';
    menuHeader.style.whiteSpace = 'pre';
    
    let listText = "NODE04> CENTRAL DATABASE: COMPILING ACTIVE REPORT ASSIGNMENTS...\n\n" +
                   "FILE DESIGNATION            STATUS\n" +
                   "--------------------------------------------------\n";
                   
    for (let key in window.reportAssignments) {
        let assignment = window.reportAssignments[key];
        let displayName = key.toUpperCase();
        let status = "[RESERVED]";
        
        if (assignment.type === "real") {
            let isUnlocked = localStorage.getItem(assignment.unlockKey) === 'true';
            status = isUnlocked ? "[UNLOCKED]" : "[LOCKED]";
        }
        
        let paddingCount = Math.max(1, 28 - displayName.length);
        let padding = " ".repeat(paddingCount);
        listText += `${displayName}${padding}${status}\n`;
    }
    
    listText += "--------------------------------------------------\n\n" +
                "NODE04> ENTER TARGET ASSIGNMENT DESIGNATION TO BEGIN REGISTRATION LOG:";
                
    menuHeader.textContent = listText;
    
    window.historyContainer.appendChild(menuHeader);
    window.scrollZone.scrollTop = window.scrollZone.scrollHeight;
    focusTerminal();
}