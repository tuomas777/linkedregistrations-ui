/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-require-imports */
import '../tests/mockNextAuth';

import subYears from 'date-fns/subYears';
import { rest } from 'msw';
import { GetServerSidePropsContext } from 'next';
import singletonRouter from 'next/router';
import React from 'react';

import { ROUTES } from '../domain/app/routes/constants';
import { NOTIFICATIONS } from '../domain/enrolment/constants';
import { SignupGroupFormFields } from '../domain/enrolment/types';
import { eventName } from '../domain/event/__mocks__/event';
import { mockedLanguagesResponses } from '../domain/language/__mocks__/languages';
import { registration } from '../domain/registration/__mocks__/registration';
import { TEST_REGISTRATION_ID } from '../domain/registration/constants';
import { signup } from '../domain/signup/__mocks__/enrolment';
import { TEST_SIGNUP_ID } from '../domain/signup/constants';
import SignupGroupCompletedPage, {
  getServerSideProps as getSignupGroupCompletedPageServerSideProps,
} from '../pages/registration/[registrationId]/signup-group/completed/index';
import CreateSignupGroupPage, {
  getServerSideProps as getCreateSignupGroupPageServerSideProps,
} from '../pages/registration/[registrationId]/signup-group/create/index';
import SummaryPage, {
  getServerSideProps as getSummaryPageServerSideProps,
} from '../pages/registration/[registrationId]/signup-group/create/summary/index';
import EditSignupPage, {
  getServerSideProps as getEditSignupPageServerSideProps,
} from '../pages/registration/[registrationId]/signup/[signupId]/edit/index';
import EnrolmentCancelledPage, {
  getServerSideProps as getEnrolmentCancelledPageServerSideProps,
} from '../pages/registration/[registrationId]/signup/cancelled/index';
import { ExtendedSSRConfig } from '../types';
import formatDate from '../utils/formatDate';
import {
  getMockedSeatsReservationData,
  setSignupGroupFormSessionStorageValues,
} from '../utils/mockDataUtils';
import { mockDefaultConfig } from '../utils/mockNextJsConfig';
import {
  loadingSpinnerIsNotInDocument,
  render,
  screen,
  setQueryMocks,
} from '../utils/testUtils';

jest.mock('next/dist/client/router', () => require('next-router-mock'));

beforeEach(() => {
  mockDefaultConfig();
  // values stored in tests will also be available in other tests unless you run
  localStorage.clear();
  sessionStorage.clear();
});

const isHeadingRendered = async (heading: string | RegExp) => {
  await loadingSpinnerIsNotInDocument();
  await screen.findByRole('heading', { name: heading }, { timeout: 5000 });
};

const signupGroupValues: SignupGroupFormFields = {
  accepted: true,
  email: 'participant@email.com',
  extraInfo: '',
  membershipNumber: '',
  nativeLanguage: 'fi',
  notifications: [NOTIFICATIONS.EMAIL],
  phoneNumber: '358 44 123 4567',
  serviceLanguage: 'fi',
  signups: [
    {
      city: 'City',
      dateOfBirth: formatDate(subYears(new Date(), 9)),
      extraInfo: '',
      firstName: 'First name',
      inWaitingList: false,
      lastName: 'Last name',
      streetAddress: 'Street address',
      zipcode: '00100',
    },
  ],
};

const mocks = [
  ...mockedLanguagesResponses,
  rest.get(`*/registration/${TEST_REGISTRATION_ID}/`, (req, res, ctx) =>
    res(ctx.status(200), ctx.json(registration))
  ),
  rest.get(`*/signup/*`, (req, res, ctx) =>
    res(ctx.status(200), ctx.json(signup))
  ),
];

describe('CreateSignupGroupPage', () => {
  it('should render heading', async () => {
    setQueryMocks(...mocks);

    setSignupGroupFormSessionStorageValues({
      registrationId: registration.id,
      seatsReservation: getMockedSeatsReservationData(1000),
      signupGroupFormValues: { ...signupGroupValues, email: '' },
    });

    singletonRouter.push({
      pathname: ROUTES.CREATE_SIGNUP_GROUP,
      query: { registrationId: registration.id },
    });

    render(<CreateSignupGroupPage />);

    await isHeadingRendered(eventName);
  });

  it('should prefetch data', async () => {
    setQueryMocks(...mocks);

    const { props } = (await getCreateSignupGroupPageServerSideProps({
      locale: 'fi',
      query: { registrationId: registration.id },
    } as unknown as GetServerSidePropsContext)) as {
      props: ExtendedSSRConfig;
    };

    expect(props.dehydratedState.queries).toEqual([
      {
        queryHash: `["registration","${TEST_REGISTRATION_ID}"]`,
        queryKey: ['registration', TEST_REGISTRATION_ID],
        state: expect.objectContaining({ data: registration }),
      },
    ]);
  });
});

