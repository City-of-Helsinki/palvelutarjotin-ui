import * as React from 'react';
import wait from 'waait';

import {
  render,
  screen,
  userEvent,
  waitFor,
  configure,
  act,
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

const fillupForm = async (values = defaultFillValues) => {
  await act(
    async () =>
      await userEvent.type(
        screen.getByRole('textbox', {
          name: /etunimi \*/i,
        }),
        firstName
      )
  );

  await act(
    async () =>
      await userEvent.type(
        screen.getByRole('textbox', {
          name: /sukunimi \*/i,
        }),
        lastName
      )
  );

  await act(
    async () =>
      await userEvent.type(
        screen.getByRole('textbox', {
          name: /sähköposti \*/i,
        }),
        email
      )
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

    await act(
      async () =>
        await userEvent.click(
          screen.getByRole('button', { name: /tilaan uutiskirjeen \*/i })
        )
    );
    await act(
      async () =>
        await userEvent.click(
          screen.getByRole('option', {
            name: /alakouluille/i,
          })
        )
    );
    await act(
      async () =>
        await userEvent.click(
          screen.getByRole('option', {
            name: /varhaiskasvatukselle/i,
          })
        )
    );
    await act(
      async () =>
        await userEvent.click(
          screen.getByRole('option', {
            name: /yläkouluille ja toisen asteen oppilaitoksille/i,
          })
        )
    );
    await act(async () => await userEvent.tab());
    expect(screen.getByText(/alakouluille/i)).toBeInTheDocument();
    expect(screen.getByText(/varhaiskasvatukselle/i)).toBeInTheDocument();
    expect(
      screen.getByText(/yläkouluille ja toisen asteen oppilaitoksille/i)
    ).toBeInTheDocument();

    await act(async () => await fillupForm());

    await act(
      async () =>
        await userEvent.click(
          screen.getByRole('button', {
            name: /tilaa uutiskirje/i,
          })
        )
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
    await act(
      async () =>
        await userEvent.type(
          screen.getByRole('textbox', {
            name: /sähköposti \*/i,
          }),
          'not-an-email'
        )
    );
    // Unfocus
    await act(async () => await userEvent.tab());
    await waitFor(() => {
      expect(
        screen.getByText(/tämän kentän on oltava kelvollinen sähköpostiosoite/i)
      ).toBeInTheDocument();
    });
    // wait for debounce to trigger and populate localStorage
    await act(() => wait(500));
  });
});
