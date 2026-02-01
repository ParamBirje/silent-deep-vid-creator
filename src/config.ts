export const SFX = {
    KEYBOARD_TYPING: 'sfx/keyboard-typing.mp3',
    MOUSE_CLICK: 'sfx/mouse-click-faint.mp3',
} as const;

export const VIDEO_CONFIG = {
    FPS: 30,
    WIDTH: 1920,
    HEIGHT: 1080,
    CHARS_PER_FRAME: 0.5,
    WAIT_SECONDS_AFTER_TYPING: 1,
    CRF: 25, // 18 is high quality/larger file, 23-28 is standard/optimized
} as const;
