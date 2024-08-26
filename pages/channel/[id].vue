<template>
    <div class="flex flex-col items-center bg-[#0F0F0F]">
      <!-- Channel Details -->
      <ChannelDetails :channelId="channelId" />
  
      <!-- Tab Navigation -->
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
  
      <!-- Tab Content -->
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
  
  export default defineComponent({
    components: {
      ChannelDetails,
      ChannelPlaylists,
      ChannelVideos
    },
    setup() {
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
  /* Ensure that the active tab underline aligns with the text length and stays within the parent border */
  button {
    flex: 0; /* Don't stretch to full width */
    margin-right: 1px; /* Add a small margin between buttons */
  }
  
  button:last-child {
    margin-right: 0; /* Remove margin for the last button */
  }
  </style>
  