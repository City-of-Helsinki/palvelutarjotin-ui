/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/ban-ts-comment */

import {
  LanguageCodeEnum,
  ConfigProvider as RHHCConfigProvider,
  defaultConfig as rhhcDefaultConfig,
} from 'react-helsinki-headless-cms';

import {
  fakePage,
  fakeMediaItem,
  fakePost,
} from '../../../utils/cmsMockDataUtils';
import { render, screen } from '../../../utils/testUtils';
import { getRoutedInternalHref } from '../../utils';
import CmsPage from '../CmsPage';

function verifyCmsSidebarContentCard({
  title,
  url,
  image,
  imageAlt,
}: {
  title: string;
  url: string;
  image?: string | null;
  imageAlt?: string | null;
}) {
  // Has title with correct link
  const link = screen.getByRole('link', {
    name: title,
  }) as HTMLAnchorElement;
  expect(link).toBeInTheDocument();
  expect(link.href).toEqual(url);

  if (imageAlt) {
    // Has image if it exists that has correct alt text
    const imageElement = screen.getByRole('img', {
      name: imageAlt,
    }) as HTMLImageElement;
    expect(imageElement).toBeInTheDocument();
    // Next image components gets an encoded src value
    expect(imageElement.src).toEqual(expect.any(String));
  }
}

test('renders with sidebar layout when sidebar has content', async () => {
  const sidebarLayoutLinkList = {
    __typename: 'LayoutLinkList' as const,
    title: 'Tärkeimmät linkit',
    description: 'Tsekkaa nämä linkit ja löydä mahtavaa sisältöä!',
    anchor: 'important-links',
    links: [
      {
        target: '_blank',
        // eslint-disable-next-line max-len
        url: 'https://kultus-ui.test.hel.ninja/cms-page/oppimateriaalit/ylakoulu-ja-toinen-aste/koulujen-elokuvaviikko-elokuvan-kotitehtavat-etaopetukseen',
        title: 'Elokuvaviikon etäkotitehtävät',
      },
      {
        // eslint-disable-next-line max-len
        url: '/cms-page/oppimateriaalit/ylakoulu-ja-toinen-aste/koulujen-elokuvaviikko-elokuvan-kotitehtavat-etaopetukseen',
        title: 'Ideoita elokuvaviikon tunneille',
      },
    ],
  };
  const sidebarLayoutPage = fakePage({
    id: '1',
    title: 'Oppimateriaalit elokuvajuhlia varten',
    uri: '/oppimateriaalit-elokuvajuhlia-varten',
    link: 'https://hkih.stage.geniem.io/oppimateriaalit-elokuvajuhlia-varten',
    featuredImage: {
      node: fakeMediaItem({
        id: '1',
        mediaItemUrl: 'https://hkih.production.geniem.io/i/1245',
        altText: 'Kirjoja eri väreissä',
      }),
    },
  });
  const sidebarLayoutPages = {
    __typename: 'LayoutPages' as const,
    pages: [sidebarLayoutPage],
  };
  const sidebarLayoutArticle = fakePost({
    id: '2',
    title: 'Kevät tulee, tuo luonto osaksi opetusta',
    uri: '/2020/01/01/kevat-tulee-tuo-luonto-osaksi-opetusta',
    link: 'https://hkih.stage.geniem.io/2020/01/01/kevat-tulee-tuo-luonto-osaksi-opetusta',
  });
  const sidebarLayoutArticles = {
    __typename: 'LayoutArticles' as const,
    articles: [sidebarLayoutArticle],
  };

  const internalHrefOrigins = ['https://hkih.stage.geniem.io'];
  const getIsHrefExternal = (href: string) => {
    if (href?.startsWith('/')) return false;
    return !internalHrefOrigins.some((origin) => href?.includes(origin));
  };
  const mockedGetIsHrefExternal = jest.fn(getIsHrefExternal);
  const mockedGetRoutedInternalHref = jest.fn(getRoutedInternalHref);
  const { container } = render(
    <RHHCConfigProvider
      config={{
        ...rhhcDefaultConfig,
        currentLanguageCode: LanguageCodeEnum.Fi,
        copy: {
          ...rhhcDefaultConfig.copy,
          openInNewTabAriaLabel: 'Avautuu uudessa välilehdessä.',
          openInExternalDomainAriaLabel: 'Avautuu uudella sivustolla.',
        },
        customCopy: {
          loadMoreButtonVariant: 'primary',
          loadMoreButtonTheme: 'coat',
        },
        internalHrefOrigins,
        utils: {
          ...rhhcDefaultConfig.utils,
          getIsHrefExternal: mockedGetIsHrefExternal,
          getRoutedInternalHref: mockedGetRoutedInternalHref,
        },
      }}
    >
      <CmsPage
        breadcrumbs={[]}
        page={fakePage({
          title: 'Alisivun otsikko',
          content: 'Alisivun kontentti',
          sidebar: [
            sidebarLayoutLinkList,
            sidebarLayoutPages,
            sidebarLayoutArticles,
          ],
        })}
      />
    </RHHCConfigProvider>
  );

  //-- Renders layout link lists correctly
  // Renders title
  expect(screen.queryByText(sidebarLayoutLinkList.title)).toBeInTheDocument();
  // Renders description
  expect(
    screen.queryByText(sidebarLayoutLinkList.description)
  ).toBeInTheDocument();
  // Sets anchoring id
  // Check that an element with the ID exists. Use uncommon pattern because we
  // are ensuring a technical detail instead of validating the user
  // experience.
  expect(
    container.querySelector(`#${sidebarLayoutLinkList.anchor}`)
  ).toBeInTheDocument();
  // Renders link opening in external window correctly
  expect(
    screen.getByRole('link', {
      name: `${sidebarLayoutLinkList.links[0].title}. Avautuu uudessa välilehdessä. Avautuu uudella sivustolla.`,
    })
  ).toBeInTheDocument();
  // Renders link opening in same window
  expect(
    screen.getByRole('link', {
      name: sidebarLayoutLinkList.links[1].title,
    })
  ).toBeInTheDocument();

  expect(mockedGetRoutedInternalHref).toBeCalled();
  expect(mockedGetRoutedInternalHref).toHaveReturnedWith(
    '/cms-page/oppimateriaalit-elokuvajuhlia-varten'
  );

  //-- Renders layout pages
  verifyCmsSidebarContentCard({
    title: sidebarLayoutPage.title!,
    url: `${window.origin}/cms-page${sidebarLayoutPage.uri}`,
    image: sidebarLayoutPage.featuredImage?.node?.mediaItemUrl,
    imageAlt: sidebarLayoutPage.featuredImage?.node?.altText,
  });

  //-- Renders layout articles
  verifyCmsSidebarContentCard({
    title: sidebarLayoutArticle.title!,
    url: `${window.origin}/cms-article${sidebarLayoutArticle.uri}`,
  });
});
