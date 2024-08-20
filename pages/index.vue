<template>
  <div class="flex flex-col items-center">
    <div class="grid 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 gap-4">
      <VideoCard
        v-for="video in videos"
        :key="video.id.videoId"
        :title="video.snippet.title"
        :user="video.snippet.channelTitle"
        :views="video.statistics.viewCount ? `${video.statistics.viewCount} views` : 'No views available'"
        :channelThumbnail="video.snippet.thumbnails?.default?.url || ''"
        :thumbnail="video.snippet.thumbnails?.high?.url || ''"
        :videoId="video.id.videoId"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRuntimeConfig } from '#app';

interface VideoSnippet {
  title: string;
  channelTitle: string;
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
  snippet: VideoSnippet;
  statistics: VideoStatistics;
}


export default defineComponent({
  setup() {
    const config = useRuntimeConfig();
    const apiKey = config.public.youtubeApiKey;
    const videos = ref<VideoItem[]>([]);
    const searchQuery = ref('musicvideo'); 
    async function fetchVideoDetails(videoIds: string[]) {
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
}

    const fetchVideos = async (query: string) => {
      try {
        const searchResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(query)}&maxResults=10&key=${apiKey}`
        );
        const searchData = await searchResponse.json();
        
        const videoIds = searchData.items.map((item: any) => item.id.videoId);
        const details = await fetchVideoDetails(videoIds);

        videos.value = details.map((item: any) => ({
          id: { videoId: item.id },
          snippet: {
            title: item.snippet.title,
            channelTitle: item.snippet.channelTitle,
            thumbnails: {
              default: { url: item.snippet.thumbnails?.default?.url || '' },
              high: { url: item.snippet.thumbnails?.high?.url || '' },
            }
          },
          statistics: {
            viewCount: item.statistics?.viewCount ? `${item.statistics.viewCount} views` : 'No views available',
          }
        }));
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    };

    onMounted(() => fetchVideos(searchQuery.value));

    return { videos, searchQuery, fetchVideos };
  },
});


</script>

<style scoped>
</style>
