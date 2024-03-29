import { AxiosResponse } from 'axios';

import { NewsletterSubscribeFormFields } from '../../../domain/newsletter/newsletterSubscribeForm/constants';
import axiosClient, { SUBSCRIBERS_ROUTES } from '../gruppoClient';
export type SubscriberFormCustomField = {
  Key: string;
  Value: string;
};

export type SubscriberBaseFields = {
  EmailAddress: string;
};

export type SubscriberFormFields = SubscriberBaseFields & {
  Name: string;
  CustomFields?: SubscriberFormCustomField[];
  Resubscribe: boolean;
  RestartSubscriptionBasedAutoresponders: boolean;
  ConsentToTrack: string;
};

export type SubscriberDetails = {
  EmailAddress: string;
  Name: string;
  Date: string;
  State: string;
  CustomFields: SubscriberFormCustomField[];
  ReadsEmailWith: string;
  ConsentToTrack: string;
};

export function getDetails(
  groupId: string,
  email: string
): Promise<AxiosResponse<SubscriberDetails>> {
  const url = SUBSCRIBERS_ROUTES.DETAILS.replace(':groupId', groupId).replace(
    ':email',
    email
  );
  return axiosClient.get(url);
}

export function addSubscriber(
  groupId: string,
  data: SubscriberFormFields
): Promise<AxiosResponse<string>> {
  const url = SUBSCRIBERS_ROUTES.CREATE.replace(':groupId', groupId);
  return axiosClient.post(url, JSON.stringify(data));
}

export async function unsubscribe(
  groupId: string,
  data: SubscriberBaseFields
): Promise<void> {
  const url = SUBSCRIBERS_ROUTES.UNSUBSCRIBE.replace(':groupId', groupId);
  axiosClient.post(url, JSON.stringify(data));
}

export async function deleteSubscriber(
  groupId: string,
  email: string
): Promise<AxiosResponse> {
  const url = SUBSCRIBERS_ROUTES.DELETE.replace(':groupId', groupId).replace(
    ':email',
    email
  );
  return axiosClient.delete(url);
}

export function convertSubscribeFormData(
  data: NewsletterSubscribeFormFields
): SubscriberFormFields {
  return {
    EmailAddress: data.email,
    Name: `${data.firstName} ${data.lastName}`,
    Resubscribe: true,
    RestartSubscriptionBasedAutoresponders: true,
    ConsentToTrack: 'No', // TODO: COOKIE CONSENT
  };
}
