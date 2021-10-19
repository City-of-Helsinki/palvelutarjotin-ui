import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
  /** A (multidimensional) set of coordinates following x, y, z order. */
  GeoJSONCoordinates: any;
  /** Arbitrary JSON value */
  JSONObject: any;
};



/** TODO: take this from service map / TPREK */
export type AccessibilityProfile = {
  __typename?: 'AccessibilityProfile';
  meta?: Maybe<NodeMeta>;
  todo?: Maybe<Scalars['String']>;
};

/** TODO: give real structure */
export type Address = {
  __typename?: 'Address';
  postalCode?: Maybe<Scalars['String']>;
  streetAddress?: Maybe<LanguageString>;
  city?: Maybe<LanguageString>;
};

export type AdministrativeDivision = {
  __typename?: 'AdministrativeDivision';
  id?: Maybe<Scalars['ID']>;
  type?: Maybe<Scalars['String']>;
  municipality?: Maybe<Scalars['String']>;
  name?: Maybe<LanguageString>;
};

export enum CacheControlScope {
  Public = 'PUBLIC',
  Private = 'PRIVATE'
}

/** Contact details for a person, legal entity, venue or project */
export type ContactInfo = {
  __typename?: 'ContactInfo';
  contactUrl?: Maybe<Scalars['String']>;
  phoneNumbers: Array<PhoneNumber>;
  emailAddresses: Array<Scalars['String']>;
  postalAddresses: Array<Address>;
};

export enum ContactMedium {
  Sms = 'SMS',
  Email = 'EMAIL',
  SmsAndEmail = 'SMS_AND_EMAIL',
  MobileNotification = 'MOBILE_NOTIFICATION',
  Asiointi = 'ASIOINTI'
}


/**
 * Resources (media) that provide extra description of a resource,
 * facility, event or venue, such as images, videos, info pages, etc.
 */
export type DescriptionResources = {
  __typename?: 'DescriptionResources';
  mediaResources: Array<MediaResource>;
  infoUrls: Array<Scalars['String']>;
  externalLinks: Array<Scalars['String']>;
};

/**  Elasticsearch results  */
export type ElasticSearchResult = {
  __typename?: 'ElasticSearchResult';
  took?: Maybe<Scalars['Int']>;
  timed_out?: Maybe<Scalars['Boolean']>;
  _shards?: Maybe<Shards>;
  hits?: Maybe<Hits>;
};

/** Information about enrolled participant(s) in an event occurrence */
export type Enrolment = {
  __typename?: 'Enrolment';
  meta?: Maybe<NodeMeta>;
  event?: Maybe<EventOccurrence>;
  enroller?: Maybe<Person>;
  participantCount: Scalars['Int'];
  participants?: Maybe<Array<Person>>;
  participantCategory?: Maybe<Keyword>;
  overseerCount?: Maybe<Scalars['Int']>;
  overseers?: Maybe<Array<Person>>;
  requestedMethodOfNotification?: Maybe<ContactMedium>;
  status?: Maybe<EnrolmentStatus>;
  extraInformation?: Maybe<Scalars['String']>;
};

/** Rules about who can enroll to an event and how */
export type EnrolmentPolicy = {
  __typename?: 'EnrolmentPolicy';
  meta?: Maybe<NodeMeta>;
  type: Array<EnrolmentPolicyType>;
  enrolmentTime?: Maybe<TimeDescription>;
  allowedParticipantCategories: Array<Keyword>;
  participantMinimumAge: Scalars['Int'];
  participantMaximumAge: Scalars['Int'];
  /** minimum number of people who can enrol together (at the same time) */
  minimumEnrolmentCount?: Maybe<Scalars['Int']>;
  /** maximum number of people who can enrol together (at the same time) */
  maximumEnrolmentCount?: Maybe<Scalars['Int']>;
};

export enum EnrolmentPolicyType {
  NoEnrolmentNeeded = 'NO_ENROLMENT_NEEDED',
  Groups = 'GROUPS',
  GroupsWithSupervisors = 'GROUPS_WITH_SUPERVISORS',
  Individuals = 'INDIVIDUALS'
}

