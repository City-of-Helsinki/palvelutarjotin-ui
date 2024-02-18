import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string | number; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
  GeoJSONCoordinates: { input: any; output: any; }
  JSONObject: { input: any; output: any; }
  _Any: { input: any; output: any; }
  federation__FieldSet: { input: any; output: any; }
  link__Import: { input: any; output: any; }
};

export type Accessibility = {
  __typename?: 'Accessibility';
  email?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  sentences: Array<AccessibilitySentence>;
  shortcomings: Array<AccessibilityShortcoming>;
  viewpoints: Array<AccessibilityViewpoint>;
  www?: Maybe<Scalars['String']['output']>;
};

export enum AccessibilityProfile {
  HearingAid = 'hearing_aid',
  ReducedMobility = 'reduced_mobility',
  Rollator = 'rollator',
  Stroller = 'stroller',
  VisuallyImpaired = 'visually_impaired',
  Wheelchair = 'wheelchair'
}

export type AccessibilitySentence = {
  __typename?: 'AccessibilitySentence';
  sentence?: Maybe<LanguageString>;
  sentenceGroup?: Maybe<LanguageString>;
  sentenceGroupName?: Maybe<Scalars['String']['output']>;
};

export type AccessibilityShortcoming = {
  __typename?: 'AccessibilityShortcoming';
  count?: Maybe<Scalars['Int']['output']>;
  profile: AccessibilityProfile;
};

export type AccessibilityViewpoint = {
  __typename?: 'AccessibilityViewpoint';
  id: Scalars['ID']['output'];
  name: LanguageString;
  shortages: Array<LanguageString>;
  value: AccessibilityViewpointValue;
};

export enum AccessibilityViewpointValue {
  Green = 'green',
  Red = 'red',
  Unknown = 'unknown'
}

/** TODO: give real structure */
export type Address = {
  __typename?: 'Address';
  city?: Maybe<LanguageString>;
  postalCode?: Maybe<Scalars['String']['output']>;
  streetAddress?: Maybe<LanguageString>;
};

export type AdministrativeDivision = {
  __typename?: 'AdministrativeDivision';
  id?: Maybe<Scalars['ID']['output']>;
  municipality?: Maybe<Scalars['String']['output']>;
  name?: Maybe<LanguageString>;
  type?: Maybe<Scalars['String']['output']>;
};

export enum CacheControlScope {
  Private = 'PRIVATE',
  Public = 'PUBLIC'
}

/** Contact details for a person, legal entity, venue or project */
export type ContactInfo = {
  __typename?: 'ContactInfo';
  contactUrl?: Maybe<Scalars['String']['output']>;
  emailAddresses: Array<Scalars['String']['output']>;
  phoneNumbers: Array<PhoneNumber>;
  postalAddresses: Array<Address>;
};

export enum ContactMedium {
  Asiointi = 'ASIOINTI',
  Email = 'EMAIL',
  MobileNotification = 'MOBILE_NOTIFICATION',
  Sms = 'SMS',
  SmsAndEmail = 'SMS_AND_EMAIL'
}

/**
 * Resources (media) that provide extra description of a resource,
 * facility, event or venue, such as images, videos, info pages, etc.
 */
export type DescriptionResources = {
  __typename?: 'DescriptionResources';
  externalLinks: Array<Scalars['String']['output']>;
  infoUrls: Array<Scalars['String']['output']>;
  mediaResources: Array<MediaResource>;
};

/** Elasticsearch results */
export type ElasticSearchResult = {
  __typename?: 'ElasticSearchResult';
  _shards?: Maybe<Shards>;
  hits?: Maybe<Hits>;
  timed_out?: Maybe<Scalars['Boolean']['output']>;
  took?: Maybe<Scalars['Int']['output']>;
};

/** Information about enrolled participant(s) in an event occurrence */
export type Enrolment = {
  __typename?: 'Enrolment';
  enroller?: Maybe<Person>;
  event?: Maybe<EventOccurrence>;
  extraInformation?: Maybe<Scalars['String']['output']>;
  meta?: Maybe<NodeMeta>;
  overseerCount?: Maybe<Scalars['Int']['output']>;
  overseers?: Maybe<Array<Person>>;
  participantCategory?: Maybe<KeywordString>;
  participantCount: Scalars['Int']['output'];
  participants?: Maybe<Array<Person>>;
  requestedMethodOfNotification?: Maybe<ContactMedium>;
  status?: Maybe<EnrolmentStatus>;
};

/** Rules about who can enroll to an event and how */
export type EnrolmentPolicy = {
  __typename?: 'EnrolmentPolicy';
  allowedParticipantCategories: Array<KeywordString>;
  enrolmentTime?: Maybe<TimeDescription>;
  /** maximum number of people who can enrol together (at the same time) */
  maximumEnrolmentCount?: Maybe<Scalars['Int']['output']>;
  meta?: Maybe<NodeMeta>;
  /** minimum number of people who can enrol together (at the same time) */
  minimumEnrolmentCount?: Maybe<Scalars['Int']['output']>;
  participantMaximumAge: Scalars['Int']['output'];
  participantMinimumAge: Scalars['Int']['output'];
  type: Array<EnrolmentPolicyType>;
};

