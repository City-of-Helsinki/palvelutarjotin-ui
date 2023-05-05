import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
  DateTime: any;
  JSONString: any;
  Time: any;
  Upload: any;
};

export type AddEventMutation = {
  __typename?: 'AddEventMutation';
  response?: Maybe<EventMutationResponse>;
};

export type AddEventMutationInput = {
  audience?: InputMaybe<Array<IdObjectInput>>;
  audienceMaxAge?: InputMaybe<Scalars['String']>;
  audienceMinAge?: InputMaybe<Scalars['String']>;
  customData?: InputMaybe<Scalars['String']>;
  datePublished?: InputMaybe<Scalars['String']>;
  description: LocalisedObjectInput;
  /** Set to `true` to save event as draft version, when draft is true, event data validation will be skipped */
  draft?: InputMaybe<Scalars['Boolean']>;
  endTime?: InputMaybe<Scalars['String']>;
  enrolmentEndTime?: InputMaybe<Scalars['String']>;
  enrolmentStartTime?: InputMaybe<Scalars['String']>;
  eventStatus?: InputMaybe<Scalars['String']>;
  externalLinks?: InputMaybe<Array<Scalars['String']>>;
  images?: InputMaybe<Array<IdObjectInput>>;
  inLanguage?: InputMaybe<Array<IdObjectInput>>;
  infoUrl?: InputMaybe<LocalisedObjectInput>;
  keywords: Array<IdObjectInput>;
  localizationExtraInfo?: InputMaybe<LocalisedObjectInput>;
  location?: InputMaybe<IdObjectInput>;
  maximumAttendeeCapacity?: InputMaybe<Scalars['Int']>;
  minimumAttendeeCapacity?: InputMaybe<Scalars['Int']>;
  name: LocalisedObjectInput;
  offers: Array<OfferInput>;
  /** Organisation global id which the created event belongs to */
  organisationId: Scalars['String'];
  /** Palvelutarjotin event data */
  pEvent: PalvelutarjotinEventInput;
  provider?: InputMaybe<LocalisedObjectInput>;
  providerContactInfo?: InputMaybe<Scalars['String']>;
  remainingAttendeeCapacity?: InputMaybe<Scalars['Int']>;
  shortDescription: LocalisedObjectInput;
  startTime: Scalars['String'];
  subEvents?: InputMaybe<Array<Scalars['String']>>;
  superEvent?: InputMaybe<Scalars['String']>;
  superEventType?: InputMaybe<Scalars['String']>;
};

export type AddOccurrenceMutationInput = {
  amountOfSeats: Scalars['Int'];
  clientMutationId?: InputMaybe<Scalars['String']>;
  contactPersons?: InputMaybe<Array<InputMaybe<PersonNodeInput>>>;
  endTime: Scalars['DateTime'];
  languages: Array<InputMaybe<LanguageInput>>;
  maxGroupSize?: InputMaybe<Scalars['Int']>;
  minGroupSize?: InputMaybe<Scalars['Int']>;
  pEventId: Scalars['ID'];
  placeId?: InputMaybe<Scalars['String']>;
  seatType?: InputMaybe<SeatType>;
  startTime: Scalars['DateTime'];
};

export type AddOccurrenceMutationPayload = {
  __typename?: 'AddOccurrenceMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  occurrence?: Maybe<OccurrenceNode>;
};

export type AddOrganisationMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  phoneNumber?: InputMaybe<Scalars['String']>;
  publisherId?: InputMaybe<Scalars['String']>;
  type: OrganisationTypeEnum;
};

export type AddOrganisationMutationPayload = {
  __typename?: 'AddOrganisationMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  organisation?: Maybe<OrganisationNode>;
};

export type AddStudyGroupMutationInput = {
  amountOfAdult?: InputMaybe<Scalars['Int']>;
  clientMutationId?: InputMaybe<Scalars['String']>;
  extraNeeds?: InputMaybe<Scalars['String']>;
  groupName?: InputMaybe<Scalars['String']>;
  groupSize: Scalars['Int'];
  /** If person input doesn't include person id, a new person object will be created */
  person: PersonNodeInput;
  studyLevels?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  unitId?: InputMaybe<Scalars['String']>;
  unitName?: InputMaybe<Scalars['String']>;
};

export type AddStudyGroupMutationPayload = {
  __typename?: 'AddStudyGroupMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  studyGroup?: Maybe<StudyGroupNode>;
};

export type AddVenueMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  hasAreaForGroupWork: Scalars['Boolean'];
  hasClothingStorage: Scalars['Boolean'];
  hasIndoorPlayingArea: Scalars['Boolean'];
  hasOutdoorPlayingArea: Scalars['Boolean'];
  hasSnackEatingPlace: Scalars['Boolean'];
  hasToiletNearby: Scalars['Boolean'];
  /** Place id from linked event */
  id: Scalars['ID'];
  outdoorActivity: Scalars['Boolean'];
  translations?: InputMaybe<Array<InputMaybe<VenueTranslationsInput>>>;
};

export type AddVenueMutationPayload = {
  __typename?: 'AddVenueMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  venue?: Maybe<VenueNode>;
};

export type ApproveEnrolmentMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  customMessage?: InputMaybe<Scalars['String']>;
  enrolmentId: Scalars['ID'];
};

export type ApproveEnrolmentMutationPayload = {
  __typename?: 'ApproveEnrolmentMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  enrolment?: Maybe<EnrolmentNode>;
};

export type CancelEnrolmentMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Need to be included to actually cancel the enrolment,without this token, BE only initiate thecancellation process by sending a confirmation email to teacher */
  token?: InputMaybe<Scalars['String']>;
  uniqueId: Scalars['ID'];
};

export type CancelEnrolmentMutationPayload = {
  __typename?: 'CancelEnrolmentMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  enrolment?: Maybe<EnrolmentNode>;
};

export type CancelOccurrenceMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  reason?: InputMaybe<Scalars['String']>;
};

export type CancelOccurrenceMutationPayload = {
  __typename?: 'CancelOccurrenceMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  occurrence?: Maybe<OccurrenceNode>;
};

export type CreateMyProfileMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  emailAddress: Scalars['String'];
  /** Default `fi` */
  language?: InputMaybe<Language>;
  name: Scalars['String'];
  /** Propose a new organisation being added. Used with 3rd party organisations */
  organisationProposals?: InputMaybe<Array<InputMaybe<OrganisationProposalNodeInput>>>;
  organisations?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  phoneNumber?: InputMaybe<Scalars['String']>;
  placeIds?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type CreateMyProfileMutationPayload = {
  __typename?: 'CreateMyProfileMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  myProfile?: Maybe<PersonNode>;
};

export type DeclineEnrolmentMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  customMessage?: InputMaybe<Scalars['String']>;
  enrolmentId: Scalars['ID'];
};

export type DeclineEnrolmentMutationPayload = {
  __typename?: 'DeclineEnrolmentMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  enrolment?: Maybe<EnrolmentNode>;
};

export type DeleteEventMutation = {
  __typename?: 'DeleteEventMutation';
  response?: Maybe<EventMutationResponse>;
};

export type DeleteImageMutation = {
  __typename?: 'DeleteImageMutation';
  response?: Maybe<ImageMutationResponse>;
};

export type DeleteOccurrenceMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
};

export type DeleteOccurrenceMutationPayload = {
  __typename?: 'DeleteOccurrenceMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
};

export type DeleteStudyGroupMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
};

export type DeleteStudyGroupMutationPayload = {
  __typename?: 'DeleteStudyGroupMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
};

export type DeleteVenueMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Place id from linked event */
  id: Scalars['ID'];
};

export type DeleteVenueMutationPayload = {
  __typename?: 'DeleteVenueMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
};

export type Division = {
  __typename?: 'Division';
  municipality?: Maybe<Scalars['String']>;
  name?: Maybe<LocalisedObject>;
  /** Open Civic Data ID */
  ocdId?: Maybe<Scalars['String']>;
  type: Scalars['String'];
};

export type EnrolEventQueueMutationInput = {
  /** The user response token provided by the reCAPTCHA client-side integration */
  captchaKey?: InputMaybe<Scalars['String']>;
  clientMutationId?: InputMaybe<Scalars['String']>;
  notificationType?: InputMaybe<NotificationType>;
  /** The event that a group would like to queue to */
  pEventId: Scalars['ID'];
  /** Leave blank if the contact person is the same with group contact person */
  person?: InputMaybe<PersonNodeInput>;
  /** Study group data */
  studyGroup: StudyGroupInput;
};

export type EnrolEventQueueMutationPayload = {
  __typename?: 'EnrolEventQueueMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  eventQueueEnrolment?: Maybe<EventQueueEnrolmentNode>;
};

export type EnrolOccurrenceMutationInput = {
  /** The user response token provided by the reCAPTCHA client-side integration */
  captchaKey?: InputMaybe<Scalars['String']>;
  clientMutationId?: InputMaybe<Scalars['String']>;
  notificationType?: InputMaybe<NotificationType>;
  /** Occurrence ids of event */
  occurrenceIds: Array<InputMaybe<Scalars['ID']>>;
  /** Leave blank if the contact person is the same with group contact person */
  person?: InputMaybe<PersonNodeInput>;
  /** Should the related notifications be sent during the mutation. Default is True. */
  sendNotifications?: InputMaybe<Scalars['Boolean']>;
  /** Study group data */
  studyGroup: StudyGroupInput;
};

export type EnrolOccurrenceMutationPayload = {
  __typename?: 'EnrolOccurrenceMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  enrolments?: Maybe<Array<Maybe<EnrolmentNode>>>;
};

export type EnrolmentNode = Node & {
  __typename?: 'EnrolmentNode';
  enrolmentTime: Scalars['DateTime'];
  /** The ID of the object. */
  id: Scalars['ID'];
  notificationType?: Maybe<NotificationType>;
  occurrence: OccurrenceNode;
  person?: Maybe<PersonNode>;
  personDeletedAt?: Maybe<Scalars['DateTime']>;
  status?: Maybe<EnrolmentStatus>;
  studyGroup: StudyGroupNode;
  updatedAt: Scalars['DateTime'];
};

