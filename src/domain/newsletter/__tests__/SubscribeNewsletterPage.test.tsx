import { rest } from 'msw';
import * as React from 'react';

import { server } from '../../../tests/msw/server';
import { render, userEvent, screen, waitFor } from '../../../utils/testUtils';
import { NewsletterGroupId } from '../newsletterSubscribeForm/constants';
import SubscribeNewsletterPage from '../SubscribeNewsletterPage';

const firstName = 'Test';
const lastName = 'Guy';
const email = 'test.guy@example.com';
const defaultFillValues = {
  firstName,
  lastName,
  email,
};

const serverSuccessfulAddSubscriptionHandlers = Object.values(NewsletterGroupId)
  .map((groupId) => [
    rest.post(`/api/newsletter/subscribe/${groupId}`, (req, res, ctx) => {
      return res(ctx.json({ email }));
    }),
    rest.delete(`/api/newsletter/subscribe/${groupId}`, (req, res, ctx) => {
      return res(ctx.json({ email }));
    }),
  ])
  .flat();

describe('SubscribeNewsletterPage', () => {
  beforeEach(() => {
    server.use(...serverSuccessfulAddSubscriptionHandlers);
  });

  const fillupForm = (values = defaultFillValues) => {
    userEvent.type(
      screen.getByRole('textbox', {
        name: /etunimi \*/i,
      }),
      firstName
    );

    userEvent.type(
      screen.getByRole('textbox', {
        name: /sukunimi \*/i,
      }),
      lastName
    );

    userEvent.type(
      screen.getByRole('textbox', {
        name: /sähköposti \*/i,
      }),
      email
    );
  };

  it('renders correctly', async () => {
    const { container } = render(<SubscribeNewsletterPage />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('handles successful submits properly', async () => {
    render(<SubscribeNewsletterPage />);
    fillupForm();
    expect(
      screen.queryByRole('heading', {
        name: /kiitos tilauksesta!/i,
      })
    ).not.toBeInTheDocument();

    userEvent.click(
      screen.getByRole('button', {
        name: /tilaa uutiskirje/i,
      })
    );

    await waitFor(() => {
      expect(
        screen.getByRole('heading', {
          name: /kiitos tilauksesta!/i,
        })
      ).toBeInTheDocument();
    });
  });

  it('handles errenous submits properly', async () => {
    const serverUnsuccessfulAddSubscriptionHandlers = Object.values(
      NewsletterGroupId
    ).map((groupId) =>
      rest.post(`/api/newsletter/subscribe/${groupId}`, (req, res, ctx) => {
        return res.networkError('error');
      })
    );
    server.use(...serverUnsuccessfulAddSubscriptionHandlers);

    render(<SubscribeNewsletterPage />);
    fillupForm({ ...defaultFillValues, email: 'not-an-email' });

    userEvent.click(
      screen.getByRole('button', {
        name: /tilaa uutiskirje/i,
      })
    );

    await waitFor(() => {
      expect(
        screen.getByRole('heading', {
          name: /valitettavasti tilauksen lähettäminen epäonnistui! yritäthän myöhemmin uudelleen\./i,
        })
      ).toBeInTheDocument();
    });
  });

  it('handles successful account deletions properly', async () => {
    render(<SubscribeNewsletterPage />);

    userEvent.type(
      screen.getByRole('textbox', {
        name: /sähköposti \*/i,
      }),
      email
    );

    expect(
      screen.queryByRole('heading', {
        name: /uutiskirjeen tilaus on peruutettu ja tili poistettu!/i,
      })
    ).not.toBeInTheDocument();

    userEvent.click(
      screen.getByRole('button', {
        name: /peruuta tilaus ja poista tili/i,
      })
    );

    await waitFor(() => {
      expect(
        screen.getByRole('heading', {
          name: /uutiskirjeen tilaus on peruutettu ja tili poistettu!/i,
        })
      ).toBeInTheDocument();
    });
  });

  it('handles errenous deletions properly', async () => {
    const serverUnsuccessfulAddSubscriptionHandlers = Object.values(
      NewsletterGroupId
    ).map((groupId) =>
      rest.delete(`/api/newsletter/subscribe/${groupId}`, (req, res, ctx) => {
        return res.networkError('error');
      })
    );
    server.use(...serverUnsuccessfulAddSubscriptionHandlers);

    render(<SubscribeNewsletterPage />);
    fillupForm({ ...defaultFillValues, email: 'not-an-email' });

    userEvent.click(
      screen.getByRole('button', {
        name: /peruuta tilaus ja poista tili/i,
      })
    );

    await waitFor(() => {
      expect(
        screen.getByRole('heading', {
          name: /valitettavasti tilauksen peruuttaminen epäonnistui! yritäthän myöhemmin uudelleen\./i,
        })
      ).toBeInTheDocument();
    });
  });
});
