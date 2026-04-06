export type BodyType = 'Half' | 'Full';

export type Language = 'en' | 'en-IE' | 'de' | 'fr' | 'es' | 'es-MX' | 'it' | 'pt' | 'pt-BR' | 'tr' | 'ja' | 'kr' | 'ch';

export type AvatarCreatorConfig = {
  bodyType?: BodyType;
  language?: Language;
  token?: string;
  avatarId?: string;
  userId?: string;
  genderSelection?: boolean;
  saveConfirm?: boolean;
  whiteLabelTitle?: string;
  whiteLabelColor?: string;
  thumbnail?: boolean;
  downloadUrl?: boolean;
  hidePremiumAssets?: boolean;
};

export type IFrameEvent<TPayload> = {
  eventName?: string;
  source?: string;
  data: TPayload;
};
