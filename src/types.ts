export interface Section {
    title: string;
    audioPath: string;
    durationInSeconds: number;
    images: {
        path: string;
        durationInSeconds: number;
    }[];
}

export interface VideoMetadata {
    videoName: string;
    sections: Section[];
}
