import { useApolloClient, ApolloError } from '@apollo/client';
import { useState, useEffect, useCallback, useRef } from 'react';

import {
  PlaceDocument,
  PlaceFieldsFragment,
  PlaceQuery,
} from '../../../generated/graphql';

/**
 * Custom React hook to fetch multiple places by their IDs using Apollo Client.
 *
 * @param ids - An optional array of place IDs to fetch.
 * - If provided, the hook fetches places with these IDs.
 * - If `undefined` or an empty array is provided, the hook does not perform any fetching and returns initial state.
 * @returns An object containing the fetched places, loading state, and any error that occurred during the fetch.
 */
function useFetchPlacesByIds(ids?: string[]) {
  const client = useApolloClient();
  const [places, setPlaces] = useState<PlaceFieldsFragment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApolloError | Error | null>(null);
  const abortControllersRef = useRef<AbortController[]>([]);

  const fetchPlaces = useCallback(
    async (placeIds: string[]) => {
      // Handle the case where no IDs are provided.  This prevents unnecessary API calls.
      if (!placeIds || placeIds.length === 0) {
        setPlaces([]);
        setLoading(false);
        return;
      }

      // Initialize loading state and clear any previous errors.
      setLoading(true);
      setError(null);
      abortControllersRef.current = []; // Reset AbortControllers for a new fetch

      try {
        // Create an AbortController for each query.  This allows us to cancel the requests if needed.
        const controllers = placeIds.map(() => new AbortController());
        abortControllersRef.current = controllers; // Store AbortControllers

        // Execute the Apollo Client queries in parallel.
        const promises = placeIds.map((id, index) =>
          client.query<PlaceQuery>({
            query: PlaceDocument,
            variables: { id },
            // Pass the AbortController's signal to the fetchOptions.
            context: { fetchOptions: { signal: controllers[index].signal } },
          })
        );

        // Wait for all queries to complete.
        const results = await Promise.all(promises);

        // Process the results.  Extract the place data and filter out any null values.
        const fetchedPlaces: PlaceFieldsFragment[] = results
          .map((result) => result.data?.place)
          .filter((place): place is PlaceFieldsFragment => !!place);

        setPlaces(fetchedPlaces);
      } catch (err: unknown) {
        // Handle errors during the fetch.  If an error occurs, abort any pending requests.
        abortControllersRef.current.forEach((controller) => controller.abort());

        if (err instanceof ApolloError || err instanceof Error) {
          setError(err);
        } else {
          setError(new Error('An unexpected error occurred'));
        }
      } finally {
        setLoading(false);
        abortControllersRef.current = [];
      }
    },
    [client]
  );

  useEffect(() => {
    if (ids?.length) {
      fetchPlaces(ids);
    }

    // Cleanup function to abort any pending requests when the component unmounts or the 'ids' change.
    return () => {
      abortControllersRef.current.forEach((controller) => controller.abort());
      abortControllersRef.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); //  This useEffect should only run when the component mounts and unmounts.

  return { places, loading, error };
}

export default useFetchPlacesByIds;
