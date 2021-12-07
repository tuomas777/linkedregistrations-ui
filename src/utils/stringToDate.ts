import parse from 'date-fns/parse';

import { DATE_FORMAT } from '../constants';

const stringToDate = (value: string): Date =>
  parse(value, DATE_FORMAT, new Date());

export default stringToDate;
