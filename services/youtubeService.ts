import { useRuntimeConfig } from '#app';

const API_BASE_URL = 'https://www.googleapis.com/youtube/v3';

// Fetch Video Details
export const fetchVideoDetails = async (videoId: string): Promise<{
  title: string;
  views: string;
  age: string;
  likes: string;
  description: string;
  channelImage: string;
  channelName: string;
  channelId: string; // Added channelId here
  subscribers: string; // Fetching subscribers here
} | null> => {
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
      const channelId = snippet.channelId;

      // Fetch channel details to get subscriber count
      const channelResponse = await fetch(
        `${API_BASE_URL}/channels?part=snippet,statistics&id=${channelId}&key=${apiKey}`
      );
      const channelData = await channelResponse.json();

      return {
        title: snippet.title,
        views: data.items[0].statistics.viewCount,
        age: snippet.publishedAt,
        likes: data.items[0].statistics.likeCount,
        description: snippet.description,
        channelImage: channelData.items[0].snippet.thumbnails.default.url,
        channelName: snippet.channelTitle,
        channelId, // Adding channelId here
        subscribers: channelData.items[0].statistics.subscriberCount, // Fetching subscriber count
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching video details:', error);
    return null;
  }
};

// Fetch Comments
export const fetchComments = async (videoId: string): Promise<any[]> => {
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
export const fetchRecommendedVideos = async (videoId: string): Promise<{
  id: string;
  title: string;
  channelName: string;
  views: string;
  thumbnail: string;
}[]> => {
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
      views: 'N/A', // Placeholder until you implement fetching views
      thumbnail: item.snippet.thumbnails.medium.url,
    }));
  } catch (error) {
    console.error('Error fetching recommended videos:', error);
    return [];
  }
};

// Fetch Channel Details
export const fetchChannelDetails = async (channelId: string): Promise<{
  channelName: string;
  description: string;
  subscribers: string;
  videosCount: string;
  channelImage: string;
  bannerImage: string;
} | null> => {
  const config = useRuntimeConfig();
  const apiKey = config.public.youtubeApiKey;

  try {
    const response = await fetch(
      `${API_BASE_URL}/channels?part=snippet,statistics&id=${channelId}&key=${apiKey}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    if (data.items.length > 0) {
      const snippet = data.items[0].snippet;
      const statistics = data.items[0].statistics;

      return {
        channelName: snippet.title,
        description: snippet.description,
        subscribers: statistics.subscriberCount,
        videosCount: statistics.videoCount,
        channelImage: snippet.thumbnails.default.url,
        bannerImage: snippet.thumbnails.high.url,
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching channel details:', error);
    return null;
  }
};

// Fetch Channel Playlists
export const fetchChannelPlaylists = async (channelId: string): Promise<{
  id: string;
  title: string;
  thumbnail: string;
  description: string;
  videoCount: number; // Added videoCount here
}[]> => {
  const config = useRuntimeConfig();
  const apiKey = config.public.youtubeApiKey;

  try {
    const response = await fetch(
      `${API_BASE_URL}/playlists?part=snippet&channelId=${channelId}&maxResults=10&key=${apiKey}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();

    // Fetch video count for each playlist
    const playlists = await Promise.all(data.items.map(async (item: any) => {
      const details = await fetchPlaylistDetails(item.id);
      return {
        id: item.id,
        title: item.snippet.title,
        thumbnail: details.thumbnail,
        description: item.snippet.description,
        videoCount: details.videoCount, // Include videoCount here
      };
    }));

    return playlists;
  } catch (error) {
    console.error('Error fetching channel playlists:', error);
    return [];
  }
};

// Fetch Channel Videos
export const fetchChannelVideos = async (channelId: string): Promise<{
  id: string;
  title: string;
  thumbnail: string;
}[]> => {
  const config = useRuntimeConfig();
  const apiKey = config.public.youtubeApiKey;

  try {
    const response = await fetch(
      `${API_BASE_URL}/search?part=snippet&channelId=${channelId}&maxResults=10&type=video&key=${apiKey}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.medium.url,
    }));
  } catch (error) {
    console.error('Error fetching channel videos:', error);
    return [];
  }
};

export async function fetchPlaylistDetails(playlistId: string) {
  const config = useRuntimeConfig();
  const apiKey = config.public.youtubeApiKey;
  const response = await fetch(`https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&id=${playlistId}&key=${apiKey}`);
  const data = await response.json();
  const playlist = data.items[0];
  return {
    thumbnail: playlist.snippet.thumbnails.high.url,
    title: playlist.snippet.title,
    videoCount: playlist.contentDetails.itemCount
  };
}


export async function fetchPlaylistVideos(playlistId: string) {
  const config = useRuntimeConfig();
  const apiKey = config.public.youtubeApiKey;
  try {
    const response = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${playlistId}&maxResults=50&key=${apiKey}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();

    // Fetch channel details for each video
    const videoDetails = await Promise.all(
      data.items.map(async (item: any) => {
        const videoId = item.contentDetails.videoId;
        const videoResponse = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${apiKey}`);
        const videoData = await videoResponse.json();
        const video = videoData.items[0];
        
        // Fetch channel image
        const channelId = video.snippet.channelId;
        const channelResponse = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${apiKey}`);
        const channelData = await channelResponse.json();
        const channelImage = channelData.items[0].snippet.thumbnails.default.url;

        return {
          id: video.id,
          title: video.snippet.title,
          thumbnail: video.snippet.thumbnails.high.url,
          channelTitle: video.snippet.channelTitle,
          viewCount: video.statistics.viewCount || 'No views available',
          channelImage: channelImage
        };
      })
    );

    return videoDetails;
  } catch (error) {
    console.error('Error fetching playlist videos:', error);
    return [];
  }
}
