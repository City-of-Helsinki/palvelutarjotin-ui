import { TRANS } from './translations';
import {
  EnrolmentStatus,
  EnrolOccurrenceMutation,
  EventQuery,
  EventsQuery,
  Language,
  NotificationType,
  OccurrencesOccurrenceSeatTypeChoices,
  SchoolsAndKindergartensListQuery,
  ServiceUnitNode,
  StudyLevelsQuery,
} from '../generated/graphql';

export const MOCK_EVENT_QUERY_RESPONSE: EventQuery = {
  event: {
    id: 'kultus:aglkkgn5ue',
    internalId:
      'https://linkedevents.api.test.hel.ninja/v1/event/kultus:aglkkgn5ue/',
    name: {
      en: '',
      fi: 'Testitapahtuman nimi',
      sv: '',
      __typename: 'LocalisedObject',
    },
    shortDescription: {
      en: '',
      fi: 'Testitapahtuman lyhyt kuvaus',
      sv: '',
      __typename: 'LocalisedObject',
    },
    description: {
      en: '',
      fi: '<p>Testitapahtuman kuvaus</p>\n',
      sv: '',
      __typename: 'LocalisedObject',
    },
    images: [],
    infoUrl: {
      en: '',
      fi: 'https://example.org/testitapahtuma/',
      sv: '',
      __typename: 'LocalisedObject',
    },
    offers: [
      {
        isFree: false,
        description: {
          en: '',
          fi: 'Vain korttimaksu.',
          sv: '',
          __typename: 'LocalisedObject',
        },
        price: {
          en: '10',
          fi: '10',
          sv: '10',
          __typename: 'LocalisedObject',
        },
        infoUrl: null,
        __typename: 'Offer',
      },
    ],
    pEvent: {
      autoAcceptance: false,
      id: 'UGFsdmVsdXRhcmpvdGluRXZlbnROb2RlOjE1MjQ=',
      enrolmentEndDays: 0,
      enrolmentStart: '2025-05-06T10:20:00+00:00',
      externalEnrolmentUrl: null,
      neededOccurrences: 1,
      contactPhoneNumber: '123456789',
      contactEmail: 'admin@example.com',
      isQueueingAllowed: true,
      mandatoryAdditionalInformation: false,
      organisation: {
        id: 'T3JnYW5pc2F0aW9uTm9kZTox',
        name: 'Kulttuurin ja vapaa-ajan toimiala',
        __typename: 'OrganisationNode',
      },
      contactPerson: null,
      occurrences: {
        edges: [
          {
            node: {
              id: 'T2NjdXJyZW5jZU5vZGU6MzE0Ng==',
              pEvent: {
                id: 'UGFsdmVsdXRhcmpvdGluRXZlbnROb2RlOjE1MjQ=',
                __typename: 'PalvelutarjotinEventNode',
              },
              amountOfSeats: 25,
              seatsTaken: 0,
              seatType: OccurrencesOccurrenceSeatTypeChoices.ChildrenCount,
              remainingSeats: 25,
              minGroupSize: 1,
              maxGroupSize: 10,
              languages: {
                edges: [
                  {
                    node: {
                      id: 'sv',
                      name: 'Swedish',
                      __typename: 'LanguageNode',
                    },
                    __typename: 'LanguageNodeEdge',
                  },
                ],
                __typename: 'LanguageNodeConnection',
              },
              cancelled: false,
              startTime: '2225-05-11T09:30:00+00:00',
              endTime: '2225-05-11T10:30:00+00:00',
              placeId: 'tprek:15417',
              __typename: 'OccurrenceNode',
            },
            __typename: 'OccurrenceNodeEdge',
          },
        ],
        __typename: 'OccurrenceNodeConnection',
      },
      nextOccurrence: {
        edges: [
          {
            node: {
              id: 'T2NjdXJyZW5jZU5vZGU6MzE0Ng==',
              startTime: '2225-05-11T09:30:00+00:00',
              endTime: '2225-05-11T10:30:00+00:00',
              __typename: 'OccurrenceNode',
            },
            __typename: 'OccurrenceNodeEdge',
          },
        ],
        __typename: 'OccurrenceNodeConnection',
      },
      nextOccurrenceDatetime: '2225-05-11T09:30:00+00:00',
      lastOccurrenceDatetime: '2225-05-11T09:30:00+00:00',
      __typename: 'PalvelutarjotinEventNode',
    },
    inLanguage: [],
    audience: [
      {
        id: 'kultus:52',
        internalId:
          'https://linkedevents.api.test.hel.ninja/v1/keyword/kultus:52/',
        name: {
          en: '5-6 years',
          fi: '5-6 vuotiaat',
          sv: '5-6 år',
          __typename: 'LocalisedObject',
        },
        __typename: 'Keyword',
      },
    ],
    keywords: [
      {
        id: 'kultus:5',
        internalId:
          'https://linkedevents.api.test.hel.ninja/v1/keyword/kultus:5/',
        name: {
          en: 'Concert',
          fi: 'Konsertti',
          sv: 'Konsert',
          __typename: 'LocalisedObject',
        },
        __typename: 'Keyword',
      },
    ],
    location: {
      id: 'tprek:15417',
      internalId:
        'https://linkedevents.api.test.hel.ninja/v1/place/tprek:15417/',
      name: {
        en: 'Sello Library',
        fi: 'Sellon kirjasto',
        sv: 'Sellobiblioteket',
        __typename: 'LocalisedObject',
      },
      streetAddress: {
        en: 'Leppävaarankatu 9',
        fi: 'Leppävaarankatu 9',
        sv: 'Albergagatan 9',
        __typename: 'LocalisedObject',
      },
      addressLocality: {
        en: 'Espoo',
        fi: 'Espoo',
        sv: 'Esbo',
        __typename: 'LocalisedObject',
      },
      telephone: {
        en: null,
        fi: '+358 9 1234 5678',
        sv: null,
        __typename: 'LocalisedObject',
      },
      __typename: 'Place',
    },
    venue: {
      id: 'tprek:15417',
      hasClothingStorage: true,
      hasSnackEatingPlace: true,
      outdoorActivity: true,
      hasToiletNearby: true,
      hasAreaForGroupWork: false,
      hasIndoorPlayingArea: true,
      hasOutdoorPlayingArea: true,
      translations: [
        {
          languageCode: Language.Fi,
          description: 'Sello FI',
          __typename: 'VenueTranslationType',
        },
        {
          languageCode: Language.Sv,
          description: 'Sello SV',
          __typename: 'VenueTranslationType',
        },
        {
          languageCode: Language.En,
          description: 'Sello EN',
          __typename: 'VenueTranslationType',
        },
      ],
      __typename: 'VenueNode',
    },
    startTime: '2225-05-11T09:30:00Z',
    additionalCriteria: [
      {
        id: 'kultus:5',
        internalId:
          'https://linkedevents.api.test.hel.ninja/v1/keyword/kultus:5/',
        name: {
          en: 'Concert',
          fi: 'Konsertti',
          sv: 'Konsert',
          __typename: 'LocalisedObject',
        },
        __typename: 'Keyword',
      },
    ],
    categories: [
      {
        id: 'kultus:17',
        internalId:
          'https://linkedevents.api.test.hel.ninja/v1/keyword/kultus:17/',
        name: {
          en: 'Music',
          fi: 'Musiikki',
          sv: 'Musik',
          __typename: 'LocalisedObject',
        },
        __typename: 'Keyword',
      },
    ],
    __typename: 'Event',
  },
};

