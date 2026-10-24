import { useEffect, useState } from 'react';

const PHOTOS_URL = 'https://picsum.photos/v2/list?limit=30';

export default function useFetchPhotos() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function fetchPhotos() {
      try {
        const response = await fetch(PHOTOS_URL, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Photo request failed (${response.status}).`);
        }

        const data = await response.json();
        setPhotos(data);
      } catch (requestError) {
        if (requestError.name !== 'AbortError') {
          setError('Photos could not be loaded. Please try again later.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchPhotos();
    return () => controller.abort();
  }, []);

  return { photos, loading, error };
}
