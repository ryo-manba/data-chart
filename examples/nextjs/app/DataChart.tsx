'use client';
import { useEffect } from 'react';

export default function DataChart() {
  useEffect(() => {
    import('data-chart').then(() => {
      document.body.classList.add('ready');
    });
  }, []);
  return null;
}
