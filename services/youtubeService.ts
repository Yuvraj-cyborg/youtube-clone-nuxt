import { useRuntimeConfig } from '#app';

const API_BASE_URL = 'https://www.googleapis.com/youtube/v3';

// Fetch Video Details
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
      const snippet = data.items[0].snippet;
      const channelResponse = await fetch(
        `${API_BASE_URL}/channels?part=snippet&id=${snippet.channelId}&key=${apiKey}`
      );
      const channelData = await channelResponse.json();

      return {
        title: snippet.title,
        views: data.items[0].statistics.viewCount,
        age: snippet.publishedAt,  // Adjust if you need different data
        likes: data.items[0].statistics.likeCount,
        description: snippet.description,
        channelImage: channelData.items[0].snippet.thumbnails.default.url,
        channelName: snippet.channelTitle,
        subscribers: 'N/A',  // You may need a separate API call to get subscriber count
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching video details:', error);
    return null;
  }
};

// Fetch Comments
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

// Fetch Recommended Videos
export const fetchRecommendedVideos = async (videoId: string) => {
  const config = useRuntimeConfig();
  const apiKey = config.public.youtubeApiKey;

  try {
    const response = await fetch(
      `${API_BASE_URL}/search?relatedToVideoId=${videoId}&type=video&part=snippet&key=${apiKey}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      channelName: item.snippet.channelTitle,
      views: 'N/A',  // You might need another API call to get views count
      thumbnail: item.snippet.thumbnails.medium.url,
    }));
  } catch (error) {
    console.error('Error fetching recommended videos:', error);
    return [];
  }
};
