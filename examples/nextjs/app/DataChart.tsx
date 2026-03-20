'use client';
import { useEffect } from 'react';

export default function DataChart() {
  useEffect(() => {
    import('data-chart');
  }, []);
  return null;
}
