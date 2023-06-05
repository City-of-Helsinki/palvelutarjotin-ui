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

const serverSuccessfulAddSubscriptionHandlers = Object.values(
  NewsletterGroupId
).map((groupId) =>
  rest.post(`/api/newsletter/subscribe/${groupId}`, (req, res, ctx) => {
    return res(ctx.json({ email }));
  })
);

describe('SubscribeNewsletterPage', () => {
  beforeEach(() => {
    server.use(...serverSuccessfulAddSubscriptionHandlers);
  });

  const fillupForm = async (values = defaultFillValues) => {
    await userEvent.type(
      screen.getByRole('textbox', {
        name: /etunimi \*/i,
      }),
      firstName
    );

    await userEvent.type(
      screen.getByRole('textbox', {
        name: /sukunimi \*/i,
      }),
      lastName
    );

    await userEvent.type(
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
    await fillupForm();
    expect(
      screen.queryByRole('heading', {
        name: /tilaus lähetetty/i,
      })
    ).not.toBeInTheDocument();

    await userEvent.click(
      screen.getByRole('button', {
        name: /tilaa uutiskirje/i,
      })
    );

    await waitFor(
      () => {
        expect(screen.getByText(/tilaus lähetetty/i)).toBeInTheDocument();
      },
      { timeout: 10000 }
    );
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

    await fillupForm({ ...defaultFillValues, email: 'not-an-email' });

    expect(
      screen.queryByRole('heading', {
        name: /tilaus lähetetty/i,
      })
    ).not.toBeInTheDocument();

    await userEvent.click(
      screen.getByRole('button', {
        name: /tilaa uutiskirje/i,
      })
    );

    await waitFor(() => {
      expect(
        screen.getByText(
          /valitettavasti tilauksen lähettäminen epäonnistui! yritäthän myöhemmin uudelleen\./i
        )
      ).toBeInTheDocument();
    });
  });
});
