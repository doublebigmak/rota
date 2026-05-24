import { useState, useEffect } from 'react';

let cached = null;

export function useManifest() {
  const [manifest, setManifest] = useState(cached);
  const [loading, setLoading] = useState(!cached);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (cached) return;
    fetch('/content/manifest.json')
      .then((r) => {
        if (!r.ok) throw new Error(`Failed to load manifest: ${r.status}`);
        return r.json();
      })
      .then((data) => {
        cached = data;
        setManifest(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const getSubject = (id) => manifest?.subjects?.find((s) => s.id === id) ?? null;

  return { manifest, loading, error, getSubject };
}