export const MOCK_EVENTS_QUERY_RESPONSE: EventsQuery = {
  events: {
    meta: {
      count: 1,
      next: null,
      previous: null,
      __typename: 'Meta',
    },
    data: [
      {
        id: 'kultus:aglkkgn5ue',
        internalId:
          'https://linkedevents.api.test.hel.ninja/v1/event/kultus:aglkkgn5ue/',
        name: {
          en: '',
          fi: 'Testitapahtuman nimi',
          sv: '',
          __typename: 'LocalisedObject',
        },
        shortDescription: {
          en: '',
          fi: 'Testitapahtuman lyhyt kuvaus',
          sv: '',
          __typename: 'LocalisedObject',
        },
        description: {
          en: '',
          fi: '<p>Testitapahtuman kuvaus</p>\n',
          sv: '',
          __typename: 'LocalisedObject',
        },
        images: [],
        infoUrl: {
          en: '',
          fi: 'https://example.org/testitapahtuma/',
          sv: '',
          __typename: 'LocalisedObject',
        },
        offers: [
          {
            isFree: false,
            description: {
              en: '',
              fi: 'Vain korttimaksu.',
              sv: '',
              __typename: 'LocalisedObject',
            },
            price: {
              en: '10',
              fi: '10',
              sv: '10',
              __typename: 'LocalisedObject',
            },
            infoUrl: null,
            __typename: 'Offer',
          },
        ],
        pEvent: {
          id: 'UGFsdmVsdXRhcmpvdGluRXZlbnROb2RlOjE1MjQ=',
          nextOccurrenceDatetime: '2225-05-11T09:30:00+00:00',
          lastOccurrenceDatetime: '2225-05-11T09:30:00+00:00',
          nextOccurrence: {
            edges: [
              {
                node: {
                  id: 'T2NjdXJyZW5jZU5vZGU6MzE0Ng==',
                  startTime: '2225-05-11T09:30:00+00:00',
                  endTime: '2225-05-11T10:30:00+00:00',
                  __typename: 'OccurrenceNode',
                },
                __typename: 'OccurrenceNodeEdge',
              },
            ],
            __typename: 'OccurrenceNodeConnection',
          },
          organisation: {
            id: 'T3JnYW5pc2F0aW9uTm9kZTox',
            name: 'Kulttuurin ja vapaa-ajan toimiala',
            __typename: 'OrganisationNode',
          },
          enrolmentStart: '2025-05-06T10:20:00+00:00',
          externalEnrolmentUrl: null,
          hasSpaceForEnrolments: true,
          __typename: 'PalvelutarjotinEventNode',
        },
        inLanguage: [],
        audience: [
          {
            id: 'kultus:52',
            internalId:
              'https://linkedevents.api.test.hel.ninja/v1/keyword/kultus:52/',
            name: {
              en: '5-6 years',
              fi: '5-6 vuotiaat',
              sv: '5-6 år',
              __typename: 'LocalisedObject',
            },
            __typename: 'Keyword',
          },
        ],
        keywords: [
          {
            id: 'kultus:5',
            internalId:
              'https://linkedevents.api.test.hel.ninja/v1/keyword/kultus:5/',
            name: {
              en: 'Concert',
              fi: 'Konsertti',
              sv: 'Konsert',
              __typename: 'LocalisedObject',
            },
            __typename: 'Keyword',
          },
        ],
        location: {
          id: 'tprek:15417',
          internalId:
            'https://linkedevents.api.test.hel.ninja/v1/place/tprek:15417/',
          name: {
            en: 'Sello Library',
            fi: 'Sellon kirjasto',
            sv: 'Sellobiblioteket',
            __typename: 'LocalisedObject',
          },
          streetAddress: {
            en: 'Leppävaarankatu 9',
            fi: 'Leppävaarankatu 9',
            sv: 'Albergagatan 9',
            __typename: 'LocalisedObject',
          },
          addressLocality: {
            en: 'Espoo',
            fi: 'Espoo',
            sv: 'Esbo',
            __typename: 'LocalisedObject',
          },
          telephone: {
            en: null,
            fi: '+358 9 1234 5678',
            sv: null,
            __typename: 'LocalisedObject',
          },
          __typename: 'Place',
        },
        startTime: '2225-05-11T09:30:00Z',
        __typename: 'Event',
      },
    ],
    __typename: 'EventListResponse',
  },
};