export enum EnrolmentPolicyType {
  Groups = 'GROUPS',
  GroupsWithSupervisors = 'GROUPS_WITH_SUPERVISORS',
  Individuals = 'INDIVIDUALS',
  NoEnrolmentNeeded = 'NO_ENROLMENT_NEEDED'
}

export enum EnrolmentStatus {
  Cancelled = 'CANCELLED',
  Confirmed = 'CONFIRMED',
  Declined = 'DECLINED',
  Queued = 'QUEUED',
  Requested = 'REQUESTED'
}

/**
 * Request for equipment - if someone needs equipment for a purpose such
 * as organising a volunteering event (as is the case in park cleaning
 * bees), a specification of what is being requested.
 */
export type EquipmentRequest = {
  __typename?: 'EquipmentRequest';
  deliveryLocation?: Maybe<LocationDescription>;
  estimatedAmount?: Maybe<Scalars['Int']['output']>;
  extraInformation: Scalars['String']['output'];
  meta?: Maybe<NodeMeta>;
  requestedEquipment: Scalars['String']['output'];
  requestedForEvent?: Maybe<Event>;
  returnLocation?: Maybe<LocationDescription>;
};

/**
 * An organised event - something that happens at a specific time, has a
 * specific topic or content, and people can participate.  Examples include
 * meetups, concerts, volunteering occasions (or bees), happenings.  This
 * corresponds to Linked events/courses event, beta.kultus
 * PalvelutarjotinEventNode, Kukkuu event.
 */
export type Event = {
  __typename?: 'Event';
  contactPerson?: Maybe<LegalEntity>;
  description?: Maybe<LanguageString>;
  descriptionResources?: Maybe<DescriptionResources>;
  enrolmentPolicy?: Maybe<EnrolmentPolicy>;
  eventDataSource?: Maybe<Scalars['String']['output']>;
  eventLanguages: Array<UnifiedSearchLanguageEnum>;
  keywords: Array<KeywordString>;
  meta?: Maybe<NodeMeta>;
  name?: Maybe<LanguageString>;
  occurrences: Array<EventOccurrence>;
  organiser?: Maybe<LegalEntity>;
  pricing?: Maybe<Array<EventPricing>>;
  published?: Maybe<Scalars['DateTime']['output']>;
  publisher?: Maybe<LegalEntity>;
  shortDescription?: Maybe<Scalars['String']['output']>;
  subEvents: Array<Event>;
  superEvent?: Maybe<Event>;
  targetAudience?: Maybe<Array<KeywordString>>;
};

export type EventOccurrence = {
  __typename?: 'EventOccurrence';
  /** for events where equipment is requested from the City of Helsinki */
  cityEquipmentRequests?: Maybe<Array<EquipmentRequest>>;
  currentlyAvailableParticipantCount?: Maybe<Scalars['Int']['output']>;
  enrolments: Array<Enrolment>;
  /**
   * for information - for example, to guide people who are looking for
   * big or small events, or to give city officials a hint on how much
   * equipment is needed
   */
  estimatedAttendeeCount?: Maybe<Scalars['Int']['output']>;
  happensAt?: Maybe<TimeDescription>;
  location?: Maybe<LocationDescription>;
  maximumAttendeeCount?: Maybe<Scalars['Int']['output']>;
  meta?: Maybe<NodeMeta>;
  minimumAttendeeCount?: Maybe<Scalars['Int']['output']>;
  /** which event this is an occurrence of */
  ofEvent?: Maybe<Event>;
  status?: Maybe<EventOccurrenceStatus>;
};

export enum EventOccurrenceStatus {
  Cancelled = 'CANCELLED',
  Postponed = 'POSTPONED',
  Published = 'PUBLISHED',
  Rescheduled = 'RESCHEDULED',
  Unpublished = 'UNPUBLISHED'
}

/** TODO: improve (a lot) over Linked events' offer type */
export type EventPricing = {
  __typename?: 'EventPricing';
  meta?: Maybe<NodeMeta>;
  todo?: Maybe<Scalars['String']['output']>;
};

/** CRS object properties. */
export type GeoJsoncrsProperties = GeoJsonLinkedCrsProperties | GeoJsonNamedCrsProperties;

/** Enumeration of all GeoJSON CRS object types. */
export enum GeoJsoncrsType {
  Link = 'link',
  Name = 'name'
}

/** Coordinate Reference System (CRS) object. */
export type GeoJsonCoordinateReferenceSystem = {
  __typename?: 'GeoJSONCoordinateReferenceSystem';
  properties: GeoJsoncrsProperties;
  type: GeoJsoncrsType;
};

