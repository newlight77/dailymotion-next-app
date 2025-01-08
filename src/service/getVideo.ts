import { queryParamsToQueryString } from "../shared/httpUtil";

export type VideoResponse = {
  id: string,
  video?: {
    url: string
  },
  error?: {
    message: string
  }
}

export const getVideo = async (id: string, onSuccess: (videoResponse: VideoResponse) => void ): Promise<VideoResponse> => {

  try {

    const params = {
      fields: 'id,channel,country,thumbnail_url,thumbnail_180_url,thumbnail_240_url,thumbnail_360_url,thumbnail_480_url,duration,description,title,owner.country,language,owner.language,channel.name,channel.description,channel.slug,channel.id'
    }

    const response = await fetch(`https://api.dailymotion.com/video/${id}?${queryParamsToQueryString(params)}`, {
        method: 'GET'
    });

    const data = await response.json();
    if (!data) {
      console.error("Response body is null");
      return {
        id,
        video: undefined,
        error: { message: "Response body is null"}
      };
    }

    const videoResponse: VideoResponse = {
      id,
      video: data,
      error: undefined
    };
    onSuccess(videoResponse);
    return data;
  } catch (error) {
      console.error("Error fetching data: ", error);
      return {
        id,
        video: undefined,
        error: { message: `Error fetching data: ${error}`}
      };
  }
};
