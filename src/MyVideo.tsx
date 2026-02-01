import { AbsoluteFill, Audio, Img, Series, staticFile, useVideoConfig, interpolate, useCurrentFrame, random, Loop } from 'remotion';
import { VideoMetadata } from './types';
import { SFX, VIDEO_CONFIG } from './config';

const ZoomImage: React.FC<{ src: string, durationInFrames: number, salt: string }> = ({ src, durationInFrames, salt }) => {
    const frame = useCurrentFrame();

    // Slow zoom from 1 to 1.15
    const scale = interpolate(
        frame,
        [0, durationInFrames],
        [1, 1.15],
        { extrapolateRight: 'clamp' }
    );

    // Randomize the focal point (transform-origin) based on the image path/index
    const x = random(`${salt}-x`) * 100;
    const y = random(`${salt}-y`) * 100;

    return (
        <AbsoluteFill>
            <Img
                src={staticFile(src)}
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transform: `scale(${scale})`,
                    transformOrigin: `${x}% ${y}%`,
                }}
            />
        </AbsoluteFill>
    );
};

const TypewriterTitle: React.FC<{ text: string }> = ({ text }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const CHARS_PER_FRAME = VIDEO_CONFIG.CHARS_PER_FRAME;
    const WAIT_SECONDS = VIDEO_CONFIG.WAIT_SECONDS_AFTER_TYPING;

    const charDuration = Math.ceil(text.length / CHARS_PER_FRAME);
    const waitFrames = WAIT_SECONDS * fps;
    const totalDuration = (charDuration * 2) + waitFrames;

    let displayText = "";
    let isTyping = false;

    if (frame < charDuration) {
        // Typing phase
        const charsShowing = Math.floor(frame * CHARS_PER_FRAME);
        displayText = text.substring(0, charsShowing);
        isTyping = true;
    } else if (frame < charDuration + waitFrames) {
        // Wait phase
        displayText = text;
        isTyping = false;
    } else {
        // Backspacing phase
        const backspaceFrame = frame - charDuration - waitFrames;
        const charsToRemove = Math.floor(backspaceFrame * CHARS_PER_FRAME);
        displayText = text.substring(0, Math.max(0, text.length - charsToRemove));
        isTyping = true;
    }

    return (
        <AbsoluteFill style={{
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'black'
        }}>
            {isTyping && (
                <Loop durationInFrames={30}>
                    <Audio src={staticFile(SFX.KEYBOARD_TYPING)} volume={0.5} />
                </Loop>
            )}
            <h1 style={{
                color: 'white',
                fontSize: 80,
                fontFamily: 'Arial',
                textAlign: 'center',
                padding: '0 100px',
                textTransform: 'uppercase',
                borderRight: frame % 20 < 10 ? '4px solid white' : '4px solid transparent', // Blinking cursor
                display: 'inline-block'
            }}>
                {displayText}
            </h1>
        </AbsoluteFill>
    );
};

export const MyVideo: React.FC<VideoMetadata> = ({ sections }) => {
    const { fps } = useVideoConfig();

    const CHARS_PER_FRAME = VIDEO_CONFIG.CHARS_PER_FRAME;
    const WAIT_SECONDS = VIDEO_CONFIG.WAIT_SECONDS_AFTER_TYPING;

    const getTitleDurationFrames = (text: string) => {
        const charDuration = Math.ceil(text.length / CHARS_PER_FRAME);
        return (charDuration * 2) + (WAIT_SECONDS * fps);
    };

    return (
        <AbsoluteFill style={{ backgroundColor: 'black' }}>
            <Series>
                {sections.map((section, sectionIndex) => {
                    const titleFrames = getTitleDurationFrames(section.title);
                    const sectionFrames = Math.ceil(section.durationInSeconds * fps);

                    return (
                        <Series.Sequence
                            key={sectionIndex}
                            layout="none"
                            durationInFrames={titleFrames + sectionFrames}
                        >
                            <Series>
                                {/* Typewriter Title Card */}
                                <Series.Sequence durationInFrames={titleFrames}>
                                    <TypewriterTitle text={section.title} />
                                </Series.Sequence>

                                {/* Section Content */}
                                <Series.Sequence durationInFrames={sectionFrames}>
                                    <AbsoluteFill>
                                        <Audio src={staticFile(section.audioPath)} />
                                        <Series>
                                            {section.images.map((image, imageIndex) => (
                                                <Series.Sequence
                                                    key={imageIndex}
                                                    durationInFrames={Math.ceil(image.durationInSeconds * fps)}
                                                >
                                                    <AbsoluteFill>
                                                        <Audio src={staticFile(SFX.MOUSE_CLICK)} volume={0.8} />
                                                        <ZoomImage
                                                            src={image.path}
                                                            durationInFrames={Math.ceil(image.durationInSeconds * fps)}
                                                            salt={`${sectionIndex}-${imageIndex}`}
                                                        />
                                                    </AbsoluteFill>
                                                </Series.Sequence>
                                            ))}
                                        </Series>
                                    </AbsoluteFill>
                                </Series.Sequence>
                            </Series>
                        </Series.Sequence>
                    );
                })}
            </Series>
        </AbsoluteFill>
    );
};
