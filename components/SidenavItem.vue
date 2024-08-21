<template>
  <li
    :class="[!openSideNav ? 'p-2' : 'flex items-center p-2']"
    class="text-white text-sm font-semibold text-center hover:bg-gray-700 rounded-lg cursor-pointer"
    @click="handleClick"
  >
    <div :class="[!openSideNav ? 'w-full flex justify-center' : '']">
      <MdiIcon :icon="mdiIcon" :size="'26'" />
    </div>
    <div :class="[!openSideNav ? '' : 'mt-1 ml-4']">
      <span v-if="!openSideNav">{{ iconString ? iconString.substring(0, 4) : '' }}</span>
      <span v-else>{{ iconString || '' }}</span>
    </div>
  </li>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

type MdiIconNames = 'Home' | 'Music' | 'Sport' | 'Gaming' | 'Movies' | 'News';

export default defineComponent({
  props: {
    openSideNav: {
      type: Boolean,
      required: true,
    },
    iconString: {
      type: String,
      required: true,
    },
  },
  emits: ['search'],
  setup(props, { emit }) {
    const mdiIcons: Record<MdiIconNames, string> = {
      Home: 'mdiHome',
      Music: 'mdiMusicNoteEighth',
      Sport: 'mdiSoccer',
      Gaming: 'mdiController',
      Movies: 'mdiMovieOpen',
      News: 'mdiNewspaper',
    };

    const mdiIcon = computed(() => mdiIcons[props.iconString as MdiIconNames] || '');

    const handleClick = () => {
      emit('search', props.iconString);
    };

    return {
      mdiIcon,
      handleClick,
    };
  },
});
</script>

<style scoped>
</style>
