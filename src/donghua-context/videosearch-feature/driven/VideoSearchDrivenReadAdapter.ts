import { queryParamsToQueryString } from "@/core/core-lib/shared/httpUtil";
import { MetaVideoType, VideoType } from "../domain";
import { VideoSearchResponse, VideoSearchParamsType } from "../domain";
import { VideoSearchDrivenPort } from "../domain/port";


const fields = [
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
].join(',')

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapToVideo(d: any): MetaVideoType {
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
  };
}


class VideoSearchDrivenReadAdapter implements VideoSearchDrivenPort {
  search = async (params: VideoSearchParamsType): Promise<VideoSearchResponse> => {

    const searchParams = {
      search: params.search,
      limit: params.limit || 50,
      page: params.page || 1,
      fields: fields,
    }

    try {
      const response = await fetch(`https://api.dailymotion.com/videos?${queryParamsToQueryString(searchParams)}`, {
        method: 'GET'
      });

      const data = await response.json();
      if (!data) {
        console.error("Response body is null");
        return {
          search: searchParams.search,
          page: searchParams.page,
          limit: searchParams.limit,
          list: [],
          hasMore: false,
        };
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const list: MetaVideoType[] = data.list ? data.list.map((d: any) => mapToVideo(d)) : []

      return {
        search: searchParams.search,
        page: data.page,
        limit: data.limit,
        list: list,
        hasMore: false,
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
      return {
        search: searchParams.search,
        page: searchParams.page,
        limit: searchParams.limit,
        list: [],
        hasMore: false,
      };
    }
  }

  getById = async (id: string): Promise<VideoType | undefined> => {
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

      return {
        videoId: id,
        title: data.title,
        owner: data.owner,
        link: data.embed_url,
        episode: 0
      };
    } catch (error) {
      console.error("Error fetching data: ", error);
      return undefined;
    }
  }
}


export const videoSearchDrivenAdapter = () => new VideoSearchDrivenReadAdapter();
