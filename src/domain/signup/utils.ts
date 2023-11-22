import { AxiosError } from 'axios';
import omit from 'lodash/omit';

import { ExtendedSession } from '../../types';
import formatDate from '../../utils/formatDate';
import skipFalsyType from '../../utils/skipFalsyType';
import stringToDate from '../../utils/stringToDate';
import {
  callDelete,
  callGet,
  callPatch,
  callPut,
} from '../app/axios/axiosClient';
import { Registration } from '../registration/types';
import {
  SignupFields,
  SignupFormFields,
  SignupGroup,
  SignupGroupFormFields,
} from '../signupGroup/types';
import {
  getContactPersonInitialValues,
  getContactPersonPayload,
} from '../signupGroup/utils';

import { ATTENDEE_STATUS } from './constants';
import {
  ContactPersonInput,
  PatchSignupMutationInput,
  Signup,
  SignupInput,
  SignupQueryVariables,
  UpdateSignupMutationInput,
} from './types';

export const signupPathBuilder = (args: SignupQueryVariables): string => {
  return `/signup/${args.id}/`;
};

export const fetchSignup = async (
  args: SignupQueryVariables,
  session: ExtendedSession | null
): Promise<Signup> => {
  try {
    const { data } = await callGet({
      session,
      url: signupPathBuilder(args),
    });
    return data;
  } catch (error) {
    /* istanbul ignore next */
    throw Error(JSON.stringify((error as AxiosError).response?.data));
  }
};

export const deleteSignup = async ({
  id,
  session,
}: {
  id: string;
  session: ExtendedSession | null;
}): Promise<null> => {
  try {
    const { data } = await callDelete({
      session,
      url: signupPathBuilder({ id }),
    });
    return data;
  } catch (error) {
    throw Error(JSON.stringify((error as AxiosError).response?.data));
  }
};

export const patchSignup = async ({
  input: { id, ...input },
  session,
}: {
  input: PatchSignupMutationInput;
  session: ExtendedSession | null;
}): Promise<Signup> => {
  try {
    const { data } = await callPatch({
      data: JSON.stringify(input),
      session,
      url: signupPathBuilder({ id }),
    });
    return data;
  } catch (error) {
    throw Error(JSON.stringify((error as AxiosError).response?.data));
  }
};

export const updateSignup = async ({
  input: { id, ...input },
  session,
}: {
  input: UpdateSignupMutationInput;
  session: ExtendedSession | null;
}): Promise<Signup> => {
  try {
    const { data } = await callPut({
      data: JSON.stringify(input),
      session,
      url: signupPathBuilder({ id }),
    });
    return data;
  } catch (error) {
    throw Error(JSON.stringify((error as AxiosError).response?.data));
  }
};

export const getSignupInitialValues = (signup: Signup): SignupFormFields => ({
  city: signup.city ?? '',
  dateOfBirth: signup.date_of_birth
    ? formatDate(new Date(signup.date_of_birth))
    : '',
  extraInfo: signup.extra_info ?? '',
  firstName: signup.first_name ?? '',
  id: signup.id,
  inWaitingList: signup.attendee_status === ATTENDEE_STATUS.Waitlisted,
  lastName: signup.last_name ?? '',
  streetAddress: signup.street_address ?? '',
  zipcode: signup.zipcode ?? '',
});

export const getSignupGroupInitialValuesFromSignup = (
  signup: Signup,
  signupGroup?: SignupGroup
): SignupGroupFormFields => {
  const contactPerson =
    signupGroup?.contact_person ?? signup?.contact_person ?? {};
  return {
    contactPerson: getContactPersonInitialValues(contactPerson),
    extraInfo: '',
    signups: [getSignupInitialValues(signup)],
    userConsent: !!signup.user_consent,
  };
};

export const getSignupPayload = ({
  formValues,
  signupData,
}: {
  formValues: SignupGroupFormFields;
  signupData: SignupFormFields;
}): SignupInput => {
  const { userConsent } = formValues;

  const {
    city,
    dateOfBirth,
    extraInfo,
    firstName,
    id,
    lastName,
    streetAddress,
    zipcode,
  } = signupData;
  return {
    city: city || '',
    date_of_birth: dateOfBirth
      ? formatDate(stringToDate(dateOfBirth), 'yyyy-MM-dd')
      : null,
    extra_info: extraInfo || '',
    first_name: firstName || '',
    id: id ?? undefined,
    last_name: lastName || '',
    street_address: streetAddress || null,
    zipcode: zipcode || null,
    user_consent: userConsent,
  };
};

export const getUpdateSignupPayload = ({
  formValues,
  hasSignupGroup,
  id,
  registration,
}: {
  formValues: SignupGroupFormFields;
  hasSignupGroup: boolean;
  id: string;
  registration: Registration;
}): UpdateSignupMutationInput => {
  const { contactPerson } = formValues;
  const signupData = formValues.signups[0] ?? {};
  return {
    ...getSignupPayload({
      formValues,
      signupData,
    }),
    contact_person: !hasSignupGroup
      ? getContactPersonPayload(contactPerson)
      : undefined,
    id,
    registration: registration.id,
  };
};

export const getSignupFields = ({
  signup,
}: {
  signup: Signup;
}): SignupFields => {
  const signupGroup = signup.signup_group ?? null;
  const firstName = signup.first_name ?? '';
  const lastName = signup.last_name ?? '';
  const fullName = [firstName, lastName].filter(skipFalsyType).join(' ');

  return {
    attendeeStatus: signup.attendee_status ?? ATTENDEE_STATUS.Attending,
    email: signup.contact_person?.email ?? '',
    firstName,
    fullName,
    lastName,
    phoneNumber: signup.contact_person?.phone_number ?? '',
    signupGroup,
  };
};

export const omitSensitiveDataFromContactPerson = (
  payload: ContactPersonInput
): Partial<ContactPersonInput> =>
  omit(payload, [
    'email',
    'first_name',
    'last_name',
    'membership_number',
    'native_language',
    'phone_number',
    'service_language',
  ]);

export const omitSensitiveDataFromSignupPayload = (
  payload: SignupInput | UpdateSignupMutationInput
): Partial<SignupInput | UpdateSignupMutationInput> =>
  omit(
    {
      ...payload,
      contact_person: payload.contact_person
        ? (omitSensitiveDataFromContactPerson(
            payload.contact_person
          ) as ContactPersonInput)
        : payload.contact_person,
    },
    [
      '__typename',
      'city',
      'date_of_birth',
      'extra_info',
      'first_name',
      'last_name',
      'street_address',
      'zipcode',
    ]
  );
