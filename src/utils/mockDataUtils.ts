/* eslint-disable @typescript-eslint/no-explicit-any */
import { faker } from '@faker-js/faker';
import { add as addTime } from 'date-fns';

import {
  EnrolmentNode,
  EnrolmentNodeConnection,
  EnrolmentNodeEdge,
  EnrolmentStatus,
  Event,
  EventListResponse,
  Image,
  InLanguage,
  Keyword,
  Language,
  LanguageNode,
  LanguageNodeConnection,
  LanguageNodeEdge,
  LocalisedObject,
  NotificationType,
  OccurrenceNode,
  OccurrenceNodeConnection,
  OccurrenceNodeEdge,
  Offer,
  OrganisationNode,
  OrganisationNodeConnection,
  OrganisationNodeEdge,
  OrganisationsOrganisationTypeChoices,
  PageInfo,
  PalvelutarjotinEventNode,
  PersonNode,
  PersonNodeConnection,
  PersonNodeEdge,
  Place,
  PlaceListResponse,
  StudyGroupNode,
  StudyLevelNodeConnection,
  StudyLevelNodeEdge,
  StudyLevelNode,
  VenueNode,
  OccurrencesOccurrenceSeatTypeChoices,
  OrganisationProposalNode,
  OrganisationProposalNodeConnection,
  OrganisationProposalNodeEdge,
  KeywordListResponse,
  EventListPaginatedTypeResponse,
} from '../generated/graphql';

type ExtendedPalvelutarjotinEventNode = PalvelutarjotinEventNode & {
  nextOccurrence?: OccurrenceNodeConnection | null;
};

const organisationNames = [
  'Kulttuuri- ja vapaa-aikalautakunnan kulttuurijaosto',
  'Kulttuurin ja vapaa-ajan toimiala',
];

const PageInfoMock: PageInfo = {
  hasNextPage: false,
  hasPreviousPage: false,
  __typename: 'PageInfo',
  startCursor: '',
  endCursor: '',
};

export const fakeUpcomingEvents = (
  count = 1,
  events?: Partial<Event>[]
): EventListPaginatedTypeResponse => ({
  data: generateNodeArray((i) => fakeEvent(events?.[i]), count),
  pageInfo: {
    totalCount: count,
    hasNextPage: true,
    page: 0,
  },
  __typename: 'EventListPaginatedTypeResponse',
});

export const fakeEvents = (
  count = 1,
  events?: Partial<Event>[]
): EventListResponse => ({
  data: generateNodeArray((i) => fakeEvent(events?.[i]), count),
  meta: {
    __typename: 'Meta',
    count: count,
    next: '',
    previous: '',
  },
  __typename: 'EventListResponse',
});

export const fakeOffer = (overrides?: Partial<Offer>): Offer => ({
  isFree: true,
  description: {
    en: null,
    fi: 'description',
    sv: null,
    __typename: 'LocalisedObject',
  },
  price: {
    en: null,
    fi: '99,9',
    sv: null,
    __typename: 'LocalisedObject',
  },
  infoUrl: null,
  __typename: 'Offer',
  ...overrides,
});

export const fakeEvent = (overrides?: Partial<Event>): Event => {
  return {
    id: `palvelutarjotin:${faker.string.uuid()}`,
    internalId: faker.string.uuid(),
    name: fakeLocalizedObject(faker.commerce.productName()),
    shortDescription: fakeLocalizedObject(),
    description: fakeLocalizedObject(),
    images: [fakeImage()],
    infoUrl: fakeLocalizedObject(),
    inLanguage: [fakeInLanguage()],
    audience: [],
    keywords: [fakeKeyword()],
    location: fakePlace(),
    venue: fakeVenue(),
    pEvent: fakePEvent(),
    startTime: '2020-07-13T05:51:05.761000Z',
    publicationStatus: 'draft',
    datePublished: null,
    externalLinks: [] as any,
    offers: [] as any,
    subEvents: [] as any,
    endTime: '2020-07-13T05:51:05.761000Z',
    additionalCriteria: [],
    categories: [],
    activities: [],
    __typename: 'Event',
    ...overrides,
  };
};

export const fakeEnrolments = (
  count = 1,
  enrolments?: Partial<EnrolmentNode>[]
): EnrolmentNodeConnection => ({
  edges: generateNodeArray(
    (i) => fakeEnrolmentNodeEdge(enrolments?.[i]),
    count
  ),
  pageInfo: PageInfoMock,
  __typename: 'EnrolmentNodeConnection',
  count,
});