describe('SummaryPage', () => {
  it('should render heading', async () => {
    setQueryMocks(...mocks);

    setSignupGroupFormSessionStorageValues({
      registrationId: registration.id,
      seatsReservation: getMockedSeatsReservationData(1000),
      signupGroupFormValues: { ...signupGroupValues, email: '' },
    });

    singletonRouter.push({
      pathname: ROUTES.CREATE_SIGNUP_GROUP_SUMMARY,
      query: { registrationId: registration.id },
    });

    render(<SummaryPage />);

    await isHeadingRendered(eventName);
  });

  it('should prefetch data', async () => {
    setQueryMocks(...mocks);

    const { props } = (await getSummaryPageServerSideProps({
      locale: 'fi',
      query: { registrationId: registration.id },
    } as unknown as GetServerSidePropsContext)) as {
      props: ExtendedSSRConfig;
    };

    expect(props.dehydratedState.queries).toEqual([
      {
        queryHash: `["registration","${TEST_REGISTRATION_ID}"]`,
        queryKey: ['registration', TEST_REGISTRATION_ID],
        state: expect.objectContaining({ data: registration }),
      },
    ]);
  });
});

describe('SignupGroupCompletedPage', () => {
  it('should render heading', async () => {
    setQueryMocks(...mocks);

    singletonRouter.push({
      pathname: ROUTES.SIGNUP_GROUP_COMPLETED,
      query: { signupId: signup.id, registrationId: registration.id },
    });

    render(<SignupGroupCompletedPage />);

    await isHeadingRendered('Kiitos ilmoittautumisestasi!');
  });

  it('should prefetch data', async () => {
    setQueryMocks(...mocks);

    const { props } = (await getSignupGroupCompletedPageServerSideProps({
      locale: 'fi',
      query: { registrationId: registration.id },
    } as unknown as GetServerSidePropsContext)) as {
      props: ExtendedSSRConfig;
    };

    expect(props.dehydratedState.queries).toEqual([
      {
        queryHash: `["registration","${TEST_REGISTRATION_ID}"]`,
        queryKey: ['registration', TEST_REGISTRATION_ID],
        state: expect.objectContaining({ data: registration }),
      },
    ]);
  });
});

describe('EditSignupPage', () => {
  it('should render heading', async () => {
    setQueryMocks(...mocks);

    singletonRouter.push({
      pathname: ROUTES.EDIT_SIGNUP,
      query: {
        registrationId: registration.id,
        signupId: signup.id,
      },
    });

    render(<EditSignupPage />);

    await isHeadingRendered(eventName);
  });

  it('should prefetch data', async () => {
    setQueryMocks(...mocks);

    const { props } = (await getEditSignupPageServerSideProps({
      locale: 'fi',
      query: {
        registrationId: registration.id,
        signupId: signup.id,
      },
    } as unknown as GetServerSidePropsContext)) as {
      props: ExtendedSSRConfig;
    };

    expect(props.dehydratedState.queries).toEqual([
      {
        queryHash: `["registration","${TEST_REGISTRATION_ID}"]`,
        queryKey: ['registration', TEST_REGISTRATION_ID],
        state: expect.objectContaining({ data: registration }),
      },
      {
        queryHash: `["signup","${TEST_SIGNUP_ID}"]`,
        queryKey: ['signup', TEST_SIGNUP_ID],
        state: expect.objectContaining({ data: signup }),
      },
    ]);
  });
});

describe('SignupCancelledPage', () => {
  it('should render heading', async () => {
    setQueryMocks(...mocks);

    singletonRouter.push({
      pathname: ROUTES.SIGNUP_CANCELLED,
      query: { registrationId: registration.id },
    });

    render(<EnrolmentCancelledPage />);

    await isHeadingRendered('Ilmoittautumisesi on peruttu');
  });

  it('should prefetch data', async () => {
    setQueryMocks(...mocks);

    const { props } = (await getEnrolmentCancelledPageServerSideProps({
      locale: 'fi',
      query: { registrationId: registration.id },
    } as unknown as GetServerSidePropsContext)) as {
      props: ExtendedSSRConfig;
    };

    expect(props.dehydratedState.queries).toEqual([
      {
        queryHash: `["registration","${TEST_REGISTRATION_ID}"]`,
        queryKey: ['registration', TEST_REGISTRATION_ID],
        state: expect.objectContaining({ data: registration }),
      },
    ]);
  });
});
