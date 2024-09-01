<template>
  <div class="flex flex-col items-center">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 p-4">
      <VideoCard
        v-for="video in videos"
        :key="video.id.videoId"
        :title="video.snippet.title"
        :user="video.snippet.channelTitle"
        :views="video.statistics.viewCount ? `${video.statistics.viewCount} views` : 'No views available'"
        :channelImage="video.channelImage"
        :thumbnail="video.snippet.thumbnails?.high?.url || ''"
        :videoId="video.id.videoId"
        class="w-full max-w-lg rounded-lg col-span-1"
      />
    </div>
    <div ref="loadingTrigger" class="loading-trigger"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch, onUnmounted } from 'vue';
import { useRuntimeConfig } from '#app';
import VideoCard from '@/components/VideoCard.vue';

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

interface VideoContentDetails {
  duration: string;
}

interface VideoItem {
  id: VideoId;
  snippet: VideoSnippet;
  statistics: VideoStatistics;
  channelImage: string;
  contentDetails: VideoContentDetails;
}

export default defineComponent({
  components: {
    VideoCard,
  },
  props: {
    channelId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const config = useRuntimeConfig();
    const apiKey = config.public.youtubeApiKey;
    const videos = ref<VideoItem[]>([]);
    const nextPageToken = ref<string | null>(null);
    const isLoading = ref(false);

    // Fetch channel image
    const fetchChannelImage = async (channelId: string): Promise<string> => {
      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${apiKey}`
        );
        const data = await response.json();
        return data.items[0].snippet.thumbnails.default.url;
      } catch (error) {
        console.error('Error fetching channel image:', error);
        return '';
      }
    };

    // Fetch video details
    const fetchVideoDetails = async (videoIds: string[]) => {
      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${videoIds.join(',')}&key=${apiKey}`
        );
        const data = await response.json();

        return Promise.all(
          data.items.map(async (item: any) => {
            const channelImage = await fetchChannelImage(item.snippet.channelId);
            return {
              id: { videoId: item.id },
              snippet: {
                title: item.snippet.title,
                channelTitle: item.snippet.channelTitle,
                thumbnails: {
                  default: { url: item.snippet.thumbnails?.default?.url || '' },
                  high: { url: item.snippet.thumbnails?.high?.url || '' },
                },
              },
              statistics: {
                viewCount: item.statistics?.viewCount ? `${item.statistics.viewCount} views` : 'No views available',
              },
              channelImage,
              contentDetails: {
                duration: item.contentDetails.duration,
              },
            };
          })
        );
      } catch (error) {
        console.error('Error fetching video details:', error);
        return [];
      }
    };

    // Fetch videos
    const fetchVideos = async (pageToken: string | null = null) => {
      if (isLoading.value) return;
      isLoading.value = true;

      try {
        const searchResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&channelId=${props.channelId}&maxResults=10${pageToken ? `&pageToken=${pageToken}` : ''}&key=${apiKey}`
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

        videos.value = [...videos.value, ...details];
        nextPageToken.value = searchData.nextPageToken || null;
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        isLoading.value = false;
      }
    };

    // Handle scroll for infinite scrolling
    const handleScroll = () => {
      const triggerElement = document.querySelector('.loading-trigger');
      if (triggerElement) {
        const rect = triggerElement.getBoundingClientRect();
        if (rect.top <= window.innerHeight && !isLoading.value) {
          fetchVideos(nextPageToken.value);
        }
      }
    };

    watch(() => props.channelId, () => {
      videos.value = [];
      nextPageToken.value = null;
      fetchVideos();
    });

    onMounted(() => {
      fetchVideos();
      window.addEventListener('scroll', handleScroll);
    });

    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll);
    });

    return { videos };
  },
});
</script>

<style scoped>
.loading-trigger {
  height: 1px; /* Minimal height to act as a trigger */
}
</style>