export const fakeEnrolment = (
  overrides?: Partial<EnrolmentNode>
): EnrolmentNode => ({
  enrolmentTime: '2020-08-18T06:37:40.755109+00:00',
  updatedAt: '2020-08-18T06:37:40.755109+00:00',
  id: faker.string.uuid(),
  occurrence: fakeOccurrence(),
  studyGroup: fakeStudyGroup(),
  notificationType: NotificationType.EmailSms,
  __typename: 'EnrolmentNode',
  person: fakePerson(),
  status: EnrolmentStatus.Approved,
  ...overrides,
});

export const fakeStudyGroup = (
  overrides?: Partial<StudyGroupNode>
): StudyGroupNode => ({
  amountOfAdult: 1,
  createdAt: '',
  enrolments: [] as any,
  queuedEnrolments: [] as any,
  extraNeeds: '',
  preferredTimes: '',
  groupName: '',
  groupSize: 20,
  id: faker.string.uuid(),
  unitId: '',
  unitName: '',
  occurrences: fakeOccurrences(),
  person: fakePerson(),
  updatedAt: '',
  __typename: 'StudyGroupNode',
  studyLevels: fakeStudyLevels(),
  ...overrides,
});

export const fakeInLanguage = (
  overrides?: Partial<InLanguage>
): InLanguage => ({
  id: 'fi',
  internalId: 'https://api.hel.fi/linkedevents-test/v1/language/fi/',
  name: {
    en: null,
    fi: 'suomi',
    sv: null,
    __typename: 'LocalisedObject',
  },
  __typename: 'InLanguage',
  ...overrides,
});

export const fakePlace = (overrides?: Partial<Place>): Place => ({
  id: faker.string.uuid(),
  internalId: 'https://api.hel.fi/linkedevents-test/v1/place/tprek:15376/',
  name: fakeLocalizedObject(),
  streetAddress: fakeLocalizedObject(),
  addressLocality: fakeLocalizedObject(),
  telephone: fakeLocalizedObject(),
  __typename: 'Place',
  ...overrides,
});

export const fakePlaces = (
  count = 1,
  places?: Partial<Place>[]
): PlaceListResponse => ({
  meta: {
    __typename: 'Meta',
    count: count,
    next: '',
    previous: '',
  },
  data: generateNodeArray((i) => fakePlace(places?.[i]), count),
  __typename: 'PlaceListResponse',
});

export const fakeKeywords = (
  count = 1,
  keywords?: Partial<Keyword>[]
): KeywordListResponse => ({
  meta: {
    __typename: 'Meta',
    count: count,
    next: '',
    previous: '',
  },
  data: generateNodeArray((i) => fakeKeyword(keywords?.[i]), count),
  __typename: 'KeywordListResponse',
});

export const fakeKeyword = (overrides?: Partial<Keyword>): Keyword => ({
  id: faker.string.uuid(),
  name: fakeLocalizedObject(),
  internalId: 'https://api.hel.fi/linkedevents-test/v1/keyword/yso:p4363/',
  __typename: 'Keyword',
  ...overrides,
});

export const fakeVenue = (overrides?: Partial<VenueNode>): VenueNode => ({
  id: faker.string.uuid(),
  hasClothingStorage: faker.datatype.boolean(),
  hasSnackEatingPlace: faker.datatype.boolean(),
  outdoorActivity: faker.datatype.boolean(),
  hasToiletNearby: faker.datatype.boolean(),
  hasAreaForGroupWork: faker.datatype.boolean(),
  hasIndoorPlayingArea: faker.datatype.boolean(),
  hasOutdoorPlayingArea: faker.datatype.boolean(),
  translations: [
    {
      languageCode: 'FI' as Language,
      description: 'TestiVenue',
      __typename: 'VenueTranslationType',
    },
  ],
  __typename: 'VenueNode',
  ...overrides,
});

export const fakeImage = (overrides?: Partial<Image>): Image => ({
  id: faker.string.uuid(),
  internalId: 'https://api.hel.fi/linkedevents-test/v1/image/48566/',
  license: 'cc_by',
  name: faker.word.words(),
  url: 'https://api.hel.fi/linkedevents-test/media/images/test.png',
  cropping: '59,0,503,444',
  photographerName: faker.person.firstName(),
  altText: faker.word.words(),
  __typename: 'Image',
  ...overrides,
});

