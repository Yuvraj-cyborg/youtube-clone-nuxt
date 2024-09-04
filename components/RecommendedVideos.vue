<template>
  <div class="p-4">
    <h2 class="text-lg font-bold text-white mb-4">Recommended Videos</h2>
    <div class="flex flex-col gap-4">
      <div 
        v-for="video in videos"
        :key="video.id.videoId"
        class="flex items-start gap-4"
      >
        <div class="flex-shrink-0">
          <VideoCard
            :title="video.snippet.title"
            :user="video.snippet.channelTitle"
            :views="video.statistics.viewCount ? `${video.statistics.viewCount} views` : 'No views available'"
            :channelImage="video.channelImage"
            :thumbnail="video.snippet.thumbnails?.high?.url || ''"
            :videoId="video.id.videoId"
            class="w-32 h-20 object-cover flex items-center rounded-md"
          />
        </div>
        <div class="flex flex-col justify-center">
          <h3 class="text-white text-sm">
            {{ video.snippet.title }}
          </h3>
          <p class="text-gray-400 text-xs">{{ video.snippet.channelTitle }}</p>
          <p class="text-gray-400 text-xs">
            {{ video.statistics.viewCount ? `${video.statistics.viewCount} views` : 'No views available' }} • {{ timeSincePublished(video.snippet.publishedAt) }}
          </p>
        </div>
      </div>
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
  thumbnails: {
    high: {
      url: string;
    };
  };
  publishedAt: string;
}

interface VideoItem {
  id: {
    videoId: string;
  };
  snippet: VideoSnippet;
  statistics: {
    viewCount: string;
  };
  channelImage: string;
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

    const fetchChannelImage = async (channelId: string): Promise<string> => {
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

    const fetchVideoDetails = async (videoIds: string[]): Promise<VideoItem[]> => {
      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoIds.join(',')}&key=${apiKey}`
        );
        const data = await response.json();
        return data.items.map((item: any) => ({
          id: { videoId: item.id },
          snippet: {
            title: item.snippet.title,
            channelTitle: item.snippet.channelTitle,
            thumbnails: {
              high: { url: item.snippet.thumbnails?.high?.url || '' },
            },
            publishedAt: item.snippet.publishedAt,
          },
          statistics: {
            viewCount: item.statistics?.viewCount || 'No views available',
          },
          channelImage: '',
        }));
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
        const searchData = await searchResponse.json();

        const videoIds = searchData.items.map((item: any) => item.id.videoId);
        const details = await fetchVideoDetails(videoIds);

        const videoItems = await Promise.all(
          details.map(async (item) => {
            const channelImage = await fetchChannelImage(item.snippet.channelTitle);
            return { ...item, channelImage };
          })
        );

        videos.value = videoItems;
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    };

    const timeSincePublished = (publishedAt: string): string => {
      const publishedDate = new Date(publishedAt);
      const currentTime = new Date();

      const differenceInMs = currentTime.getTime() - publishedDate.getTime();

      const seconds = Math.floor(differenceInMs / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      const weeks = Math.floor(days / 7);
      const months = Math.floor(days / 30);
      const years = Math.floor(days / 365);

      if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
      if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
      if (weeks > 0) return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
      if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
      if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
      if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
      return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
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

    return { videos, timeSincePublished };
  },
});
</script>

<style scoped>
.w-32 {
  width: 8rem;
}

.h-20 {
  height: 5rem;
}

.object-cover {
  object-fit: cover;
}
</style>