export type EnrolmentNodeConnection = {
  __typename?: 'EnrolmentNodeConnection';
  count?: Maybe<Scalars['Int']>;
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<EnrolmentNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `EnrolmentNode` and its cursor. */
export type EnrolmentNodeEdge = {
  __typename?: 'EnrolmentNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<EnrolmentNode>;
};

/** An enumeration. */
export enum EnrolmentStatus {
  Approved = 'APPROVED',
  Cancelled = 'CANCELLED',
  Declined = 'DECLINED',
  Pending = 'PENDING'
}

export type Event = {
  __typename?: 'Event';
  /** Only use this field in single event query for best performance. This field only work if `keywords` is included in the query argument */
  activities: Array<Keyword>;
  /** Only use this field in single event query for best performance. This field only work if `keywords` is included in the query argument */
  additionalCriteria: Array<Keyword>;
  audience: Array<Keyword>;
  audienceMaxAge?: Maybe<Scalars['String']>;
  audienceMinAge?: Maybe<Scalars['String']>;
  /** Only use this field in single event query for best performance. This field only work if `keywords` is included in the query argument */
  categories: Array<Keyword>;
  createdTime?: Maybe<Scalars['String']>;
  customData?: Maybe<Scalars['String']>;
  dataSource?: Maybe<Scalars['String']>;
  datePublished?: Maybe<Scalars['String']>;
  description: LocalisedObject;
  endTime?: Maybe<Scalars['String']>;
  enrolmentEndTime?: Maybe<Scalars['String']>;
  enrolmentStartTime?: Maybe<Scalars['String']>;
  eventStatus?: Maybe<Scalars['String']>;
  externalLinks: Array<ExternalLink>;
  id: Scalars['String'];
  images: Array<Image>;
  inLanguage: Array<InLanguage>;
  infoUrl?: Maybe<LocalisedObject>;
  internalContext?: Maybe<Scalars['String']>;
  internalId: Scalars['ID'];
  internalType?: Maybe<Scalars['String']>;
  keywords: Array<Keyword>;
  lastModifiedTime?: Maybe<Scalars['String']>;
  localizationExtraInfo?: Maybe<LocalisedObject>;
  location?: Maybe<Place>;
  maximumAttendeeCapacity?: Maybe<Scalars['Int']>;
  minimumAttendeeCapacity?: Maybe<Scalars['Int']>;
  name: LocalisedObject;
  offers: Array<Offer>;
  pEvent: PalvelutarjotinEventNode;
  provider?: Maybe<LocalisedObject>;
  providerContactInfo?: Maybe<Scalars['String']>;
  publicationStatus?: Maybe<Scalars['String']>;
  publisher?: Maybe<Scalars['String']>;
  remainingAttendeeCapacity?: Maybe<Scalars['Int']>;
  shortDescription: LocalisedObject;
  startTime?: Maybe<Scalars['String']>;
  subEvents: Array<IdObject>;
  superEvent?: Maybe<IdObject>;
  superEventType?: Maybe<Scalars['String']>;
  venue?: Maybe<VenueNode>;
};

export type EventListPaginatedTypeResponse = {
  __typename?: 'EventListPaginatedTypeResponse';
  data: Array<Event>;
  pageInfo: PaginatedType;
};

export type EventListResponse = {
  __typename?: 'EventListResponse';
  data: Array<Event>;
  meta: Meta;
};

export type EventMutationResponse = {
  __typename?: 'EventMutationResponse';
  body?: Maybe<Event>;
  resultText?: Maybe<Scalars['String']>;
  statusCode: Scalars['Int'];
};

export type EventQueueEnrolmentNode = Node & {
  __typename?: 'EventQueueEnrolmentNode';
  enrolmentTime: Scalars['DateTime'];
  /** The ID of the object. */
  id: Scalars['ID'];
  notificationType?: Maybe<NotificationType>;
  pEvent: PalvelutarjotinEventNode;
  person?: Maybe<PersonNode>;
  personDeletedAt?: Maybe<Scalars['DateTime']>;
  status?: Maybe<EventQueueEnrolmentStatus>;
  studyGroup: StudyGroupNode;
  updatedAt: Scalars['DateTime'];
};

export type EventQueueEnrolmentNodeConnection = {
  __typename?: 'EventQueueEnrolmentNodeConnection';
  count?: Maybe<Scalars['Int']>;
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<EventQueueEnrolmentNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `EventQueueEnrolmentNode` and its cursor. */
export type EventQueueEnrolmentNodeEdge = {
  __typename?: 'EventQueueEnrolmentNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<EventQueueEnrolmentNode>;
};

/** An enumeration. */
export enum EventQueueEnrolmentStatus {
  HasEnrolments = 'HAS_ENROLMENTS',
  HasNoEnrolments = 'HAS_NO_ENROLMENTS'
}

export type EventSearchListResponse = {
  __typename?: 'EventSearchListResponse';
  data: Array<Event>;
  meta: Meta;
};

export type ExternalLink = {
  __typename?: 'ExternalLink';
  language?: Maybe<Scalars['String']>;
  link?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};

export type ExternalPlace = {
  __typename?: 'ExternalPlace';
  name?: Maybe<LocalisedObject>;
};

export type IdObject = {
  __typename?: 'IdObject';
  createdTime?: Maybe<Scalars['String']>;
  dataSource?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  internalContext?: Maybe<Scalars['String']>;
  internalId: Scalars['ID'];
  internalType?: Maybe<Scalars['String']>;
  lastModifiedTime?: Maybe<Scalars['String']>;
  publisher?: Maybe<Scalars['String']>;
};

export type IdObjectInput = {
  internalId?: InputMaybe<Scalars['String']>;
};

export type Image = {
  __typename?: 'Image';
  altText?: Maybe<Scalars['String']>;
  createdTime?: Maybe<Scalars['String']>;
  cropping?: Maybe<Scalars['String']>;
  dataSource?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  internalContext?: Maybe<Scalars['String']>;
  internalId: Scalars['ID'];
  internalType?: Maybe<Scalars['String']>;
  lastModifiedTime?: Maybe<Scalars['String']>;
  license?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  photographerName?: Maybe<Scalars['String']>;
  publisher?: Maybe<Scalars['String']>;
  url: Scalars['String'];
};

export type ImageListResponse = {
  __typename?: 'ImageListResponse';
  data: Array<Image>;
  meta: Meta;
};

export type ImageMutationResponse = {
  __typename?: 'ImageMutationResponse';
  body?: Maybe<Image>;
  resultText?: Maybe<Scalars['String']>;
  statusCode: Scalars['Int'];
};

export type InLanguage = {
  __typename?: 'InLanguage';
  createdTime?: Maybe<Scalars['String']>;
  dataSource?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  internalContext?: Maybe<Scalars['String']>;
  internalId: Scalars['ID'];
  internalType?: Maybe<Scalars['String']>;
  lastModifiedTime?: Maybe<Scalars['String']>;
  name?: Maybe<LocalisedObject>;
  publisher?: Maybe<Scalars['String']>;
  translationAvailable?: Maybe<Scalars['Boolean']>;
};

export type Keyword = {
  __typename?: 'Keyword';
  aggregate?: Maybe<Scalars['Boolean']>;
  altLabels?: Maybe<Array<Maybe<Scalars['String']>>>;
  createdTime?: Maybe<Scalars['String']>;
  dataSource?: Maybe<Scalars['String']>;
  deprecated?: Maybe<Scalars['Boolean']>;
  id?: Maybe<Scalars['String']>;
  image?: Maybe<Scalars['Int']>;
  internalContext?: Maybe<Scalars['String']>;
  internalId: Scalars['ID'];
  internalType?: Maybe<Scalars['String']>;
  lastModifiedTime?: Maybe<Scalars['String']>;
  nEvents?: Maybe<Scalars['Int']>;
  name?: Maybe<LocalisedObject>;
  publisher?: Maybe<Scalars['ID']>;
};

export type KeywordListResponse = {
  __typename?: 'KeywordListResponse';
  data: Array<Keyword>;
  meta: Meta;
};

export type KeywordSet = {
  __typename?: 'KeywordSet';
  createdTime?: Maybe<Scalars['String']>;
  dataSource?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  internalContext?: Maybe<Scalars['String']>;
  internalId: Scalars['ID'];
  internalType?: Maybe<Scalars['String']>;
  keywords: Array<Keyword>;
  lastModifiedTime?: Maybe<Scalars['String']>;
  name?: Maybe<LocalisedObject>;
  publisher?: Maybe<Scalars['String']>;
  usage?: Maybe<Scalars['String']>;
};

/** An enumeration. */
export enum KeywordSetType {
  Activities = 'ACTIVITIES',
  AdditionalCriteria = 'ADDITIONAL_CRITERIA',
  Category = 'CATEGORY',
  TargetGroup = 'TARGET_GROUP'
}

/** An enumeration. */
export enum Language {
  En = 'EN',
  Fi = 'FI',
  Sv = 'SV'
}

export type LanguageInput = {
  id?: InputMaybe<Scalars['String']>;
};

export type LanguageNode = Node & {
  __typename?: 'LanguageNode';
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type LanguageNodeConnection = {
  __typename?: 'LanguageNodeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<LanguageNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `LanguageNode` and its cursor. */
export type LanguageNodeEdge = {
  __typename?: 'LanguageNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<LanguageNode>;
};

export type LocalisedObject = {
  __typename?: 'LocalisedObject';
  en?: Maybe<Scalars['String']>;
  fi?: Maybe<Scalars['String']>;
  sv?: Maybe<Scalars['String']>;
};

export type LocalisedObjectInput = {
  en?: InputMaybe<Scalars['String']>;
  fi?: InputMaybe<Scalars['String']>;
  sv?: InputMaybe<Scalars['String']>;
};

export type MassApproveEnrolmentsMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  customMessage?: InputMaybe<Scalars['String']>;
  enrolmentIds: Array<InputMaybe<Scalars['ID']>>;
};

export type MassApproveEnrolmentsMutationPayload = {
  __typename?: 'MassApproveEnrolmentsMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  enrolments: Array<Maybe<EnrolmentNode>>;
};

export type Meta = {
  __typename?: 'Meta';
  count?: Maybe<Scalars['Int']>;
  next?: Maybe<Scalars['String']>;
  previous?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addEventMutation?: Maybe<AddEventMutation>;
  addOccurrence?: Maybe<AddOccurrenceMutationPayload>;
  addOrganisation?: Maybe<AddOrganisationMutationPayload>;
  addStudyGroup?: Maybe<AddStudyGroupMutationPayload>;
  addVenue?: Maybe<AddVenueMutationPayload>;
  approveEnrolment?: Maybe<ApproveEnrolmentMutationPayload>;
  cancelEnrolment?: Maybe<CancelEnrolmentMutationPayload>;
  cancelOccurrence?: Maybe<CancelOccurrenceMutationPayload>;
  createMyProfile?: Maybe<CreateMyProfileMutationPayload>;
  declineEnrolment?: Maybe<DeclineEnrolmentMutationPayload>;
  deleteEventMutation?: Maybe<DeleteEventMutation>;
  deleteImageMutation?: Maybe<DeleteImageMutation>;
  deleteOccurrence?: Maybe<DeleteOccurrenceMutationPayload>;
  /** Mutation for admin only */
  deleteStudyGroup?: Maybe<DeleteStudyGroupMutationPayload>;
  deleteVenue?: Maybe<DeleteVenueMutationPayload>;
  enrolEventQueue?: Maybe<EnrolEventQueueMutationPayload>;
  enrolOccurrence?: Maybe<EnrolOccurrenceMutationPayload>;
  massApproveEnrolments?: Maybe<MassApproveEnrolmentsMutationPayload>;
  /** Using this mutation will update event publication status and also set the `start_time`, `end_time` of linkedEvent */
  publishEventMutation?: Maybe<PublishEventMutation>;
  unenrolEventQueue?: Maybe<UnenrolEventQueueMutationPayload>;
  /** Only staff can unenrol study group */
  unenrolOccurrence?: Maybe<UnenrolOccurrenceMutationPayload>;
  unpublishEventMutation?: Maybe<UnpublishEventMutation>;
  updateEnrolment?: Maybe<UpdateEnrolmentMutationPayload>;
  updateEventMutation?: Maybe<UpdateEventMutation>;
  updateImageMutation?: Maybe<UpdateImageMutation>;
  updateMyProfile?: Maybe<UpdateMyProfileMutationPayload>;
  updateOccurrence?: Maybe<UpdateOccurrenceMutationPayload>;
  updateOrganisation?: Maybe<UpdateOrganisationMutationPayload>;
  updatePerson?: Maybe<UpdatePersonMutationPayload>;
  /** Mutation for admin only */
  updateStudyGroup?: Maybe<UpdateStudyGroupMutationPayload>;
  updateVenue?: Maybe<UpdateVenueMutationPayload>;
  uploadImageMutation?: Maybe<UploadImageMutation>;
};


export type MutationAddEventMutationArgs = {
  event?: InputMaybe<AddEventMutationInput>;
};


export type MutationAddOccurrenceArgs = {
  input: AddOccurrenceMutationInput;
};


export type MutationAddOrganisationArgs = {
  input: AddOrganisationMutationInput;
};


export type MutationAddStudyGroupArgs = {
  input: AddStudyGroupMutationInput;
};


export type MutationAddVenueArgs = {
  input: AddVenueMutationInput;
};


export type MutationApproveEnrolmentArgs = {
  input: ApproveEnrolmentMutationInput;
};


export type MutationCancelEnrolmentArgs = {
  input: CancelEnrolmentMutationInput;
};


export type MutationCancelOccurrenceArgs = {
  input: CancelOccurrenceMutationInput;
};


export type MutationCreateMyProfileArgs = {
  input: CreateMyProfileMutationInput;
};


export type MutationDeclineEnrolmentArgs = {
  input: DeclineEnrolmentMutationInput;
};


export type MutationDeleteEventMutationArgs = {
  eventId: Scalars['String'];
};


export type MutationDeleteImageMutationArgs = {
  imageId: Scalars['String'];
};


export type MutationDeleteOccurrenceArgs = {
  input: DeleteOccurrenceMutationInput;
};


export type MutationDeleteStudyGroupArgs = {
  input: DeleteStudyGroupMutationInput;
};


export type MutationDeleteVenueArgs = {
  input: DeleteVenueMutationInput;
};


export type MutationEnrolEventQueueArgs = {
  input: EnrolEventQueueMutationInput;
};


export type MutationEnrolOccurrenceArgs = {
  input: EnrolOccurrenceMutationInput;
};


export type MutationMassApproveEnrolmentsArgs = {
  input: MassApproveEnrolmentsMutationInput;
};


export type MutationPublishEventMutationArgs = {
  event?: InputMaybe<PublishEventMutationInput>;
};


export type MutationUnenrolEventQueueArgs = {
  input: UnenrolEventQueueMutationInput;
};


export type MutationUnenrolOccurrenceArgs = {
  input: UnenrolOccurrenceMutationInput;
};


export type MutationUnpublishEventMutationArgs = {
  event?: InputMaybe<PublishEventMutationInput>;
};


export type MutationUpdateEnrolmentArgs = {
  input: UpdateEnrolmentMutationInput;
};


export type MutationUpdateEventMutationArgs = {
  event?: InputMaybe<UpdateEventMutationInput>;
};


export type MutationUpdateImageMutationArgs = {
  image?: InputMaybe<UpdateImageMutationInput>;
};


export type MutationUpdateMyProfileArgs = {
  input: UpdateMyProfileMutationInput;
};


export type MutationUpdateOccurrenceArgs = {
  input: UpdateOccurrenceMutationInput;
};


export type MutationUpdateOrganisationArgs = {
  input: UpdateOrganisationMutationInput;
};


export type MutationUpdatePersonArgs = {
  input: UpdatePersonMutationInput;
};


export type MutationUpdateStudyGroupArgs = {
  input: UpdateStudyGroupMutationInput;
};


export type MutationUpdateVenueArgs = {
  input: UpdateVenueMutationInput;
};


export type MutationUploadImageMutationArgs = {
  image?: InputMaybe<UploadImageMutationInput>;
};

/** An object with an ID */
export type Node = {
  /** The ID of the object. */
  id: Scalars['ID'];
};

/** An enumeration. */
export enum NotificationTemplateLanguage {
  En = 'EN',
  Fi = 'FI',
  Sv = 'SV'
}

export type NotificationTemplateNode = Node & {
  __typename?: 'NotificationTemplateNode';
  /** The ID of the object. */
  id: Scalars['ID'];
  preview?: Maybe<Scalars['String']>;
  translations: Array<Maybe<NotificationTranslationType>>;
  type: Scalars['String'];
};

/** An enumeration. */
export enum NotificationTemplateType {
  EnrolmentApproved = 'ENROLMENT_APPROVED',
  EnrolmentApprovedSms = 'ENROLMENT_APPROVED_SMS',
  EnrolmentCancellation = 'ENROLMENT_CANCELLATION',
  EnrolmentCancellationSms = 'ENROLMENT_CANCELLATION_SMS',
  EnrolmentCancelled = 'ENROLMENT_CANCELLED',
  EnrolmentCancelledSms = 'ENROLMENT_CANCELLED_SMS',
  EnrolmentDeclined = 'ENROLMENT_DECLINED',
  EnrolmentDeclinedSms = 'ENROLMENT_DECLINED_SMS',
  EnrolmentSummaryReport = 'ENROLMENT_SUMMARY_REPORT',
  OccurrenceCancelled = 'OCCURRENCE_CANCELLED',
  OccurrenceCancelledSms = 'OCCURRENCE_CANCELLED_SMS',
  OccurrenceEnrolment = 'OCCURRENCE_ENROLMENT',
  OccurrenceEnrolmentSms = 'OCCURRENCE_ENROLMENT_SMS',
  OccurrenceUnenrolment = 'OCCURRENCE_UNENROLMENT',
  OccurrenceUnenrolmentSms = 'OCCURRENCE_UNENROLMENT_SMS',
  PersonMyprofileAccepted = 'PERSON_MYPROFILE_ACCEPTED',
  PersonMyprofileCreation = 'PERSON_MYPROFILE_CREATION'
}

export type NotificationTemplateWithContext = {
  __typename?: 'NotificationTemplateWithContext';
  customContextPreviewHtml?: Maybe<Scalars['String']>;
  customContextPreviewText?: Maybe<Scalars['String']>;
  template?: Maybe<NotificationTemplateNode>;
};

export type NotificationTranslationType = {
  __typename?: 'NotificationTranslationType';
  bodyHtml?: Maybe<Scalars['String']>;
  bodyText?: Maybe<Scalars['String']>;
  languageCode: NotificationTemplateLanguage;
  preview?: Maybe<Scalars['String']>;
  subject?: Maybe<Scalars['String']>;
};

/** An enumeration. */
export enum NotificationType {
  Email = 'EMAIL',
  EmailSms = 'EMAIL_SMS',
  Sms = 'SMS'
}

export type OccurrenceNode = Node & {
  __typename?: 'OccurrenceNode';
  amountOfSeats: Scalars['Int'];
  cancelled: Scalars['Boolean'];
  contactPersons: PersonNodeConnection;
  createdAt: Scalars['DateTime'];
  endTime: Scalars['DateTime'];
  enrolments: EnrolmentNodeConnection;
  /** The ID of the object. */
  id: Scalars['ID'];
  languages: LanguageNodeConnection;
  /** Only use this field in single event query for best performance. */
  linkedEvent?: Maybe<Event>;
  maxGroupSize?: Maybe<Scalars['Int']>;
  minGroupSize?: Maybe<Scalars['Int']>;
  pEvent?: Maybe<PalvelutarjotinEventNode>;
  placeId: Scalars['String'];
  remainingSeats: Scalars['Int'];
  seatType: OccurrenceSeatType;
  seatsApproved: Scalars['Int'];
  seatsTaken: Scalars['Int'];
  startTime: Scalars['DateTime'];
  studyGroups: StudyGroupNodeConnection;
  updatedAt: Scalars['DateTime'];
};


export type OccurrenceNodeContactPersonsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};


export type OccurrenceNodeEnrolmentsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  occurrenceId?: InputMaybe<Scalars['ID']>;
  offset?: InputMaybe<Scalars['Int']>;
  status?: InputMaybe<Scalars['String']>;
};


export type OccurrenceNodeLanguagesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};


export type OccurrenceNodeStudyGroupsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};

export type OccurrenceNodeConnection = {
  __typename?: 'OccurrenceNodeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<OccurrenceNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `OccurrenceNode` and its cursor. */
export type OccurrenceNodeEdge = {
  __typename?: 'OccurrenceNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<OccurrenceNode>;
};

/** An enumeration. */
export enum OccurrenceSeatType {
  /** children count */
  ChildrenCount = 'CHILDREN_COUNT',
  /** enrolment count */
  EnrolmentCount = 'ENROLMENT_COUNT'
}

export type Offer = {
  __typename?: 'Offer';
  description?: Maybe<LocalisedObject>;
  infoUrl?: Maybe<LocalisedObject>;
  isFree?: Maybe<Scalars['Boolean']>;
  price?: Maybe<LocalisedObject>;
};

export type OfferInput = {
  description?: InputMaybe<LocalisedObjectInput>;
  infoUrl?: InputMaybe<LocalisedObjectInput>;
  isFree?: InputMaybe<Scalars['Boolean']>;
  price?: InputMaybe<LocalisedObjectInput>;
};

export type OrganisationNode = Node & {
  __typename?: 'OrganisationNode';
  /** The ID of the object. */
  id: Scalars['ID'];
  name: Scalars['String'];
  persons: PersonNodeConnection;
  phoneNumber: Scalars['String'];
  publisherId: Scalars['String'];
  type: OrganisationType;
};


export type OrganisationNodePersonsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};