export const fakePEvent = (
  overrides?: Partial<ExtendedPalvelutarjotinEventNode>
): ExtendedPalvelutarjotinEventNode => ({
  id: faker.string.uuid(),
  contactPerson: fakePerson(),
  contactEmail: 'test@email.com',
  contactPhoneNumber: '1233211234',
  enrolmentEndDays: 3,
  enrolmentStart: '2020-07-13T06:00:00+00:00',
  externalEnrolmentUrl: null,
  neededOccurrences: 3,
  isQueueingAllowed: true,
  organisation: fakeOrganisation(),
  occurrences: fakeOccurrences(),
  queuedEnrolments: [] as any,
  createdAt: '' as any,
  linkedEventId: '' as any,
  updatedAt: '' as any,
  autoAcceptance: true,
  nextOccurrenceDatetime: '',
  lastOccurrenceDatetime: '',
  mandatoryAdditionalInformation: false,
  nextOccurrence: fakeOccurrences(1, [fakeOccurrence()]),
  hasSpaceForEnrolments: null,
  __typename: 'PalvelutarjotinEventNode',
  ...overrides,
});

export const fakeOccurrences = (
  count = 1,
  occurrences?: Partial<OccurrenceNode>[]
): OccurrenceNodeConnection => ({
  edges: generateNodeArray(
    (i) => fakeOccurrenceNodeEdge(occurrences?.[i]),
    count
  ),
  pageInfo: PageInfoMock,
  __typename: 'OccurrenceNodeConnection',
});

export const fakeEnrolmentNodeEdge = (
  overrides?: Partial<EnrolmentNode>
): EnrolmentNodeEdge => ({
  cursor: '',
  node: fakeEnrolment(overrides),
  __typename: 'EnrolmentNodeEdge',
});

export const fakeOccurrenceNodeEdge = (
  overrides?: Partial<OccurrenceNode>
): OccurrenceNodeEdge => ({
  cursor: '',
  node: fakeOccurrence(overrides),
  __typename: 'OccurrenceNodeEdge',
});
export const fakeLanguages = (
  languages: Partial<LanguageNode>[]
): LanguageNodeConnection => ({
  edges: languages.map((language) => fakeLanguageNodeEdge(language)),
  pageInfo: PageInfoMock,
  __typename: 'LanguageNodeConnection',
});

export const fakeLanguageNodeEdge = (
  overrides?: Partial<LanguageNode>
): LanguageNodeEdge => ({
  cursor: '',
  node: fakeLanguage(overrides),
  __typename: 'LanguageNodeEdge',
});

export const fakeLanguage = (
  overrides?: Partial<LanguageNode>
): LanguageNode => ({
  id: 'fi',
  name: 'Finnish',
  __typename: 'LanguageNode',
  ...overrides,
});

export const fakeOccurrence = (
  overrides?: Partial<OccurrenceNode>
): OccurrenceNode => ({
  id: faker.string.uuid(),
  pEvent: {
    id: 'UGFsdmVsdXRhcmpvdGluRXZlbnROb2RlOjcw',
    __typename: 'PalvelutarjotinEventNode',
  } as PalvelutarjotinEventNode,
  amountOfSeats: 30,
  minGroupSize: 10,
  maxGroupSize: 20,
  languages: fakeLanguages([
    { id: 'en', name: 'English' },
    { id: 'fi', name: 'Finnish' },
  ]),
  startTime: '2020-08-03T09:00:00+00:00',
  endTime: overrides?.startTime
    ? addTime(new Date(overrides?.startTime), { hours: 1 })
    : '2020-08-03T09:30:00+00:00',
  placeId: '',
  seatType: OccurrencesOccurrenceSeatTypeChoices.ChildrenCount,
  seatsTaken: 0,
  seatsApproved: 0,
  contactPersons: [] as any,
  createdAt: '' as any,
  enrolments: [] as any,
  studyGroups: [] as any,
  updatedAt: '' as any,
  remainingSeats: 30,
  cancelled: false,
  linkedEvent: {
    __typename: 'Event',
    offers: [fakeOffer()],
  } as any,
  __typename: 'OccurrenceNode',
  ...overrides,
});

export const fakeOrganisations = (
  count = 1,
  organisations?: Partial<OrganisationNode>[]
): OrganisationNodeConnection => ({
  edges: generateNodeArray(
    (i) => fakeOrganisationNodeEdge(organisations?.[i]),
    count
  ),
  pageInfo: PageInfoMock,
  __typename: 'OrganisationNodeConnection',
});

export const fakeOrganisationNodeEdge = (
  overrides?: Partial<OrganisationNode>
): OrganisationNodeEdge => ({
  cursor: '',
  __typename: 'OrganisationNodeEdge',
  node: fakeOrganisation(overrides),
});

export const fakeOrganisation = (
  overrides: Partial<OrganisationNode> = {}
): OrganisationNode => ({
  id: faker.string.uuid(),
  name: faker.helpers.arrayElement(organisationNames) as string,
  // avoid infinite recursion
  persons: overrides.persons || fakePersons(5),
  phoneNumber: faker.phone.number(),
  publisherId: faker.string.uuid(),
  type: OrganisationsOrganisationTypeChoices.User,
  __typename: 'OrganisationNode',
  ...overrides,
});

