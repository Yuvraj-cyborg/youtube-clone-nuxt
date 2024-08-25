<template>
  <div 
    class="video-card cursor-pointer transition-transform duration-300 ease-in-out transform hover:scale-105"
    @click="handleClick"
  >
    <img :src="thumbnail" alt="Thumbnail" class="w-full h-60 object-cover rounded-lg" />
    <div class="p-4 flex items-start gap-3 rounded-lg">
      <img 
        :src="channelImage" 
        alt="Channel Thumbnail" 
        class="w-12 h-12 rounded-full object-cover"
      />
      <div class="flex flex-col justify-center flex-1">
        <h3 class="text-white *:text-lg break-words overflow-hidden">{{ title }}</h3>
        <p class="text-gray-300 text-sm truncate">{{ user }}</p>
        <p class="text-gray-300 text-sm truncate">{{ views }}</p>
      </div>
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
    channelImage: String,
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
  @apply max-w-md w-full overflow-hidden; /* Adjust width to fit title */
}
</style>