export type OrganisationNodeConnection = {
  __typename?: 'OrganisationNodeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<OrganisationNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `OrganisationNode` and its cursor. */
export type OrganisationNodeEdge = {
  __typename?: 'OrganisationNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<OrganisationNode>;
};

export type OrganisationProposalNode = Node & {
  __typename?: 'OrganisationProposalNode';
  applicant: PersonNode;
  description: Scalars['String'];
  /** The ID of the object. */
  id: Scalars['ID'];
  name: Scalars['String'];
  phoneNumber: Scalars['String'];
};

export type OrganisationProposalNodeConnection = {
  __typename?: 'OrganisationProposalNodeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<OrganisationProposalNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `OrganisationProposalNode` and its cursor. */
export type OrganisationProposalNodeEdge = {
  __typename?: 'OrganisationProposalNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<OrganisationProposalNode>;
};

export type OrganisationProposalNodeInput = {
  description?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  phoneNumber?: InputMaybe<Scalars['String']>;
};

/** An enumeration. */
export enum OrganisationType {
  /** Provider */
  Provider = 'PROVIDER',
  /** Käyttäjä */
  User = 'USER'
}

export enum OrganisationTypeEnum {
  Provider = 'PROVIDER',
  User = 'USER'
}

/** The Relay compliant `PageInfo` type, containing data necessary to paginate this connection. */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['String']>;
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['String']>;
};

export type PaginatedType = {
  __typename?: 'PaginatedType';
  hasNextPage?: Maybe<Scalars['Boolean']>;
  hasPreviousPage?: Maybe<Scalars['Boolean']>;
  page?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
  pages?: Maybe<Scalars['Int']>;
  totalCount?: Maybe<Scalars['Int']>;
};

export type PalvelutarjotinEventInput = {
  autoAcceptance?: InputMaybe<Scalars['Boolean']>;
  contactEmail?: InputMaybe<Scalars['String']>;
  contactPersonId?: InputMaybe<Scalars['ID']>;
  contactPhoneNumber?: InputMaybe<Scalars['String']>;
  enrolmentEndDays?: InputMaybe<Scalars['Int']>;
  enrolmentStart?: InputMaybe<Scalars['DateTime']>;
  externalEnrolmentUrl?: InputMaybe<Scalars['String']>;
  mandatoryAdditionalInformation?: InputMaybe<Scalars['Boolean']>;
  neededOccurrences: Scalars['Int'];
  translations?: InputMaybe<Array<InputMaybe<PalvelutarjotinEventTranslationsInput>>>;
};

export type PalvelutarjotinEventNode = Node & {
  __typename?: 'PalvelutarjotinEventNode';
  autoAcceptance: Scalars['Boolean'];
  /** Translated field in the language defined in request ACCEPT-LANGUAGE header  */
  autoAcceptanceMessage?: Maybe<Scalars['String']>;
  contactEmail: Scalars['String'];
  contactInfoDeletedAt?: Maybe<Scalars['DateTime']>;
  contactPerson?: Maybe<PersonNode>;
  contactPhoneNumber: Scalars['String'];
  createdAt: Scalars['DateTime'];
  enrolmentEndDays?: Maybe<Scalars['Int']>;
  enrolmentStart?: Maybe<Scalars['DateTime']>;
  externalEnrolmentUrl?: Maybe<Scalars['String']>;
  /** The ID of the object. */
  id: Scalars['ID'];
  lastOccurrenceDatetime?: Maybe<Scalars['DateTime']>;
  linkedEventId: Scalars['String'];
  mandatoryAdditionalInformation: Scalars['Boolean'];
  neededOccurrences: Scalars['Int'];
  nextOccurrenceDatetime?: Maybe<Scalars['DateTime']>;
  occurrences?: Maybe<OccurrenceNodeConnection>;
  organisation?: Maybe<OrganisationNode>;
  queuedEnrolments: EventQueueEnrolmentNodeConnection;
  translations?: Maybe<Array<Maybe<PalvelutarjotinEventTranslationType>>>;
  updatedAt: Scalars['DateTime'];
};


export type PalvelutarjotinEventNodeOccurrencesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  cancelled?: InputMaybe<Scalars['Boolean']>;
  date?: InputMaybe<Scalars['Date']>;
  enrollable?: InputMaybe<Scalars['Boolean']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  pEvent?: InputMaybe<Scalars['ID']>;
  time?: InputMaybe<Scalars['Time']>;
  upcoming?: InputMaybe<Scalars['Boolean']>;
};


export type PalvelutarjotinEventNodeQueuedEnrolmentsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  pEventId?: InputMaybe<Scalars['ID']>;
};

export type PalvelutarjotinEventTranslationType = {
  __typename?: 'PalvelutarjotinEventTranslationType';
  autoAcceptanceMessage: Scalars['String'];
  languageCode: Language;
};

export type PalvelutarjotinEventTranslationsInput = {
  /** A custom message included in notification template when auto acceptance is set on. */
  autoAcceptanceMessage?: InputMaybe<Scalars['String']>;
  languageCode: Language;
};

export type PersonNode = Node & {
  __typename?: 'PersonNode';
  createdAt: Scalars['DateTime'];
  emailAddress: Scalars['String'];
  enrolmentSet: EnrolmentNodeConnection;
  eventqueueenrolmentSet: EventQueueEnrolmentNodeConnection;
  /** The ID of the object. */
  id: Scalars['ID'];
  isStaff: Scalars['Boolean'];
  language: Language;
  name: Scalars['String'];
  occurrences: OccurrenceNodeConnection;
  organisationproposalSet: OrganisationProposalNodeConnection;
  organisations: OrganisationNodeConnection;
  phoneNumber: Scalars['String'];
  placeIds: Array<Scalars['String']>;
  studygroupSet: StudyGroupNodeConnection;
  updatedAt: Scalars['DateTime'];
};


export type PersonNodeEnrolmentSetArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  occurrenceId?: InputMaybe<Scalars['ID']>;
  offset?: InputMaybe<Scalars['Int']>;
  status?: InputMaybe<Scalars['String']>;
};


export type PersonNodeEventqueueenrolmentSetArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  pEventId?: InputMaybe<Scalars['ID']>;
};


export type PersonNodeOccurrencesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  cancelled?: InputMaybe<Scalars['Boolean']>;
  date?: InputMaybe<Scalars['Date']>;
  enrollable?: InputMaybe<Scalars['Boolean']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  pEvent?: InputMaybe<Scalars['ID']>;
  time?: InputMaybe<Scalars['Time']>;
  upcoming?: InputMaybe<Scalars['Boolean']>;
};


export type PersonNodeOrganisationproposalSetArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};


export type PersonNodeOrganisationsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  type?: InputMaybe<Scalars['String']>;
};


export type PersonNodeStudygroupSetArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};

export type PersonNodeConnection = {
  __typename?: 'PersonNodeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<PersonNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `PersonNode` and its cursor. */
export type PersonNodeEdge = {
  __typename?: 'PersonNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<PersonNode>;
};

export type PersonNodeInput = {
  emailAddress: Scalars['String'];
  id?: InputMaybe<Scalars['ID']>;
  /** Default `fi` */
  language?: InputMaybe<Language>;
  name: Scalars['String'];
  phoneNumber?: InputMaybe<Scalars['String']>;
  placeIds?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type Place = {
  __typename?: 'Place';
  addressCountry?: Maybe<Scalars['String']>;
  addressLocality?: Maybe<LocalisedObject>;
  addressRegion?: Maybe<Scalars['String']>;
  contactType?: Maybe<Scalars['String']>;
  createdTime?: Maybe<Scalars['String']>;
  customData?: Maybe<Scalars['String']>;
  dataSource?: Maybe<Scalars['String']>;
  deleted?: Maybe<Scalars['Boolean']>;
  description?: Maybe<Scalars['String']>;
  divisions?: Maybe<Array<Maybe<Division>>>;
  email?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  image?: Maybe<Scalars['Int']>;
  infoUrl?: Maybe<LocalisedObject>;
  internalContext?: Maybe<Scalars['String']>;
  internalId: Scalars['ID'];
  internalType?: Maybe<Scalars['String']>;
  lastModifiedTime?: Maybe<Scalars['String']>;
  nEvents?: Maybe<Scalars['Int']>;
  name?: Maybe<LocalisedObject>;
  parent?: Maybe<Scalars['ID']>;
  position?: Maybe<PlacePosition>;
  postOfficeBoxNum?: Maybe<Scalars['String']>;
  postalCode?: Maybe<Scalars['String']>;
  publisher?: Maybe<Scalars['String']>;
  replacedBy?: Maybe<Scalars['String']>;
  streetAddress?: Maybe<LocalisedObject>;
  telephone?: Maybe<LocalisedObject>;
};

export type PlaceListResponse = {
  __typename?: 'PlaceListResponse';
  data: Array<Place>;
  meta: Meta;
};

export type PlacePosition = {
  __typename?: 'PlacePosition';
  coordinates: Array<Scalars['Float']>;
  type: Scalars['String'];
};

export type PlaceSearchListResponse = {
  __typename?: 'PlaceSearchListResponse';
  data: Array<Place>;
  meta: Meta;
};

export type PublishEventMutation = {
  __typename?: 'PublishEventMutation';
  response?: Maybe<EventMutationResponse>;
};

export type PublishEventMutationInput = {
  audience?: InputMaybe<Array<IdObjectInput>>;
  audienceMaxAge?: InputMaybe<Scalars['String']>;
  audienceMinAge?: InputMaybe<Scalars['String']>;
  customData?: InputMaybe<Scalars['String']>;
  datePublished?: InputMaybe<Scalars['String']>;
  description: LocalisedObjectInput;
  endTime?: InputMaybe<Scalars['String']>;
  enrolmentEndTime?: InputMaybe<Scalars['String']>;
  enrolmentStartTime?: InputMaybe<Scalars['String']>;
  eventStatus?: InputMaybe<Scalars['String']>;
  externalLinks?: InputMaybe<Array<Scalars['String']>>;
  id: Scalars['String'];
  images?: InputMaybe<Array<IdObjectInput>>;
  inLanguage?: InputMaybe<Array<IdObjectInput>>;
  infoUrl?: InputMaybe<LocalisedObjectInput>;
  keywords: Array<IdObjectInput>;
  localizationExtraInfo?: InputMaybe<LocalisedObjectInput>;
  location?: InputMaybe<IdObjectInput>;
  maximumAttendeeCapacity?: InputMaybe<Scalars['Int']>;
  minimumAttendeeCapacity?: InputMaybe<Scalars['Int']>;
  name: LocalisedObjectInput;
  offers: Array<OfferInput>;
  /** Organisation global id which the created event belongs to */
  organisationId: Scalars['String'];
  /** Palvelutarjotin event data */
  pEvent?: InputMaybe<PalvelutarjotinEventInput>;
  provider?: InputMaybe<LocalisedObjectInput>;
  providerContactInfo?: InputMaybe<Scalars['String']>;
  remainingAttendeeCapacity?: InputMaybe<Scalars['Int']>;
  shortDescription: LocalisedObjectInput;
  startTime?: InputMaybe<Scalars['String']>;
  subEvents?: InputMaybe<Array<Scalars['String']>>;
  superEvent?: InputMaybe<Scalars['String']>;
  superEventType?: InputMaybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  cancellingEnrolment?: Maybe<EnrolmentNode>;
  /** Query for admin only */
  enrolment?: Maybe<EnrolmentNode>;
  enrolmentSummary?: Maybe<EnrolmentNodeConnection>;
  event?: Maybe<Event>;
  /** Query for admin only */
  eventQueueEnrolment?: Maybe<EventQueueEnrolmentNode>;
  /** Query for admin only */
  eventQueueEnrolments?: Maybe<EventQueueEnrolmentNodeConnection>;
  events?: Maybe<EventListResponse>;
  eventsSearch?: Maybe<EventSearchListResponse>;
  image?: Maybe<Image>;
  images?: Maybe<ImageListResponse>;
  keyword?: Maybe<Keyword>;
  keywordSet?: Maybe<KeywordSet>;
  keywords?: Maybe<KeywordListResponse>;
  language?: Maybe<LanguageNode>;
  languages?: Maybe<LanguageNodeConnection>;
  /** Query personal data of logged user */
  myProfile?: Maybe<PersonNode>;
  notificationTemplate?: Maybe<NotificationTemplateWithContext>;
  occurrence?: Maybe<OccurrenceNode>;
  occurrences?: Maybe<OccurrenceNodeConnection>;
  organisation?: Maybe<OrganisationNode>;
  organisations?: Maybe<OrganisationNodeConnection>;
  person?: Maybe<PersonNode>;
  persons?: Maybe<PersonNodeConnection>;
  place?: Maybe<Place>;
  places?: Maybe<PlaceListResponse>;
  placesSearch?: Maybe<PlaceSearchListResponse>;
  /** Keywords related to Kultus ordered by the number of events */
  popularKultusKeywords?: Maybe<KeywordListResponse>;
  schoolsAndKindergartensList?: Maybe<ServiceUnitNameListResponse>;
  studyLevel?: Maybe<StudyLevelNode>;
  studyLevels?: Maybe<StudyLevelNodeConnection>;
  /** Get upcoming events sorted by the next occurrence. */
  upcomingEvents?: Maybe<EventListPaginatedTypeResponse>;
  venue?: Maybe<VenueNode>;
  venues?: Maybe<VenueNodeConnection>;
};


export type QueryCancellingEnrolmentArgs = {
  id: Scalars['ID'];
};


export type QueryEnrolmentArgs = {
  id: Scalars['ID'];
};


export type QueryEnrolmentSummaryArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  organisationId: Scalars['ID'];
  status?: InputMaybe<EnrolmentStatus>;
};


export type QueryEventArgs = {
  id: Scalars['ID'];
  include?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


export type QueryEventQueueEnrolmentArgs = {
  id: Scalars['ID'];
};


export type QueryEventQueueEnrolmentsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  pEventId?: InputMaybe<Scalars['ID']>;
};


export type QueryEventsArgs = {
  allOngoingAnd?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  allOngoingOr?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  division?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  end?: InputMaybe<Scalars['String']>;
  inLanguage?: InputMaybe<Scalars['String']>;
  include?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  isFree?: InputMaybe<Scalars['Boolean']>;
  keyword?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  keywordAnd?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  keywordNot?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  language?: InputMaybe<Scalars['String']>;
  location?: InputMaybe<Scalars['String']>;
  nearbyDistance?: InputMaybe<Scalars['Float']>;
  nearbyPlaceId?: InputMaybe<Scalars['ID']>;
  organisationId?: InputMaybe<Scalars['String']>;
  page?: InputMaybe<Scalars['Int']>;
  pageSize?: InputMaybe<Scalars['Int']>;
  publicationStatus?: InputMaybe<Scalars['String']>;
  publisher?: InputMaybe<Scalars['ID']>;
  showAll?: InputMaybe<Scalars['Boolean']>;
  sort?: InputMaybe<Scalars['String']>;
  start?: InputMaybe<Scalars['String']>;
  superEvent?: InputMaybe<Scalars['ID']>;
  superEventType?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  text?: InputMaybe<Scalars['String']>;
  translation?: InputMaybe<Scalars['String']>;
};


export type QueryEventsSearchArgs = {
  include?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  input: Scalars['String'];
};


export type QueryImageArgs = {
  id: Scalars['ID'];
};


export type QueryKeywordArgs = {
  id: Scalars['ID'];
};


export type QueryKeywordSetArgs = {
  setType: KeywordSetType;
};


export type QueryKeywordsArgs = {
  dataSource?: InputMaybe<Scalars['String']>;
  page?: InputMaybe<Scalars['Int']>;
  pageSize?: InputMaybe<Scalars['Int']>;
  showAllKeywords?: InputMaybe<Scalars['Boolean']>;
  sort?: InputMaybe<Scalars['String']>;
  text?: InputMaybe<Scalars['String']>;
};


export type QueryLanguageArgs = {
  id: Scalars['ID'];
};


export type QueryLanguagesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};


