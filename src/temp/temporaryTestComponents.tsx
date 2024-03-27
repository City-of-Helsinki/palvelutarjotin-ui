import { Header, HeaderCustomTheme, Tabs, TabsCustomTheme } from 'hds-react';

const isClient = typeof window !== 'undefined';

const theme: HeaderCustomTheme = {
  '--color-focus-outline': 'var(--color-metro-dark)',
  '--header-color': 'var(--color-black)',
  '--header-max-width': '1220px',
  // '--header-focus-outline-color': 'var(--color-metro-dark)',
  '--actionbar-background-color': 'var(--color-engel)',
  '--nav-background-color': 'var(--color-engel-light)',
  // '--nav-mobile-menu-background-color': 'var(--color-engel-light)',
  '--nav-border-color': 'var(--color-black)',
  '--nav-link-hover-color': 'var(--color-black)',
  '--universal-bar-background-color': 'var(--color-black-20)',
  '--nav-link-dropdown-background-color': 'var(--color-engel-light)',
  '--nav-button-background-color': 'var(--color-black-20)',
  '--nav-button-hover-background-color': 'var(--color-black-40)',
  '--nav-drop-down-icon-color': 'var(--color-black)',
  '--header-background-color': 'var(--color-engel-light)',
  '--logo-height': '50px',
};

const theme2: TabsCustomTheme = {
  '--tab-color': 'var(--color-black-90)',
  '--tab-active-border-color': 'var(--color-metro)',
};

export const HeaderWrapper = () => {
  console.log('rendered HeaderWrapper', { isClient });
  return (
    <Header theme={theme}>
      <Header.UniversalBar primaryLinkText={'123'} primaryLinkHref="#">
        <Header.Link href="#uutiset" label={'123'} />
        <Header.Link href="#uutiset" label={'123'} />
        <Header.Link href="#uutiset" label={'123'} />
        <Header.Link href="#uutiset" label={'123'} />
      </Header.UniversalBar>
    </Header>
  );
};

export const TabsWrapper = () => {
  console.log('rendered TabsWrapper', { isClient });
  return (
    <Tabs theme={theme2}>
      <Tabs.TabList className="example-tablist">
        <Tabs.Tab>Daycare</Tabs.Tab>
        <Tabs.Tab>Pre-school</Tabs.Tab>
        <Tabs.Tab>Basic education</Tabs.Tab>
        <Tabs.Tab>Upper secondary</Tabs.Tab>
        <Tabs.Tab>University</Tabs.Tab>
      </Tabs.TabList>

      <Tabs.TabPanel>
        A pre-school is an educational establishment offering early childhood
        education to children before they begin compulsory education at primary
        school.
      </Tabs.TabPanel>
    </Tabs>
  );
};