export enum EnrolmentStatus {
  Requested = 'REQUESTED',
  Queued = 'QUEUED',
  Confirmed = 'CONFIRMED',
  Cancelled = 'CANCELLED',
  Declined = 'DECLINED'
}

/**
 * Request for equipment - if someone needs equipment for a purpose such
 * as organising a volunteering event (as is the case in park cleaning
 * bees), a specification of what is being requested.
 */
export type EquipmentRequest = {
  __typename?: 'EquipmentRequest';
  meta?: Maybe<NodeMeta>;
  requestedEquipment: Scalars['String'];
  estimatedAmount?: Maybe<Scalars['Int']>;
  requestedForEvent?: Maybe<Event>;
  deliveryLocation?: Maybe<LocationDescription>;
  returnLocation?: Maybe<LocationDescription>;
  extraInformation: Scalars['String'];
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
  meta?: Maybe<NodeMeta>;
  name?: Maybe<LanguageString>;
  description?: Maybe<LanguageString>;
  shortDescription?: Maybe<Scalars['String']>;
  descriptionResources?: Maybe<DescriptionResources>;
  keywords: Array<Keyword>;
  eventDataSource?: Maybe<Scalars['String']>;
  occurrences: Array<EventOccurrence>;
  pricing?: Maybe<Array<EventPricing>>;
  organiser?: Maybe<LegalEntity>;
  publisher?: Maybe<LegalEntity>;
  published?: Maybe<Scalars['DateTime']>;
  contactPerson?: Maybe<LegalEntity>;
  eventLanguages: Array<Language>;
  subEvents: Array<Event>;
  superEvent?: Maybe<Event>;
  enrolmentPolicy?: Maybe<EnrolmentPolicy>;
  targetAudience?: Maybe<Array<Keyword>>;
};

export type EventOccurrence = {
  __typename?: 'EventOccurrence';
  meta?: Maybe<NodeMeta>;
  /** which event this is an occurrence of */
  ofEvent?: Maybe<Event>;
  happensAt?: Maybe<TimeDescription>;
  /**
   * for information - for example, to guide people who are looking for
   * big or small events, or to give city officials a hint on how much
   * equipment is needed
   */
  estimatedAttendeeCount?: Maybe<Scalars['Int']>;
  location?: Maybe<LocationDescription>;
  status?: Maybe<EventOccurrenceStatus>;
  enrolments: Array<Enrolment>;
  minimumAttendeeCount?: Maybe<Scalars['Int']>;
  maximumAttendeeCount?: Maybe<Scalars['Int']>;
  currentlyAvailableParticipantCount?: Maybe<Scalars['Int']>;
  /** for events where equipment is requested from the City of Helsinki */
  cityEquipmentRequests?: Maybe<Array<EquipmentRequest>>;
};

export enum EventOccurrenceStatus {
  Unpublished = 'UNPUBLISHED',
  Published = 'PUBLISHED',
  Cancelled = 'CANCELLED',
  Rescheduled = 'RESCHEDULED',
  Postponed = 'POSTPONED'
}

/** TODO: improve (a lot) over Linked events' offer type */
export type EventPricing = {
  __typename?: 'EventPricing';
  meta?: Maybe<NodeMeta>;
  todo?: Maybe<Scalars['String']>;
};

/** CRS object properties. */
export type GeoJsoncrsProperties = GeoJsonNamedCrsProperties | GeoJsonLinkedCrsProperties;

/** Enumeration of all GeoJSON CRS object types. */
export enum GeoJsoncrsType {
  Name = 'name',
  Link = 'link'
}

/** Coordinate Reference System (CRS) object. */
export type GeoJsonCoordinateReferenceSystem = {
  __typename?: 'GeoJSONCoordinateReferenceSystem';
  type: GeoJsoncrsType;
  properties: GeoJsoncrsProperties;
};


