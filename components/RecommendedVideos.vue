<template>
  <div class="p-4">
    <h2 class="text-lg font-bold text-white mb-4">Recommended Videos</h2>
    <div class="flex flex-col gap-4">
      <VideoCard
        v-for="video in videos"
        :key="video.id.videoId"
        :title="video.snippet.title"
        :user="video.snippet.channelTitle"
        :views="video.statistics.viewCount ? `${video.statistics.viewCount} views` : 'No views available'"
        :channelImage="video.channelImage"
        :thumbnail="video.snippet.thumbnails?.high?.url || ''"
        :videoId="video.id.videoId"
        class="w-full"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted } from 'vue';
import { useRuntimeConfig } from '#app';
import VideoCard from '@/components/VideoCard.vue';

interface VideoSnippet {
  title: string;
  channelTitle: string;
  channelId: string; 
  thumbnails: {
    default: { url: string };
    high: { url: string };
  };
}

interface VideoId {
  videoId: string;
}

interface VideoStatistics {
  viewCount: string;
}

interface VideoItem {
  id: VideoId;
  channelImage: string;
  snippet: VideoSnippet;
  statistics: VideoStatistics;
}

export default defineComponent({
  components: {
    VideoCard,
  },
  props: {
    searchQuery: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const config = useRuntimeConfig();
    const apiKey = config.public.youtubeApiKey;
    const videos = ref<VideoItem[]>([]);
    const defaultQuery = 'musicvideo';

    const fetchChannelImage = async (channelId: string) => {
      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${apiKey}`
        );
        const data = await response.json();
        return data.items[0]?.snippet?.thumbnails?.default?.url || '';
      } catch (error) {
        console.error('Error fetching channel image:', error);
        return '';
      }
    };

    const fetchVideoDetails = async (videoIds: string[]) => {
      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoIds.join(',')}&key=${apiKey}`
        );
        const data = await response.json();
        return data.items;
      } catch (error) {
        console.error('Error fetching video details:', error);
        return [];
      }
    };

    const fetchVideos = async (query: string) => {
      try {
        const searchResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(query)}&maxResults=10&key=${apiKey}`
        );
        if (!searchResponse.ok) {
          throw new Error(`HTTP error! Status: ${searchResponse.status}`);
        }
        const searchData = await searchResponse.json();

        if (!searchData.items) {
          throw new Error('No items found in the search response');
        }

        const videoIds = searchData.items.map((item: any) => item.id.videoId);
        const details = await fetchVideoDetails(videoIds);

        // Fetch channel images for each video
        const videoItems = await Promise.all(
          details.map(async (item: any) => {
            const channelImage = await fetchChannelImage(item.snippet.channelId);
            return {
              id: { videoId: item.id },
              snippet: {
                title: item.snippet.title,
                channelTitle: item.snippet.channelTitle,
                channelId: item.snippet.channelId, // Store channelId
                thumbnails: {
                  default: { url: item.snippet.thumbnails?.default?.url || '' },
                  high: { url: item.snippet.thumbnails?.high?.url || '' },
                }
              },
              statistics: {
                viewCount: item.statistics?.viewCount || 'No views available',
              },
              channelImage, // Add the fetched channel image here
            };
          })
        );

        videos.value = videoItems;
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    };

    watch(() => props.searchQuery, (newQuery) => {
      if (newQuery) {
        fetchVideos(newQuery);
      } else {
        fetchVideos(defaultQuery);
      }
    });

    onMounted(() => {
      fetchVideos(props.searchQuery || defaultQuery);
    });

    return { videos };
  },
});
</script>

<style scoped>
.w-full {
  width: 100%;
}
</style>
