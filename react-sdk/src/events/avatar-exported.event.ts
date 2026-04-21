import { AvatarExportedData, StreamojiEvent } from '../types';

export type AvatarExportedEventPayload = AvatarExportedData;

export type AvatarExportedEvent = StreamojiEvent<AvatarExportedEventPayload>;