export type QueryNotificationTemplateArgs = {
  context: Scalars['JSONString'];
  language: Language;
  templateType?: InputMaybe<NotificationTemplateType>;
};


export type QueryOccurrenceArgs = {
  id: Scalars['ID'];
};


export type QueryOccurrencesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  cancelled?: InputMaybe<Scalars['Boolean']>;
  date?: InputMaybe<Scalars['Date']>;
  enrollable?: InputMaybe<Scalars['Boolean']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  pEvent?: InputMaybe<Scalars['ID']>;
  time?: InputMaybe<Scalars['Time']>;
  upcoming?: InputMaybe<Scalars['Boolean']>;
};


export type QueryOrganisationArgs = {
  id: Scalars['ID'];
};


export type QueryOrganisationsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  type?: InputMaybe<Scalars['String']>;
};


export type QueryPersonArgs = {
  id: Scalars['ID'];
};


export type QueryPersonsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};


export type QueryPlaceArgs = {
  id: Scalars['ID'];
};


export type QueryPlacesArgs = {
  dataSource?: InputMaybe<Scalars['String']>;
  divisions?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  page?: InputMaybe<Scalars['Int']>;
  pageSize?: InputMaybe<Scalars['Int']>;
  showAllPlaces?: InputMaybe<Scalars['Boolean']>;
  sort?: InputMaybe<Scalars['String']>;
  text?: InputMaybe<Scalars['String']>;
};


export type QueryPlacesSearchArgs = {
  include?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  input: Scalars['String'];
};


export type QueryPopularKultusKeywordsArgs = {
  amount?: InputMaybe<Scalars['Int']>;
  showAllKeywords?: InputMaybe<Scalars['Boolean']>;
};


export type QueryStudyLevelArgs = {
  id: Scalars['ID'];
};


export type QueryStudyLevelsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};


export type QueryUpcomingEventsArgs = {
  include?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  page?: InputMaybe<Scalars['Int']>;
  pageSize?: InputMaybe<Scalars['Int']>;
};


export type QueryVenueArgs = {
  id: Scalars['ID'];
};


export type QueryVenuesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};

/** An enumeration. */
export enum SeatType {
  ChildrenCount = 'CHILDREN_COUNT',
  EnrolmentCount = 'ENROLMENT_COUNT'
}

export type ServiceUnitNameListResponse = {
  __typename?: 'ServiceUnitNameListResponse';
  data: Array<ServiceUnitNode>;
  meta: Meta;
};

export type ServiceUnitNode = {
  __typename?: 'ServiceUnitNode';
  id: Scalars['ID'];
  name?: Maybe<LocalisedObject>;
};

export type StudyGroupInput = {
  amountOfAdult?: InputMaybe<Scalars['Int']>;
  extraNeeds?: InputMaybe<Scalars['String']>;
  groupName?: InputMaybe<Scalars['String']>;
  groupSize: Scalars['Int'];
  /** If person input doesn't include person id, a new person object will be created */
  person: PersonNodeInput;
  studyLevels?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  unitId?: InputMaybe<Scalars['String']>;
  unitName?: InputMaybe<Scalars['String']>;
};

export type StudyGroupNode = Node & {
  __typename?: 'StudyGroupNode';
  amountOfAdult: Scalars['Int'];
  createdAt: Scalars['DateTime'];
  enrolments: EnrolmentNodeConnection;
  extraNeeds: Scalars['String'];
  groupName: Scalars['String'];
  groupSize: Scalars['Int'];
  /** The ID of the object. */
  id: Scalars['ID'];
  occurrences: OccurrenceNodeConnection;
  person?: Maybe<PersonNode>;
  personDeletedAt?: Maybe<Scalars['DateTime']>;
  queuedEnrolments: EventQueueEnrolmentNodeConnection;
  studyLevels: StudyLevelNodeConnection;
  unit?: Maybe<UnitNode>;
  unitId?: Maybe<Scalars['String']>;
  unitName: Scalars['String'];
  updatedAt: Scalars['DateTime'];
};


export type StudyGroupNodeEnrolmentsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  occurrenceId?: InputMaybe<Scalars['ID']>;
  offset?: InputMaybe<Scalars['Int']>;
  status?: InputMaybe<Scalars['String']>;
};


export type StudyGroupNodeOccurrencesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  cancelled?: InputMaybe<Scalars['Boolean']>;
  date?: InputMaybe<Scalars['Date']>;
  enrollable?: InputMaybe<Scalars['Boolean']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  pEvent?: InputMaybe<Scalars['ID']>;
  time?: InputMaybe<Scalars['Time']>;
  upcoming?: InputMaybe<Scalars['Boolean']>;
};


export type StudyGroupNodeQueuedEnrolmentsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  pEventId?: InputMaybe<Scalars['ID']>;
};


export type StudyGroupNodeStudyLevelsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};

export type StudyGroupNodeConnection = {
  __typename?: 'StudyGroupNodeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<StudyGroupNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `StudyGroupNode` and its cursor. */
export type StudyGroupNodeEdge = {
  __typename?: 'StudyGroupNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<StudyGroupNode>;
};

export type StudyLevelNode = Node & {
  __typename?: 'StudyLevelNode';
  id: Scalars['ID'];
  /** Translated field in the language defined in request ACCEPT-LANGUAGE header  */
  label?: Maybe<Scalars['String']>;
  /** Used to make a hierarchy between study levels. */
  level: Scalars['Int'];
  translations: Array<StudyLevelTranslationType>;
};

export type StudyLevelNodeConnection = {
  __typename?: 'StudyLevelNodeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<StudyLevelNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `StudyLevelNode` and its cursor. */
export type StudyLevelNodeEdge = {
  __typename?: 'StudyLevelNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<StudyLevelNode>;
};

export type StudyLevelTranslationType = {
  __typename?: 'StudyLevelTranslationType';
  label: Scalars['String'];
  languageCode: Language;
};

export type UnenrolEventQueueMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  pEventId: Scalars['ID'];
  /** Study group id */
  studyGroupId: Scalars['ID'];
};

export type UnenrolEventQueueMutationPayload = {
  __typename?: 'UnenrolEventQueueMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  pEvent?: Maybe<PalvelutarjotinEventNode>;
  studyGroup?: Maybe<StudyGroupNode>;
};

export type UnenrolOccurrenceMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Occurrence id of event */
  occurrenceId: Scalars['ID'];
  /** Study group id */
  studyGroupId: Scalars['ID'];
};

export type UnenrolOccurrenceMutationPayload = {
  __typename?: 'UnenrolOccurrenceMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  occurrence?: Maybe<OccurrenceNode>;
  studyGroup?: Maybe<StudyGroupNode>;
};

export type UnitNode = ExternalPlace | Place;

export type UnpublishEventMutation = {
  __typename?: 'UnpublishEventMutation';
  response?: Maybe<EventMutationResponse>;
};

export type UpdateEnrolmentMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  enrolmentId: Scalars['ID'];
  notificationType?: InputMaybe<NotificationType>;
  /** Leave blank if the contact person is the same with group contact person */
  person?: InputMaybe<PersonNodeInput>;
  /** Study group input */
  studyGroup?: InputMaybe<StudyGroupInput>;
};

export type UpdateEnrolmentMutationPayload = {
  __typename?: 'UpdateEnrolmentMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  enrolment?: Maybe<EnrolmentNode>;
};

export type UpdateEventMutation = {
  __typename?: 'UpdateEventMutation';
  response?: Maybe<EventMutationResponse>;
};

export type UpdateEventMutationInput = {
  audience?: InputMaybe<Array<IdObjectInput>>;
  audienceMaxAge?: InputMaybe<Scalars['String']>;
  audienceMinAge?: InputMaybe<Scalars['String']>;
  customData?: InputMaybe<Scalars['String']>;
  datePublished?: InputMaybe<Scalars['String']>;
  description: LocalisedObjectInput;
  /** Set to `true` to save event as draft version, when draft is true, event data validation will be skipped */
  draft?: InputMaybe<Scalars['Boolean']>;
  endTime?: InputMaybe<Scalars['String']>;
  enrolmentEndTime?: InputMaybe<Scalars['String']>;
  enrolmentStartTime?: InputMaybe<Scalars['String']>;
  eventStatus?: InputMaybe<Scalars['String']>;
  externalLinks?: InputMaybe<Array<Scalars['String']>>;
  id: Scalars['String'];
  images?: InputMaybe<Array<IdObjectInput>>;
  inLanguage?: InputMaybe<Array<IdObjectInput>>;
  infoUrl?: InputMaybe<LocalisedObjectInput>;
  keywords: Array<IdObjectInput>;
  localizationExtraInfo?: InputMaybe<LocalisedObjectInput>;
  location?: InputMaybe<IdObjectInput>;
  maximumAttendeeCapacity?: InputMaybe<Scalars['Int']>;
  minimumAttendeeCapacity?: InputMaybe<Scalars['Int']>;
  name: LocalisedObjectInput;
  offers: Array<OfferInput>;
  /** Organisation global id which the created event belongs to */
  organisationId: Scalars['String'];
  /** Palvelutarjotin event data */
  pEvent?: InputMaybe<PalvelutarjotinEventInput>;
  provider?: InputMaybe<LocalisedObjectInput>;
  providerContactInfo?: InputMaybe<Scalars['String']>;
  remainingAttendeeCapacity?: InputMaybe<Scalars['Int']>;
  shortDescription: LocalisedObjectInput;
  startTime: Scalars['String'];
  subEvents?: InputMaybe<Array<Scalars['String']>>;
  superEvent?: InputMaybe<Scalars['String']>;
  superEventType?: InputMaybe<Scalars['String']>;
};

export type UpdateImageMutation = {
  __typename?: 'UpdateImageMutation';
  response?: Maybe<ImageMutationResponse>;
};

export type UpdateImageMutationInput = {
  altText?: InputMaybe<Scalars['String']>;
  cropping?: InputMaybe<Scalars['String']>;
  id: Scalars['String'];
  /** Following GraphQL file upload specs here: https://github.com/jaydenseric/graphql-multipart-request-spec */
  image?: InputMaybe<Scalars['Upload']>;
  license?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  photographerName?: InputMaybe<Scalars['String']>;
};

export type UpdateMyProfileMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  emailAddress?: InputMaybe<Scalars['String']>;
  /** Default `fi` */
  language?: InputMaybe<Language>;
  name?: InputMaybe<Scalars['String']>;
  phoneNumber?: InputMaybe<Scalars['String']>;
  placeIds?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type UpdateMyProfileMutationPayload = {
  __typename?: 'UpdateMyProfileMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  myProfile?: Maybe<PersonNode>;
};

export type UpdateOccurrenceMutationInput = {
  amountOfSeats?: InputMaybe<Scalars['Int']>;
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Should include all contact persons of the occurrence, missing contact persons will be removed during mutation */
  contactPersons?: InputMaybe<Array<InputMaybe<PersonNodeInput>>>;
  endTime?: InputMaybe<Scalars['DateTime']>;
  id: Scalars['ID'];
  /** If present, should include all languages of the occurrence */
  languages: Array<InputMaybe<LanguageInput>>;
  maxGroupSize?: InputMaybe<Scalars['Int']>;
  minGroupSize?: InputMaybe<Scalars['Int']>;
  pEventId?: InputMaybe<Scalars['ID']>;
  placeId?: InputMaybe<Scalars['String']>;
  seatType?: InputMaybe<SeatType>;
  startTime?: InputMaybe<Scalars['DateTime']>;
};

export type UpdateOccurrenceMutationPayload = {
  __typename?: 'UpdateOccurrenceMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  occurrence?: Maybe<OccurrenceNode>;
};

export type UpdateOrganisationMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  name?: InputMaybe<Scalars['String']>;
  phoneNumber?: InputMaybe<Scalars['String']>;
  publisherId?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<OrganisationTypeEnum>;
};

export type UpdateOrganisationMutationPayload = {
  __typename?: 'UpdateOrganisationMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  organisation?: Maybe<OrganisationNode>;
};

export type UpdatePersonMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  emailAddress?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  language?: InputMaybe<Language>;
  name?: InputMaybe<Scalars['String']>;
  phoneNumber?: InputMaybe<Scalars['String']>;
};

export type UpdatePersonMutationPayload = {
  __typename?: 'UpdatePersonMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  person?: Maybe<PersonNode>;
};

export type UpdateStudyGroupMutationInput = {
  amountOfAdult?: InputMaybe<Scalars['Int']>;
  clientMutationId?: InputMaybe<Scalars['String']>;
  extraNeeds?: InputMaybe<Scalars['String']>;
  groupName?: InputMaybe<Scalars['String']>;
  groupSize?: InputMaybe<Scalars['Int']>;
  id: Scalars['ID'];
  person?: InputMaybe<PersonNodeInput>;
  studyLevels?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  unitId?: InputMaybe<Scalars['String']>;
  unitName?: InputMaybe<Scalars['String']>;
};

export type UpdateStudyGroupMutationPayload = {
  __typename?: 'UpdateStudyGroupMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  studyGroup?: Maybe<StudyGroupNode>;
};

export type UpdateVenueMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  hasAreaForGroupWork?: InputMaybe<Scalars['Boolean']>;
  hasClothingStorage?: InputMaybe<Scalars['Boolean']>;
  hasIndoorPlayingArea?: InputMaybe<Scalars['Boolean']>;
  hasOutdoorPlayingArea?: InputMaybe<Scalars['Boolean']>;
  hasSnackEatingPlace?: InputMaybe<Scalars['Boolean']>;
  hasToiletNearby?: InputMaybe<Scalars['Boolean']>;
  /** Place id from linked event */
  id: Scalars['ID'];
  outdoorActivity?: InputMaybe<Scalars['Boolean']>;
  translations?: InputMaybe<Array<InputMaybe<VenueTranslationsInput>>>;
};

export type UpdateVenueMutationPayload = {
  __typename?: 'UpdateVenueMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  venue?: Maybe<VenueNode>;
};

export type UploadImageMutation = {
  __typename?: 'UploadImageMutation';
  response?: Maybe<ImageMutationResponse>;
};

export type UploadImageMutationInput = {
  altText?: InputMaybe<Scalars['String']>;
  cropping?: InputMaybe<Scalars['String']>;
  /** Following GraphQL file upload specs here: https://github.com/jaydenseric/graphql-multipart-request-spec */
  image?: InputMaybe<Scalars['Upload']>;
  license?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  photographerName?: InputMaybe<Scalars['String']>;
};

export type VenueNode = Node & {
  __typename?: 'VenueNode';
  /** Translated field in the language defined in request ACCEPT-LANGUAGE header  */
  description?: Maybe<Scalars['String']>;
  hasAreaForGroupWork: Scalars['Boolean'];
  hasClothingStorage: Scalars['Boolean'];
  hasIndoorPlayingArea: Scalars['Boolean'];
  hasOutdoorPlayingArea: Scalars['Boolean'];
  hasSnackEatingPlace: Scalars['Boolean'];
  hasToiletNearby: Scalars['Boolean'];
  /** place_id from linkedEvent */
  id: Scalars['ID'];
  outdoorActivity: Scalars['Boolean'];
  translations: Array<VenueTranslationType>;
};

