import { StreamojiEvent } from '../types';

export type UserSetEventPayload = {
  id: string;
};

export type UserSetEvent = StreamojiEvent<UserSetEventPayload>;
