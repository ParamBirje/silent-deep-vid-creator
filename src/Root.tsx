import { Composition, getInputProps } from 'remotion';
import { MyVideo } from './MyVideo';
import metadataJson from './metadata.json';
import { VideoMetadata } from './types';
import { VIDEO_CONFIG } from './config';

export const RemotionRoot = () => {
    const props = (getInputProps() as unknown) as VideoMetadata;
    const data = props.sections ? props : (metadataJson as VideoMetadata);

    const fps = VIDEO_CONFIG.FPS;
    const CHARS_PER_FRAME = VIDEO_CONFIG.CHARS_PER_FRAME;
    const WAIT_SECONDS = VIDEO_CONFIG.WAIT_SECONDS_AFTER_TYPING;

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
                width={VIDEO_CONFIG.WIDTH}
                height={VIDEO_CONFIG.HEIGHT}
                defaultProps={data}
            />
        </>
    );
};
