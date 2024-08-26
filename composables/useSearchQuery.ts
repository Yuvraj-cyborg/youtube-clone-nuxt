import { useState } from '#app';

export function useSearchQuery() {
  const searchQuery = useState('searchQuery', () => '');

  return {
    searchQuery
  };
}
