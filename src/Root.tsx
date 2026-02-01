import { Composition, getInputProps } from 'remotion';
import { MyVideo } from './MyVideo';
import metadataJson from './metadata.json';
import { VideoMetadata } from './types';

export const RemotionRoot = () => {
    const props = (getInputProps() as unknown) as VideoMetadata;
    const data = props.sections ? props : (metadataJson as VideoMetadata);

    const fps = 30;
    const CHARS_PER_FRAME = 0.5; // Moderate speed: 2 frames per character
    const WAIT_SECONDS = 1;

    const getTitleDurationFrames = (text: string) => {
        const charDuration = Math.ceil(text.length / CHARS_PER_FRAME);
        return (charDuration * 2) + (WAIT_SECONDS * fps);
    };

    const totalDurationFrames = data.sections.reduce((acc, section) => {
        const titleFrames = getTitleDurationFrames(section.title);
        const sectionFrames = Math.ceil(section.durationInSeconds * fps);
        return acc + titleFrames + sectionFrames;
    }, 0);

    return (
        <>
            <Composition
                id="AutoVideo"
                component={MyVideo as any}
                durationInFrames={totalDurationFrames}
                fps={fps}
                width={1920}
                height={1080}
                defaultProps={data}
            />
        </>
    );
};
