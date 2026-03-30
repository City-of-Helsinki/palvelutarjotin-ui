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
  ID: { input: string; output: string; }
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

/** Elasticsearch results */
export type ElasticSearchResult = {
  __typename?: 'ElasticSearchResult';
  _shards?: Maybe<Shards>;
  hits?: Maybe<Hits>;
  timed_out?: Maybe<Scalars['Boolean']['output']>;
  took?: Maybe<Scalars['Int']['output']>;
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

export type LanguageString = {
  __typename?: 'LanguageString';
  en?: Maybe<Scalars['String']['output']>;
  fi?: Maybe<Scalars['String']['output']>;
  sv?: Maybe<Scalars['String']['output']>;
};

/** Free-form location, not necessarily at a known venue. */
export type LocationDescription = {
  __typename?: 'LocationDescription';
  address?: Maybe<Address>;
  administrativeDivisions?: Maybe<Array<Maybe<AdministrativeDivision>>>;
  explanation?: Maybe<Scalars['String']['output']>;
  geoLocation?: Maybe<GeoJsonFeature>;
  url?: Maybe<LanguageString>;
};

export type LocationImage = {
  __typename?: 'LocationImage';
  caption?: Maybe<LanguageString>;
  url?: Maybe<Scalars['String']['output']>;
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
  /**
   * Get Helsinki/Finland administrative divisions i.e.
   * neighborhoods (=kaupunginosat), sub-districts (=osa-alueet),
   * municipalities (=kunnat) etc.
   *
   * Based on imported data from [django-munigeo](https://github.com/City-of-Helsinki/django-munigeo):
   * - "geo_import finland --municipalities"
   * - "geo_import helsinki --divisions"
   *
   * Used django-munigeo importers:
   * - [geo_import](https://github.com/City-of-Helsinki/django-munigeo/blob/release-0.3.12/munigeo/management/commands/geo_import.py)
   *   - [finland](https://github.com/City-of-Helsinki/django-munigeo/blob/release-0.3.12/munigeo/importer/finland.py)
   *   - [helsinki](https://github.com/City-of-Helsinki/django-munigeo/blob/release-0.3.12/munigeo/importer/helsinki.py)
   */
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
  showCultureAndLeisureDivisionFirst?: InputMaybe<Scalars['Boolean']['input']>;
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
  id: Scalars['ID']['output'];
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
  LongTermPatients = 'LONG_TERM_PATIENTS',
  Youth = 'YOUTH'
}

export enum UnifiedSearchIndex {
  AdministrativeDivision = 'administrative_division',
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
  description?: Maybe<LanguageString>;
  eventCount?: Maybe<Scalars['Int']['output']>;
  images?: Maybe<Array<Maybe<LocationImage>>>;
  isCultureAndLeisureDivisionVenue?: Maybe<Scalars['Boolean']['output']>;
  location?: Maybe<LocationDescription>;
  meta?: Maybe<NodeMeta>;
  name?: Maybe<LanguageString>;
  ontologyWords?: Maybe<Array<Maybe<OntologyWord>>>;
  openingHours?: Maybe<OpeningHours>;
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
// @ts-ignore
export function useAdministrativeDivisionsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<AdministrativeDivisionsQuery, AdministrativeDivisionsQueryVariables>): Apollo.UseSuspenseQueryResult<AdministrativeDivisionsQuery, AdministrativeDivisionsQueryVariables>;
export function useAdministrativeDivisionsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<AdministrativeDivisionsQuery, AdministrativeDivisionsQueryVariables>): Apollo.UseSuspenseQueryResult<AdministrativeDivisionsQuery | undefined, AdministrativeDivisionsQueryVariables>;
export function useAdministrativeDivisionsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<AdministrativeDivisionsQuery, AdministrativeDivisionsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<AdministrativeDivisionsQuery, AdministrativeDivisionsQueryVariables>(AdministrativeDivisionsDocument, options);
        }
export type AdministrativeDivisionsQueryHookResult = ReturnType<typeof useAdministrativeDivisionsQuery>;
export type AdministrativeDivisionsLazyQueryHookResult = ReturnType<typeof useAdministrativeDivisionsLazyQuery>;
export type AdministrativeDivisionsSuspenseQueryHookResult = ReturnType<typeof useAdministrativeDivisionsSuspenseQuery>;
export type AdministrativeDivisionsQueryResult = Apollo.QueryResult<AdministrativeDivisionsQuery, AdministrativeDivisionsQueryVariables>;