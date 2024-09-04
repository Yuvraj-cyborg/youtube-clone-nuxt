<template>
  <div>
    <!-- Top Navigation Bar -->
    <div
      id="TopNav"
      class="bg-[#0F0F0F] text-white w-full h-[60px] flex justify-between items-center z-20 p-4 fixed top-0 left-0"
    >
      <div class="flex items-center">
        <button
          @click="toggleSideNav"
          class="p-2 ml-3 rounded-full hover:bg-gray-800 inline-block cursor-pointer"
        >
          <MdiIcon icon="mdiMenu" :size="'26'" />
        </button>
        <div class="mx-2"></div>
        
        <!-- Logo Section with Router Link -->
        <router-link to="/" class="flex text-white items-center justify-center mr-10 cursor-pointer font-roboto gap-0.5">
          <img src="~/assets/images/YT-logo.png" alt="" width="36" />
          <img src="~/assets/images/YT-logo-text.png" alt="" width="70" />
        </router-link>

      </div>

      <div class="w-[600px] md:block hidden">
        <div class="rounded-full flex items-center bg-[#222222]">
          <input
            v-model="localSearchQuery"
            @keydown.enter="handleSearchBarEnter"
            type="text"
            class="form-control block w-full px-5 py-1.5 text-base font-normal text-gray-200 bg-black placeholder-gray-400 bg-clip-padding border border-solid border-l-gray-700 border-y-gray-700 rounded-l-full transition ease-in-out m-0 border-transparent focus:ring-0"
            placeholder="Search"
          />
          <MdiIcon icon="mdiMagnify" class="mx-6 cursor-pointer" :size="'23'" @click="emitSearchQuery" />
        </div>
      </div>

      <div>
        <img
          class="rounded-full mx-8"
          width="35"
          src="https://yt3.ggpht.com/HJAvMWrupeAICkvhD24ukW7m68_8cAu_9YOKBsbgVOE_Ti636ucJq4o_P6f3uNGsuxdbpAJUKw=s88-c-k-c0x00ffffff-no-rj"
          alt="pfp"
        />
      </div>
    </div>

    <!-- Sidebar Navigation -->
    <div
      id="SideNav"
      class="fixed top-[60px] left-0 h-[calc(100vh-60px)] bg-[#0F0F0F] z-10 transition-all duration-300"
      :class="openSideNav ? 'w-[240px]' : 'w-0'"
    >
      <ul v-if="openSideNav" class="p-5">
        <SidenavItem :openSideNav="openSideNav" iconString="Home"/>
        <SidenavItem :openSideNav="openSideNav" iconString="Music"  />
        <SidenavItem :openSideNav="openSideNav" iconString="Sport"  />
        <SidenavItem :openSideNav="openSideNav" iconString="Gaming"  />
        <SidenavItem :openSideNav="openSideNav" iconString="Movies"  />
        <SidenavItem :openSideNav="openSideNav" iconString="News" />
        <div class="border-b border-b-gray-700 my-2.5"></div>
        <div class="text-gray-400 text-[14px] font-bold">
          About Press Copyright
          <div>Contact us</div>
          Creator Advertise Developers
        </div>
        <div class="text-gray-400 text-[14px] font-bold">
          Terms Privacy Policy & Safety
          <div>How Youtube works</div>
          <span>Test new features</span>
        </div>
      </ul>
    </div>

    <!-- Main Content Area -->
    <div
      id="content"
      class="transition-all duration-300"
      :class="openSideNav ? 'ml-[240px]' : 'ml-0'"
    >
      <NuxtPage :searchQuery="searchQuery" /><!-- This is where your main content will be displayed -->
    </div>
  </div>
</template>




<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useSearchQuery } from '@/composables/useSearchQuery'; // Import the composable

const openSideNav = ref(true);
const showLocalSearchQuery = ref(true); // Flag to control visibility
const { searchQuery } = useSearchQuery();
const localSearchQuery = ref(''); // Local state for input

const router = useRouter();

const toggleSideNav = () => {
  openSideNav.value = !openSideNav.value;
};

// Function to handle enter key in search bar
const handleSearchBarEnter = () => {
  emitSearchQuery();
};

// Function to handle search when clicked in the search bar
const emitSearchQuery = () => {
  searchQuery.value = localSearchQuery.value; // Update global search query
  router.push({ path: '/', query: { search: localSearchQuery.value } }); // Redirect with query
  showLocalSearchQuery.value = true; // Ensure local search query is visible
};


</script>


<style scoped>
#content {
  padding-top: 60px; /* Ensure content doesn't overlap with TopNav */
}
</style>