export type VenueNodeConnection = {
  __typename?: 'VenueNodeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<VenueNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `VenueNode` and its cursor. */
export type VenueNodeEdge = {
  __typename?: 'VenueNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<VenueNode>;
};

export type VenueTranslationType = {
  __typename?: 'VenueTranslationType';
  description: Scalars['String'];
  languageCode: Language;
};

export type VenueTranslationsInput = {
  description?: InputMaybe<Scalars['String']>;
  languageCode: Language;
};

export type EnrolOccurrenceMutationVariables = Exact<{
  input: EnrolOccurrenceMutationInput;
}>;


export type EnrolOccurrenceMutation = { __typename?: 'Mutation', enrolOccurrence?: { __typename?: 'EnrolOccurrenceMutationPayload', enrolments?: Array<{ __typename?: 'EnrolmentNode', id: string, notificationType?: NotificationType | null, enrolmentTime: any, status?: EnrolmentStatus | null, person?: { __typename?: 'PersonNode', id: string, emailAddress: string, name: string, phoneNumber: string, language: Language } | null, studyGroup: { __typename?: 'StudyGroupNode', id: string, unitId?: string | null, unitName: string, groupSize: number, amountOfAdult: number, groupName: string, extraNeeds: string, unit?: { __typename?: 'ExternalPlace', name?: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null } | null } | { __typename?: 'Place', internalId: string, id?: string | null, name?: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null } | null } | null, studyLevels: { __typename?: 'StudyLevelNodeConnection', edges: Array<{ __typename?: 'StudyLevelNodeEdge', node?: { __typename?: 'StudyLevelNode', id: string, label?: string | null, level: number, translations: Array<{ __typename?: 'StudyLevelTranslationType', languageCode: Language, label: string }> } | null } | null> }, person?: { __typename?: 'PersonNode', id: string, emailAddress: string, name: string, phoneNumber: string, language: Language } | null } } | null> | null } | null };

export type EnrolmentFieldsFragment = { __typename?: 'EnrolmentNode', id: string, notificationType?: NotificationType | null, enrolmentTime: any, status?: EnrolmentStatus | null, person?: { __typename?: 'PersonNode', id: string, emailAddress: string, name: string, phoneNumber: string, language: Language } | null, studyGroup: { __typename?: 'StudyGroupNode', id: string, unitId?: string | null, unitName: string, groupSize: number, amountOfAdult: number, groupName: string, extraNeeds: string, unit?: { __typename?: 'ExternalPlace', name?: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null } | null } | { __typename?: 'Place', internalId: string, id?: string | null, name?: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null } | null } | null, studyLevels: { __typename?: 'StudyLevelNodeConnection', edges: Array<{ __typename?: 'StudyLevelNodeEdge', node?: { __typename?: 'StudyLevelNode', id: string, label?: string | null, level: number, translations: Array<{ __typename?: 'StudyLevelTranslationType', languageCode: Language, label: string }> } | null } | null> }, person?: { __typename?: 'PersonNode', id: string, emailAddress: string, name: string, phoneNumber: string, language: Language } | null } };

export type PEventFieldsFragment = { __typename?: 'PalvelutarjotinEventNode', autoAcceptance: boolean, id: string, enrolmentEndDays?: number | null, enrolmentStart?: any | null, externalEnrolmentUrl?: string | null, neededOccurrences: number, contactPhoneNumber: string, contactEmail: string, mandatoryAdditionalInformation: boolean, nextOccurrenceDatetime?: any | null, lastOccurrenceDatetime?: any | null, organisation?: { __typename?: 'OrganisationNode', id: string, name: string } | null, contactPerson?: { __typename?: 'PersonNode', id: string, name: string } | null, occurrences?: { __typename?: 'OccurrenceNodeConnection', edges: Array<{ __typename?: 'OccurrenceNodeEdge', node?: { __typename?: 'OccurrenceNode', id: string, amountOfSeats: number, seatsTaken: number, seatType: OccurrenceSeatType, remainingSeats: number, minGroupSize?: number | null, maxGroupSize?: number | null, cancelled: boolean, startTime: any, endTime: any, placeId: string, pEvent?: { __typename?: 'PalvelutarjotinEventNode', id: string } | null, languages: { __typename?: 'LanguageNodeConnection', edges: Array<{ __typename?: 'LanguageNodeEdge', node?: { __typename?: 'LanguageNode', id: string, name: string } | null } | null> } } | null } | null> } | null, nextOccurrence?: { __typename?: 'OccurrenceNodeConnection', edges: Array<{ __typename?: 'OccurrenceNodeEdge', node?: { __typename?: 'OccurrenceNode', id: string, startTime: any, endTime: any } | null } | null> } | null };

export type LocalisedFieldsFragment = { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null };

export type OfferFieldsFragment = { __typename?: 'Offer', isFree?: boolean | null, description?: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null } | null, price?: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null } | null, infoUrl?: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null } | null };

export type EventFieldsFragment = { __typename?: 'Event', id: string, internalId: string, startTime?: string | null, name: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null }, shortDescription: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null }, description: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null }, images: Array<{ __typename?: 'Image', id?: string | null, internalId: string, license?: string | null, name: string, url: string, cropping?: string | null, photographerName?: string | null, altText?: string | null }>, infoUrl?: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null } | null, offers: Array<{ __typename?: 'Offer', isFree?: boolean | null, description?: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null } | null, price?: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null } | null, infoUrl?: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null } | null }>, pEvent: { __typename?: 'PalvelutarjotinEventNode', autoAcceptance: boolean, id: string, enrolmentEndDays?: number | null, enrolmentStart?: any | null, externalEnrolmentUrl?: string | null, neededOccurrences: number, contactPhoneNumber: string, contactEmail: string, mandatoryAdditionalInformation: boolean, nextOccurrenceDatetime?: any | null, lastOccurrenceDatetime?: any | null, organisation?: { __typename?: 'OrganisationNode', id: string, name: string } | null, contactPerson?: { __typename?: 'PersonNode', id: string, name: string } | null, occurrences?: { __typename?: 'OccurrenceNodeConnection', edges: Array<{ __typename?: 'OccurrenceNodeEdge', node?: { __typename?: 'OccurrenceNode', id: string, amountOfSeats: number, seatsTaken: number, seatType: OccurrenceSeatType, remainingSeats: number, minGroupSize?: number | null, maxGroupSize?: number | null, cancelled: boolean, startTime: any, endTime: any, placeId: string, pEvent?: { __typename?: 'PalvelutarjotinEventNode', id: string } | null, languages: { __typename?: 'LanguageNodeConnection', edges: Array<{ __typename?: 'LanguageNodeEdge', node?: { __typename?: 'LanguageNode', id: string, name: string } | null } | null> } } | null } | null> } | null, nextOccurrence?: { __typename?: 'OccurrenceNodeConnection', edges: Array<{ __typename?: 'OccurrenceNodeEdge', node?: { __typename?: 'OccurrenceNode', id: string, startTime: any, endTime: any } | null } | null> } | null }, inLanguage: Array<{ __typename?: 'InLanguage', id?: string | null, internalId: string, name?: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null } | null }>, audience: Array<{ __typename?: 'Keyword', id?: string | null, internalId: string, name?: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null } | null }>, keywords: Array<{ __typename?: 'Keyword', id?: string | null, internalId: string, name?: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null } | null }>, location?: { __typename?: 'Place', id?: string | null, internalId: string, name?: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null } | null, streetAddress?: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null } | null, addressLocality?: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null } | null, telephone?: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null } | null } | null, venue?: { __typename?: 'VenueNode', id: string, hasClothingStorage: boolean, hasSnackEatingPlace: boolean, outdoorActivity: boolean, hasToiletNearby: boolean, hasAreaForGroupWork: boolean, hasIndoorPlayingArea: boolean, hasOutdoorPlayingArea: boolean, translations: Array<{ __typename?: 'VenueTranslationType', languageCode: Language, description: string }> } | null, additionalCriteria: Array<{ __typename?: 'Keyword', id?: string | null, internalId: string, name?: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null } | null }>, categories: Array<{ __typename?: 'Keyword', id?: string | null, internalId: string, name?: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null } | null }> };

export type EventQueryVariables = Exact<{
  id: Scalars['ID'];
  include?: InputMaybe<Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>>;
  upcomingOccurrencesOnly?: InputMaybe<Scalars['Boolean']>;
}>;


export type EventQuery = { __typename?: 'Query', event?: { __typename?: 'Event', id: string, internalId: string, startTime?: string | null, name: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null }, shortDescription: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null }, description: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null }, images: Array<{ __typename?: 'Image', id?: string | null, internalId: string, license?: string | null, name: string, url: string, cropping?: string | null, photographerName?: string | null, altText?: string | null }>, infoUrl?: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null } | null, offers: Array<{ __typename?: 'Offer', isFree?: boolean | null, description?: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null } | null, price?: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null } | null, infoUrl?: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null } | null }>, pEvent: { __typename?: 'PalvelutarjotinEventNode', autoAcceptance: boolean, id: string, enrolmentEndDays?: number | null, enrolmentStart?: any | null, externalEnrolmentUrl?: string | null, neededOccurrences: number, contactPhoneNumber: string, contactEmail: string, mandatoryAdditionalInformation: boolean, nextOccurrenceDatetime?: any | null, lastOccurrenceDatetime?: any | null, organisation?: { __typename?: 'OrganisationNode', id: string, name: string } | null, contactPerson?: { __typename?: 'PersonNode', id: string, name: string } | null, occurrences?: { __typename?: 'OccurrenceNodeConnection', edges: Array<{ __typename?: 'OccurrenceNodeEdge', node?: { __typename?: 'OccurrenceNode', id: string, amountOfSeats: number, seatsTaken: number, seatType: OccurrenceSeatType, remainingSeats: number, minGroupSize?: number | null, maxGroupSize?: number | null, cancelled: boolean, startTime: any, endTime: any, placeId: string, pEvent?: { __typename?: 'PalvelutarjotinEventNode', id: string } | null, languages: { __typename?: 'LanguageNodeConnection', edges: Array<{ __typename?: 'LanguageNodeEdge', node?: { __typename?: 'LanguageNode', id: string, name: string } | null } | null> } } | null } | null> } | null, nextOccurrence?: { __typename?: 'OccurrenceNodeConnection', edges: Array<{ __typename?: 'OccurrenceNodeEdge', node?: { __typename?: 'OccurrenceNode', id: string, startTime: any, endTime: any } | null } | null> } | null }, inLanguage: Array<{ __typename?: 'InLanguage', id?: string | null, internalId: string, name?: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null } | null }>, audience: Array<{ __typename?: 'Keyword', id?: string | null, internalId: string, name?: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null } | null }>, keywords: Array<{ __typename?: 'Keyword', id?: string | null, internalId: string, name?: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null } | null }>, location?: { __typename?: 'Place', id?: string | null, internalId: string, name?: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null } | null, streetAddress?: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null } | null, addressLocality?: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null } | null, telephone?: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null } | null } | null, venue?: { __typename?: 'VenueNode', id: string, hasClothingStorage: boolean, hasSnackEatingPlace: boolean, outdoorActivity: boolean, hasToiletNearby: boolean, hasAreaForGroupWork: boolean, hasIndoorPlayingArea: boolean, hasOutdoorPlayingArea: boolean, translations: Array<{ __typename?: 'VenueTranslationType', languageCode: Language, description: string }> } | null, additionalCriteria: Array<{ __typename?: 'Keyword', id?: string | null, internalId: string, name?: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null } | null }>, categories: Array<{ __typename?: 'Keyword', id?: string | null, internalId: string, name?: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null } | null }> } | null };

export type EnrolEventQueueMutationVariables = Exact<{
  input: EnrolEventQueueMutationInput;
}>;


export type EnrolEventQueueMutation = { __typename?: 'Mutation', enrolEventQueue?: { __typename?: 'EnrolEventQueueMutationPayload', eventQueueEnrolment?: { __typename?: 'EventQueueEnrolmentNode', id: string, notificationType?: NotificationType | null, enrolmentTime: any, status?: EventQueueEnrolmentStatus | null, person?: { __typename?: 'PersonNode', id: string, emailAddress: string, name: string, phoneNumber: string, language: Language } | null, studyGroup: { __typename?: 'StudyGroupNode', id: string, unitId?: string | null, unitName: string, groupSize: number, amountOfAdult: number, groupName: string, extraNeeds: string, unit?: { __typename?: 'ExternalPlace', name?: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null } | null } | { __typename?: 'Place', internalId: string, id?: string | null, name?: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null } | null } | null, studyLevels: { __typename?: 'StudyLevelNodeConnection', edges: Array<{ __typename?: 'StudyLevelNodeEdge', node?: { __typename?: 'StudyLevelNode', id: string, label?: string | null, level: number, translations: Array<{ __typename?: 'StudyLevelTranslationType', languageCode: Language, label: string }> } | null } | null> }, person?: { __typename?: 'PersonNode', id: string, emailAddress: string, name: string, phoneNumber: string, language: Language } | null } } | null } | null };

export type EventQueueEnrolmentFieldsFragment = { __typename?: 'EventQueueEnrolmentNode', id: string, notificationType?: NotificationType | null, enrolmentTime: any, status?: EventQueueEnrolmentStatus | null, person?: { __typename?: 'PersonNode', id: string, emailAddress: string, name: string, phoneNumber: string, language: Language } | null, studyGroup: { __typename?: 'StudyGroupNode', id: string, unitId?: string | null, unitName: string, groupSize: number, amountOfAdult: number, groupName: string, extraNeeds: string, unit?: { __typename?: 'ExternalPlace', name?: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null } | null } | { __typename?: 'Place', internalId: string, id?: string | null, name?: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null } | null } | null, studyLevels: { __typename?: 'StudyLevelNodeConnection', edges: Array<{ __typename?: 'StudyLevelNodeEdge', node?: { __typename?: 'StudyLevelNode', id: string, label?: string | null, level: number, translations: Array<{ __typename?: 'StudyLevelTranslationType', languageCode: Language, label: string }> } | null } | null> }, person?: { __typename?: 'PersonNode', id: string, emailAddress: string, name: string, phoneNumber: string, language: Language } | null } };

export type MetaFieldsFragment = { __typename?: 'Meta', count?: number | null, next?: string | null, previous?: string | null };

export type EventsFieldsFragment = { __typename?: 'Event', id: string, internalId: string, startTime?: string | null, name: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null }, shortDescription: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null }, description: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null }, images: Array<{ __typename?: 'Image', id?: string | null, internalId: string, license?: string | null, name: string, url: string, cropping?: string | null, photographerName?: string | null, altText?: string | null }>, infoUrl?: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null } | null, offers: Array<{ __typename?: 'Offer', isFree?: boolean | null, description?: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null } | null, price?: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null } | null, infoUrl?: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null } | null }>, pEvent: { __typename?: 'PalvelutarjotinEventNode', id: string, nextOccurrenceDatetime?: any | null, lastOccurrenceDatetime?: any | null, nextOccurrence?: { __typename?: 'OccurrenceNodeConnection', edges: Array<{ __typename?: 'OccurrenceNodeEdge', node?: { __typename?: 'OccurrenceNode', id: string, startTime: any, endTime: any } | null } | null> } | null, organisation?: { __typename?: 'OrganisationNode', id: string, name: string } | null }, inLanguage: Array<{ __typename?: 'InLanguage', id?: string | null, internalId: string, name?: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null } | null }>, audience: Array<{ __typename?: 'Keyword', id?: string | null, internalId: string, name?: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null } | null }>, keywords: Array<{ __typename?: 'Keyword', id?: string | null, internalId: string, name?: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null } | null }>, location?: { __typename?: 'Place', id?: string | null, internalId: string, name?: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null } | null, streetAddress?: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null } | null, addressLocality?: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null } | null, telephone?: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null } | null } | null };

