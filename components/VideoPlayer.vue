<template>
  <div class="video-player">
    <youtube 
      :video-id="videoId" 
      :src="`https://www.youtube.com/watch?v=${videoId}`" 
      width="100%" 
      height="480"
    />
  </div>
</template>
  
<script lang="ts">
import { defineComponent } from 'vue';
import { useRuntimeConfig } from '#app';
import Youtube from 'vue3-youtube';


export default defineComponent({
  props: {
    videoId: {
      type: String,
      required: true,
    },
  },
  setup() {
    const config = useRuntimeConfig();

    const fetchVideoDetails = async (videoId: string) => {
      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${config.public.youtubeApiKey}`
        );
        const data = await response.json();
        return data.items && data.items.length > 0 ? data.items[0] : null;
      } catch (error) {
        console.error('Error fetching video details:', error);
        return null;
      }
    };

    return { fetchVideoDetails };
  },
});
</script>
  
<style scoped>
.video-player {
  width: 100%;
  height: 100%;
  background-color: black;
}
</style>
