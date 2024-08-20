<template>
  <div>
    <div id="TopNav">
      <NavigationBar />
    </div>
    <div id="SideNav">
      <SidenavItem />
    </div>
    <div id="Content">
      <NuxtPage />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  components: {
    SidenavItem: () => import('~/components/SidenavItem.vue'),
  },
});
</script>

<style scoped>

</style>