export type EventsQueryVariables = Exact<{
  division?: InputMaybe<Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>>;
  allOngoingAnd?: InputMaybe<Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>>;
  end?: InputMaybe<Scalars['String']>;
  include?: InputMaybe<Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>>;
  inLanguage?: InputMaybe<Scalars['String']>;
  isFree?: InputMaybe<Scalars['Boolean']>;
  keyword?: InputMaybe<Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>>;
  keywordNot?: InputMaybe<Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>>;
  language?: InputMaybe<Scalars['String']>;
  location?: InputMaybe<Scalars['String']>;
  page?: InputMaybe<Scalars['Int']>;
  pageSize?: InputMaybe<Scalars['Int']>;
  publisher?: InputMaybe<Scalars['ID']>;
  sort?: InputMaybe<Scalars['String']>;
  start?: InputMaybe<Scalars['String']>;
  superEvent?: InputMaybe<Scalars['ID']>;
  superEventType?: InputMaybe<Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>>;
  text?: InputMaybe<Scalars['String']>;
  translation?: InputMaybe<Scalars['String']>;
  organisationId?: InputMaybe<Scalars['String']>;
}>;


export type EventsQuery = { __typename?: 'Query', events?: { __typename?: 'EventListResponse', meta: { __typename?: 'Meta', count?: number | null, next?: string | null, previous?: string | null }, data: Array<{ __typename?: 'Event', id: string, internalId: string, startTime?: string | null, name: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null }, shortDescription: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null }, description: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null }, images: Array<{ __typename?: 'Image', id?: string | null, internalId: string, license?: string | null, name: string, url: string, cropping?: string | null, photographerName?: string | null, altText?: string | null }>, infoUrl?: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null } | null, offers: Array<{ __typename?: 'Offer', isFree?: boolean | null, description?: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null } | null, price?: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null } | null, infoUrl?: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null } | null }>, pEvent: { __typename?: 'PalvelutarjotinEventNode', id: string, nextOccurrenceDatetime?: any | null, lastOccurrenceDatetime?: any | null, nextOccurrence?: { __typename?: 'OccurrenceNodeConnection', edges: Array<{ __typename?: 'OccurrenceNodeEdge', node?: { __typename?: 'OccurrenceNode', id: string, startTime: any, endTime: any } | null } | null> } | null, organisation?: { __typename?: 'OrganisationNode', id: string, name: string } | null }, inLanguage: Array<{ __typename?: 'InLanguage', id?: string | null, internalId: string, name?: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null } | null }>, audience: Array<{ __typename?: 'Keyword', id?: string | null, internalId: string, name?: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null } | null }>, keywords: Array<{ __typename?: 'Keyword', id?: string | null, internalId: string, name?: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null } | null }>, location?: { __typename?: 'Place', id?: string | null, internalId: string, name?: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null } | null, streetAddress?: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null } | null, addressLocality?: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null } | null, telephone?: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null } | null } | null }> } | null };

export type UpcomingEventsQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']>;
  pageSize?: InputMaybe<Scalars['Int']>;
  include?: InputMaybe<Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>>;
}>;


export type UpcomingEventsQuery = { __typename?: 'Query', upcomingEvents?: { __typename?: 'EventListPaginatedTypeResponse', pageInfo: { __typename?: 'PaginatedType', totalCount?: number | null, page?: number | null, hasNextPage?: boolean | null }, data: Array<{ __typename?: 'Event', id: string, internalId: string, startTime?: string | null, name: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null }, shortDescription: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null }, description: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null }, images: Array<{ __typename?: 'Image', id?: string | null, internalId: string, license?: string | null, name: string, url: string, cropping?: string | null, photographerName?: string | null, altText?: string | null }>, infoUrl?: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null } | null, offers: Array<{ __typename?: 'Offer', isFree?: boolean | null, description?: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null } | null, price?: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null } | null, infoUrl?: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null } | null }>, pEvent: { __typename?: 'PalvelutarjotinEventNode', id: string, nextOccurrenceDatetime?: any | null, lastOccurrenceDatetime?: any | null, nextOccurrence?: { __typename?: 'OccurrenceNodeConnection', edges: Array<{ __typename?: 'OccurrenceNodeEdge', node?: { __typename?: 'OccurrenceNode', id: string, startTime: any, endTime: any } | null } | null> } | null, organisation?: { __typename?: 'OrganisationNode', id: string, name: string } | null }, inLanguage: Array<{ __typename?: 'InLanguage', id?: string | null, internalId: string, name?: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null } | null }>, audience: Array<{ __typename?: 'Keyword', id?: string | null, internalId: string, name?: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null } | null }>, keywords: Array<{ __typename?: 'Keyword', id?: string | null, internalId: string, name?: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null } | null }>, location?: { __typename?: 'Place', id?: string | null, internalId: string, name?: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null } | null, streetAddress?: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null } | null, addressLocality?: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null } | null, telephone?: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null } | null } | null }> } | null };

export type ImageFieldsFragment = { __typename?: 'Image', id?: string | null, internalId: string, license?: string | null, name: string, url: string, cropping?: string | null, photographerName?: string | null, altText?: string | null };

export type ImageQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type ImageQuery = { __typename?: 'Query', image?: { __typename?: 'Image', id?: string | null, internalId: string, license?: string | null, name: string, url: string, cropping?: string | null, photographerName?: string | null, altText?: string | null } | null };

export type KeywordFieldsFragment = { __typename?: 'Keyword', id?: string | null, internalId: string, name?: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null } | null };

export type KeywordQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type KeywordQuery = { __typename?: 'Query', keyword?: { __typename?: 'Keyword', id?: string | null, internalId: string, name?: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null } | null } | null };

export type KeywordsQueryVariables = Exact<{
  dataSource?: InputMaybe<Scalars['String']>;
  page?: InputMaybe<Scalars['Int']>;
  pageSize?: InputMaybe<Scalars['Int']>;
  showAllKeywords?: InputMaybe<Scalars['Boolean']>;
  sort?: InputMaybe<Scalars['String']>;
  text?: InputMaybe<Scalars['String']>;
}>;


export type KeywordsQuery = { __typename?: 'Query', keywords?: { __typename?: 'KeywordListResponse', meta: { __typename?: 'Meta', count?: number | null, next?: string | null, previous?: string | null }, data: Array<{ __typename?: 'Keyword', id?: string | null, internalId: string, name?: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null } | null }> } | null };

export type KeywordSetQueryVariables = Exact<{
  setType: KeywordSetType;
}>;


export type KeywordSetQuery = { __typename?: 'Query', keywordSet?: { __typename?: 'KeywordSet', internalId: string, keywords: Array<{ __typename?: 'Keyword', id?: string | null, internalId: string, name?: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null } | null }>, name?: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null } | null } | null };

export type PopularKeywordsQueryVariables = Exact<{
  amount?: InputMaybe<Scalars['Int']>;
  showAllKeywords?: InputMaybe<Scalars['Boolean']>;
}>;


export type PopularKeywordsQuery = { __typename?: 'Query', popularKultusKeywords?: { __typename?: 'KeywordListResponse', meta: { __typename?: 'Meta', count?: number | null, next?: string | null, previous?: string | null }, data: Array<{ __typename?: 'Keyword', id?: string | null, internalId: string, name?: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null } | null }> } | null };

export type LanguageFieldsFragment = { __typename?: 'LanguageNode', id: string, name: string };

export type OccurrenceFieldsFragment = { __typename?: 'OccurrenceNode', id: string, amountOfSeats: number, seatsTaken: number, seatType: OccurrenceSeatType, remainingSeats: number, minGroupSize?: number | null, maxGroupSize?: number | null, cancelled: boolean, startTime: any, endTime: any, placeId: string, pEvent?: { __typename?: 'PalvelutarjotinEventNode', id: string } | null, languages: { __typename?: 'LanguageNodeConnection', edges: Array<{ __typename?: 'LanguageNodeEdge', node?: { __typename?: 'LanguageNode', id: string, name: string } | null } | null> } };

export type OccurrenceQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type OccurrenceQuery = { __typename?: 'Query', occurrence?: { __typename?: 'OccurrenceNode', id: string, amountOfSeats: number, seatsTaken: number, seatType: OccurrenceSeatType, remainingSeats: number, minGroupSize?: number | null, maxGroupSize?: number | null, cancelled: boolean, startTime: any, endTime: any, placeId: string, pEvent?: { __typename?: 'PalvelutarjotinEventNode', id: string } | null, languages: { __typename?: 'LanguageNodeConnection', edges: Array<{ __typename?: 'LanguageNodeEdge', node?: { __typename?: 'LanguageNode', id: string, name: string } | null } | null> } } | null };

export type OccurrencesQueryVariables = Exact<{
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  cancelled?: InputMaybe<Scalars['Boolean']>;
  pEvent?: InputMaybe<Scalars['ID']>;
  orderBy?: InputMaybe<Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>>;
  upcoming?: InputMaybe<Scalars['Boolean']>;
  enrollable?: InputMaybe<Scalars['Boolean']>;
}>;


export type OccurrencesQuery = { __typename?: 'Query', occurrences?: { __typename?: 'OccurrenceNodeConnection', pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null }, edges: Array<{ __typename?: 'OccurrenceNodeEdge', cursor: string, node?: { __typename?: 'OccurrenceNode', id: string, amountOfSeats: number, seatsTaken: number, seatType: OccurrenceSeatType, remainingSeats: number, minGroupSize?: number | null, maxGroupSize?: number | null, cancelled: boolean, startTime: any, endTime: any, placeId: string, pEvent?: { __typename?: 'PalvelutarjotinEventNode', id: string } | null, languages: { __typename?: 'LanguageNodeConnection', edges: Array<{ __typename?: 'LanguageNodeEdge', node?: { __typename?: 'LanguageNode', id: string, name: string } | null } | null> } } | null } | null> } | null };

export type OrganisationFieldsFragment = { __typename?: 'OrganisationNode', id: string, name: string };

export type PersonFieldsFragment = { __typename?: 'PersonNode', id: string, emailAddress: string, name: string, phoneNumber: string, language: Language };

export type PlaceFieldsFragment = { __typename?: 'Place', id?: string | null, internalId: string, name?: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null } | null, streetAddress?: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null } | null, addressLocality?: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null } | null, telephone?: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null } | null };

export type PlaceQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type PlaceQuery = { __typename?: 'Query', place?: { __typename?: 'Place', id?: string | null, internalId: string, name?: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null } | null, streetAddress?: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null } | null, addressLocality?: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null } | null, telephone?: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null } | null } | null };

export type PlacesQueryVariables = Exact<{
  dataSource?: InputMaybe<Scalars['String']>;
  divisions?: InputMaybe<Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>>;
  page?: InputMaybe<Scalars['Int']>;
  pageSize?: InputMaybe<Scalars['Int']>;
  showAllPlaces?: InputMaybe<Scalars['Boolean']>;
  sort?: InputMaybe<Scalars['String']>;
  text?: InputMaybe<Scalars['String']>;
}>;


export type PlacesQuery = { __typename?: 'Query', places?: { __typename?: 'PlaceListResponse', meta: { __typename?: 'Meta', count?: number | null, next?: string | null, previous?: string | null }, data: Array<{ __typename?: 'Place', id?: string | null, internalId: string, name?: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null } | null, streetAddress?: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null } | null, addressLocality?: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null } | null, telephone?: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null } | null }> } | null };

export type SchoolsAndKindergartensListQueryVariables = Exact<{ [key: string]: never; }>;


export type SchoolsAndKindergartensListQuery = { __typename?: 'Query', schoolsAndKindergartensList?: { __typename?: 'ServiceUnitNameListResponse', meta: { __typename?: 'Meta', count?: number | null }, data: Array<{ __typename?: 'ServiceUnitNode', id: string, name?: { __typename?: 'LocalisedObject', fi?: string | null, sv?: string | null, en?: string | null } | null }> } | null };

export type StudyGroupFieldsFragment = { __typename?: 'StudyGroupNode', id: string, unitId?: string | null, unitName: string, groupSize: number, amountOfAdult: number, groupName: string, extraNeeds: string, unit?: { __typename?: 'ExternalPlace', name?: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null } | null } | { __typename?: 'Place', internalId: string, id?: string | null, name?: { __typename?: 'LocalisedObject', en?: string | null, fi?: string | null, sv?: string | null } | null } | null, studyLevels: { __typename?: 'StudyLevelNodeConnection', edges: Array<{ __typename?: 'StudyLevelNodeEdge', node?: { __typename?: 'StudyLevelNode', id: string, label?: string | null, level: number, translations: Array<{ __typename?: 'StudyLevelTranslationType', languageCode: Language, label: string }> } | null } | null> }, person?: { __typename?: 'PersonNode', id: string, emailAddress: string, name: string, phoneNumber: string, language: Language } | null };

export type StudyLevelFieldsFragment = { __typename?: 'StudyLevelNode', id: string, label?: string | null, level: number, translations: Array<{ __typename?: 'StudyLevelTranslationType', languageCode: Language, label: string }> };

export type StudyLevelsQueryVariables = Exact<{ [key: string]: never; }>;


export type StudyLevelsQuery = { __typename?: 'Query', studyLevels?: { __typename?: 'StudyLevelNodeConnection', edges: Array<{ __typename?: 'StudyLevelNodeEdge', node?: { __typename?: 'StudyLevelNode', id: string, label?: string | null, level: number, translations: Array<{ __typename?: 'StudyLevelTranslationType', languageCode: Language, label: string }> } | null } | null> } | null };

export type StudyLevelQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type StudyLevelQuery = { __typename?: 'Query', studyLevel?: { __typename?: 'StudyLevelNode', id: string, label?: string | null, level: number, translations: Array<{ __typename?: 'StudyLevelTranslationType', languageCode: Language, label: string }> } | null };

export type VenueFieldsFragment = { __typename?: 'VenueNode', id: string, hasClothingStorage: boolean, hasSnackEatingPlace: boolean, outdoorActivity: boolean, hasToiletNearby: boolean, hasAreaForGroupWork: boolean, hasIndoorPlayingArea: boolean, hasOutdoorPlayingArea: boolean, translations: Array<{ __typename?: 'VenueTranslationType', languageCode: Language, description: string }> };

export type VenueQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type VenueQuery = { __typename?: 'Query', venue?: { __typename?: 'VenueNode', id: string, hasClothingStorage: boolean, hasSnackEatingPlace: boolean, outdoorActivity: boolean, hasToiletNearby: boolean, hasAreaForGroupWork: boolean, hasIndoorPlayingArea: boolean, hasOutdoorPlayingArea: boolean, translations: Array<{ __typename?: 'VenueTranslationType', languageCode: Language, description: string }> } | null };

export const PersonFieldsFragmentDoc = gql`
    fragment personFields on PersonNode {
  id
  emailAddress
  name
  phoneNumber
  language
}
    `;
export const LocalisedFieldsFragmentDoc = gql`
    fragment localisedFields on LocalisedObject {
  en
  fi
  sv
}
    `;
export const StudyLevelFieldsFragmentDoc = gql`
    fragment studyLevelFields on StudyLevelNode {
  id
  label
  level
  translations {
    languageCode
    label
  }
}
    `;
