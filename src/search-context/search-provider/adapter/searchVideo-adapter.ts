import { queryParamsToQueryString } from "@/shared/httpUtil";
import { MetaVideoType } from "../domain/anime";

// export interface MetaVideo {
//   id: string;
//   title: string;
//   description: string;
//   channel: string;
//   "channel.id": string;
//   "channel.slug": string;
//   "channel.name": string;
//   "channel.description": string;
//   country: string;
//   "owner.country": string;
//   language: string;
//   "owner.language": string;
//   thumbnail: string;
//   thumbnail_180_url: string;
//   thumbnail_240_url: string;
//   thumbnail_360_url: string;
//   thumbnail_480_url: string;
//   updated_time: number;
//   duration: number;
// }


export type SearchResponse = {
  search: string,
  results?: {
    list: MetaVideoType[],
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

export const searchVideos = async (searchParams: SearchParams ): Promise<SearchResponse> => {

  const params = {
      ...{
        search: searchParams.search,
        limit: searchParams.limit || 10,
        page: searchParams.page|| 1,
      },
      fields: [
        'id',
        'title',
        'duration',
        'description',
        'country',
        'language',
        'thumbnail_url',
        'thumbnail_180_url',
        'thumbnail_240_url',
        'thumbnail_360_url',
        'thumbnail_480_url',
        'owner',
        'owner.id',
        'owner.username',
        'owner.url',
        'owner.country',
        'owner.language',
        'channel',
        'channel.name',
        'channel.description',
        'channel.slug',
        'channel.id',
        'updated_time'
      ].join(','),
  }

  try {
    const response = await fetch(`https://api.dailymotion.com/videos?${queryParamsToQueryString(params)}`, {
        method: 'GET'
    });

    const data = await response.json();
    if (!data) {
      console.error("Response body is null");
      return {
        search: searchParams.search,
        error: { message: "Response body is null"}
      };
    }

    let list = [];
    if (data.list) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      list = data.list.map((d: any) => {
        return {
          id: d.id,
          title: d.title,
          duration: d.duration,
          description: d.description,
          country: d.country,
          language: d.language,
          thumbnail_url: d.thumbnail_url,
          thumbnail_180_url: d.thumbnail_180_url,
          thumbnail_240_url: d.thumbnail_240_url,
          thumbnail_360_url: d.thumbnail_360_url,
          thumbnail_480_url: d.thumbnail_480_url,
          owner: d['owner'],
          ownerId: d['owner.id'],
          ownerUsername: d['owner.username'],
          ownerUrl: d['owner.url'],
          ownerCountry: d['owner.country'],
          ownerLanguage: d['owner.language'],
          channel: d.channel,
          channelId: d['channel.id'],
          channelSlug: d['channel.slug'],
          channelName: d['channel.name'],
          channelDescription: d['channel.description'],
          updated_time: d.updated_time,
        }
      })
    }

    const searchResponse: SearchResponse = {
      search: searchParams.search,
      results: {
        list: list,
        page: data.page,
        hasMore: data.hasMore,
        total: data.total,
        limit: data.limit,
      },
      error: undefined
    };
    return searchResponse;
  } catch (error) {
      console.error("Error fetching data: ", error);
      return {
        search: searchParams.search,
        error: { message: `Error fetching data: ${error}`}
      };
  }
};
