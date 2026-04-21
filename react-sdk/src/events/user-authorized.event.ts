import { StreamojiEvent } from '../types';

export type UserAuthorizedEventPayload = {
  url: string;
};

export type UserAuthorizedEvent = StreamojiEvent<UserAuthorizedEventPayload>;
