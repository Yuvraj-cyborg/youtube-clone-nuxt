<template>
  <div class="flex flex-col max-h-screen overflow-hidden">
    <div class="flex flex-row fixed top-10 left-0 right-0" style="height: 92.5vh;">
      <div class="flex flex-col flex-grow p-7 mx-20 mr-0 overflow-auto">
        <div class="flex flex-col">
          <div class="flex justify-center">
            <iframe
              :src="videoSrc"
              width="800"
              height="502"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
              title="YouTube video player"
              class="w-full"
            ></iframe>
          </div>

          <div class="mt-5">
            <p class="text-xl">{{ videoDetails.title }}</p>
            <div class="flex justify-between mt-1 text-sm text-gray-400">
              <div>
                <span class="after:content-['•'] after:mx-1">{{ videoDetails.views }} views</span>
                <span>{{ videoDetails.age }} ago</span>
              </div>
              <div class="flex items-center gap-4 uppercase">
                <div class="flex items-center gap-1 cursor-pointer">
                  <i class="icon-like"></i>
                  <strong>{{ videoDetails.likes }}</strong>
                </div>
                <div class="flex items-center gap-1 cursor-pointer">
                  <i class="icon-dislike"></i>
                  <strong>Dislike</strong>
                </div>
                <div class="flex items-center gap-1 cursor-pointer">
                  <i class="icon-share"></i>
                  <strong>Share</strong>
                </div>
                <div class="flex items-center gap-1 cursor-pointer">
                  <i class="icon-clip"></i>
                  <strong>Clip</strong>
                </div>
                <div class="flex items-center gap-1 cursor-pointer">
                  <i class="icon-save"></i>
                  <strong>Save</strong>
                </div>
                <div class="flex items-center gap-1 cursor-pointer">
                  <i class="icon-more"></i>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-5 w-full">
            <VideoDescription :videoId="videoId" />
          </div>
        </div>
      </div>

      <div class="w-[500px] bg-black text-gray-200 p-7 overflow-auto">
        <VideoComments :videoId="videoId" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { fetchVideoDetails } from "../services/youtubeService";
import VideoDescription from '@/components/VideoDescription.vue';
import VideoComments from '../components/VideoComments.vue';

export default defineComponent({
  components: {
    VideoDescription,
    VideoComments
  },
  setup() {
    const route = useRoute();
    const videoId = route.params.id as string;

    const videoDetails = ref({
      title: '',
      views: '',
      age: '',
      likes: '',
      description: '',
      channelImage: '',
      channelName: '',
      subscribers: '',
    });

    const videoSrc = computed(() => `https://www.youtube.com/embed/${videoId}?autoplay=1`);

    fetchVideoDetails(videoId).then((details) => {
      if (details) {
        videoDetails.value = details;
      }
    });

    return {
      videoSrc,
      videoDetails,
      videoId,
    };
  },
});
</script>

<style scoped>
.flex {
  display: flex;
}

.flex-grow {
  flex-grow: 1;
}

.mt-5 {
  margin-top: 1.25rem;
}

.w-full {
  width: 100%;
}

.w-300px {
  width: 300px;
}

.bg-gray-900 {
  background-color: #1f2937; /* Dark gray background */
}

.text-gray-200 {
  color: #e5e7eb; /* Light gray text */
}
</style>
