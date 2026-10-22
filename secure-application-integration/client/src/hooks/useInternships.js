import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '../services/api.js';

const EMPTY_PARAMS = {};

export function useInternships(initialParams = EMPTY_PARAMS) {
  const [internships, setInternships] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const requestSequence = useRef(0);

  const loadInternships = useCallback(async (params = initialParams) => {
    const requestId = ++requestSequence.current;
    setLoading(true);
    setError('');
    try {
      const result = await api.getInternships(params);
      if (requestId === requestSequence.current) {
        setInternships(result.data);
        setCategories(result.meta.categories || []);
      }
    } catch (requestError) {
      if (requestId === requestSequence.current) {
        setError(requestError.name === 'AbortError'
          ? 'The request timed out. Please try again.'
          : requestError.message || 'Could not load internships.');
      }
    } finally {
      if (requestId === requestSequence.current) setLoading(false);
    }
  }, [initialParams]);

  useEffect(() => {
    loadInternships();
  }, [loadInternships]);

  return { internships, categories, loading, error, reload: loadInternships };
}
