import * as React from 'react';

import {
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../utils/testUtils';
import { NewsletterGroupId, NewsletterSubscribeFormFields } from '../constants';
import NewsLetterSubscribeForm, {
  defaultInitialValues,
} from '../NewsletterSubscribeForm';

const firstName = 'Test';
const lastName = 'Guy';
const email = 'test.guy@example.com';

const getData = (
  groups: NewsletterGroupId[] = Object.values(NewsletterGroupId)
): NewsletterSubscribeFormFields => ({
  groups,
  email,
  firstName,
  lastName,
});

describe('NewsLetterSubscribeForm', () => {
  it('renders correctly', async () => {
    const onSubmit = jest.fn();

    render(
      <NewsLetterSubscribeForm
        onSubmit={onSubmit}
        initialValues={defaultInitialValues}
      />
    );

    expect(screen.getByText(/alakouluille/i)).toBeInTheDocument();
    expect(screen.getByText(/varhaiskasvatukselle/i)).toBeInTheDocument();
    expect(
      screen.getByText(/yläkouluille ja toisen asteen oppilaitoksille/i)
    ).toBeInTheDocument();

    userEvent.click(
      screen.getByRole('button', {
        name: /tilaan uutiskirjeen \*/i,
      })
    );

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

    userEvent.click(
      screen.getByRole('button', {
        name: /tilaa uutiskirje/i,
      })
    );

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(getData(), expect.anything());
    });
  });
});
