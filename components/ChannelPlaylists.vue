<template>
  <div v-if="playlists.length" class="playlists-container p-4">
    <h3 class="text-white text-xl mb-4">Playlists</h3>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="playlist in playlists" :key="playlist.id" class="playlist-item">
        <router-link :to="`/playlist/${playlist.id}`">
          <img :src="playlist.thumbnail" alt="Playlist Thumbnail" class="w-full h-32 object-cover cursor-pointer">
          <h4 class="text-white mt-2">{{ playlist.title }}</h4>
          <p class="text-gray-400">{{ playlist.description }}</p>
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
/* Add any additional styles here */
.playlist-item img {
  transition: transform 0.3s ease;
}

.playlist-item img:hover {
  transform: scale(1.05);
}
</style>
