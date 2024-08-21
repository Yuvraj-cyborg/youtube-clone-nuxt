
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
    return data.items[0];
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