export const StudyGroupFieldsFragmentDoc = gql`
    fragment studyGroupFields on StudyGroupNode {
  id
  unitId
  unitName
  unit {
    ... on ExternalPlace {
      name {
        ...localisedFields
      }
    }
    ... on Place {
      internalId
      id
      name {
        ...localisedFields
      }
    }
  }
  groupSize
  amountOfAdult
  groupName
  studyLevels {
    edges {
      node {
        ...studyLevelFields
      }
    }
  }
  extraNeeds
  person {
    ...personFields
  }
}
    ${LocalisedFieldsFragmentDoc}
${StudyLevelFieldsFragmentDoc}
${PersonFieldsFragmentDoc}`;
export const EnrolmentFieldsFragmentDoc = gql`
    fragment enrolmentFields on EnrolmentNode {
  id
  notificationType
  enrolmentTime
  status
  person {
    ...personFields
  }
  studyGroup {
    ...studyGroupFields
  }
}
    ${PersonFieldsFragmentDoc}
${StudyGroupFieldsFragmentDoc}`;
export const ImageFieldsFragmentDoc = gql`
    fragment imageFields on Image {
  id
  internalId
  license
  name
  url
  cropping
  photographerName
  altText
}
    `;
export const OfferFieldsFragmentDoc = gql`
    fragment offerFields on Offer {
  isFree
  description {
    ...localisedFields
  }
  price {
    ...localisedFields
  }
  infoUrl {
    ...localisedFields
  }
}
    ${LocalisedFieldsFragmentDoc}`;
export const LanguageFieldsFragmentDoc = gql`
    fragment languageFields on LanguageNode {
  id
  name
}
    `;
export const OccurrenceFieldsFragmentDoc = gql`
    fragment occurrenceFields on OccurrenceNode {
  id
  pEvent {
    id
  }
  amountOfSeats
  seatsTaken
  seatType
  remainingSeats
  minGroupSize
  maxGroupSize
  languages {
    edges {
      node {
        ...languageFields
      }
    }
  }
  cancelled
  startTime
  endTime
  placeId
}
    ${LanguageFieldsFragmentDoc}`;
export const OrganisationFieldsFragmentDoc = gql`
    fragment organisationFields on OrganisationNode {
  id
  name
}
    `;
export const PEventFieldsFragmentDoc = gql`
    fragment pEventFields on PalvelutarjotinEventNode {
  autoAcceptance
  id
  enrolmentEndDays
  enrolmentStart
  externalEnrolmentUrl
  neededOccurrences
  contactPhoneNumber
  contactEmail
  mandatoryAdditionalInformation
  organisation {
    id
    name
  }
  contactPerson {
    id
    name
  }
  occurrences(upcoming: $upcomingOccurrencesOnly) {
    edges {
      node {
        ...occurrenceFields
      }
    }
  }
  nextOccurrence: occurrences(first: 1, upcoming: true) {
    edges {
      node {
        id
        startTime
        endTime
      }
    }
  }
  organisation {
    ...organisationFields
  }
  nextOccurrenceDatetime
  lastOccurrenceDatetime
}
    ${OccurrenceFieldsFragmentDoc}
${OrganisationFieldsFragmentDoc}`;
export const KeywordFieldsFragmentDoc = gql`
    fragment keywordFields on Keyword {
  id
  internalId
  name {
    ...localisedFields
  }
}
    ${LocalisedFieldsFragmentDoc}`;
export const PlaceFieldsFragmentDoc = gql`
    fragment placeFields on Place {
  id
  internalId
  name {
    ...localisedFields
  }
  streetAddress {
    ...localisedFields
  }
  addressLocality {
    ...localisedFields
  }
  telephone {
    ...localisedFields
  }
}
    ${LocalisedFieldsFragmentDoc}`;
export const VenueFieldsFragmentDoc = gql`
    fragment venueFields on VenueNode {
  id
  hasClothingStorage
  hasSnackEatingPlace
  outdoorActivity
  hasToiletNearby
  hasAreaForGroupWork
  hasIndoorPlayingArea
  hasOutdoorPlayingArea
  translations {
    languageCode
    description
  }
}
    `;
export const EventFieldsFragmentDoc = gql`
    fragment eventFields on Event {
  id
  internalId
  name {
    ...localisedFields
  }
  shortDescription {
    ...localisedFields
  }
  description {
    ...localisedFields
  }
  images {
    ...imageFields
  }
  infoUrl {
    ...localisedFields
  }
  offers {
    ...offerFields
  }
  pEvent {
    ...pEventFields
  }
  inLanguage {
    id
    internalId
    name {
      ...localisedFields
    }
  }
  audience {
    ...keywordFields
  }
  keywords {
    ...keywordFields
  }
  location {
    ...placeFields
  }
  venue {
    ...venueFields
  }
  startTime
  additionalCriteria {
    ...keywordFields
  }
  categories {
    ...keywordFields
  }
}
    ${LocalisedFieldsFragmentDoc}
${ImageFieldsFragmentDoc}
${OfferFieldsFragmentDoc}
${PEventFieldsFragmentDoc}
${KeywordFieldsFragmentDoc}
${PlaceFieldsFragmentDoc}
${VenueFieldsFragmentDoc}`;
export const EventQueueEnrolmentFieldsFragmentDoc = gql`
    fragment eventQueueEnrolmentFields on EventQueueEnrolmentNode {
  id
  notificationType
  enrolmentTime
  status
  person {
    ...personFields
  }
  studyGroup {
    ...studyGroupFields
  }
}
    ${PersonFieldsFragmentDoc}
${StudyGroupFieldsFragmentDoc}`;
export const MetaFieldsFragmentDoc = gql`
    fragment metaFields on Meta {
  count
  next
  previous
}
    `;
export const EventsFieldsFragmentDoc = gql`
    fragment eventsFields on Event {
  id
  internalId
  name {
    ...localisedFields
  }
  shortDescription {
    ...localisedFields
  }
  description {
    ...localisedFields
  }
  images {
    ...imageFields
  }
  infoUrl {
    ...localisedFields
  }
  offers {
    ...offerFields
  }
  pEvent {
    id
    nextOccurrenceDatetime
    lastOccurrenceDatetime
    nextOccurrence: occurrences(first: 1, upcoming: true) {
      edges {
        node {
          id
          startTime
          endTime
        }
      }
    }
    organisation {
      id
      name
    }
  }
  inLanguage {
    id
    internalId
    name {
      ...localisedFields
    }
  }
  audience {
    ...keywordFields
  }
  keywords {
    ...keywordFields
  }
  location {
    ...placeFields
  }
  startTime
}
    ${LocalisedFieldsFragmentDoc}
${ImageFieldsFragmentDoc}
${OfferFieldsFragmentDoc}
${KeywordFieldsFragmentDoc}
${PlaceFieldsFragmentDoc}`;
export const EnrolOccurrenceDocument = gql`
    mutation EnrolOccurrence($input: EnrolOccurrenceMutationInput!) {
  enrolOccurrence(input: $input) {
    enrolments {
      ...enrolmentFields
    }
  }
}
    ${EnrolmentFieldsFragmentDoc}`;
export type EnrolOccurrenceMutationFn = Apollo.MutationFunction<EnrolOccurrenceMutation, EnrolOccurrenceMutationVariables>;

/**
 * __useEnrolOccurrenceMutation__
 *
 * To run a mutation, you first call `useEnrolOccurrenceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEnrolOccurrenceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [enrolOccurrenceMutation, { data, loading, error }] = useEnrolOccurrenceMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useEnrolOccurrenceMutation(baseOptions?: Apollo.MutationHookOptions<EnrolOccurrenceMutation, EnrolOccurrenceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EnrolOccurrenceMutation, EnrolOccurrenceMutationVariables>(EnrolOccurrenceDocument, options);
      }
export type EnrolOccurrenceMutationHookResult = ReturnType<typeof useEnrolOccurrenceMutation>;
export type EnrolOccurrenceMutationResult = Apollo.MutationResult<EnrolOccurrenceMutation>;
export type EnrolOccurrenceMutationOptions = Apollo.BaseMutationOptions<EnrolOccurrenceMutation, EnrolOccurrenceMutationVariables>;
export const EventDocument = gql`
    query Event($id: ID!, $include: [String], $upcomingOccurrencesOnly: Boolean) {
  event(id: $id, include: $include) {
    ...eventFields
  }
}
    ${EventFieldsFragmentDoc}`;

/**
 * __useEventQuery__
 *
 * To run a query within a React component, call `useEventQuery` and pass it any options that fit your needs.
 * When your component renders, `useEventQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEventQuery({
 *   variables: {
 *      id: // value for 'id'
 *      include: // value for 'include'
 *      upcomingOccurrencesOnly: // value for 'upcomingOccurrencesOnly'
 *   },
 * });
 */
export function useEventQuery(baseOptions: Apollo.QueryHookOptions<EventQuery, EventQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<EventQuery, EventQueryVariables>(EventDocument, options);
      }
export function useEventLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<EventQuery, EventQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<EventQuery, EventQueryVariables>(EventDocument, options);
        }
export type EventQueryHookResult = ReturnType<typeof useEventQuery>;
export type EventLazyQueryHookResult = ReturnType<typeof useEventLazyQuery>;
export type EventQueryResult = Apollo.QueryResult<EventQuery, EventQueryVariables>;
export const EnrolEventQueueDocument = gql`
    mutation EnrolEventQueue($input: EnrolEventQueueMutationInput!) {
  enrolEventQueue(input: $input) {
    eventQueueEnrolment {
      ...eventQueueEnrolmentFields
    }
  }
}
    ${EventQueueEnrolmentFieldsFragmentDoc}`;
export type EnrolEventQueueMutationFn = Apollo.MutationFunction<EnrolEventQueueMutation, EnrolEventQueueMutationVariables>;

/**
 * __useEnrolEventQueueMutation__
 *
 * To run a mutation, you first call `useEnrolEventQueueMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEnrolEventQueueMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [enrolEventQueueMutation, { data, loading, error }] = useEnrolEventQueueMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useEnrolEventQueueMutation(baseOptions?: Apollo.MutationHookOptions<EnrolEventQueueMutation, EnrolEventQueueMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EnrolEventQueueMutation, EnrolEventQueueMutationVariables>(EnrolEventQueueDocument, options);
      }
export type EnrolEventQueueMutationHookResult = ReturnType<typeof useEnrolEventQueueMutation>;
export type EnrolEventQueueMutationResult = Apollo.MutationResult<EnrolEventQueueMutation>;
export type EnrolEventQueueMutationOptions = Apollo.BaseMutationOptions<EnrolEventQueueMutation, EnrolEventQueueMutationVariables>;
export const EventsDocument = gql`
    query Events($division: [String], $allOngoingAnd: [String], $end: String, $include: [String], $inLanguage: String, $isFree: Boolean, $keyword: [String], $keywordNot: [String], $language: String, $location: String, $page: Int, $pageSize: Int, $publisher: ID, $sort: String, $start: String, $superEvent: ID, $superEventType: [String], $text: String, $translation: String, $organisationId: String) {
  events(
    division: $division
    allOngoingAnd: $allOngoingAnd
    end: $end
    include: $include
    inLanguage: $inLanguage
    isFree: $isFree
    keyword: $keyword
    keywordNot: $keywordNot
    language: $language
    location: $location
    page: $page
    pageSize: $pageSize
    publisher: $publisher
    sort: $sort
    start: $start
    superEvent: $superEvent
    superEventType: $superEventType
    text: $text
    translation: $translation
    organisationId: $organisationId
  ) {
    meta {
      ...metaFields
    }
    data {
      ...eventsFields
    }
  }
}
    ${MetaFieldsFragmentDoc}
${EventsFieldsFragmentDoc}`;

/**
 * __useEventsQuery__
 *
 * To run a query within a React component, call `useEventsQuery` and pass it any options that fit your needs.
 * When your component renders, `useEventsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEventsQuery({
 *   variables: {
 *      division: // value for 'division'
 *      allOngoingAnd: // value for 'allOngoingAnd'
 *      end: // value for 'end'
 *      include: // value for 'include'
 *      inLanguage: // value for 'inLanguage'
 *      isFree: // value for 'isFree'
 *      keyword: // value for 'keyword'
 *      keywordNot: // value for 'keywordNot'
 *      language: // value for 'language'
 *      location: // value for 'location'
 *      page: // value for 'page'
 *      pageSize: // value for 'pageSize'
 *      publisher: // value for 'publisher'
 *      sort: // value for 'sort'
 *      start: // value for 'start'
 *      superEvent: // value for 'superEvent'
 *      superEventType: // value for 'superEventType'
 *      text: // value for 'text'
 *      translation: // value for 'translation'
 *      organisationId: // value for 'organisationId'
 *   },
 * });
 */
export function useEventsQuery(baseOptions?: Apollo.QueryHookOptions<EventsQuery, EventsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<EventsQuery, EventsQueryVariables>(EventsDocument, options);
      }
export function useEventsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<EventsQuery, EventsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<EventsQuery, EventsQueryVariables>(EventsDocument, options);
        }
export type EventsQueryHookResult = ReturnType<typeof useEventsQuery>;
export type EventsLazyQueryHookResult = ReturnType<typeof useEventsLazyQuery>;
export type EventsQueryResult = Apollo.QueryResult<EventsQuery, EventsQueryVariables>;
export const UpcomingEventsDocument = gql`
    query UpcomingEvents($page: Int, $pageSize: Int, $include: [String]) {
  upcomingEvents(page: $page, pageSize: $pageSize, include: $include) {
    pageInfo {
      totalCount
      page
      hasNextPage
    }
    data {
      ...eventsFields
    }
  }
}
    ${EventsFieldsFragmentDoc}`;

/**
 * __useUpcomingEventsQuery__
 *
 * To run a query within a React component, call `useUpcomingEventsQuery` and pass it any options that fit your needs.
 * When your component renders, `useUpcomingEventsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUpcomingEventsQuery({
 *   variables: {
 *      page: // value for 'page'
 *      pageSize: // value for 'pageSize'
 *      include: // value for 'include'
 *   },
 * });
 */
export function useUpcomingEventsQuery(baseOptions?: Apollo.QueryHookOptions<UpcomingEventsQuery, UpcomingEventsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UpcomingEventsQuery, UpcomingEventsQueryVariables>(UpcomingEventsDocument, options);
      }
export function useUpcomingEventsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UpcomingEventsQuery, UpcomingEventsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UpcomingEventsQuery, UpcomingEventsQueryVariables>(UpcomingEventsDocument, options);
        }
export type UpcomingEventsQueryHookResult = ReturnType<typeof useUpcomingEventsQuery>;
export type UpcomingEventsLazyQueryHookResult = ReturnType<typeof useUpcomingEventsLazyQuery>;
export type UpcomingEventsQueryResult = Apollo.QueryResult<UpcomingEventsQuery, UpcomingEventsQueryVariables>;
export const ImageDocument = gql`
    query Image($id: ID!) {
  image(id: $id) {
    ...imageFields
  }
}
    ${ImageFieldsFragmentDoc}`;