export const MOCK_ENROL_OCCURRENCE_MUTATION_RESPONSE: EnrolOccurrenceMutation =
  {
    enrolOccurrence: {
      enrolments: [
        {
          id: 'RW5yb2xtZW50Tm9kZTo5ODI=',
          notificationType: NotificationType.Email,
          enrolmentTime: '2025-05-06T10:49:07.076077+00:00',
          status: EnrolmentStatus.Pending,
          person: null,
          studyGroup: {
            id: 'U3R1ZHlHcm91cE5vZGU6OTg4',
            unitId: 'tprek:114',
            unitName: 'Päiväkoti Kamppi',
            unit: {
              internalId:
                'https://linkedevents.api.test.hel.ninja/v1/place/tprek:114/',
              id: 'tprek:114',
              name: {
                en: 'Daycare Kamppi',
                fi: 'Päiväkoti Kamppi',
                sv: 'Päiväkoti Kamppi',
                __typename: 'LocalisedObject',
              },
              __typename: 'Place',
            },
            groupSize: 8,
            amountOfAdult: 2,
            groupName: 'Testiryhmä',
            studyLevels: {
              edges: [
                {
                  node: {
                    id: 'preschool',
                    label: 'preschool',
                    level: 2,
                    translations: [
                      {
                        languageCode: Language.En,
                        label: 'preschool',
                        __typename: 'StudyLevelTranslationType',
                      },
                    ],
                    __typename: 'StudyLevelNode',
                  },
                  __typename: 'StudyLevelNodeEdge',
                },
              ],
              __typename: 'StudyLevelNodeConnection',
            },
            extraNeeds: 'Neurokirjon ryhmä',
            person: null,
            __typename: 'StudyGroupNode',
          },
          __typename: 'EnrolmentNode',
        },
      ],
      __typename: 'EnrolOccurrenceMutationPayload',
    },
  };

export const MOCK_DAYCARE_KAMPPI_SERVICE_UNIT_NODE: ServiceUnitNode = {
  id: 'tprek:114',
  name: {
    fi: TRANS.daycareKamppiStudyGroupUnit['fi'],
    sv: TRANS.daycareKamppiStudyGroupUnit['sv'],
    en: TRANS.daycareKamppiStudyGroupUnit['en'],
    __typename: 'LocalisedObject',
  },
  __typename: 'ServiceUnitNode',
};

export const MOCK_SCHOOLS_AND_KINDERGARTENS_LIST_QUERY_RESPONSE: SchoolsAndKindergartensListQuery =
  {
    schoolsAndKindergartensList: {
      meta: {
        count: 1,
        __typename: 'Meta',
      },
      data: [MOCK_DAYCARE_KAMPPI_SERVICE_UNIT_NODE],
      __typename: 'ServiceUnitNameListResponse',
    },
  };

export const MOCK_STUDY_LEVELS_QUERY_RESPONSE: StudyLevelsQuery = {
  studyLevels: {
    edges: [
      {
        node: {
          id: 'preschool',
          label: 'preschool',
          level: 2,
          translations: [
            {
              languageCode: Language.En,
              label: 'preschool',
              __typename: 'StudyLevelTranslationType',
            },
          ],
          __typename: 'StudyLevelNode',
        },
        __typename: 'StudyLevelNodeEdge',
      },
    ],
    __typename: 'StudyLevelNodeConnection',
  },
};