/** An object that links a geometry to properties in order to provide context. */
export type GeoJsonFeature = GeoJsonInterface & {
  __typename?: 'GeoJSONFeature';
  type: GeoJsonType;
  crs: GeoJsonCoordinateReferenceSystem;
  bbox?: Maybe<Array<Maybe<Scalars['Float']>>>;
  geometry?: Maybe<GeoJsonGeometryInterface>;
  properties?: Maybe<Scalars['JSONObject']>;
  id?: Maybe<Scalars['String']>;
};

/** A set of multiple features. */
export type GeoJsonFeatureCollection = GeoJsonInterface & {
  __typename?: 'GeoJSONFeatureCollection';
  type: GeoJsonType;
  crs: GeoJsonCoordinateReferenceSystem;
  bbox?: Maybe<Array<Maybe<Scalars['Float']>>>;
  features: Array<GeoJsonFeature>;
};

/** A set of multiple geometries, possibly of various types. */
export type GeoJsonGeometryCollection = GeoJsonInterface & {
  __typename?: 'GeoJSONGeometryCollection';
  type: GeoJsonType;
  crs: GeoJsonCoordinateReferenceSystem;
  bbox?: Maybe<Array<Maybe<Scalars['Float']>>>;
  geometries: Array<GeoJsonGeometryInterface>;
};

export type GeoJsonGeometryInterface = {
  type: GeoJsonType;
  crs: GeoJsonCoordinateReferenceSystem;
  bbox?: Maybe<Array<Maybe<Scalars['Float']>>>;
  coordinates?: Maybe<Scalars['GeoJSONCoordinates']>;
};

export type GeoJsonInterface = {
  type: GeoJsonType;
  crs: GeoJsonCoordinateReferenceSystem;
  bbox?: Maybe<Array<Maybe<Scalars['Float']>>>;
};

/** Object describing a single connected sequence of geographical points. */
export type GeoJsonLineString = GeoJsonInterface & GeoJsonGeometryInterface & {
  __typename?: 'GeoJSONLineString';
  type: GeoJsonType;
  crs: GeoJsonCoordinateReferenceSystem;
  bbox?: Maybe<Array<Maybe<Scalars['Float']>>>;
  coordinates?: Maybe<Scalars['GeoJSONCoordinates']>;
};

/** Properties for link based CRS object. */
export type GeoJsonLinkedCrsProperties = {
  __typename?: 'GeoJSONLinkedCRSProperties';
  href: Scalars['String'];
  type?: Maybe<Scalars['String']>;
};

/** Object describing multiple connected sequences of geographical points. */
export type GeoJsonMultiLineString = GeoJsonInterface & GeoJsonGeometryInterface & {
  __typename?: 'GeoJSONMultiLineString';
  type: GeoJsonType;
  crs: GeoJsonCoordinateReferenceSystem;
  bbox?: Maybe<Array<Maybe<Scalars['Float']>>>;
  coordinates?: Maybe<Scalars['GeoJSONCoordinates']>;
};

/** Object describing multiple geographical points. */
export type GeoJsonMultiPoint = GeoJsonInterface & GeoJsonGeometryInterface & {
  __typename?: 'GeoJSONMultiPoint';
  type: GeoJsonType;
  crs: GeoJsonCoordinateReferenceSystem;
  bbox?: Maybe<Array<Maybe<Scalars['Float']>>>;
  coordinates?: Maybe<Scalars['GeoJSONCoordinates']>;
};

/** Object describing multiple shapes formed by sets of geographical points. */
export type GeoJsonMultiPolygon = GeoJsonInterface & GeoJsonGeometryInterface & {
  __typename?: 'GeoJSONMultiPolygon';
  type: GeoJsonType;
  crs: GeoJsonCoordinateReferenceSystem;
  bbox?: Maybe<Array<Maybe<Scalars['Float']>>>;
  coordinates?: Maybe<Scalars['GeoJSONCoordinates']>;
};

