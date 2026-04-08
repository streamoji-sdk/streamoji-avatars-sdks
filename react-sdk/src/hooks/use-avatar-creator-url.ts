import { AvatarCreatorConfig } from '../types';
import { useMemo } from 'react';

export const useAvatarCreatorUrl = (subdomain: string, config: AvatarCreatorConfig | undefined): string => {
  return useMemo(() => {
    let url = `https://avatars.streamoji.com/createAvatar?iframe=true`;

    if (config?.bodyType) url += `&bodyType=${config?.bodyType}`;
    if (config?.token) url += `&token=${config?.token}`;
    if (config?.avatarId) url += `&avatarId=${config?.avatarId}`;
    if (config?.userId) url += `&userId=${config?.userId}`;
    if (config?.genderSelection) url += `&genderSelection=true`;
    if (config?.saveConfirm) url += `&saveConfirm=true`;
    if (config?.whiteLabelTitle) url += `&whiteLabelTitle=${encodeURIComponent(config.whiteLabelTitle)}`;
    if (config?.whiteLabelColor) url += `&whiteLabelColor=${encodeURIComponent(config.whiteLabelColor.replace('#', ''))}`;
    if (config?.thumbnail) url += `&thumbnail=true`;
    if (config?.downloadUrl) url += `&downloadUrl=true`;
    if (config?.hidePremiumAssets) url += `&hidePremiumAssets=true`;
    if (config?.language) url += `&language=${config?.language}`;

    return url;
  }, [subdomain, config]);
};
