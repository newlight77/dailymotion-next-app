import { queryParamsToQueryString } from "@/shared/httpUtil";

export type VideoResponse = {
  result?: {
    id: string,
    title: string,
    owner: string,
    embedUrl: string,
  },
  error?: {
    message: string
  }
}

export const getVideo = async (id: string, onSuccess?: (videoResponse: VideoResponse) => void ): Promise<VideoResponse> => {

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
      return {
        result: undefined,
        error: { message: "Response body is null"}
      };
    }

    const videoResponse: VideoResponse = {
      result: {
        id,
        title: data.title,
        owner: data.owner,
        embedUrl: data.embed_url,
      },
      error: undefined
    };
    if (onSuccess) onSuccess(videoResponse);
    return data;
  } catch (error) {
      console.error("Error fetching data: ", error);
      return {
        result: undefined,
        error: { message: `Error fetching data: ${error}`}
      };
  }
};
