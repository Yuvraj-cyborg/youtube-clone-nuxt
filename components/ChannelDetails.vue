<template>
  <div v-if="channelDetails" class="channel-details-container">
    <img :src="channelDetails.bannerImage" alt="Channel Banner" class="w-full h-48 object-cover">
    <div class="flex items-center p-4">
      <img :src="channelDetails.channelImage" alt="Channel Image" class="w-16 h-16 rounded-full">
      <div class="ml-4">
        <h2 class="text-white text-2xl">{{ channelDetails.channelName }}</h2>
        <p class="text-gray-400">{{ channelDetails.subscribers }} subscribers</p>
        <p class="text-gray-400">{{ channelDetails.videosCount }} videos</p>
        <p class="text-gray-400 mt-2">{{ channelDetails.description }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { fetchChannelDetails } from '@/services/youtubeService';

export default defineComponent({
  props: {
    channelId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const channelDetails = ref<{
      channelName: string;
      description: string;
      subscribers: string;
      videosCount: string;
      channelImage: string;
      bannerImage: string;
    } | null>(null);

    onMounted(async () => {
      channelDetails.value = await fetchChannelDetails(props.channelId);
    });

    return {
      channelDetails,
    };
  },
});
</script>

<style scoped>
/* Add necessary styles here */
</style>
