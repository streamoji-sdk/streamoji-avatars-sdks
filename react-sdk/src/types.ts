import { CSSProperties } from 'react';

export type BodyType = 'Half' | 'Full';

export type AvatarCreatorConfig = {
  bodyType?: BodyType;
  whiteLabelTitle?: string;
  whiteLabelColor?: string;
  saveConfirm?: boolean;
  thumbnail?: boolean;
};

export type AvatarExportedData = {
  url: string;
  avatarId: string;
  userId?: string;
  thumbnailUrl?: string;
  avatarGender?: string;
  [key: string]: unknown;
};

export type StreamojiEvent<TPayload = unknown> = {
  eventName?: string;
  source?: string;
  data?: TPayload;
};

export type IFrameEvent<TPayload = unknown> = StreamojiEvent<TPayload>;

export type AvatarCreatorProps = {
  token: string;
  onAvatarExported?: (data: AvatarExportedData) => void;
  onReady?: () => void;
  config?: AvatarCreatorConfig;
  style?: CSSProperties;
  className?: string;
};

export type FetchStreamojiTokenParams = {
  clientId: string;
  clientSecret: string;
  userId: string;
  userName: string;
};

export type FetchStreamojiTokenResponse = {
  success?: boolean;
  authToken?: string;
  [key: string]: unknown;
};
