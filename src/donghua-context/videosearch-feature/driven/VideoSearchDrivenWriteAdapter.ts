import { VideoSearchDrivenWritePort } from "../domain/port";


class VideoSearchDrivenWriteAdapter implements VideoSearchDrivenWritePort {
  none = () => {}
}


export const videoSearchDrivenWriteAdapter = () => new VideoSearchDrivenWriteAdapter();
