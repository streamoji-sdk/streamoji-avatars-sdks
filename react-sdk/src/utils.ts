import { FetchStreamojiTokenParams, FetchStreamojiTokenResponse } from './types';

const STREAMOJI_TOKEN_URL = 'https://us-central1-streamoji-265f4.cloudfunctions.net/getAuthToken';

/**
 * Tries to parse the JSON data, and returns undefined if parsing fails.
 * @param jsonString The string to be parsed.
 * @returns The parsed JSON data or undefined if the data is not valid JSON.
 */
export const JSONTryParse = <T>(jsonString: unknown): T | undefined => {
  if (typeof jsonString !== 'string') return undefined;

  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    return undefined;
  }
};

/**
 * Helper to fetch a Streamoji auth token.
 * For production, call this on your backend so the client secret is not exposed in the browser.
 */
export const fetchStreamojiToken = async ({
  clientId,
  clientSecret,
  userId,
  userName,
}: FetchStreamojiTokenParams): Promise<FetchStreamojiTokenResponse> => {
  const response = await fetch(STREAMOJI_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Client-Id': clientId,
      'Client-Secret': clientSecret,
    },
    body: JSON.stringify({
      userId,
      userName,
    }),
  });

  const data = (await response.json()) as FetchStreamojiTokenResponse;

  if (!response.ok) {
    throw new Error((typeof data.error === 'string' && data.error) || 'Failed to fetch Streamoji auth token.');
  }

  return data;
};
