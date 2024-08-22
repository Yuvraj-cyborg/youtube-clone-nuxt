import { useRuntimeConfig } from '#app';

const API_BASE_URL = 'https://www.googleapis.com/youtube/v3';

export const fetchVideoDetails = async (videoId: string) => {
  const config = useRuntimeConfig();
  const apiKey = config.public.youtubeApiKey;

  try {
    const response = await fetch(
      `${API_BASE_URL}/videos?part=snippet,statistics&id=${videoId}&key=${apiKey}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    if (data.items.length > 0) {
      return {
        title: data.items[0].snippet.title,
        views: data.items[0].statistics.viewCount,
        age: data.items[0].snippet.publishedAt,  // Adjust if you need different data
        likes: data.items[0].statistics.likeCount,
        description: data.items[0].snippet.description,
        channelImage: data.items[0].snippet.thumbnails.default.url,
        channelName: data.items[0].snippet.channelTitle,
        subscribers: 'N/A',  // You may need a separate API call to get subscriber count
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching video details:', error);
    return null;
  }
};

export const fetchComments = async (videoId: string) => {
  const config = useRuntimeConfig();
  const apiKey = config.public.youtubeApiKey;

  try {
    const response = await fetch(
      `${API_BASE_URL}/commentThreads?part=snippet&videoId=${videoId}&key=${apiKey}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data.items;
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
};
