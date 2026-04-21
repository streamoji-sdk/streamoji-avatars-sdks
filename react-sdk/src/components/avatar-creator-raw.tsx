import React, { CSSProperties, FC, useCallback, useEffect, useRef } from 'react';
import { AvatarCreatorConfig, IFrameEvent } from '../types';
import { useAvatarCreatorUrl } from '../hooks/use-avatar-creator-url';
import { JSONTryParse } from '../utils';

const STREAMOJI_TARGET = 'streamojiavatars';
const FRAME_READY_EVENT = 'v1.frame.ready';

export type AvatarCreatorRawProps = {
  token: string;
  className?: string;
  style?: CSSProperties;
  config?: AvatarCreatorConfig;
  onReady?: () => void;
};

export type EventReceivedProps = {
  onEventReceived?: (event: IFrameEvent) => void;
};

export const AvatarCreatorRaw: FC<AvatarCreatorRawProps & EventReceivedProps> = ({ token, className, style, config, onReady, onEventReceived }) => {
  const frameRef = useRef<HTMLIFrameElement | null>(null);
  const src = useAvatarCreatorUrl(token, config);

  const subscribeToEvents = useCallback(() => {
    frameRef.current?.contentWindow?.postMessage(
      JSON.stringify({
        target: STREAMOJI_TARGET,
        type: 'subscribe',
        eventName: 'v1.**',
      }),
      '*'
    );
  }, []);

  const handleMessage = useCallback(
    (event: MessageEvent) => {
      const parsedMessage = JSONTryParse<IFrameEvent>(event.data);

      if (parsedMessage?.source !== STREAMOJI_TARGET) return;

      if (parsedMessage.eventName === FRAME_READY_EVENT) {
        subscribeToEvents();
        onReady?.();
      }

      onEventReceived?.(parsedMessage);
    },
    [onEventReceived, onReady, subscribeToEvents]
  );

  useEffect(() => {
    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [handleMessage]);

  return <iframe ref={frameRef} title="Streamoji Avatar Creator" src={src} style={style} className={className} allow="camera *; microphone *; clipboard-write" />;
};
