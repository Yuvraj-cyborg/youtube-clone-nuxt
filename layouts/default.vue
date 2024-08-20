<template>
  <div>
    <div id="TopNav">
      <NavigationBar @search="handleSearchQuery" />
    </div>
    <div id="SideNav">
      <SidenavItem />
    </div>
    <div id="Content">
      <NuxtPage :searchQuery="searchQuery" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  components: {
    SidenavItem: () => import('~/components/SidenavItem.vue'),
  },
  setup() {
    const searchQuery = ref('');

    const handleSearchQuery = (query: string) => {
      searchQuery.value = query;
    };

    return { searchQuery, handleSearchQuery };
  },
});
</script>

<style scoped>

</style>
