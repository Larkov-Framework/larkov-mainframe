const justFinished = localStorage.getItem('blackboxJustFinished') === 'true';
if (justFinished) {
    splashScreen.style.display = 'none';
    splashScreen.style.opacity = '0';
    ambientAudio.volume = window.savedVolume || 0.40;
    ambientAudio.play().catch(err => console.log(err));
    stickyWrapper.classList.add('enabled');
    leftHandImg.classList.remove('hidden');
    rightHandImg.classList.remove('hidden');
}
shiftBtn.addEventListener('click', () => {
    ambientAudio.volume = window.savedVolume || 0.40;
    ambientAudio.play().catch(err => console.log(err));
    splashScreen.style.opacity = '0';
    setTimeout(() => { 
        splashScreen.style.display = 'none'; 
        focusTerminal(); 
        stickyWrapper.classList.add('enabled');
        leftHandImg.classList.remove('hidden');
        rightHandImg.classList.remove('hidden');
    }, 500);
});
const devResetBtn = document.getElementById('reset-save-btn');
if (devResetBtn) {
    devResetBtn.addEventListener('click', () => {
        const savedVolumeSetting = localStorage.getItem('ambientVolume');
        localStorage.clear();
        if (savedVolumeSetting !== null) {
            localStorage.setItem('ambientVolume', savedVolumeSetting);
        }
        location.reload();
    });
}