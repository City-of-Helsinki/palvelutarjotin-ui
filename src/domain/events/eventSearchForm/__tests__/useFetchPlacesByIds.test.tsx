import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';

import {
  PlaceQuery,
  PlaceDocument,
  PlaceFieldsFragment,
} from '../../../../generated/graphql';
import useFetchPlacesByIds from '../useFetchPlacesByIds';

interface MockPlaceInput {
  id: string;
  internalId: string;
  nameFi: string;
}

const createMockPlace = ({
  id,
  internalId,
  nameFi,
}: MockPlaceInput): PlaceFieldsFragment => ({
  __typename: 'Place',
  id,
  internalId,
  name: { __typename: 'LocalisedObject', fi: nameFi, en: null, sv: null },
  telephone: null,
  addressLocality: null,
  streetAddress: null,
});

const successfulMockIds = ['1', '2', '3'];

const generateSuccessfulMocks = (
  ids: string[]
): MockedResponse<PlaceQuery>[] => {
  return ids.map((id) => ({
    request: {
      query: PlaceDocument,
      variables: { id },
    },
    result: {
      data: {
        place: createMockPlace({ id, internalId: id, nameFi: `Place ${id}` }),
      },
    },
  }));
};

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MockedProvider mocks={[]}>{children}</MockedProvider>
);

describe('useFetchPlacesByIds Hook', () => {
  it('should fetch multiple places successfully', async () => {
    const { result } = renderHook(
      () => useFetchPlacesByIds(successfulMockIds),
      {
        wrapper: ({ children }) => (
          <MockedProvider mocks={generateSuccessfulMocks(successfulMockIds)}>
            {children}
          </MockedProvider>
        ),
        initialProps: { ids: successfulMockIds },
      }
    );

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBeNull();
    expect(result.current.places).toStrictEqual(
      successfulMockIds.map((id) =>
        createMockPlace({ id, internalId: id, nameFi: `Place ${id}` })
      )
    );
  });

  it('should handle an empty array of ids', async () => {
    const ids: string[] = []; // use obj as parameter to prevent forever loop
    const { result } = renderHook(() => useFetchPlacesByIds(ids), {
      wrapper,
      initialProps: { ids: [] },
    });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBeNull();
    expect(result.current.places).toEqual([]);
  });

  it('should handle undefined ids', async () => {
    const { result } = renderHook(() => useFetchPlacesByIds(undefined), {
      wrapper,
      initialProps: { ids: undefined },
    });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBeNull();
    expect(result.current.places).toEqual([]);
  });

  it('should handle a network error for one of the requests', async () => {
    const ids = ['1', '2', '3']; // use obj as parameter to prevent forever loop
    const { result } = renderHook(() => useFetchPlacesByIds(ids), {
      wrapper: ({ children }) => (
        <MockedProvider
          mocks={[
            {
              request: {
                query: PlaceDocument,
                variables: { id: '1' },
              },
              result: {
                data: { place: null },
                errors: [new Error('Network error')],
              },
            },
            ...generateSuccessfulMocks(['2', '3']),
          ]}
        >
          {children}
        </MockedProvider>
      ),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.places).toEqual([]);
  });

  it('should handle a GraphQL error (ApolloError)', async () => {
    const graphQLErrorMock: MockedResponse<PlaceQuery>[] = [
      {
        request: {
          query: PlaceDocument,
          variables: { id: '1' },
        },
        result: {
          errors: [
            {
              message: 'GraphQL error occurred',
              extensions: { code: 'GRAPHQL_ERROR' },
            },
          ],
        },
      },
      ...generateSuccessfulMocks(['2']),
    ];
    const ids = ['1', '2']; // use obj as parameter to prevent forever loop
    const { result } = renderHook(() => useFetchPlacesByIds(ids), {
      wrapper: ({ children }) => (
        <MockedProvider mocks={graphQLErrorMock}>{children}</MockedProvider>
      ),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.places).toEqual([]);
  });

  it('should handle a successful fetch with a null place', async () => {
    const ids = ['1', '2']; // use obj as parameter to prevent forever loop
    const { result } = renderHook(() => useFetchPlacesByIds(ids), {
      wrapper: ({ children }) => (
        <MockedProvider
          mocks={[
            {
              request: {
                query: PlaceDocument,
                variables: { id: '1' },
              },
              result: { data: { place: null } },
            },
            ...generateSuccessfulMocks(['2']),
          ]}
        >
          {children}
        </MockedProvider>
      ),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBeNull();
    expect(result.current.places).toStrictEqual(
      ['2'].map((id) =>
        createMockPlace({ id, internalId: id, nameFi: `Place ${id}` })
      )
    );
  });
});
