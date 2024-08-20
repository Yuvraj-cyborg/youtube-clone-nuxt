<template>
  <div class="video-player">
    <iframe
      :src="videoSrc"
      width="100%"
      height="480"
      frameborder="0"
      allowfullscreen
    ></iframe>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

export default defineComponent({
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

<style scoped>
.video-player {
  width: 100%;
  height: 100%;
  background-color: black;
}
</style>
