<template>
  <div class="flex flex-col h-screen">
    <div class="bg-black w-full">
      <div class="w-full h-64 md:w-1/2 mx-auto">
        <iframe
          :src="videoSrc"
          class="w-full h-full"
          frameborder="0"
          allowfullscreen
          title="YouTube video player"
        ></iframe>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto p-4 bg-black text-white">
      <VideoDescription :videoId="videoId" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import VideoDescription from '@/components/VideoDescription.vue';

export default defineComponent({
  components: {
    VideoDescription,
  },
  props: {
    videoId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const videoSrc = computed(() => `https://www.youtube.com/embed/${props.videoId}?autoplay=1`);

    return {
      videoSrc,
    };
  },
});
</script>
