let leftHandTimeout;
let rightHandTimeout;
const keyToHandMap = {
    '1': { hand: 'left', pose: 'assets/hands/hand1_top_left_quadrant.png' },
    '2': { hand: 'left', pose: 'assets/hands/hand1_top_left_quadrant.png' },
    '3': { hand: 'left', pose: 'assets/hands/hand1_top_left_quadrant.png' },
    '4': { hand: 'left', pose: 'assets/hands/hand1_top_left_quadrant.png' },
    '5': { hand: 'left', pose: 'assets/hands/hand1_top_left_quadrant.png' },
    'q': { hand: 'left', pose: 'assets/hands/hand1_top_left_quadrant.png' },
    'w': { hand: 'left', pose: 'assets/hands/hand1_top_left_quadrant.png' },
    'e': { hand: 'left', pose: 'assets/hands/hand1_top_left_quadrant.png' },
    'r': { hand: 'left', pose: 'assets/hands/hand1_top_left_quadrant.png' },
    't': { hand: 'left', pose: 'assets/hands/hand1_top_left_quadrant.png' },
    'tab': { hand: 'left', pose: 'assets/hands/hand1_top_left_quadrant.png' },
    'a': { hand: 'left', pose: 'assets/hands/hand1__middle_left_quadrant.png' },
    's': { hand: 'left', pose: 'assets/hands/hand1__middle_left_quadrant.png' },
    'd': { hand: 'left', pose: 'assets/hands/hand1__middle_left_quadrant.png' },
    'f': { hand: 'left', pose: 'assets/hands/hand1__middle_left_quadrant.png' },
    'g': { hand: 'left', pose: 'assets/hands/hand1__middle_left_quadrant.png' },
    'capslock': { hand: 'left', pose: 'assets/hands/hand1__middle_left_quadrant.png' },
    'z': { hand: 'left', pose: 'assets/hands/hand1_lowest_left_quadrant.png' },
    'x': { hand: 'left', pose: 'assets/hands/hand1_lowest_left_quadrant.png' },
    'c': { hand: 'left', pose: 'assets/hands/hand1_lowest_left_quadrant.png' },
    'v': { hand: 'left', pose: 'assets/hands/hand1_lowest_left_quadrant.png' },
    'shift': { hand: 'left', pose: 'assets/hands/hand1_lowest_left_quadrant.png' },
    'control': { hand: 'left', pose: 'assets/hands/hand1_lowest_left_quadrant.png' },
    '6': { hand: 'right', pose: 'assets/hands/hand2_top_right_quadrant.png' },
    'y': { hand: 'right', pose: 'assets/hands/hand2_top_right_quadrant.png' },
    'u': { hand: 'right', pose: 'assets/hands/hand2_top_right_quadrant.png' },
    'i': { hand: 'right', pose: 'assets/hands/hand2_top_right_quadrant.png' },
    'o': { hand: 'right', pose: 'assets/hands/hand2_top_right_quadrant.png' },
    'p': { hand: 'right', pose: 'assets/hands/hand2_top_right_quadrant.png' },
    '[': { hand: 'right', pose: 'assets/hands/hand2_top_right_quadrant.png' },
    ']': { hand: 'right', pose: 'assets/hands/hand2_top_right_quadrant.png' },
    'backspace': { hand: 'right', pose: 'assets/hands/hand2_top_right_quadrant.png' },
    ';': { hand: 'right', pose: 'assets/hands/hand2_top_right_quadrant-numkeys.png' },
    '\'': { hand: 'right', pose: 'assets/hands/hand2_top_right_quadrant-numkeys.png' },
    '\\': { hand: 'right', pose: 'assets/hands/hand2_top_right_quadrant-numkeys.png' },
    'enter': { hand: 'right', pose: 'assets/hands/hand2_top_right_quadrant-numkeys.png' },
    '7': { hand: 'right', pose: 'assets/hands/hand2_middle_right_quadrant-numkeys.png' },
    '8': { hand: 'right', pose: 'assets/hands/hand2_middle_right_quadrant-numkeys.png' },
    '9': { hand: 'right', pose: 'assets/hands/hand2_middle_right_quadrant-numkeys.png' },
    '0': { hand: 'right', pose: 'assets/hands/hand2_middle_right_quadrant-numkeys.png' },
    '-': { hand: 'right', pose: 'assets/hands/hand2_middle_right_quadrant-numkeys.png' },
    '=': { hand: 'right', pose: 'assets/hands/hand2_middle_right_quadrant-numkeys.png' },
    ',': { hand: 'right', pose: 'assets/hands/hand2_middle_right_quadrant-numkeys.png' },
    '.': { hand: 'right', pose: 'assets/hands/hand2_middle_right_quadrant-numkeys.png' },
    '/': { hand: 'right', pose: 'assets/hands/hand2_middle_right_quadrant-numkeys.png' },
    'insert': { hand: 'right', pose: 'assets/hands/hand2_middle_right_quadrant-numkeys.png' },
    'home': { hand: 'right', pose: 'assets/hands/hand2_middle_right_quadrant-numkeys.png' },
    'pageup': { hand: 'right', pose: 'assets/hands/hand2_middle_right_quadrant-numkeys.png' },
    'delete': { hand: 'right', pose: 'assets/hands/hand2_middle_right_quadrant-numkeys.png' },
    'end': { hand: 'right', pose: 'assets/hands/hand2_middle_right_quadrant-numkeys.png' },
    'pagedown': { hand: 'right', pose: 'assets/hands/hand2_middle_right_quadrant-numkeys.png' },
    'arrowup': { hand: 'right', pose: 'assets/hands/hand2_middle_right_quadrant-numkeys.png' },
    'arrowdown': { hand: 'right', pose: 'assets/hands/hand2_middle_right_quadrant-numkeys.png' },
    'arrowleft': { hand: 'right', pose: 'assets/hands/hand2_middle_right_quadrant-numkeys.png' },
    'arrowright': { hand: 'right', pose: 'assets/hands/hand2_middle_right_quadrant-numkeys.png' },
    'h': { hand: 'right', pose: 'assets/hands/hand2_lowest_right_quadrant.png' },
    'j': { hand: 'right', pose: 'assets/hands/hand2_lowest_right_quadrant.png' },
    'k': { hand: 'right', pose: 'assets/hands/hand2_lowest_right_quadrant.png' },
    'l': { hand: 'right', pose: 'assets/hands/hand2_lowest_right_quadrant.png' },
    'n': { hand: 'right', pose: 'assets/hands/hand2_lowest_right_quadrant.png' },
    'm': { hand: 'right', pose: 'assets/hands/hand2_lowest_right_quadrant.png' },
    'b': { hand: 'right', pose: 'assets/hands/hand2_lowest_right_quadrant.png' },
    ' ': { hand: 'right', pose: 'assets/hands/hand2_lowest_right_quadrant.png' }
};
function triggerHandMovement(key) {
    const action = keyToHandMap[key.toLowerCase()];
    if (!action) return;
    if (action.hand === 'left') {
        clearTimeout(leftHandTimeout);
        leftHandImg.src = action.pose;
        leftHandTimeout = setTimeout(() => {
            leftHandImg.src = 'assets/hands/hand1_left_atrest.png';
        }, 150);
    } else if (action.hand === 'right') {
        clearTimeout(rightHandTimeout);
        rightHandImg.src = action.pose;
        rightHandTimeout = setTimeout(() => {
            rightHandImg.src = 'assets/hands/hand2_right_atrest.png';
        }, 150);
    }
}