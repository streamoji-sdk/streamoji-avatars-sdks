import { StreamojiEvent } from '../types';

export type AssetUnlockedEventPayload = {
  userId: string;
  assetId: string;
};

export type AssetUnlockedEvent = StreamojiEvent<AssetUnlockedEventPayload>;
