import { queryParamsToQueryString } from "@/shared/httpUtil";

export type VideoResponse = {
  id: string,
  title?: string,
  embedUrl?: string,
  error?: {
    message: string
  }
}

export const getVideo = async (id: string, onSuccess: (videoResponse: VideoResponse) => void ): Promise<VideoResponse> => {

  try {

    const params = {
      fields: 'id,title,embed_url'
    }

    const response = await fetch(`https://api.dailymotion.com/video/${id}?${queryParamsToQueryString(params)}`, {
        method: 'GET'
    });

    const data = await response.json();
    if (!data) {
      console.error("Response body is null");
      return {
        id: id,
        title: undefined,
        embedUrl: undefined,
        error: { message: "Response body is null"}
      };
    }

    const videoResponse: VideoResponse = {
      id,
      title: data.title,
      embedUrl: data.embed_url,
      error: undefined
    };
    onSuccess(videoResponse);
    return data;
  } catch (error) {
      console.error("Error fetching data: ", error);
      return {
        id,
        title: undefined,
        embedUrl: undefined,
        error: { message: `Error fetching data: ${error}`}
      };
  }
};
