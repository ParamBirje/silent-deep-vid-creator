import { AbsoluteFill, Audio, Img, Series, staticFile, useVideoConfig, interpolate, useCurrentFrame, random } from 'remotion';
import { VideoMetadata } from './types';

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

export const MyVideo: React.FC<VideoMetadata> = ({ sections }) => {
    const { fps } = useVideoConfig();
    const TITLE_DURATION_FRAMES = 3 * fps;

    return (
        <AbsoluteFill style={{ backgroundColor: 'black' }}>
            <Series>
                {sections.map((section, sectionIndex) => (
                    <Series.Sequence
                        key={sectionIndex}
                        layout="none"
                        durationInFrames={TITLE_DURATION_FRAMES + Math.ceil(section.durationInSeconds * fps)}
                    >
                        <Series>
                            {/* Title Card */}
                            <Series.Sequence durationInFrames={TITLE_DURATION_FRAMES}>
                                <AbsoluteFill style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: 'black'
                                }}>
                                    <h1 style={{
                                        color: 'white',
                                        fontSize: 80,
                                        fontFamily: 'Arial',
                                        textAlign: 'center',
                                        padding: '0 100px',
                                        textTransform: 'uppercase'
                                    }}>
                                        {section.title}
                                    </h1>
                                </AbsoluteFill>
                            </Series.Sequence>

                            {/* Section Content */}
                            <Series.Sequence durationInFrames={Math.ceil(section.durationInSeconds * fps)}>
                                <AbsoluteFill>
                                    <Audio src={staticFile(section.audioPath)} />
                                    <Series>
                                        {section.images.map((image, imageIndex) => (
                                            <Series.Sequence
                                                key={imageIndex}
                                                durationInFrames={Math.ceil(image.durationInSeconds * fps)}
                                            >
                                                <ZoomImage
                                                    src={image.path}
                                                    durationInFrames={Math.ceil(image.durationInSeconds * fps)}
                                                    salt={`${sectionIndex}-${imageIndex}`}
                                                />
                                            </Series.Sequence>
                                        ))}
                                    </Series>
                                </AbsoluteFill>
                            </Series.Sequence>
                        </Series>
                    </Series.Sequence>
                ))}
            </Series>
        </AbsoluteFill>
    );
};
