export default defineNuxtConfig({
  css: ['~/assets/css/main.css'],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
    mdi: {
      componentName: 'MdiIcon',
      defaultSize: '1em'
    },
  modules: ["nuxt-mdi"],
  runtimeConfig: {
    public: {
      youtubeApiKey: process.env.YOUTUBE_API_KEY, 
    },
  },
});