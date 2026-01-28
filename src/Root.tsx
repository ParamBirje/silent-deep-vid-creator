import { Composition, getInputProps } from 'remotion';
import { MyVideo } from './MyVideo';
import metadataJson from './metadata.json';
import { VideoMetadata } from './types';

export const RemotionRoot = () => {
    const props = (getInputProps() as unknown) as VideoMetadata;
    const data = props.sections ? props : (metadataJson as VideoMetadata);

    const TITLE_DURATION_SEC = 3;
    const totalDurationSec = data.sections.reduce((acc, section) => {
        return acc + TITLE_DURATION_SEC + section.durationInSeconds;
    }, 0);

    const fps = 30;
    const durationInFrames = Math.ceil(totalDurationSec * fps);

    return (
        <>
            <Composition
                id="AutoVideo"
                component={MyVideo as any}
                durationInFrames={durationInFrames}
                fps={fps}
                width={1920}
                height={1080}
                defaultProps={data}
            />
        </>
    );
};