/** An object that links a geometry to properties in order to provide context. */
export type GeoJsonFeature = GeoJsonInterface & {
  __typename?: 'GeoJSONFeature';
  bbox?: Maybe<Array<Maybe<Scalars['Float']['output']>>>;
  crs: GeoJsonCoordinateReferenceSystem;
  geometry?: Maybe<GeoJsonGeometryInterface>;
  id?: Maybe<Scalars['String']['output']>;
  properties?: Maybe<Scalars['JSONObject']['output']>;
  type: GeoJsonType;
};

/** A set of multiple features. */
export type GeoJsonFeatureCollection = GeoJsonInterface & {
  __typename?: 'GeoJSONFeatureCollection';
  bbox?: Maybe<Array<Maybe<Scalars['Float']['output']>>>;
  crs: GeoJsonCoordinateReferenceSystem;
  features: Array<GeoJsonFeature>;
  type: GeoJsonType;
};

/** A set of multiple geometries, possibly of various types. */
export type GeoJsonGeometryCollection = GeoJsonInterface & {
  __typename?: 'GeoJSONGeometryCollection';
  bbox?: Maybe<Array<Maybe<Scalars['Float']['output']>>>;
  crs: GeoJsonCoordinateReferenceSystem;
  geometries: Array<GeoJsonGeometryInterface>;
  type: GeoJsonType;
};

export type GeoJsonGeometryInterface = {
  bbox?: Maybe<Array<Maybe<Scalars['Float']['output']>>>;
  coordinates?: Maybe<Scalars['GeoJSONCoordinates']['output']>;
  crs: GeoJsonCoordinateReferenceSystem;
  type: GeoJsonType;
};

export type GeoJsonInterface = {
  bbox?: Maybe<Array<Maybe<Scalars['Float']['output']>>>;
  crs: GeoJsonCoordinateReferenceSystem;
  type: GeoJsonType;
};

/** Object describing a single connected sequence of geographical points. */
export type GeoJsonLineString = GeoJsonGeometryInterface & GeoJsonInterface & {
  __typename?: 'GeoJSONLineString';
  bbox?: Maybe<Array<Maybe<Scalars['Float']['output']>>>;
  coordinates?: Maybe<Scalars['GeoJSONCoordinates']['output']>;
  crs: GeoJsonCoordinateReferenceSystem;
  type: GeoJsonType;
};

/** Properties for link based CRS object. */
export type GeoJsonLinkedCrsProperties = {
  __typename?: 'GeoJSONLinkedCRSProperties';
  href: Scalars['String']['output'];
  type?: Maybe<Scalars['String']['output']>;
};

/** Object describing multiple connected sequences of geographical points. */
export type GeoJsonMultiLineString = GeoJsonGeometryInterface & GeoJsonInterface & {
  __typename?: 'GeoJSONMultiLineString';
  bbox?: Maybe<Array<Maybe<Scalars['Float']['output']>>>;
  coordinates?: Maybe<Scalars['GeoJSONCoordinates']['output']>;
  crs: GeoJsonCoordinateReferenceSystem;
  type: GeoJsonType;
};

/** Object describing multiple geographical points. */
export type GeoJsonMultiPoint = GeoJsonGeometryInterface & GeoJsonInterface & {
  __typename?: 'GeoJSONMultiPoint';
  bbox?: Maybe<Array<Maybe<Scalars['Float']['output']>>>;
  coordinates?: Maybe<Scalars['GeoJSONCoordinates']['output']>;
  crs: GeoJsonCoordinateReferenceSystem;
  type: GeoJsonType;
};

/** Object describing multiple shapes formed by sets of geographical points. */
export type GeoJsonMultiPolygon = GeoJsonGeometryInterface & GeoJsonInterface & {
  __typename?: 'GeoJSONMultiPolygon';
  bbox?: Maybe<Array<Maybe<Scalars['Float']['output']>>>;
  coordinates?: Maybe<Scalars['GeoJSONCoordinates']['output']>;
  crs: GeoJsonCoordinateReferenceSystem;
  type: GeoJsonType;
};

/** Properties for name based CRS object. */
export type GeoJsonNamedCrsProperties = {
  __typename?: 'GeoJSONNamedCRSProperties';
  name: Scalars['String']['output'];
};

/** Object describing a single geographical point. */
export type GeoJsonPoint = GeoJsonGeometryInterface & GeoJsonInterface & {
  __typename?: 'GeoJSONPoint';
  bbox?: Maybe<Array<Maybe<Scalars['Float']['output']>>>;
  coordinates?: Maybe<Scalars['GeoJSONCoordinates']['output']>;
  crs: GeoJsonCoordinateReferenceSystem;
  type: GeoJsonType;
};

/** Object describing a single shape formed by a set of geographical points. */
export type GeoJsonPolygon = GeoJsonGeometryInterface & GeoJsonInterface & {
  __typename?: 'GeoJSONPolygon';
  bbox?: Maybe<Array<Maybe<Scalars['Float']['output']>>>;
  coordinates?: Maybe<Scalars['GeoJSONCoordinates']['output']>;
  crs: GeoJsonCoordinateReferenceSystem;
  type: GeoJsonType;
};

