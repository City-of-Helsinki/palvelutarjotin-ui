import { TextEncoder, TextDecoder } from 'util';

import { fakePage } from '../../../utils/cmsMockDataUtils';
import { render, screen } from '../../../utils/testUtils';
import CmsPage from '../CmsPage';

// To avoid error: ReferenceError: TextEncoder is not defined
// discussed here: https://github.com/jsdom/jsdom/issues/2524
global.TextEncoder = TextEncoder;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
global.TextDecoder = TextDecoder as any;

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
        url: 'https://palvelutarjotin.test.kuva.hel.ninja/cms-page/oppimateriaalit/ylakoulu-ja-toinen-aste/koulujen-elokuvaviikko-elokuvan-kotitehtavat-etaopetukseen',
        title: 'Elokuvaviikon etäkotitehtävät',
      },
      {
        // eslint-disable-next-line max-len
        url: 'https://palvelutarjotin.test.kuva.hel.ninja/cms-page/oppimateriaalit/ylakoulu-ja-toinen-aste/koulujen-elokuvaviikko-elokuvan-kotitehtavat-etaopetukseen',
        title: 'Ideoita elokuvaviikon tunneille',
      },
    ],
  };

  const { container } = render(
    <CmsPage
      navigation={[]}
      breadcrumbs={[]}
      page={fakePage({
        title: 'Alisivun otsikko',
        content: 'Alisivun kontentti',
        sidebar: [sidebarLayoutLinkList],
      })}
    />
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
      name: `${sidebarLayoutLinkList.links[0].title} Avautuu uudessa välilehdessä`,
    })
  ).toBeInTheDocument();
  // Renders link opening in same window
  expect(
    screen.getByRole('link', {
      name: sidebarLayoutLinkList.links[1].title,
    })
  ).toBeInTheDocument();
});
