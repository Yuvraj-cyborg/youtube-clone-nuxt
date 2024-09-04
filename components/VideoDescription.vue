<template>
  <div class="bg-[#272727] rounded-md text-gray-200 w-full md:w-1/2 mx-auto p-5">
    <h2 class="text-lg font-semibold text-white mb-4">Description</h2>
    <div class="mb-4 text-gray-400">
      <p><strong>Views:</strong> {{ views }}</p>
      <p><strong>Uploaded:</strong> {{ uploadTime }}</p>
    </div>
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
      class="mt-4 text-white py-2 px-6 font-medium rounded"
    >
      {{ isExpanded ? 'Show Less..' : 'Show More' }}
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
    const views = ref<string>('');
    const uploadTime = ref<string>('');
    const isExpanded = ref<boolean>(false);
    const maxDescriptionLength = 50;

    const loadVideoDetails = async () => {
      const video = await fetchVideoDetails(props.videoId);
      if (video) {
        description.value = video.description;
        views.value = video.views;
        uploadTime.value = new Date(video.age).toLocaleDateString(); 
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
      views,
      uploadTime,
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
