import { LANGUAGES } from '../constants';
import { test } from '../testWithFixtures';

LANGUAGES.forEach((lang) => {
  test(`event can be opened from search results and enrolled to using language ${lang}`, async ({
    searchPage,
    eventPage,
  }) => {
    // Load the search page with mocked search results
    await searchPage.mockSearchResults();
    await searchPage.gotoSearchPage(lang); // To load the search results

    // Set up mock data needed on the event page before opening it
    await eventPage.mockEventDetails();
    await eventPage.mockDaycareKamppiIntoStudyGroupUnits();
    await eventPage.mockStudyLevels(); // To make study level selection predictable
    await eventPage.mockEnrolOccurrenceMutation(); // To be able to enrol without real data changes

    // Open the mocked event from the search results
    await searchPage.openEvent(lang, 'Testitapahtuman nimi');

    // Check that the event page loaded with the mocked event details
    await eventPage.isReady();
    await eventPage.hasTitle('Testitapahtuman nimi');

    // Show enrolment form
    await eventPage.showOccurrenceDetails(lang);
    await eventPage.showReservationEnquiryForm(lang);

    // Fill enrolment form
    await eventPage.fillNotifierName(lang, 'Testinimi');
    await eventPage.fillNotifierEmail(lang, 'test@example.org');
    await eventPage.fillNotifierPhoneNumber(lang, '123456789');
    await eventPage.selectDaycareKamppiForStudyGroupUnit(lang);
    await eventPage.fillStudyGroupName(lang, 'Testiryhmä');
    await eventPage.selectPreschoolForStudyLevel(lang);
    await eventPage.selectNumberOfChildren(lang, '8');
    await eventPage.selectNumberOfAdults(lang, '2');
    await eventPage.fillAdditionalInfo(lang, 'Neurokirjon ryhmä');
    await eventPage.acceptDataSharing(lang);

    // Submit enrolment form
    await eventPage.submitReservationEnquiry(lang);

    // Check enrolment form submission
    await eventPage.isReady();
    await eventPage.isReservationEnquirySent(lang);
  });
});
