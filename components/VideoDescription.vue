<template>
  <div class="bg-black p-6 rounded-md text-gray-200 w-full md:w-1/2 mx-auto border border-gray-600">
    <h2 class="text-lg font-semibold text-white mb-4">Description</h2>
    <p
      :class="{
        'line-clamp-3': !isExpanded,
        'whitespace-pre-wrap': true,
        'cursor-pointer': true,
      }"
      @click="toggleExpand"
    >
      {{ description }}
    </p>
    <button
      v-if="description.length > maxDescriptionLength"
      @click="toggleExpand"
      class="mt-4 bg-red-600 text-white py-2 px-6 font-medium rounded hover:bg-red-700"
    >
      {{ isExpanded ? 'Show Less' : 'Show More' }}
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { fetchVideoDetails } from '../services/youtubeService';

export default defineComponent({
  props: {
    videoId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const description = ref<string>('');
    const isExpanded = ref<boolean>(false);
    const maxDescriptionLength = 50;

    const loadVideoDetails = async () => {
      const video = await fetchVideoDetails(props.videoId);
      if (video) {
        description.value = video.description;
      }
    };

    onMounted(() => {
      loadVideoDetails();
    });

    const toggleExpand = () => {
      isExpanded.value = !isExpanded.value;
    };

    return {
      description,
      isExpanded,
      toggleExpand,
      maxDescriptionLength,
    };
  },
});
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
