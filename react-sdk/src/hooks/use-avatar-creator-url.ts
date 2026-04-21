import { useMemo } from 'react';
import { AvatarCreatorConfig } from '../types';

export const useAvatarCreatorUrl = (token: string, config?: AvatarCreatorConfig): string => {
  return useMemo(() => {
    const params = new URLSearchParams({
      iframe: 'true',
      token,
    });

    if (config?.bodyType) params.set('bodyType', config.bodyType);
    if (config?.whiteLabelTitle) params.set('whiteLabelTitle', config.whiteLabelTitle);
    if (config?.whiteLabelColor) params.set('whiteLabelColor', config.whiteLabelColor.replace('#', ''));
    if (config?.saveConfirm) params.set('saveConfirm', 'true');
    if (config?.thumbnail) params.set('thumbnail', 'true');

    return `https://avatars.streamoji.com/createAvatar/?${params.toString()}`;
  }, [config, token]);
};