/** Properties for name based CRS object. */
export type GeoJsonNamedCrsProperties = {
  __typename?: 'GeoJSONNamedCRSProperties';
  name: Scalars['String'];
};

/** Object describing a single geographical point. */
export type GeoJsonPoint = GeoJsonInterface & GeoJsonGeometryInterface & {
  __typename?: 'GeoJSONPoint';
  type: GeoJsonType;
  crs: GeoJsonCoordinateReferenceSystem;
  bbox?: Maybe<Array<Maybe<Scalars['Float']>>>;
  coordinates?: Maybe<Scalars['GeoJSONCoordinates']>;
};

/** Object describing a single shape formed by a set of geographical points. */
export type GeoJsonPolygon = GeoJsonInterface & GeoJsonGeometryInterface & {
  __typename?: 'GeoJSONPolygon';
  type: GeoJsonType;
  crs: GeoJsonCoordinateReferenceSystem;
  bbox?: Maybe<Array<Maybe<Scalars['Float']>>>;
  coordinates?: Maybe<Scalars['GeoJSONCoordinates']>;
};

/** Enumeration of all GeoJSON object types. */
export enum GeoJsonType {
  Point = 'Point',
  MultiPoint = 'MultiPoint',
  LineString = 'LineString',
  MultiLineString = 'MultiLineString',
  Polygon = 'Polygon',
  MultiPolygon = 'MultiPolygon',
  GeometryCollection = 'GeometryCollection',
  Feature = 'Feature',
  FeatureCollection = 'FeatureCollection'
}

export type HitTotal = {
  __typename?: 'HitTotal';
  value?: Maybe<Scalars['Int']>;
  relation?: Maybe<Scalars['String']>;
};

export type Hits = {
  __typename?: 'Hits';
  max_score?: Maybe<Scalars['Float']>;
  total?: Maybe<HitTotal>;
  hits?: Maybe<Array<Maybe<SingleHit>>>;
};

export enum IdentificationStrength {
  /** If this person is just a pseudoperson for contacting */
  Nonidentifiable = 'NONIDENTIFIABLE',
  /** If the identity of this person is not known at all */
  Unidentified = 'UNIDENTIFIED',
  /** If the person has authenticated with at least some method */
  Authenticated = 'AUTHENTICATED',
  /** If the person has done some identifiable action such as payment */
  Indirect = 'INDIRECT',
  /** If the person has proved their legal identity */
  LegallyConnected = 'LEGALLY_CONNECTED'
}

export type Image = {
  __typename?: 'Image';
  url?: Maybe<Scalars['String']>;
  caption?: Maybe<LanguageString>;
};


/** TODO: merge all free tags, categories, and keywords */
export type Keyword = {
  __typename?: 'Keyword';
  name: Scalars['String'];
};

/** TODO: take from Profile or external source */
export enum Language {
  Fi = 'FI'
}

/** TODO: convert all String's to LanguageString's if linguistic content */
export type LanguageString = {
  __typename?: 'LanguageString';
  fi?: Maybe<Scalars['String']>;
  sv?: Maybe<Scalars['String']>;
  en?: Maybe<Scalars['String']>;
  text: Scalars['String'];
  defaultLanguage?: Maybe<Language>;
};

export type LegalEntity = Person | Organisation;

