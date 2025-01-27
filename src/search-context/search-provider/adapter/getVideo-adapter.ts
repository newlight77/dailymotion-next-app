import { queryParamsToQueryString } from "@/shared/httpUtil";
import { VideoType } from "../domain/anime";

export const getVideo = async (id: string, onSuccess?: (video: VideoType) => void ): Promise<VideoType | undefined> => {

  try {

    const params = {
      fields: 'id,title,embed_url,owner'
    }

    const response = await fetch(`https://api.dailymotion.com/video/${id}?${queryParamsToQueryString(params)}`, {
        method: 'GET'
    });

    const data = await response.json();
    if (!data) {
      console.error("Response body is null");
      return undefined;
    }

    const video: VideoType = {
        videoId: id,
        title: data.title,
        owner: data.owner,
        link: data.embed_url,
        episode: 0
    };
    if (onSuccess ) {
      onSuccess(video)
    };
    return undefined;
  } catch (error) {
      console.error("Error fetching data: ", error);
      return undefined;
  }
};
