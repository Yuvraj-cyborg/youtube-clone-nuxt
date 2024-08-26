<template>
    <div class="playlist-container bg-[#0F0F0F] p-4">
      <div v-if="playlist" class="playlist-details flex flex-col items-center">
        <img :src="playlist.thumbnail" alt="Playlist Thumbnail" class="w-full max-w-md h-48 object-cover mb-4">
        <h2 class="text-white text-2xl mb-2">{{ playlist.title }}</h2>
        <p class="text-gray-400 mb-4">{{ playlist.videoCount }} videos</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-screen-xl">
          <VideoCard
            v-for="video in videos"
            :key="video.id"
            :title="video.title"
            :user="video.channelTitle"
            :views="video.viewCount ? `${video.viewCount} views` : 'No views available'"
            :thumbnail="video.thumbnail"
            :videoId="video.id"
             :channelImage="video.channelImage"
            class="w-full max-w-lg rounded-lg"
          />
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import { fetchPlaylistDetails, fetchPlaylistVideos } from '@/services/youtubeService';
  import VideoCard from '@/components/VideoCard.vue';
  
  export default defineComponent({
    components: {
      VideoCard
    },
    setup() {
      const route = useRoute();
      const playlistId = route.params.id as string;
      const playlist = ref<{ thumbnail: string; title: string; videoCount: number } | null>(null);
      const videos = ref<Array<{
        id: string;
        title: string;
        thumbnail: string;
        channelTitle: string;
        viewCount: string;
        channelImage: string;
      }>>([]);
  
      onMounted(async () => {
        // Fetch playlist details
        playlist.value = await fetchPlaylistDetails(playlistId);
        // Fetch videos in the playlist
        videos.value = await fetchPlaylistVideos(playlistId);
      });
  
      return {
        playlist,
        videos
      };
    },
  });
  </script>
  
  <style scoped>
  .playlist-container {
    max-width: 1200px;
    margin: auto;
  }
  .playlist-details img {
    border-radius: 8px;
  }
  </style>
  