/** Enumeration of all GeoJSON object types. */
export enum GeoJsonType {
  Feature = 'Feature',
  FeatureCollection = 'FeatureCollection',
  GeometryCollection = 'GeometryCollection',
  LineString = 'LineString',
  MultiLineString = 'MultiLineString',
  MultiPoint = 'MultiPoint',
  MultiPolygon = 'MultiPolygon',
  Point = 'Point',
  Polygon = 'Polygon'
}

export type HitTotal = {
  __typename?: 'HitTotal';
  relation?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['Int']['output']>;
};

export type Hits = {
  __typename?: 'Hits';
  hits?: Maybe<Array<Maybe<SingleHit>>>;
  max_score?: Maybe<Scalars['Float']['output']>;
  total?: Maybe<HitTotal>;
};

export enum IdentificationStrength {
  /** If the person has authenticated with at least some method */
  Authenticated = 'AUTHENTICATED',
  /** If the person has done some identifiable action such as payment */
  Indirect = 'INDIRECT',
  /** If the person has proved their legal identity */
  LegallyConnected = 'LEGALLY_CONNECTED',
  /** If this person is just a pseudoperson for contacting */
  Nonidentifiable = 'NONIDENTIFIABLE',
  /** If the identity of this person is not known at all */
  Unidentified = 'UNIDENTIFIED'
}

/**
 * TODO: merge all free tags, categories, and keywords
 * KEYWORDS ARE GIVEN FROM events-proxy (https://events-graphql-proxy.test.hel.ninja/proxy/graphql)
 */
export type KeywordString = {
  __typename?: 'KeywordString';
  name: Scalars['String']['output'];
};

/** TODO: convert all String's to LanguageString's if linguistic content */
export type LanguageString = {
  __typename?: 'LanguageString';
  en?: Maybe<Scalars['String']['output']>;
  fi?: Maybe<Scalars['String']['output']>;
  sv?: Maybe<Scalars['String']['output']>;
};

export type LegalEntity = Organisation | Person;

export type LinkedeventsPlace = {
  __typename?: 'LinkedeventsPlace';
  _at_context?: Maybe<Scalars['String']['output']>;
  _at_id?: Maybe<Scalars['String']['output']>;
  _at_type?: Maybe<Scalars['String']['output']>;
  address_country?: Maybe<Scalars['String']['output']>;
  address_locality?: Maybe<LinkedeventsPlaceLocalityString>;
  address_region?: Maybe<Scalars['String']['output']>;
  contact_type?: Maybe<Scalars['String']['output']>;
  created_time?: Maybe<Scalars['String']['output']>;
  custom_data?: Maybe<Scalars['String']['output']>;
  data_source?: Maybe<Scalars['String']['output']>;
  deleted?: Maybe<Scalars['Boolean']['output']>;
  description?: Maybe<LinkedeventsPlaceLocalityString>;
  divisions?: Maybe<Array<Maybe<LinkedeventsPlaceDivision>>>;
  email?: Maybe<Scalars['String']['output']>;
  has_upcoming_events?: Maybe<Scalars['Boolean']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  image?: Maybe<Scalars['String']['output']>;
  info_url?: Maybe<LinkedeventsPlaceLocalityString>;
  last_modified_time?: Maybe<Scalars['String']['output']>;
  n_events?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<LinkedeventsPlaceLocalityString>;
  /** Raw Linkedevents Place fields */
  origin?: Maybe<Scalars['String']['output']>;
  parent?: Maybe<Scalars['String']['output']>;
  position?: Maybe<LinkedeventsPlacePosition>;
  post_office_box_num?: Maybe<Scalars['String']['output']>;
  postal_code?: Maybe<Scalars['String']['output']>;
  publisher?: Maybe<Scalars['String']['output']>;
  replaced_by?: Maybe<Scalars['String']['output']>;
  street_address?: Maybe<LinkedeventsPlaceLocalityString>;
  telephone?: Maybe<Scalars['String']['output']>;
};