export const fakePersons = (
  count = 1,
  persons?: Partial<PersonNode>[]
): PersonNodeConnection => ({
  edges: generateNodeArray((i) => fakePersonNodeEdge(persons?.[i]), count),
  pageInfo: PageInfoMock,
  __typename: 'PersonNodeConnection',
});

export const fakePersonNodeEdge = (
  overrides?: Partial<PersonNode>
): PersonNodeEdge => ({
  cursor: '',
  __typename: 'PersonNodeEdge',
  node: fakePerson(overrides),
});

export const fakePerson = (overrides?: Partial<PersonNode>): PersonNode => ({
  __typename: 'PersonNode',
  id: faker.string.uuid(),
  emailAddress: faker.internet.email(),
  language: 'FI' as Language,
  name: faker.person.firstName(),
  phoneNumber: faker.phone.number(),
  createdAt: '' as any,
  enrolmentSet: '' as any,
  occurrences: [] as any,
  organisations: [] as any,
  studygroupSet: '' as any,
  eventqueueenrolmentSet: [] as any,
  updatedAt: '' as any,
  isStaff: true,
  organisationproposalSet: fakeOrganisationProposals(0),
  placeIds: [],
  ...overrides,
});

export const fakeOrganisationProposals = (
  count = 0,
  organisationProposals?: Partial<OrganisationProposalNode>[]
): OrganisationProposalNodeConnection => ({
  edges: generateNodeArray(
    (i) => fakeOrganisationProposalEdge(organisationProposals?.[i]),
    count
  ),
  pageInfo: PageInfoMock,
  __typename: 'OrganisationProposalNodeConnection',
});

export const fakeOrganisationProposal = (
  overrides?: Partial<OrganisationProposalNode>
): OrganisationProposalNode => ({
  __typename: 'OrganisationProposalNode',
  id: faker.string.uuid(),
  name: '3rd party org',
  description: 'Organisation description',
  phoneNumber: '',
  applicant: fakePerson(),
  ...overrides,
});

export const fakeOrganisationProposalEdge = (
  overrides?: Partial<OrganisationProposalNode>
): OrganisationProposalNodeEdge => ({
  cursor: '',
  __typename: 'OrganisationProposalNodeEdge',
  node: fakeOrganisationProposal(overrides),
});

export const fakeLocalizedObject = (
  text?: string,
  localizedObject: { fi?: string; en?: string; sv?: string } = {}
): LocalisedObject => ({
  __typename: 'LocalisedObject',
  en: localizedObject.en ?? null,
  sv: localizedObject.sv ?? null,
  fi: localizedObject.fi || text || faker.word.sample(),
});

const generateNodeArray = <T extends (...args: any) => any>(
  fakeFunc: T,
  length: number
): ReturnType<T>[] => {
  return Array.from({ length }).map((_, i) => fakeFunc(i));
};

export enum StudyLevel {
  Preschool = 'PRESCHOOL',
  Grade_1 = 'GRADE_1',
  Grade_2 = 'GRADE_2',
  Grade_3 = 'GRADE_3',
  Grade_4 = 'GRADE_4',
  Grade_5 = 'GRADE_5',
  Grade_6 = 'GRADE_6',
  Grade_7 = 'GRADE_7',
  Grade_8 = 'GRADE_8',
  Grade_9 = 'GRADE_9',
  Grade_10 = 'GRADE_10',
  Secondary = 'SECONDARY',
}

export const fakeStudyLevels = (): StudyLevelNodeConnection => ({
  edges: Object.values(StudyLevel).map((label: StudyLevel, level: number) => ({
    node: fakeStudyLevel({ id: label, label, level }),
    cursor: '',
    __typename: 'StudyLevelNodeEdge',
  })),
  pageInfo: PageInfoMock,
  __typename: 'StudyLevelNodeConnection',
});

export const fakeStudyLevel = (
  overrides?: Partial<StudyLevelNode>
): StudyLevelNode => ({
  __typename: 'StudyLevelNode',
  id: faker.word.sample(),
  label: faker.word.words(),
  level: faker.number.int(),
  translations: [
    {
      languageCode: 'FI' as Language,
      label: faker.word.sample(),
      __typename: 'StudyLevelTranslationType',
    },
  ],
  ...overrides,
});

export const fakeStudyLevelNodeEdge = (
  overrides?: Partial<StudyLevelNode>
): StudyLevelNodeEdge => ({
  cursor: '',
  node: fakeStudyLevel(overrides),
  __typename: 'StudyLevelNodeEdge',
});
