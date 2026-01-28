import { AbsoluteFill, Audio, Img, Series, staticFile, useVideoConfig } from 'remotion';
import { VideoMetadata } from './types';

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
                                                <AbsoluteFill>
                                                    <Img
                                                        src={staticFile(image.path)}
                                                        style={{
                                                            width: '100%',
                                                            height: '100%',
                                                            objectFit: 'cover'
                                                        }}
                                                    />
                                                </AbsoluteFill>
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
