import { useCallback } from "react";
import { queryParamsToQueryString } from "../shared/httpUtil";

export interface MetaVideo {
  id: string;
  title: string;
  description: string;
  channel: string;
  "channel.id": string;
  "channel.slug": string;
  "channel.name": string;
  "channel.description": string;
  country: string;
  "owner.country": string;
  language: string;
  "owner.language": string;
  thumbnail: string;
  thumbnail_180_url: string;
  thumbnail_240_url: string;
  thumbnail_360_url: string;
  thumbnail_480_url: string;
  updated_time: number;
  duration: number;
}

export type SearchResponse = {
  search: string,
  results?: {
    list: MetaVideo[],
    page: number,
    hasMore: boolean,
    total: number,
    limit: number,
  },
  error?: {
    message: string
  },
}

export type SearchParams = {
    search: string,
    limit: number,
    page: number
}


export const useSearchVideos = ({onSearch, onError}: {
  onSearch: (searchResponse: SearchResponse) => void,
  onError: (response: Pick<SearchResponse, "error">) => void
}): (searchParams: SearchParams) => Promise<void> => {

  const searchCallback = async (searchParams: SearchParams) => {

    const params = {
      ...{
        search: searchParams.search,
        limit: searchParams.limit || 10,
        page: searchParams.page|| 1,
      },
      fields: 'id,channel,country,thumbnail_url,thumbnail_180_url,thumbnail_240_url,thumbnail_360_url,thumbnail_480_url,duration,description,title,owner.country,language,owner.language,channel.name,channel.description,channel.slug,channel.id,updated_time',
    }

    try {
      const response = await fetch(`https://api.dailymotion.com/videos?${queryParamsToQueryString(params)}`, {
          method: 'GET'
      });

      const data = await response.json();
      if (!data) {
        console.error("Response body is null");
        onError({
          error: { message: "Response body is null"}
        });
        return;
      }

      const searchResponse: SearchResponse = {
        search: searchParams.search,
        results: {
          list: data.list,
          page: data.page,
          hasMore: data.hasMore,
          total: data.total,
          limit: data.limit,
        },
        error: undefined
      };
      onSearch(searchResponse);
      return;
    } catch (error) {
        console.error("Error fetching data: ", error);
        onError({
          error: { message: `Error fetching data: ${error}`}
        });
    }
  }

  return useCallback(searchCallback, [onSearch, onError]);
};
