import {
  AdministrativeDivision,
  LanguageString,
} from '../generated/graphql-unified-search';

export const fakeLanguageString = (text: string): LanguageString => {
  return {
    fi: text,
    en: text,
    sv: text,
    __typename: 'LanguageString',
  };
};

export const fakeDivisions = (
  divisionNames: string[]
): AdministrativeDivision[] => {
  return divisionNames.map(
    (name): AdministrativeDivision => ({
      id: `ocd-division/country:fi/kunta:helsinki/kaupunginosa:${name.toLowerCase()}`,
      name: fakeLanguageString(name),
      municipality: '',
      type: '',
      __typename: 'AdministrativeDivision',
    })
  );
};
