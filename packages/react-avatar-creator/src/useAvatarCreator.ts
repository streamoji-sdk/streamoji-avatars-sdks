import { useState, useCallback, useEffect } from 'react';
import { StreamojiEvent, AvatarCreatorConfig } from './types';

export interface UseAvatarCreatorProps {
  token: string;
  config?: AvatarCreatorConfig;
  onEvent?: (event: StreamojiEvent) => void;
}

export const useAvatarCreator = ({ token, config, onEvent }: UseAvatarCreatorProps) => {
  const [isReady, setIsReady] = useState(false);

  const baseUrl = 'https://avatars.streamoji.com/createAvatar/';
  const url = `${baseUrl}?token=${token}&iframe=true`;

  const subscribe = useCallback((frameWindow: Window) => {
    frameWindow.postMessage(
      JSON.stringify({ 
        target: 'streamojiavatars', 
        type: 'subscribe', 
        eventName: 'v1.**' 
      }), 
      '*'
    );
  }, []);

  const setConfig = useCallback((frameWindow: Window, newConfig: AvatarCreatorConfig) => {
    frameWindow.postMessage(
      JSON.stringify({ 
        target: 'streamojiavatars', 
        type: 'set.config', 
        data: newConfig 
      }), 
      '*'
    );
  }, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      let json;
      try {
        json = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
      } catch (e) {
        return;
      }

      if (json?.source !== 'streamojiavatars') return;

      if (json.eventName === 'v1.frame.ready') {
        setIsReady(true);
      }

      if (onEvent) {
        onEvent(json as StreamojiEvent);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onEvent]);

  return {
    url,
    isReady,
    subscribe,
    setConfig
  };
};
