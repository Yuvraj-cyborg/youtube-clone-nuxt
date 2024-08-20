<template>
  <div>
    <div
      id="TopNav"
      class="bg-black text-white w-full h-[60px] flex justify-between items-center z-20 p-4 fixed top-0 left-0"
    >
      <div class="flex items-center">
        <button
          @click="openSideNav = !openSideNav"
          class="p-2 ml-3 rounded-full hover:bg-gray-800 inline-block cursor-pointer"
        >
          <MdiIcon icon="mdiMenu" :size="26" />
        </button>
        <div class="mx-2"></div>
        <div
          class="flex text-white items-center justify-center mr-10 cursor-pointer font-roboto"
        >
          YOUTUBE
        </div>
      </div>

      <div class="w-[600px] md:block hidden">
        <div class="rounded-full flex items-center bg-[#222222]">
          <input
            type="text"
            class="form-control block w-full px-5 py-1.5 text-base font-normal text-gray-200 bg-black placeholder-gray-400 bg-clip-padding border border-solid border-l-gray-700 border-y-gray-700 rounded-l-full transition ease-in-out m-0 border-transparent focus:ring-0"
            placeholder="Search"
          />
          <MdiIcon icon="mdiMagnify" class="mx-6" :size="23" />
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
    <div
      id="SideNav"
      class="fixed top-[60px] left-0 h-[calc(100vh-60px)] bg-black z-10"
      :class="[!openSideNav ? 'w-[70px]' : 'w-[240px]']"
    >
      <ul :class="[!openSideNav ? 'p-2' : 'px-5 pb-2 pt-[7px]']" class="w-full">
        <SidenavItem :openSideNav="openSideNav" iconString="Home" />
        <SidenavItem :openSideNav="openSideNav" iconString="Add Video" />
        <SidenavItem :openSideNav="openSideNav" iconString="Delete Video" />
        <div class="border-b border-b-gray-700 my-2.5"></div>
        <SidenavItem :openSideNav="openSideNav" iconString="Music" />
        <SidenavItem :openSideNav="openSideNav" iconString="Sport" />
        <SidenavItem :openSideNav="openSideNav" iconString="Gaming" />
        <SidenavItem :openSideNav="openSideNav" iconString="Movies" />
        <SidenavItem :openSideNav="openSideNav" iconString="News" />
        <div v-if="openSideNav">
          <div class="border-b border-b-gray-700 my-2.5" />
          <div class="text-gray-400 text-[14px] font-extrabold">
            About Press Copyright
            <div>Contact us</div>
            Creator Advertise Developers
          </div>
          <div>c</div>
          <div class="text-gray-400 text-[14px] font-extrabold">
            Terms Privacy Policy & Safety
            <div>How Youtube works</div>
            <span>Test new features</span>
          </div>
        </div>
      </ul>
    </div>

    <div
      class="absolute right-0 top-[60px] h-[calc(100vh-60px)]"
      :class="{
        'w-[calc(100%-70px)]' : !openSideNav,
        'w-[calc(100%-240px)]': openSideNav,
      }"
    >
      <slot />
    </div>
  </div>
</template>


<script lang="ts" setup>
  let openSideNav = ref(true);
</script>

<style scoped>
</style>