/**
 * __useImageQuery__
 *
 * To run a query within a React component, call `useImageQuery` and pass it any options that fit your needs.
 * When your component renders, `useImageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useImageQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useImageQuery(baseOptions: Apollo.QueryHookOptions<ImageQuery, ImageQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ImageQuery, ImageQueryVariables>(ImageDocument, options);
      }
export function useImageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ImageQuery, ImageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ImageQuery, ImageQueryVariables>(ImageDocument, options);
        }
export type ImageQueryHookResult = ReturnType<typeof useImageQuery>;
export type ImageLazyQueryHookResult = ReturnType<typeof useImageLazyQuery>;
export type ImageQueryResult = Apollo.QueryResult<ImageQuery, ImageQueryVariables>;
export const KeywordDocument = gql`
    query Keyword($id: ID!) {
  keyword(id: $id) {
    ...keywordFields
  }
}
    ${KeywordFieldsFragmentDoc}`;

/**
 * __useKeywordQuery__
 *
 * To run a query within a React component, call `useKeywordQuery` and pass it any options that fit your needs.
 * When your component renders, `useKeywordQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useKeywordQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useKeywordQuery(baseOptions: Apollo.QueryHookOptions<KeywordQuery, KeywordQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<KeywordQuery, KeywordQueryVariables>(KeywordDocument, options);
      }
export function useKeywordLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<KeywordQuery, KeywordQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<KeywordQuery, KeywordQueryVariables>(KeywordDocument, options);
        }
export type KeywordQueryHookResult = ReturnType<typeof useKeywordQuery>;
export type KeywordLazyQueryHookResult = ReturnType<typeof useKeywordLazyQuery>;
export type KeywordQueryResult = Apollo.QueryResult<KeywordQuery, KeywordQueryVariables>;
export const KeywordsDocument = gql`
    query Keywords($dataSource: String, $page: Int, $pageSize: Int, $showAllKeywords: Boolean, $sort: String, $text: String) {
  keywords(
    dataSource: $dataSource
    page: $page
    pageSize: $pageSize
    showAllKeywords: $showAllKeywords
    sort: $sort
    text: $text
  ) {
    meta {
      count
      next
      previous
    }
    data {
      ...keywordFields
    }
  }
}
    ${KeywordFieldsFragmentDoc}`;

/**
 * __useKeywordsQuery__
 *
 * To run a query within a React component, call `useKeywordsQuery` and pass it any options that fit your needs.
 * When your component renders, `useKeywordsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useKeywordsQuery({
 *   variables: {
 *      dataSource: // value for 'dataSource'
 *      page: // value for 'page'
 *      pageSize: // value for 'pageSize'
 *      showAllKeywords: // value for 'showAllKeywords'
 *      sort: // value for 'sort'
 *      text: // value for 'text'
 *   },
 * });
 */
export function useKeywordsQuery(baseOptions?: Apollo.QueryHookOptions<KeywordsQuery, KeywordsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<KeywordsQuery, KeywordsQueryVariables>(KeywordsDocument, options);
      }
export function useKeywordsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<KeywordsQuery, KeywordsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<KeywordsQuery, KeywordsQueryVariables>(KeywordsDocument, options);
        }
export type KeywordsQueryHookResult = ReturnType<typeof useKeywordsQuery>;
export type KeywordsLazyQueryHookResult = ReturnType<typeof useKeywordsLazyQuery>;
export type KeywordsQueryResult = Apollo.QueryResult<KeywordsQuery, KeywordsQueryVariables>;
export const KeywordSetDocument = gql`
    query KeywordSet($setType: KeywordSetType!) {
  keywordSet(setType: $setType) {
    keywords {
      ...keywordFields
    }
    name {
      ...localisedFields
    }
    internalId
  }
}
    ${KeywordFieldsFragmentDoc}
${LocalisedFieldsFragmentDoc}`;

/**
 * __useKeywordSetQuery__
 *
 * To run a query within a React component, call `useKeywordSetQuery` and pass it any options that fit your needs.
 * When your component renders, `useKeywordSetQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useKeywordSetQuery({
 *   variables: {
 *      setType: // value for 'setType'
 *   },
 * });
 */
export function useKeywordSetQuery(baseOptions: Apollo.QueryHookOptions<KeywordSetQuery, KeywordSetQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<KeywordSetQuery, KeywordSetQueryVariables>(KeywordSetDocument, options);
      }
export function useKeywordSetLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<KeywordSetQuery, KeywordSetQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<KeywordSetQuery, KeywordSetQueryVariables>(KeywordSetDocument, options);
        }
export type KeywordSetQueryHookResult = ReturnType<typeof useKeywordSetQuery>;
export type KeywordSetLazyQueryHookResult = ReturnType<typeof useKeywordSetLazyQuery>;
export type KeywordSetQueryResult = Apollo.QueryResult<KeywordSetQuery, KeywordSetQueryVariables>;
export const PopularKeywordsDocument = gql`
    query PopularKeywords($amount: Int, $showAllKeywords: Boolean) {
  popularKultusKeywords(amount: $amount, showAllKeywords: $showAllKeywords) {
    meta {
      count
      next
      previous
    }
    data {
      ...keywordFields
    }
  }
}
    ${KeywordFieldsFragmentDoc}`;

/**
 * __usePopularKeywordsQuery__
 *
 * To run a query within a React component, call `usePopularKeywordsQuery` and pass it any options that fit your needs.
 * When your component renders, `usePopularKeywordsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePopularKeywordsQuery({
 *   variables: {
 *      amount: // value for 'amount'
 *      showAllKeywords: // value for 'showAllKeywords'
 *   },
 * });
 */
export function usePopularKeywordsQuery(baseOptions?: Apollo.QueryHookOptions<PopularKeywordsQuery, PopularKeywordsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PopularKeywordsQuery, PopularKeywordsQueryVariables>(PopularKeywordsDocument, options);
      }
export function usePopularKeywordsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PopularKeywordsQuery, PopularKeywordsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PopularKeywordsQuery, PopularKeywordsQueryVariables>(PopularKeywordsDocument, options);
        }
export type PopularKeywordsQueryHookResult = ReturnType<typeof usePopularKeywordsQuery>;
export type PopularKeywordsLazyQueryHookResult = ReturnType<typeof usePopularKeywordsLazyQuery>;
export type PopularKeywordsQueryResult = Apollo.QueryResult<PopularKeywordsQuery, PopularKeywordsQueryVariables>;
export const OccurrenceDocument = gql`
    query Occurrence($id: ID!) {
  occurrence(id: $id) {
    ...occurrenceFields
  }
}
    ${OccurrenceFieldsFragmentDoc}`;

/**
 * __useOccurrenceQuery__
 *
 * To run a query within a React component, call `useOccurrenceQuery` and pass it any options that fit your needs.
 * When your component renders, `useOccurrenceQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOccurrenceQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useOccurrenceQuery(baseOptions: Apollo.QueryHookOptions<OccurrenceQuery, OccurrenceQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<OccurrenceQuery, OccurrenceQueryVariables>(OccurrenceDocument, options);
      }
export function useOccurrenceLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<OccurrenceQuery, OccurrenceQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<OccurrenceQuery, OccurrenceQueryVariables>(OccurrenceDocument, options);
        }
export type OccurrenceQueryHookResult = ReturnType<typeof useOccurrenceQuery>;
export type OccurrenceLazyQueryHookResult = ReturnType<typeof useOccurrenceLazyQuery>;
export type OccurrenceQueryResult = Apollo.QueryResult<OccurrenceQuery, OccurrenceQueryVariables>;
export const OccurrencesDocument = gql`
    query Occurrences($after: String, $before: String, $first: Int, $last: Int, $cancelled: Boolean, $pEvent: ID, $orderBy: [String], $upcoming: Boolean, $enrollable: Boolean) {
  occurrences(
    after: $after
    before: $before
    first: $first
    last: $last
    cancelled: $cancelled
    pEvent: $pEvent
    orderBy: $orderBy
    upcoming: $upcoming
    enrollable: $enrollable
  ) {
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    edges {
      node {
        ...occurrenceFields
      }
      cursor
    }
  }
}
    ${OccurrenceFieldsFragmentDoc}`;

/**
 * __useOccurrencesQuery__
 *
 * To run a query within a React component, call `useOccurrencesQuery` and pass it any options that fit your needs.
 * When your component renders, `useOccurrencesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOccurrencesQuery({
 *   variables: {
 *      after: // value for 'after'
 *      before: // value for 'before'
 *      first: // value for 'first'
 *      last: // value for 'last'
 *      cancelled: // value for 'cancelled'
 *      pEvent: // value for 'pEvent'
 *      orderBy: // value for 'orderBy'
 *      upcoming: // value for 'upcoming'
 *      enrollable: // value for 'enrollable'
 *   },
 * });
 */
export function useOccurrencesQuery(baseOptions?: Apollo.QueryHookOptions<OccurrencesQuery, OccurrencesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<OccurrencesQuery, OccurrencesQueryVariables>(OccurrencesDocument, options);
      }
export function useOccurrencesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<OccurrencesQuery, OccurrencesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<OccurrencesQuery, OccurrencesQueryVariables>(OccurrencesDocument, options);
        }
export type OccurrencesQueryHookResult = ReturnType<typeof useOccurrencesQuery>;
export type OccurrencesLazyQueryHookResult = ReturnType<typeof useOccurrencesLazyQuery>;
export type OccurrencesQueryResult = Apollo.QueryResult<OccurrencesQuery, OccurrencesQueryVariables>;
export const PlaceDocument = gql`
    query Place($id: ID!) {
  place(id: $id) {
    ...placeFields
  }
}
    ${PlaceFieldsFragmentDoc}`;

/**
 * __usePlaceQuery__
 *
 * To run a query within a React component, call `usePlaceQuery` and pass it any options that fit your needs.
 * When your component renders, `usePlaceQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePlaceQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function usePlaceQuery(baseOptions: Apollo.QueryHookOptions<PlaceQuery, PlaceQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PlaceQuery, PlaceQueryVariables>(PlaceDocument, options);
      }
export function usePlaceLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PlaceQuery, PlaceQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PlaceQuery, PlaceQueryVariables>(PlaceDocument, options);
        }
export type PlaceQueryHookResult = ReturnType<typeof usePlaceQuery>;
export type PlaceLazyQueryHookResult = ReturnType<typeof usePlaceLazyQuery>;
export type PlaceQueryResult = Apollo.QueryResult<PlaceQuery, PlaceQueryVariables>;
export const PlacesDocument = gql`
    query Places($dataSource: String, $divisions: [String], $page: Int, $pageSize: Int, $showAllPlaces: Boolean, $sort: String, $text: String) {
  places(
    dataSource: $dataSource
    divisions: $divisions
    page: $page
    pageSize: $pageSize
    showAllPlaces: $showAllPlaces
    sort: $sort
    text: $text
  ) {
    meta {
      count
      next
      previous
    }
    data {
      ...placeFields
    }
  }
}
    ${PlaceFieldsFragmentDoc}`;

/**
 * __usePlacesQuery__
 *
 * To run a query within a React component, call `usePlacesQuery` and pass it any options that fit your needs.
 * When your component renders, `usePlacesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePlacesQuery({
 *   variables: {
 *      dataSource: // value for 'dataSource'
 *      divisions: // value for 'divisions'
 *      page: // value for 'page'
 *      pageSize: // value for 'pageSize'
 *      showAllPlaces: // value for 'showAllPlaces'
 *      sort: // value for 'sort'
 *      text: // value for 'text'
 *   },
 * });
 */
export function usePlacesQuery(baseOptions?: Apollo.QueryHookOptions<PlacesQuery, PlacesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PlacesQuery, PlacesQueryVariables>(PlacesDocument, options);
      }
export function usePlacesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PlacesQuery, PlacesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PlacesQuery, PlacesQueryVariables>(PlacesDocument, options);
        }
export type PlacesQueryHookResult = ReturnType<typeof usePlacesQuery>;
export type PlacesLazyQueryHookResult = ReturnType<typeof usePlacesLazyQuery>;
export type PlacesQueryResult = Apollo.QueryResult<PlacesQuery, PlacesQueryVariables>;
export const SchoolsAndKindergartensListDocument = gql`
    query SchoolsAndKindergartensList {
  schoolsAndKindergartensList {
    meta {
      count
    }
    data {
      id
      name {
        fi
        sv
        en
      }
    }
  }
}
    `;

/**
 * __useSchoolsAndKindergartensListQuery__
 *
 * To run a query within a React component, call `useSchoolsAndKindergartensListQuery` and pass it any options that fit your needs.
 * When your component renders, `useSchoolsAndKindergartensListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSchoolsAndKindergartensListQuery({
 *   variables: {
 *   },
 * });
 */
export function useSchoolsAndKindergartensListQuery(baseOptions?: Apollo.QueryHookOptions<SchoolsAndKindergartensListQuery, SchoolsAndKindergartensListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SchoolsAndKindergartensListQuery, SchoolsAndKindergartensListQueryVariables>(SchoolsAndKindergartensListDocument, options);
      }
export function useSchoolsAndKindergartensListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SchoolsAndKindergartensListQuery, SchoolsAndKindergartensListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SchoolsAndKindergartensListQuery, SchoolsAndKindergartensListQueryVariables>(SchoolsAndKindergartensListDocument, options);
        }
export type SchoolsAndKindergartensListQueryHookResult = ReturnType<typeof useSchoolsAndKindergartensListQuery>;
export type SchoolsAndKindergartensListLazyQueryHookResult = ReturnType<typeof useSchoolsAndKindergartensListLazyQuery>;
export type SchoolsAndKindergartensListQueryResult = Apollo.QueryResult<SchoolsAndKindergartensListQuery, SchoolsAndKindergartensListQueryVariables>;
export const StudyLevelsDocument = gql`
    query StudyLevels {
  studyLevels {
    edges {
      node {
        ...studyLevelFields
      }
    }
  }
}
    ${StudyLevelFieldsFragmentDoc}`;

/**
 * __useStudyLevelsQuery__
 *
 * To run a query within a React component, call `useStudyLevelsQuery` and pass it any options that fit your needs.
 * When your component renders, `useStudyLevelsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStudyLevelsQuery({
 *   variables: {
 *   },
 * });
 */
export function useStudyLevelsQuery(baseOptions?: Apollo.QueryHookOptions<StudyLevelsQuery, StudyLevelsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<StudyLevelsQuery, StudyLevelsQueryVariables>(StudyLevelsDocument, options);
      }
export function useStudyLevelsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<StudyLevelsQuery, StudyLevelsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<StudyLevelsQuery, StudyLevelsQueryVariables>(StudyLevelsDocument, options);
        }
export type StudyLevelsQueryHookResult = ReturnType<typeof useStudyLevelsQuery>;
export type StudyLevelsLazyQueryHookResult = ReturnType<typeof useStudyLevelsLazyQuery>;
export type StudyLevelsQueryResult = Apollo.QueryResult<StudyLevelsQuery, StudyLevelsQueryVariables>;
export const StudyLevelDocument = gql`
    query StudyLevel($id: ID!) {
  studyLevel(id: $id) {
    ...studyLevelFields
  }
}
    ${StudyLevelFieldsFragmentDoc}`;

/**
 * __useStudyLevelQuery__
 *
 * To run a query within a React component, call `useStudyLevelQuery` and pass it any options that fit your needs.
 * When your component renders, `useStudyLevelQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStudyLevelQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useStudyLevelQuery(baseOptions: Apollo.QueryHookOptions<StudyLevelQuery, StudyLevelQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<StudyLevelQuery, StudyLevelQueryVariables>(StudyLevelDocument, options);
      }
export function useStudyLevelLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<StudyLevelQuery, StudyLevelQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<StudyLevelQuery, StudyLevelQueryVariables>(StudyLevelDocument, options);
        }
export type StudyLevelQueryHookResult = ReturnType<typeof useStudyLevelQuery>;
export type StudyLevelLazyQueryHookResult = ReturnType<typeof useStudyLevelLazyQuery>;
export type StudyLevelQueryResult = Apollo.QueryResult<StudyLevelQuery, StudyLevelQueryVariables>;
export const VenueDocument = gql`
    query Venue($id: ID!) {
  venue(id: $id) {
    ...venueFields
  }
}
    ${VenueFieldsFragmentDoc}`;

/**
 * __useVenueQuery__
 *
 * To run a query within a React component, call `useVenueQuery` and pass it any options that fit your needs.
 * When your component renders, `useVenueQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useVenueQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useVenueQuery(baseOptions: Apollo.QueryHookOptions<VenueQuery, VenueQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<VenueQuery, VenueQueryVariables>(VenueDocument, options);
      }
export function useVenueLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<VenueQuery, VenueQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<VenueQuery, VenueQueryVariables>(VenueDocument, options);
        }
export type VenueQueryHookResult = ReturnType<typeof useVenueQuery>;
export type VenueLazyQueryHookResult = ReturnType<typeof useVenueLazyQuery>;
export type VenueQueryResult = Apollo.QueryResult<VenueQuery, VenueQueryVariables>;