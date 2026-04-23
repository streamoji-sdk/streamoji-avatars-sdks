import React, { useRef, useEffect } from 'react';
import { AvatarCreatorProps, AvatarExportedEvent } from './types';

export const AvatarCreator: React.FC<AvatarCreatorProps> = ({ 
  token, 
  config, 
  onReady,
  onAvatarExported,
  onError,
  style 
}) => {
  const frameRef = useRef<HTMLIFrameElement>(null);

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
        onReady?.();
        // Automatically subscribe to events when frame is ready
        frameRef.current?.contentWindow?.postMessage(
          JSON.stringify({ 
            target: 'streamojiavatars', 
            type: 'subscribe', 
            eventName: 'v1.**' 
          }), 
          '*'
        );

        // Send config if present
        if (config) {
          frameRef.current?.contentWindow?.postMessage(
            JSON.stringify({ 
              target: 'streamojiavatars', 
              type: 'set.config', 
              data: config 
            }), 
            '*'
          );
        }
      }

      if (json.eventName === 'v1.avatar.exported') {
        onAvatarExported?.(json.data);
      }

      if (json.eventName === 'v1.error') {
        onError?.(json.data);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onAvatarExported, config]);

  const baseUrl = 'https://avatars.streamoji.com/createAvatar/';
  let url = `${baseUrl}?token=${token}&iframe=true`;

  if (config) {
    if (config.bodyType) url += `&bodyType=${config.bodyType}`;
    if (config.saveConfirm !== undefined) url += `&saveConfirm=${config.saveConfirm}`;
    if (config.thumbnail) url += '&thumbnail=true';
    if (config.whiteLabelTitle) url += `&whiteLabelTitle=${encodeURIComponent(config.whiteLabelTitle)}`;
    if (config.whiteLabelColor) url += `&whiteLabelColor=${encodeURIComponent(config.whiteLabelColor.replace('#', ''))}`;
  }

  const defaultStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    border: 'none',
    ...style
  };

  return (
    <iframe 
      ref={frameRef} 
      src={url} 
      style={defaultStyle}
      title="Streamoji Avatar Creator"
      allow="camera;microphone"
    />
  );
};
