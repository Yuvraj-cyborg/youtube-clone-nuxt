<template>
  <div 
    class="video-card cursor-pointer transition-transform duration-200 ease-in-out transform hover:scale-105" 
    @click="handleClick"
  >
    <img :src="thumbnail" alt="thumbnail" class="rounded-lg" />
    <div class="mt-2">
      <h3 class="text-white text-sm">{{ title }}</h3>
      <p class="text-gray-400 text-xs">{{ user }}</p>
      <p class="text-gray-400 text-xs">{{ views }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from '#app'; 

export default defineComponent({
  props: {
    title: String,
    user: String,
    views: String,
    thumbnail: String,
    videoId: String,
  },
  setup(props) {
    const router = useRouter();

    const handleClick = () => {
      router.push(`/video/${props.videoId}`); 
    };

    return { handleClick };
  },
});
</script>

<style scoped>
.video-card {
  width: 100%;
  max-width: 280px;
}
</style>
