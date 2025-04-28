import { MetaVideoType, PreferencesType, scoreVideo } from "../model";
import { VideoSearchParamsType, VideoSearchWithScoreResponse, VideoWithScoreType } from "../model";
import { VideoSearchDrivenReadPort, VideoSearchDrivenWritePort } from "../port";


// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type VideoSearchUseCaseType = {
  search: (searchParams: VideoSearchParamsType, prefs?: PreferencesType) => Promise<VideoSearchWithScoreResponse>,
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const videoSearchUsecase = (readPort: VideoSearchDrivenReadPort, writePort: VideoSearchDrivenWritePort): VideoSearchUseCaseType => {

  // this is a query use case
  const search = async (searchParams: VideoSearchParamsType, prefs?: PreferencesType): Promise<VideoSearchWithScoreResponse> => {
    const response = await readPort.search(searchParams);

    const { list } = response;
    let scoredList: VideoWithScoreType[] = []

    const strictValue = prefs?.strictSearch ? 0 : 1

    if (prefs) {
      // Reorder the results based on user preferences
      scoredList = list.map((video: MetaVideoType) => scoreVideo(video, searchParams.search, prefs)).map(v => v as VideoWithScoreType)
      scoredList = scoredList
        .sort((a, b) => b.score - a.score)
        .filter(v => v.score >= searchParams.search.split(" ").length - strictValue)
        .map(v => v as VideoWithScoreType)
    }

    return {
      ...response,
      list: scoredList
    };
  }

  return {
    search
  }
}
