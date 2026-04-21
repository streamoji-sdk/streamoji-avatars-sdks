export type BodyType = 'Half' | 'Full';

export interface AvatarCreatorConfig {
  bodyType?: BodyType;
  whiteLabelTitle?: string;
  whiteLabelColor?: string;
  thumbnail?: boolean;
}

export interface AvatarExportedData {
  url: string;
  thumbnailUrl?: string;
}

export interface AvatarExportedEvent {
  source: 'streamojiavatars';
  eventName: 'v1.avatar.exported';
  data: AvatarExportedData;
}

export interface FrameReadyEvent {
  source: 'streamojiavatars';
  eventName: 'v1.frame.ready';
}

export type StreamojiEvent = AvatarExportedEvent | FrameReadyEvent;

export interface AvatarCreatorProps {
  token: string;
  config?: AvatarCreatorConfig;
  onReady?: () => void;
  onAvatarExported?: (data: AvatarExportedData) => void;
  onError?: (error: any) => void;
  style?: React.CSSProperties;
}
