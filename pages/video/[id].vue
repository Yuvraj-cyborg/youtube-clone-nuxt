<template>
    <div>
      <VideoPlayer :videoId="videoId" />
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, computed } from 'vue';
  import { useRoute } from 'vue-router';
  import VideoPlayer from '~/components/VideoPlayer.vue';
  
  export default defineComponent({
    components: {
      VideoPlayer,
    },
    setup() {
      const route = useRoute();
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
    background-color: black;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  </style>
  