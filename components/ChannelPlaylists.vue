<template>
  <div v-if="playlists.length" class="playlists-container p-4">
    <h3 class="text-white text-xl mb-4">Playlists</h3>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="playlist in playlists" :key="playlist.id" class="playlist-item relative">
        <router-link :to="`/playlist/${playlist.id}`">
          <div class="relative">
            <img :src="playlist.thumbnail" alt="Playlist Thumbnail" class="w-full h-32 object-cover cursor-pointer">
            <div class="video-count-overlay">
              <span>{{ playlist.videoCount }} videos</span>
            </div>
          </div>
          <h4 class="text-white mt-2">{{ playlist.title }}</h4>
        </router-link>
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { fetchChannelPlaylists } from '@/services/youtubeService';

export default defineComponent({
  props: {
    channelId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const playlists = ref<Array<{
      id: string;
      title: string;
      thumbnail: string;
      description: string;
      videoCount: number; 
    }>>([]);

    onMounted(async () => {
      playlists.value = await fetchChannelPlaylists(props.channelId);
    });

    return {
      playlists,
    };
  },
});
</script>


<style scoped>
.playlist-item {
  position: relative;
  overflow: hidden; 
}

.playlist-item img {
  transition: transform 0.3s ease;
}

.playlist-item img:hover {
  transform: scale(1.05);
}

.playlist-item:hover .video-count-overlay {
  height: 35%;
}

.video-count-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 25%; 
  background: rgba(0, 0, 0, 0.6); 
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.9rem;
  font-weight: bold;
  box-sizing: border-box;
  padding: 0 0.5rem; 
  transition: height 0.3s ease; 
}
</style>