export type LinkedeventsPlace = {
  __typename?: 'LinkedeventsPlace';
  /**  Raw Linkedevents Place fields  */
  origin?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  data_source?: Maybe<Scalars['String']>;
  publisher?: Maybe<Scalars['String']>;
  divisions?: Maybe<Array<Maybe<LinkedeventsPlaceDivision>>>;
  created_time?: Maybe<Scalars['String']>;
  last_modified_time?: Maybe<Scalars['String']>;
  custom_data?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  contact_type?: Maybe<Scalars['String']>;
  address_region?: Maybe<Scalars['String']>;
  postal_code?: Maybe<Scalars['String']>;
  post_office_box_num?: Maybe<Scalars['String']>;
  address_country?: Maybe<Scalars['String']>;
  deleted?: Maybe<Scalars['Boolean']>;
  has_upcoming_events?: Maybe<Scalars['Boolean']>;
  n_events?: Maybe<Scalars['Int']>;
  image?: Maybe<Scalars['String']>;
  parent?: Maybe<Scalars['String']>;
  replaced_by?: Maybe<Scalars['String']>;
  position?: Maybe<LinkedeventsPlacePosition>;
  address_locality?: Maybe<LinkedeventsPlaceLocalityString>;
  info_url?: Maybe<LinkedeventsPlaceLocalityString>;
  description?: Maybe<LinkedeventsPlaceLocalityString>;
  telephone?: Maybe<Scalars['String']>;
  street_address?: Maybe<LinkedeventsPlaceLocalityString>;
  name?: Maybe<LinkedeventsPlaceLocalityString>;
  _at_id?: Maybe<Scalars['String']>;
  _at_context?: Maybe<Scalars['String']>;
  _at_type?: Maybe<Scalars['String']>;
};

export type LinkedeventsPlaceDivision = {
  __typename?: 'LinkedeventsPlaceDivision';
  type?: Maybe<Scalars['String']>;
  ocd_id?: Maybe<Scalars['String']>;
  municipality?: Maybe<Scalars['String']>;
  name?: Maybe<LinkedeventsPlaceLocalityString>;
};

export type LinkedeventsPlaceLocalityString = {
  __typename?: 'LinkedeventsPlaceLocalityString';
  fi?: Maybe<Scalars['String']>;
  sv?: Maybe<Scalars['String']>;
  en?: Maybe<Scalars['String']>;
};

export type LinkedeventsPlacePosition = {
  __typename?: 'LinkedeventsPlacePosition';
  type?: Maybe<Scalars['String']>;
  coordinates?: Maybe<Array<Maybe<Scalars['Float']>>>;
};

/** Free-form location, not necessarily at a know venue. */
export type LocationDescription = {
  __typename?: 'LocationDescription';
  url?: Maybe<LanguageString>;
  geoLocation?: Maybe<GeoJsonFeature>;
  address?: Maybe<Address>;
  explanation?: Maybe<Scalars['String']>;
  administrativeDivisions?: Maybe<Array<Maybe<AdministrativeDivision>>>;
  venue?: Maybe<Venue>;
};

/** TODO: take this from Linked events Image type. */
export type MediaResource = {
  __typename?: 'MediaResource';
  meta?: Maybe<NodeMeta>;
  todo?: Maybe<Scalars['String']>;
};

export type NodeMeta = {
  __typename?: 'NodeMeta';
  id: Scalars['ID'];
  createdAt?: Maybe<Scalars['DateTime']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
};

export type OntologyTree = {
  __typename?: 'OntologyTree';
  id?: Maybe<Scalars['ID']>;
  parentId?: Maybe<Scalars['ID']>;
  name?: Maybe<LanguageString>;
  childIds?: Maybe<Array<Maybe<Scalars['ID']>>>;
  ancestorIds?: Maybe<Array<Maybe<Scalars['ID']>>>;
  level?: Maybe<Scalars['Int']>;
};

export type OntologyWord = {
  __typename?: 'OntologyWord';
  id?: Maybe<Scalars['ID']>;
  label?: Maybe<LanguageString>;
};

export type Ontologyword = {
  __typename?: 'Ontologyword';
  id?: Maybe<Scalars['Int']>;
  ontologyword_fi?: Maybe<Scalars['String']>;
  ontologyword_sv?: Maybe<Scalars['String']>;
  ontologyword_en?: Maybe<Scalars['String']>;
  can_add_schoolyear?: Maybe<Scalars['Boolean']>;
  can_add_clarification?: Maybe<Scalars['Boolean']>;
  extra_searchwords_fi?: Maybe<Scalars['String']>;
  unit_ids?: Maybe<Array<Maybe<Scalars['Int']>>>;
};

