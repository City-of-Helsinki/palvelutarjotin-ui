import * as React from 'react';

import {
  render,
  screen,
  userEvent,
  waitFor,
  configure,
} from '../../../../utils/testUtils';
import { NewsletterGroupId, NewsletterSubscribeFormFields } from '../constants';
import NewsLetterSubscribeForm, {
  defaultInitialValues,
} from '../NewsletterSubscribeForm';
configure({ defaultHidden: true });

const firstName = 'Test';
const lastName = 'Guy';
const email = 'test.guy@example.com';
const defaultFillValues = {
  firstName,
  lastName,
  email,
};
const emptyValues: NewsletterSubscribeFormFields = {
  groups: [],
  firstName: '',
  lastName: '',
  email: '',
};

const getData = (
  groups: NewsletterGroupId[] = Object.values(NewsletterGroupId)
): NewsletterSubscribeFormFields => ({
  groups,
  email,
  firstName,
  lastName,
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

describe('NewsLetterSubscribeForm', () => {
  it('renders correctly', async () => {
    const onSubmit = jest.fn();

    render(
      <NewsLetterSubscribeForm
        onSubmit={onSubmit}
        initialValues={emptyValues}
      />
    );

    userEvent.click(
      screen.getByRole('button', { name: /tilaan uutiskirjeen \*/i })
    );
    userEvent.click(
      screen.getByRole('option', {
        name: /alakouluille/i,
      })
    );
    userEvent.click(
      screen.getByRole('option', {
        name: /varhaiskasvatukselle/i,
      })
    );
    userEvent.click(
      screen.getByRole('option', {
        name: /yläkouluille ja toisen asteen oppilaitoksille/i,
      })
    );
    userEvent.tab();
    expect(screen.getByText(/alakouluille/i)).toBeInTheDocument();
    expect(screen.getByText(/varhaiskasvatukselle/i)).toBeInTheDocument();
    expect(
      screen.getByText(/yläkouluille ja toisen asteen oppilaitoksille/i)
    ).toBeInTheDocument();

    fillupForm();

    userEvent.click(
      screen.getByRole('button', {
        name: /tilaa uutiskirje/i,
      })
    );

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(getData(), expect.anything());
    });
  });

  it('validates the email', async () => {
    render(
      <NewsLetterSubscribeForm
        onSubmit={jest.fn()}
        initialValues={defaultInitialValues}
      />
    );
    userEvent.type(
      screen.getByRole('textbox', {
        name: /sähköposti \*/i,
      }),
      'not-an-email'
    );
    // Unfocus
    userEvent.tab();
    await waitFor(() => {
      expect(
        screen.getByText(/tämän kentän on oltava kelvollinen sähköpostiosoite/i)
      ).toBeInTheDocument();
    });
  });
});
