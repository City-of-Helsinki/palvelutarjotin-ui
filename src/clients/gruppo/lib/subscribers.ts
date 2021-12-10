// eslint-disable-next-line max-len
import { NewsletterSubscribeFormFields } from '../../../domain/newsletter/newsletterSubscribeForm/NewsletterSubscribeForm';
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
  ConsentToTrack: boolean;
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

export async function getDetails(groupId: string): Promise<SubscriberDetails> {
  const url = SUBSCRIBERS_ROUTES.DETAILS.replace(':groupId', groupId);
  return await axiosClient.get(url);
}

export async function addSubscriber(
  groupId: string,
  data: SubscriberFormFields
): Promise<string> {
  const url = SUBSCRIBERS_ROUTES.CREATE.replace(':groupId', groupId);
  return await axiosClient.post(url, JSON.stringify(data));
}

export async function unsubscribe(
  groupId: string,
  data: SubscriberBaseFields
): Promise<void> {
  const url = SUBSCRIBERS_ROUTES.UNSUBSCRIBE.replace(':groupId', groupId);
  await axiosClient.post(url, JSON.stringify(data));
}

export async function deleteSubscriber(
  groupId: string,
  email: string
): Promise<void> {
  const url = SUBSCRIBERS_ROUTES.DELETE.replace(':groupId', groupId).replace(
    ':email',
    email
  );
  await axiosClient.delete(url);
}

export function convertSubscribeFormData(
  data: NewsletterSubscribeFormFields
): SubscriberFormFields {
  return {
    EmailAddress: data.email,
    Name: `${data.firstName} ${data.lastName}`,
    Resubscribe: true,
    RestartSubscriptionBasedAutoresponders: true,
    ConsentToTrack: true,
  };
}