export type LinkedeventsPlaceDivision = {
  __typename?: 'LinkedeventsPlaceDivision';
  municipality?: Maybe<Scalars['String']['output']>;
  name?: Maybe<LinkedeventsPlaceLocalityString>;
  ocd_id?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

export type LinkedeventsPlaceLocalityString = {
  __typename?: 'LinkedeventsPlaceLocalityString';
  en?: Maybe<Scalars['String']['output']>;
  fi?: Maybe<Scalars['String']['output']>;
  sv?: Maybe<Scalars['String']['output']>;
};

export type LinkedeventsPlacePosition = {
  __typename?: 'LinkedeventsPlacePosition';
  coordinates?: Maybe<Array<Maybe<Scalars['Float']['output']>>>;
  type?: Maybe<Scalars['String']['output']>;
};

/** Free-form location, not necessarily at a know venue. */
export type LocationDescription = {
  __typename?: 'LocationDescription';
  address?: Maybe<Address>;
  administrativeDivisions?: Maybe<Array<Maybe<AdministrativeDivision>>>;
  explanation?: Maybe<Scalars['String']['output']>;
  geoLocation?: Maybe<GeoJsonFeature>;
  url?: Maybe<LanguageString>;
  venue?: Maybe<UnifiedSearchVenue>;
};

export type LocationImage = {
  __typename?: 'LocationImage';
  caption?: Maybe<LanguageString>;
  url?: Maybe<Scalars['String']['output']>;
};

/** TODO: take this from Linked events Image type. */
export type MediaResource = {
  __typename?: 'MediaResource';
  meta?: Maybe<NodeMeta>;
  todo?: Maybe<Scalars['String']['output']>;
};

export type NodeMeta = {
  __typename?: 'NodeMeta';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type OntologyTree = {
  __typename?: 'OntologyTree';
  ancestorIds?: Maybe<Array<Maybe<Scalars['ID']['output']>>>;
  childIds?: Maybe<Array<Maybe<Scalars['ID']['output']>>>;
  id?: Maybe<Scalars['ID']['output']>;
  level?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<LanguageString>;
  parentId?: Maybe<Scalars['ID']['output']>;
};

export type OntologyWord = {
  __typename?: 'OntologyWord';
  id?: Maybe<Scalars['ID']['output']>;
  label?: Maybe<LanguageString>;
};

export type Ontologyword = {
  __typename?: 'Ontologyword';
  can_add_clarification?: Maybe<Scalars['Boolean']['output']>;
  can_add_schoolyear?: Maybe<Scalars['Boolean']['output']>;
  extra_searchwords_fi?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  ontologyword_en?: Maybe<Scalars['String']['output']>;
  ontologyword_fi?: Maybe<Scalars['String']['output']>;
  ontologyword_sv?: Maybe<Scalars['String']['output']>;
  unit_ids?: Maybe<Array<Maybe<Scalars['Int']['output']>>>;
};

export type OpeningHours = {
  __typename?: 'OpeningHours';
  data?: Maybe<Array<Maybe<OpeningHoursDay>>>;
  is_open_now_url?: Maybe<Scalars['String']['output']>;
  today?: Maybe<Array<Maybe<OpeningHoursTimes>>>;
  url?: Maybe<Scalars['String']['output']>;
};

export type OpeningHoursDay = {
  __typename?: 'OpeningHoursDay';
  date?: Maybe<Scalars['String']['output']>;
  times?: Maybe<Array<Maybe<OpeningHoursTimes>>>;
};

export type OpeningHoursTimes = {
  __typename?: 'OpeningHoursTimes';
  endTime?: Maybe<Scalars['String']['output']>;
  endTimeOnNextDay?: Maybe<Scalars['Boolean']['output']>;
  fullDay?: Maybe<Scalars['Boolean']['output']>;
  resourceState?: Maybe<Scalars['String']['output']>;
  startTime?: Maybe<Scalars['String']['output']>;
};

export type OrderByDistance = {
  latitude: Scalars['Float']['input'];
  longitude: Scalars['Float']['input'];
  order?: InputMaybe<SortOrder>;
};

export type OrderByName = {
  order?: InputMaybe<SortOrder>;
};

/** TODO: merge beta.kultus organisation, etc */
export type Organisation = {
  __typename?: 'Organisation';
  contactDetails?: Maybe<ContactInfo>;
  meta?: Maybe<NodeMeta>;
};

export type PalvelukarttaUnit = {
  __typename?: 'PalvelukarttaUnit';
  accessibility_viewpoints?: Maybe<Scalars['String']['output']>;
  address_city_en?: Maybe<Scalars['String']['output']>;
  address_city_fi?: Maybe<Scalars['String']['output']>;
  address_city_sv?: Maybe<Scalars['String']['output']>;
  address_zip?: Maybe<Scalars['String']['output']>;
  call_charge_info_en?: Maybe<Scalars['String']['output']>;
  call_charge_info_fi?: Maybe<Scalars['String']['output']>;
  call_charge_info_sv?: Maybe<Scalars['String']['output']>;
  created_time?: Maybe<Scalars['String']['output']>;
  data_source_url?: Maybe<Scalars['String']['output']>;
  dept_id?: Maybe<Scalars['String']['output']>;
  desc_en?: Maybe<Scalars['String']['output']>;
  desc_fi?: Maybe<Scalars['String']['output']>;
  desc_sv?: Maybe<Scalars['String']['output']>;
  easting_etrs_gk25?: Maybe<Scalars['Int']['output']>;
  easting_etrs_tm35fin?: Maybe<Scalars['Int']['output']>;
  extra_searchwords_en?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  latitude?: Maybe<Scalars['Float']['output']>;
  longitude?: Maybe<Scalars['Float']['output']>;
  manual_coordinates?: Maybe<Scalars['Boolean']['output']>;
  modified_time?: Maybe<Scalars['String']['output']>;
  name_en?: Maybe<Scalars['String']['output']>;
  name_fi?: Maybe<Scalars['String']['output']>;
  name_sv?: Maybe<Scalars['String']['output']>;
  northing_etrs_gk25?: Maybe<Scalars['Int']['output']>;
  northing_etrs_tm35fin?: Maybe<Scalars['Int']['output']>;
  ontologytree_ids?: Maybe<Array<Maybe<Scalars['Int']['output']>>>;
  ontologyword_ids?: Maybe<Array<Maybe<Scalars['Int']['output']>>>;
  ontologyword_ids_enriched?: Maybe<Array<Maybe<Ontologyword>>>;
  org_id?: Maybe<Scalars['String']['output']>;
  organizer_name?: Maybe<Scalars['String']['output']>;
  organizer_type?: Maybe<Scalars['String']['output']>;
  /** Raw palvelukartta Unit fields */
  origin?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  picture_caption_en?: Maybe<Scalars['String']['output']>;
  picture_caption_fi?: Maybe<Scalars['String']['output']>;
  picture_caption_sv?: Maybe<Scalars['String']['output']>;
  picture_url?: Maybe<Scalars['String']['output']>;
  provider_type?: Maybe<Scalars['String']['output']>;
  street_address_en?: Maybe<Scalars['String']['output']>;
  street_address_fi?: Maybe<Scalars['String']['output']>;
  street_address_sv?: Maybe<Scalars['String']['output']>;
  www_en?: Maybe<Scalars['String']['output']>;
  www_fi?: Maybe<Scalars['String']['output']>;
  www_sv?: Maybe<Scalars['String']['output']>;
};

/** TODO: take from Profile */
export type Person = {
  __typename?: 'Person';
  contactDetails?: Maybe<ContactInfo>;
  identificationStrength?: Maybe<IdentificationStrength>;
  meta?: Maybe<NodeMeta>;
  name?: Maybe<Scalars['String']['output']>;
  preferredLanguages?: Maybe<Array<UnifiedSearchLanguageEnum>>;
  preferredMedium?: Maybe<ContactMedium>;
};

export type PhoneNumber = {
  __typename?: 'PhoneNumber';
  countryCode: Scalars['String']['output'];
  restNumber: Scalars['String']['output'];
};

export enum ProviderType {
  Association = 'ASSOCIATION',
  ContractSchool = 'CONTRACT_SCHOOL',
  Municipality = 'MUNICIPALITY',
  OtherProductionMethod = 'OTHER_PRODUCTION_METHOD',
  PaymentCommitment = 'PAYMENT_COMMITMENT',
  PrivateCompany = 'PRIVATE_COMPANY',
  PurchasedService = 'PURCHASED_SERVICE',
  SelfProduced = 'SELF_PRODUCED',
  SupportedOperations = 'SUPPORTED_OPERATIONS',
  UnknownProductionMethod = 'UNKNOWN_PRODUCTION_METHOD',
  VoucherService = 'VOUCHER_SERVICE'
}

export type Query = {
  __typename?: 'Query';
  _service: _Service;
  administrativeDivisions?: Maybe<Array<Maybe<AdministrativeDivision>>>;
  ontologyTree?: Maybe<Array<Maybe<OntologyTree>>>;
  ontologyWords?: Maybe<Array<Maybe<OntologyWord>>>;
  unifiedSearch?: Maybe<SearchResultConnection>;
  unifiedSearchCompletionSuggestions?: Maybe<SearchSuggestionConnection>;
};


export type QueryAdministrativeDivisionsArgs = {
  helsinkiCommonOnly?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryOntologyTreeArgs = {
  leavesOnly?: InputMaybe<Scalars['Boolean']['input']>;
  rootId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryOntologyWordsArgs = {
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
};


export type QueryUnifiedSearchArgs = {
  administrativeDivisionIds?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  index?: InputMaybe<UnifiedSearchIndex>;
  languages?: Array<UnifiedSearchLanguage>;
  mustHaveReservableResource?: InputMaybe<Scalars['Boolean']['input']>;
  ontology?: InputMaybe<Scalars['String']['input']>;
  ontologyTreeIdOrSets?: InputMaybe<Array<Array<Scalars['ID']['input']>>>;
  ontologyWordIdOrSets?: InputMaybe<Array<Array<Scalars['ID']['input']>>>;
  openAt?: InputMaybe<Scalars['String']['input']>;
  orderByAccessibilityProfile?: InputMaybe<AccessibilityProfile>;
  orderByDistance?: InputMaybe<OrderByDistance>;
  orderByName?: InputMaybe<OrderByName>;
  providerTypes?: InputMaybe<Array<InputMaybe<ProviderType>>>;
  serviceOwnerTypes?: InputMaybe<Array<InputMaybe<ServiceOwnerType>>>;
  targetGroups?: InputMaybe<Array<InputMaybe<TargetGroup>>>;
  text?: InputMaybe<Scalars['String']['input']>;
};


export type QueryUnifiedSearchCompletionSuggestionsArgs = {
  index?: InputMaybe<UnifiedSearchIndex>;
  languages?: Array<UnifiedSearchLanguage>;
  prefix?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};

export type RawJson = {
  __typename?: 'RawJSON';
  data?: Maybe<Scalars['String']['output']>;
};

export type Reservation = {
  __typename?: 'Reservation';
  externalReservationUrl?: Maybe<LanguageString>;
  reservable?: Maybe<Scalars['Boolean']['output']>;
};

export type SearchResultConnection = {
  __typename?: 'SearchResultConnection';
  count?: Maybe<Scalars['Int']['output']>;
  edges: Array<SearchResultEdge>;
  /** Elasticsearch raw results */
  es_results?: Maybe<Array<Maybe<ElasticSearchResult>>>;
  max_score?: Maybe<Scalars['Float']['output']>;
  pageInfo?: Maybe<SearchResultPageInfo>;
};

export type SearchResultEdge = {
  __typename?: 'SearchResultEdge';
  cursor: Scalars['String']['output'];
  node: SearchResultNode;
};

export type SearchResultNode = {
  __typename?: 'SearchResultNode';
  _score?: Maybe<Scalars['Float']['output']>;
  event?: Maybe<Event>;
  id: Scalars['ID']['output'];
  searchCategories: Array<UnifiedSearchResultCategory>;
  venue?: Maybe<UnifiedSearchVenue>;
};

export type SearchResultPageInfo = {
  __typename?: 'SearchResultPageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type SearchSuggestionConnection = {
  __typename?: 'SearchSuggestionConnection';
  suggestions: Array<Maybe<Suggestion>>;
};

export type ServiceOwner = {
  __typename?: 'ServiceOwner';
  name?: Maybe<LanguageString>;
  providerType?: Maybe<ProviderType>;
  type?: Maybe<ServiceOwnerType>;
};

export enum ServiceOwnerType {
  MunicipalService = 'MUNICIPAL_SERVICE',
  NotDisplayed = 'NOT_DISPLAYED',
  PrivateContractSchool = 'PRIVATE_CONTRACT_SCHOOL',
  PrivateService = 'PRIVATE_SERVICE',
  PurchasedService = 'PURCHASED_SERVICE',
  ServiceByJointMunicipalAuthority = 'SERVICE_BY_JOINT_MUNICIPAL_AUTHORITY',
  ServiceByMunicipallyOwnedCompany = 'SERVICE_BY_MUNICIPALLY_OWNED_COMPANY',
  ServiceByMunicipalGroupEntity = 'SERVICE_BY_MUNICIPAL_GROUP_ENTITY',
  ServiceByOtherMunicipality = 'SERVICE_BY_OTHER_MUNICIPALITY',
  ServiceByRegionalCooperationOrganization = 'SERVICE_BY_REGIONAL_COOPERATION_ORGANIZATION',
  ServiceByWellbeingArea = 'SERVICE_BY_WELLBEING_AREA',
  StateContractSchool = 'STATE_CONTRACT_SCHOOL',
  StateService = 'STATE_SERVICE',
  SupportedOperations = 'SUPPORTED_OPERATIONS',
  VoucherService = 'VOUCHER_SERVICE'
}

export type Shards = {
  __typename?: 'Shards';
  failed?: Maybe<Scalars['Int']['output']>;
  skipped?: Maybe<Scalars['Int']['output']>;
  successful?: Maybe<Scalars['Int']['output']>;
  total?: Maybe<Scalars['Int']['output']>;
};

export type SingleHit = {
  __typename?: 'SingleHit';
  _id?: Maybe<Scalars['String']['output']>;
  _index?: Maybe<Scalars['String']['output']>;
  _score?: Maybe<Scalars['Float']['output']>;
  _source?: Maybe<RawJson>;
  _type?: Maybe<Scalars['String']['output']>;
};

export enum SortOrder {
  Ascending = 'ASCENDING',
  Descending = 'DESCENDING'
}

export type Suggestion = {
  __typename?: 'Suggestion';
  label: Scalars['String']['output'];
};

export enum TargetGroup {
  Associations = 'ASSOCIATIONS',
  ChildrenAndFamilies = 'CHILDREN_AND_FAMILIES',
  Disabled = 'DISABLED',
  ElderlyPeople = 'ELDERLY_PEOPLE',
  Enterprises = 'ENTERPRISES',
  Immigrants = 'IMMIGRANTS',
  Individuals = 'INDIVIDUALS',
  Youth = 'YOUTH'
}

/** any kind of description answering the question "when". */
export type TimeDescription = {
  __typename?: 'TimeDescription';
  ending?: Maybe<Scalars['DateTime']['output']>;
  otherTime?: Maybe<TimeDescription>;
  starting?: Maybe<Scalars['DateTime']['output']>;
};

export enum UnifiedSearchIndex {
  AdministrativeDivision = 'administrative_division',
  Event = 'event',
  HelsinkiCommonAdministrativeDivision = 'helsinki_common_administrative_division',
  Location = 'location',
  OntologyTree = 'ontology_tree',
  OntologyWord = 'ontology_word'
}

export enum UnifiedSearchLanguage {
  English = 'ENGLISH',
  Finnish = 'FINNISH',
  Swedish = 'SWEDISH'
}

/** TODO: take from Profile or external source */
export enum UnifiedSearchLanguageEnum {
  Fi = 'FI'
}

export enum UnifiedSearchResultCategory {
  Article = 'ARTICLE',
  Artwork = 'ARTWORK',
  Enrollable = 'ENROLLABLE',
  Event = 'EVENT',
  PointOfInterest = 'POINT_OF_INTEREST',
  Reservable = 'RESERVABLE',
  Service = 'SERVICE'
}

/**
 * A place that forms a unit and can be used for some specific purpose -
 * respa unit or resource, service map unit, beta.kultus venue, linked
 * events place, Kukkuu venue
 */
export type UnifiedSearchVenue = {
  __typename?: 'UnifiedSearchVenue';
  accessibility?: Maybe<Accessibility>;
  /** Accessibility shortcoming for a specific accessibility profile. */
  accessibilityShortcomingFor?: Maybe<AccessibilityShortcoming>;
  additionalInfo?: Maybe<Scalars['String']['output']>;
  arrivalInstructions?: Maybe<Scalars['String']['output']>;
  contactDetails?: Maybe<ContactInfo>;
  description?: Maybe<LanguageString>;
  descriptionResources?: Maybe<DescriptionResources>;
  facilities?: Maybe<Array<VenueFacility>>;
  images?: Maybe<Array<Maybe<LocationImage>>>;
  location?: Maybe<LocationDescription>;
  manager?: Maybe<LegalEntity>;
  meta?: Maybe<NodeMeta>;
  name?: Maybe<LanguageString>;
  ontologyWords?: Maybe<Array<Maybe<OntologyWord>>>;
  openingHours?: Maybe<OpeningHours>;
  partOf?: Maybe<UnifiedSearchVenue>;
  reservation?: Maybe<Reservation>;
  serviceOwner?: Maybe<ServiceOwner>;
  targetGroups?: Maybe<Array<Maybe<TargetGroup>>>;
};


/**
 * A place that forms a unit and can be used for some specific purpose -
 * respa unit or resource, service map unit, beta.kultus venue, linked
 * events place, Kukkuu venue
 */
export type UnifiedSearchVenueAccessibilityShortcomingForArgs = {
  profile?: InputMaybe<AccessibilityProfile>;
};

/** TODO: combine beta.kultus Venue stuff with respa equipment type */
export type VenueFacility = {
  __typename?: 'VenueFacility';
  categories?: Maybe<Array<KeywordString>>;
  meta?: Maybe<NodeMeta>;
  name: Scalars['String']['output'];
};

export type _Service = {
  __typename?: '_Service';
  sdl?: Maybe<Scalars['String']['output']>;
};

export enum Link__Purpose {
  /** `EXECUTION` features provide metadata necessary for operation execution. */
  Execution = 'EXECUTION',
  /** `SECURITY` features provide metadata necessary to securely resolve fields. */
  Security = 'SECURITY'
}

export type AdministrativeDivisionsQueryVariables = Exact<{
  helsinkiCommonOnly?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type AdministrativeDivisionsQuery = { __typename?: 'Query', administrativeDivisions?: Array<{ __typename?: 'AdministrativeDivision', id?: string | null, type?: string | null, name?: { __typename?: 'LanguageString', fi?: string | null, sv?: string | null, en?: string | null } | null } | null> | null };


export const AdministrativeDivisionsDocument = gql`
    query AdministrativeDivisions($helsinkiCommonOnly: Boolean = true) {
  administrativeDivisions(helsinkiCommonOnly: $helsinkiCommonOnly) {
    id
    type
    name {
      fi
      sv
      en
    }
  }
}
    `;

/**
 * __useAdministrativeDivisionsQuery__
 *
 * To run a query within a React component, call `useAdministrativeDivisionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdministrativeDivisionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdministrativeDivisionsQuery({
 *   variables: {
 *      helsinkiCommonOnly: // value for 'helsinkiCommonOnly'
 *   },
 * });
 */
export function useAdministrativeDivisionsQuery(baseOptions?: Apollo.QueryHookOptions<AdministrativeDivisionsQuery, AdministrativeDivisionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AdministrativeDivisionsQuery, AdministrativeDivisionsQueryVariables>(AdministrativeDivisionsDocument, options);
      }
export function useAdministrativeDivisionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AdministrativeDivisionsQuery, AdministrativeDivisionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AdministrativeDivisionsQuery, AdministrativeDivisionsQueryVariables>(AdministrativeDivisionsDocument, options);
        }
export type AdministrativeDivisionsQueryHookResult = ReturnType<typeof useAdministrativeDivisionsQuery>;
export type AdministrativeDivisionsLazyQueryHookResult = ReturnType<typeof useAdministrativeDivisionsLazyQuery>;
export type AdministrativeDivisionsQueryResult = Apollo.QueryResult<AdministrativeDivisionsQuery, AdministrativeDivisionsQueryVariables>;