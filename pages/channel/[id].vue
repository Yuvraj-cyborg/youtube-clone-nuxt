<template>
    <div class="flex flex-col items-center bg-[#0F0F0F]">
      <ChannelDetails :channelId="channelId" />
  
      <div class="w-full max-w-screen-xl px-0 flex border-b-[1px] border-gray-700">
        <button
          class="py-1 px-2 text-white text-sm border-b-2 transition-colors duration-300 ease-in-out"
          :class="{'border-white': activeTab === 'videos', 'border-transparent': activeTab !== 'videos'}"
          @click="activeTab = 'videos'"
        >
          Videos
        </button>
        <button
          class="py-1 px-2 text-white text-sm border-b-2 transition-colors duration-300 ease-in-out"
          :class="{'border-white': activeTab === 'playlists', 'border-transparent': activeTab !== 'playlists'}"
          @click="activeTab = 'playlists'"
        >
          Playlists
        </button>
      </div>
  
      <div class="w-full max-w-screen-xl px-4 py-4">
        <div v-if="activeTab === 'videos'">
          <ChannelVideos :channelId="channelId" />
        </div>
        <div v-if="activeTab === 'playlists'">
          <ChannelPlaylists :channelId="channelId" />
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { useRoute } from 'vue-router';
  import ChannelDetails from '@/components/ChannelDetails.vue';
  import ChannelPlaylists from '@/components/ChannelPlaylists.vue';
  import ChannelVideos from '@/components/ChannelVideos.vue';
  import { useSearchQuery } from '@/composables/useSearchQuery';
  
  
  export default defineComponent({
    components: {
      ChannelDetails,
      ChannelPlaylists,
      ChannelVideos
    },
    setup() {
     const { searchQuery } = useSearchQuery();
      const route = useRoute();
      const channelId = route.params.id as string;
      const activeTab = ref<'videos' | 'playlists'>('videos');
  
      return {
        channelId,
        activeTab
      };
    },
  });
  </script>
  
  <style scoped>
  button {
    flex: 0; 
    margin-right: 1px; 
  }
  
  button:last-child {
    margin-right: 0; 
  }
  </style>
  