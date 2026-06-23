'use client';

import { useEffect, useState } from 'react';

export interface StreamItem {
  id: string;
  label: string;
}

const FALLBACK_STREAMS: StreamItem[] = [
  { id: 'engineering', label: 'Engineering' },
  { id: 'medical-science', label: 'Medical Science' },
  { id: 'paramedical', label: 'Paramedical' },
  { id: 'arts-and-humanities', label: 'Arts and Humanities' },
  { id: 'commerce', label: 'Commerce' },
  { id: 'management', label: 'Management' },
];

export default function useStreams() {
  const [streams, setStreams] = useState<StreamItem[]>(FALLBACK_STREAMS);

  useEffect(() => {
    const fetchStreams = async () => {
      try {
        const apiBase =
          process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

        const response = await fetch(`${apiBase}/streams`, {
          cache: 'no-store',
        });

        if (!response.ok) return;

        const data = await response.json();

        if (Array.isArray(data)) {
          setStreams(
            data.map((item: unknown, index: number): StreamItem => {
              const stream = item as Partial<StreamItem> & {
                name?: string;
                _id?: string;
              };

              return {
                id:
                  stream.id ||
                  stream._id ||
                  `stream-${index}`,
                label:
                  stream.label ||
                  stream.name ||
                  `Stream ${index + 1}`,
              };
            })
          );
          return;
        }

        if (data?.success && Array.isArray(data.data)) {
          setStreams(
            data.data.map((item: unknown, index: number): StreamItem => {
              const stream = item as Partial<StreamItem> & {
                name?: string;
                _id?: string;
              };

              return {
                id:
                  stream.id ||
                  stream._id ||
                  `stream-${index}`,
                label:
                  stream.label ||
                  stream.name ||
                  `Stream ${index + 1}`,
              };
            })
          );
        }
      } catch {
        setStreams(FALLBACK_STREAMS);
      }
    };

    fetchStreams();
  }, []);

  return { streams };
}