export type OpeningHours = {
  __typename?: 'OpeningHours';
  url?: Maybe<Scalars['String']>;
  is_open_now_url?: Maybe<Scalars['String']>;
  today?: Maybe<Array<Maybe<OpeningHoursTimes>>>;
  data?: Maybe<Array<Maybe<OpeningHoursDay>>>;
};

export type OpeningHoursDay = {
  __typename?: 'OpeningHoursDay';
  date?: Maybe<Scalars['String']>;
  times?: Maybe<Array<Maybe<OpeningHoursTimes>>>;
};

export type OpeningHoursTimes = {
  __typename?: 'OpeningHoursTimes';
  startTime?: Maybe<Scalars['String']>;
  endTime?: Maybe<Scalars['String']>;
  endTimeOnNextDay?: Maybe<Scalars['Boolean']>;
  resourceState?: Maybe<Scalars['String']>;
  fullDay?: Maybe<Scalars['Boolean']>;
};

export type OrderByDistance = {
  latitude: Scalars['Float'];
  longitude: Scalars['Float'];
  order?: Maybe<SortOrder>;
};

export type OrderByName = {
  order?: Maybe<SortOrder>;
};

/** TODO: merge beta.kultus organisation, etc */
export type Organisation = {
  __typename?: 'Organisation';
  meta?: Maybe<NodeMeta>;
  contactDetails?: Maybe<ContactInfo>;
};

export type PalvelukarttaUnit = {
  __typename?: 'PalvelukarttaUnit';
  /**  Raw palvelukartta Unit fields  */
  origin?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  org_id?: Maybe<Scalars['String']>;
  dept_id?: Maybe<Scalars['String']>;
  provider_type?: Maybe<Scalars['String']>;
  organizer_type?: Maybe<Scalars['String']>;
  organizer_name?: Maybe<Scalars['String']>;
  data_source_url?: Maybe<Scalars['String']>;
  name_fi?: Maybe<Scalars['String']>;
  name_sv?: Maybe<Scalars['String']>;
  name_en?: Maybe<Scalars['String']>;
  ontologyword_ids?: Maybe<Array<Maybe<Scalars['Int']>>>;
  ontologytree_ids?: Maybe<Array<Maybe<Scalars['Int']>>>;
  desc_fi?: Maybe<Scalars['String']>;
  desc_sv?: Maybe<Scalars['String']>;
  desc_en?: Maybe<Scalars['String']>;
  latitude?: Maybe<Scalars['Float']>;
  longitude?: Maybe<Scalars['Float']>;
  northing_etrs_gk25?: Maybe<Scalars['Int']>;
  easting_etrs_gk25?: Maybe<Scalars['Int']>;
  northing_etrs_tm35fin?: Maybe<Scalars['Int']>;
  easting_etrs_tm35fin?: Maybe<Scalars['Int']>;
  manual_coordinates?: Maybe<Scalars['Boolean']>;
  street_address_fi?: Maybe<Scalars['String']>;
  street_address_sv?: Maybe<Scalars['String']>;
  street_address_en?: Maybe<Scalars['String']>;
  address_zip?: Maybe<Scalars['String']>;
  address_city_fi?: Maybe<Scalars['String']>;
  address_city_sv?: Maybe<Scalars['String']>;
  address_city_en?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  call_charge_info_fi?: Maybe<Scalars['String']>;
  call_charge_info_sv?: Maybe<Scalars['String']>;
  call_charge_info_en?: Maybe<Scalars['String']>;
  www_fi?: Maybe<Scalars['String']>;
  www_sv?: Maybe<Scalars['String']>;
  www_en?: Maybe<Scalars['String']>;
  picture_url?: Maybe<Scalars['String']>;
  picture_caption_fi?: Maybe<Scalars['String']>;
  picture_caption_sv?: Maybe<Scalars['String']>;
  picture_caption_en?: Maybe<Scalars['String']>;
  extra_searchwords_en?: Maybe<Scalars['String']>;
  accessibility_viewpoints?: Maybe<Scalars['String']>;
  created_time?: Maybe<Scalars['String']>;
  modified_time?: Maybe<Scalars['String']>;
  ontologyword_ids_enriched?: Maybe<Array<Maybe<Ontologyword>>>;
};

