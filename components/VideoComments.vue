<template>
  <div class="bg-[#0F0F0F] p-6 rounded-md text-gray-200">
    <h2 class="text-lg font-semibold text-white mb-4">Comments</h2>
    <div v-if="comments.length">
      <div v-for="comment in comments" :key="comment.id" class="mb-4">
        <div class="flex items-start mb-2">
          <img :src="comment.snippet.topLevelComment.snippet.authorProfileImageUrl" alt="Author" class="w-10 h-10 rounded-full mr-3" />
          <div class="max-w-full lg:max-w-[600px]"> 
            <p class="font-semibold">{{ comment.snippet.topLevelComment.snippet.authorDisplayName }}</p>
            <p class="text-sm text-gray-400 break-words" v-html="comment.snippet.topLevelComment.snippet.textDisplay"></p> <!-- Added break-words -->
          </div>
        </div>
      </div>
    </div>
    <p v-else class="text-gray-400">No comments yet.</p>
  </div>
</template>

  
  <script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue';
  import { fetchComments } from '../services/youtubeService';
  
  export default defineComponent({
    props: {
      videoId: {
        type: String,
        required: true,
      },
    },
    setup(props) {
      const comments = ref<any[]>([]);
  
      const loadComments = async () => {
        const fetchedComments = await fetchComments(props.videoId);
        if (fetchedComments) {
          comments.value = fetchedComments;
        }
      };
  
      onMounted(() => {
        loadComments();
      });
  
      return {
        comments,
      };
    },
  });
  </script>
  
  <style scoped>
  </style>
  