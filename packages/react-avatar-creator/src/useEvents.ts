import { useEffect } from 'react';
import { StreamojiEvent } from './types';

export const useEvents = (callback: (event: StreamojiEvent) => void) => {
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      let json;
      try {
        json = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
      } catch (e) {
        return;
      }

      if (json?.source === 'streamojiavatars') {
        callback(json as StreamojiEvent);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [callback]);
};