/** TODO: take from Profile */
export type Person = {
  __typename?: 'Person';
  meta?: Maybe<NodeMeta>;
  name?: Maybe<Scalars['String']>;
  identificationStrength?: Maybe<IdentificationStrength>;
  contactDetails?: Maybe<ContactInfo>;
  preferredLanguages?: Maybe<Array<Language>>;
  preferredMedium?: Maybe<ContactMedium>;
};

export type PhoneNumber = {
  __typename?: 'PhoneNumber';
  countryCode: Scalars['String'];
  restNumber: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  unifiedSearch?: Maybe<SearchResultConnection>;
  unifiedSearchCompletionSuggestions?: Maybe<SearchSuggestionConnection>;
  administrativeDivisions?: Maybe<Array<Maybe<AdministrativeDivision>>>;
  ontologyTree?: Maybe<Array<Maybe<OntologyTree>>>;
  ontologyWords?: Maybe<Array<Maybe<OntologyWord>>>;
};


export type QueryUnifiedSearchArgs = {
  q?: Maybe<Scalars['String']>;
  ontology?: Maybe<Scalars['String']>;
  administrativeDivisionId?: Maybe<Scalars['ID']>;
  administrativeDivisionIds?: Maybe<Array<Maybe<Scalars['ID']>>>;
  ontologyTreeId?: Maybe<Scalars['ID']>;
  ontologyTreeIds?: Maybe<Array<Maybe<Scalars['ID']>>>;
  ontologyWordIds?: Maybe<Array<Maybe<Scalars['ID']>>>;
  index?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['String']>;
  last?: Maybe<Scalars['Int']>;
  languages?: Array<UnifiedSearchLanguage>;
  openAt?: Maybe<Scalars['String']>;
  orderByDistance?: Maybe<OrderByDistance>;
  orderByName?: Maybe<OrderByName>;
};


export type QueryUnifiedSearchCompletionSuggestionsArgs = {
  prefix?: Maybe<Scalars['String']>;
  languages?: Array<UnifiedSearchLanguage>;
  index?: Maybe<Scalars['String']>;
  size?: Maybe<Scalars['Int']>;
};


export type QueryAdministrativeDivisionsArgs = {
  helsinkiCommonOnly?: Maybe<Scalars['Boolean']>;
};


export type QueryOntologyTreeArgs = {
  rootId?: Maybe<Scalars['ID']>;
  leavesOnly?: Maybe<Scalars['Boolean']>;
};


export type QueryOntologyWordsArgs = {
  ids?: Maybe<Array<Scalars['ID']>>;
};

export type RawJson = {
  __typename?: 'RawJSON';
  data?: Maybe<Scalars['String']>;
};

export type SearchResultConnection = {
  __typename?: 'SearchResultConnection';
  /**  Elasticsearch raw results  */
  es_results?: Maybe<Array<Maybe<ElasticSearchResult>>>;
  count?: Maybe<Scalars['Int']>;
  max_score?: Maybe<Scalars['Float']>;
  pageInfo?: Maybe<SearchResultPageInfo>;
  edges: Array<SearchResultEdge>;
};

export type SearchResultEdge = {
  __typename?: 'SearchResultEdge';
  cursor: Scalars['String'];
  node: SearchResultNode;
};

export type SearchResultNode = {
  __typename?: 'SearchResultNode';
  _score?: Maybe<Scalars['Float']>;
  id: Scalars['ID'];
  venue?: Maybe<Venue>;
  event?: Maybe<Event>;
  searchCategories: Array<UnifiedSearchResultCategory>;
};

export type SearchResultPageInfo = {
  __typename?: 'SearchResultPageInfo';
  hasNextPage: Scalars['Boolean'];
  hasPreviousPage: Scalars['Boolean'];
  startCursor?: Maybe<Scalars['String']>;
  endCursor?: Maybe<Scalars['String']>;
};

