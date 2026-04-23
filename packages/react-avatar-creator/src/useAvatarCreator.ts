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
  let url = `${baseUrl}?token=${token}&iframe=true`;

  if (config) {
    if (config.bodyType) url += `&bodyType=${config.bodyType}`;
    if (config.saveConfirm !== undefined) url += `&saveConfirm=${config.saveConfirm}`;
    if (config.thumbnail) url += '&thumbnail=true';
    if (config.whiteLabelTitle) url += `&whiteLabelTitle=${encodeURIComponent(config.whiteLabelTitle)}`;
    if (config.whiteLabelColor) url += `&whiteLabelColor=${encodeURIComponent(config.whiteLabelColor.replace('#', ''))}`;
  }

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
