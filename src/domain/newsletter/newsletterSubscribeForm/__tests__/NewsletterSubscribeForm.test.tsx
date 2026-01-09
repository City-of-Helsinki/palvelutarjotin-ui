import * as React from 'react';

import {
  render,
  screen,
  userEvent,
  waitFor,
  configure,
  sleep,
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

const fillupForm = async ({
  firstName,
  lastName,
  email,
} = defaultFillValues) => {
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

describe('NewsLetterSubscribeForm', () => {
  it('renders correctly', async () => {
    const onSubmit = jest.fn();

    render(
      <NewsLetterSubscribeForm
        onSubmit={onSubmit}
        initialValues={emptyValues}
      />
    );

    await userEvent.click(
      screen.getByRole('combobox', { name: /tilaan uutiskirjeen/i })
    );

    await userEvent.click(
      screen.getByRole('option', {
        name: /alakouluille/i,
      })
    );

    await userEvent.click(
      screen.getByRole('option', {
        name: /varhaiskasvatukselle/i,
      })
    );

    await userEvent.click(
      screen.getByRole('option', {
        name: /yläkouluille ja toisen asteen oppilaitoksille/i,
      })
    );

    await userEvent.tab();
    // Check that selected options are displayed (use getAllByText since they appear in both dropdown and selected list)
    expect(screen.getAllByText(/alakouluille/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/varhaiskasvatukselle/i)[0]).toBeInTheDocument();
    expect(
      screen.getAllByText(/yläkouluille ja toisen asteen oppilaitoksille/i)[0]
    ).toBeInTheDocument();

    await fillupForm();

    await userEvent.click(
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

    await userEvent.type(
      screen.getByRole('textbox', {
        name: /sähköposti \*/i,
      }),
      'not-an-email'
    );

    // Unfocus
    await userEvent.tab();
    await waitFor(() => {
      expect(
        screen.getByText(/tämän kentän on oltava kelvollinen sähköpostiosoite/i)
      ).toBeInTheDocument();
    });
    // wait for debounce to trigger and populate localStorage
    await sleep(500);
  });
});