export type SearchSuggestionConnection = {
  __typename?: 'SearchSuggestionConnection';
  suggestions: Array<Maybe<Suggestion>>;
};

export type Shards = {
  __typename?: 'Shards';
  total?: Maybe<Scalars['Int']>;
  successful?: Maybe<Scalars['Int']>;
  skipped?: Maybe<Scalars['Int']>;
  failed?: Maybe<Scalars['Int']>;
};

export type SingleHit = {
  __typename?: 'SingleHit';
  _index?: Maybe<Scalars['String']>;
  _type?: Maybe<Scalars['String']>;
  _score?: Maybe<Scalars['Float']>;
  _id?: Maybe<Scalars['String']>;
  _source?: Maybe<RawJson>;
};

export enum SortOrder {
  Ascending = 'ASCENDING',
  Descending = 'DESCENDING'
}

export type Suggestion = {
  __typename?: 'Suggestion';
  label: Scalars['String'];
};

/** any kind of description answering the question "when". */
export type TimeDescription = {
  __typename?: 'TimeDescription';
  starting?: Maybe<Scalars['DateTime']>;
  ending?: Maybe<Scalars['DateTime']>;
  otherTime?: Maybe<TimeDescription>;
};

export enum UnifiedSearchLanguage {
  Finnish = 'FINNISH',
  Swedish = 'SWEDISH',
  English = 'ENGLISH'
}

export enum UnifiedSearchResultCategory {
  PointOfInterest = 'POINT_OF_INTEREST',
  Event = 'EVENT',
  Reservable = 'RESERVABLE',
  Enrollable = 'ENROLLABLE',
  Artwork = 'ARTWORK',
  Article = 'ARTICLE',
  Service = 'SERVICE'
}

/**
 * A place that forms a unit and can be used for some specific purpose -
 * respa unit or resource, service map unit, beta.kultus venue, linked
 * events place, Kukkuu venue
 */
export type Venue = {
  __typename?: 'Venue';
  meta?: Maybe<NodeMeta>;
  name?: Maybe<LanguageString>;
  location?: Maybe<LocationDescription>;
  description?: Maybe<LanguageString>;
  descriptionResources?: Maybe<DescriptionResources>;
  partOf?: Maybe<Venue>;
  openingHours?: Maybe<OpeningHours>;
  manager?: Maybe<LegalEntity>;
  contactDetails?: Maybe<ContactInfo>;
  reservationPolicy?: Maybe<VenueReservationPolicy>;
  accessibilityProfile?: Maybe<AccessibilityProfile>;
  arrivalInstructions?: Maybe<Scalars['String']>;
  additionalInfo?: Maybe<Scalars['String']>;
  facilities?: Maybe<Array<VenueFacility>>;
  images?: Maybe<Array<Maybe<Image>>>;
  ontologyWords?: Maybe<Array<Maybe<OntologyWord>>>;
};

/** TODO: combine beta.kultus Venue stuff with respa equipment type */
export type VenueFacility = {
  __typename?: 'VenueFacility';
  meta?: Maybe<NodeMeta>;
  name: Scalars['String'];
  categories?: Maybe<Array<Keyword>>;
};

/** TODO: this comes from respa resource/unit types */
export type VenueReservationPolicy = {
  __typename?: 'VenueReservationPolicy';
  todo?: Maybe<Scalars['String']>;
};

export type AdministrativeDivisionsQueryVariables = Exact<{
  helsinkiCommonOnly?: Maybe<Scalars['Boolean']>;
}>;


export type AdministrativeDivisionsQuery = { __typename?: 'Query', administrativeDivisions?: Maybe<Array<Maybe<{ __typename?: 'AdministrativeDivision', id?: Maybe<string>, type?: Maybe<string>, name?: Maybe<{ __typename?: 'LanguageString', fi?: Maybe<string>, sv?: Maybe<string>, en?: Maybe<string> }> }>>> };


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