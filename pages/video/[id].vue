<template>
    <div class="video-container">
      <VideoPlayer :videoId="videoId" />
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, computed } from 'vue';
  import { useRoute } from '#app';
  import VideoPlayer from '~/components/VideoPlayer.vue';
  
  export default defineComponent({
    components: {
      VideoPlayer,
    },
    setup() {
      const route = useRoute();
      // Match route parameter name with the dynamic segment
      const videoId = computed(() => route.params.id as string);
  
      return {
        videoId,
      };
    },
  });
  </script>
  
  <style scoped>
  .video-container {
    width: 100%;
    height: 100vh;
    background-color: #0F0F0F;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  </style>
  