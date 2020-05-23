import { GoogleAutocompleteResult, GoogleParameters } from './types';

export default async function queryAddr(
  query: string, 
  paramters: GoogleParameters,
  signal: AbortSignal,
  sessionToken?: string, 
  fetchObserver?: (status: boolean) => void,
  errorObserver?: (res: GoogleAutocompleteResult) => void,
  ) : Promise<GoogleAutocompleteResult> {
    const { apiKey, offset, origin, location, radius, language, types, components, strictbounds } = paramters;

    let api = `https://maps.googleapis.com/maps/api/place/autocomplete/json?&key=${apiKey}&input=${query}`;

    if (sessionToken) {
      api = `${api}&sessiontoken=${sessionToken}`;
    }

    if (offset) {
      api = `${api}&offset=${offset}`;
    }

    if (origin) {
      api = `${api}&origin=${origin.latitude},${origin.longitude}`;
    }

    if (location) {
      api = `${api}&location=${location.latitude},${location.longitude}`;
    }

    if (radius) {
      api = `${api}&radius=${radius}`;
    }

    if (language) {
      api = `${api}&language=${language}`;
    }

    if (types) {
      api = `${api}&types=${types}`;
    }

    if (components) {
      const countries = components.join('|country:');
      api = `${api}&components=country:${countries}`;
    }

    if (strictbounds) {
      api = `${api}&strictbounds`;
    }
    
    // begin the fetch
    if(fetchObserver) fetchObserver(true);

    const res = await fetch(encodeURI(api), {signal});
    if (!res.ok) {
      if(fetchObserver) fetchObserver(false);
      return Promise.reject(res.statusText);
    }

    const json = await res.json();
    if(fetchObserver) fetchObserver(false);

    const result = (<GoogleAutocompleteResult>json);
    if(result.status.toLocaleLowerCase() !== 'ok') {
      if(errorObserver) errorObserver(result);
    }

    return result;
}