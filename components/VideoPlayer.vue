<template>
  <div
    :class="[
      'flex flex-col bg-[#0F0F0F] transition-all duration-300 w-full h-full ml-0',
      openSideNav ? 'ml-[240px]' : 'ml-0'
    ]"
  >
    <div
      class="md:flex md:flex-row w-full h-full transition-all duration-300"
    >
      <div
        :class="[
          'video-player flex flex-col flex-grow overflow-auto bg-[#0F0F0F] transition-all duration-300',
          openSideNav ? 'md:mr-64' : ''
        ]"
      >
        <div class="flex flex-col w-full max-w-5xl mx-auto px-0">
          <div class="flex ">
            <iframe
              :src="videoSrc"
              class="w-full aspect-video"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
              title="YouTube video player"
            ></iframe>
          </div>
          <div class="mt-5">
            <p class="text-xl text-white pb-4">{{ videoDetails.title }}</p>
            <div class="flex justify-between mt-1 text-sm text-white">
              <div class="flex items-center gap-3 cursor-pointer" @click="goToChannelPage">
                <img
                  :src="videoDetails.channelImage"
                  alt="Channel Image"
                  class="w-10 h-10 rounded-full"
                />
                <div>
                  <span class="font-semibold text-xl">{{ videoDetails.channelName }}</span>
                  <p class="text-sm text-gray-400">{{ videoDetails.subscribers }} Subscribers</p>
                </div>
              </div>
              <div class="flex items-center gap-4 uppercase">
                <div class="like flex gap-3 bg-[#272727] rounded-3xl p-3 items-center justify-between">
                  <div class="flex items-center gap-2 cursor-pointer">
                    <div class="pb-1">
                      <MdiIcon icon="mdiThumbUpOutline" :size="'20'" />
                    </div>
                    <p>{{ videoDetails.likes }}</p>
                  </div>
                  <div class="h-4 w-px bg-white"></div>
                  <div class="flex items-center gap-1 cursor-pointer">
                    <div class="pb-1">
                      <MdiIcon icon="mdiThumbDownOutline" :size="'20'" />
                    </div>
                  </div>
                </div>
                <div class="flex items-center gap-1 cursor-pointer bg-[#272727] rounded-full p-1">
                  <div class="pb-1">
                    <MdiIcon icon="mdiShareOutline" :size="'25'" />
                  </div>
                </div>
                <div class="flex items-center gap-1 cursor-pointer bg-[#272727] rounded-full p-2">
                  <MdiIcon icon="mdiDownloadOutline" :size="'25'" />
                </div>
                <div class="flex items-center gap-1 cursor-pointer bg-[#272727] rounded-full p-2">
                  <MdiIcon icon="mdiDotsHorizontal" :size="'20'" />
                </div>
              </div>
            </div>
          </div>
          <div class="mt-5 w-full">
            <VideoDescription :videoId="videoId" />
          </div>

          <div class="video-comments w-full bg-[#0F0F0F] text-gray-200 mt-5 overflow-auto">
            <VideoComments :videoId="videoId" />
          </div>
        </div>
      </div>
      <div class="recommended-video flex w-full md:max-w-[450px] bg-[#0F0F0F] text-gray-200 overflow-auto">
        <RecommendedVideos :searchQuery="searchQuery" />
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { fetchVideoDetails } from '../services/youtubeService';
import VideoDescription from '@/components/VideoDescription.vue';
import VideoComments from '../components/VideoComments.vue';
import RecommendedVideos from '../components/RecommendedVideos.vue';

export default defineComponent({
  components: {
    VideoDescription,
    VideoComments,
    RecommendedVideos,
  },
  props: {
    openSideNav: {
      type: Boolean,
      required: true,
    },
  },
  setup(props) {
    const route = useRoute();
    const router = useRouter();
    const videoId = route.params.id as string;
    const searchQuery = ref('');

    const videoDetails = ref({
      title: '',
      views: '',
      age: '',
      likes: '',
      description: '',
      channelImage: '',
      channelName: '',
      channelId: '',
      subscribers: '',
    });

    const videoSrc = computed(
      () => `https://www.youtube.com/embed/${videoId}?autoplay=1`
    );

    const goToChannelPage = () => {
      router.push({ path: `/channel/${videoDetails.value.channelId}` });
    };

    fetchVideoDetails(videoId).then((details) => {
      if (details) {
        videoDetails.value = details;
      }
    });

    return {
      videoSrc,
      videoDetails,
      videoId,
      searchQuery,
      goToChannelPage,
      openSideNav: props.openSideNav,
    };
  },
});
</script>

<style scoped>
.w-full {
  width: 100%;
}
.recommended-video::-webkit-scrollbar {
  display: none;
}
.video-player::-webkit-scrollbar {
  display: none;
}
body {
  background-color: #0f0f0f;
  margin: 0; /* Remove any default margin or padding */
}
</style>
