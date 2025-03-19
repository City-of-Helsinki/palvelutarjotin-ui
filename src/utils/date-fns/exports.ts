/* eslint-disable import/no-duplicates */
// Disable import/no-duplicates linting for this file because
// date-fns imports otherwise would be marked as duplicates, e.g.
// "node_modules/date-fns/typings.d.ts' imported multiple times",
// see https://github.com/import-js/eslint-plugin-import/issues/1479
import add from 'date-fns/add';
import format from 'date-fns/format';
import isAfter from 'date-fns/isAfter';
import isBefore from 'date-fns/isBefore';
import isFuture from 'date-fns/isFuture';
import isPast from 'date-fns/isPast';
import isSameDay from 'date-fns/isSameDay';
import isToday from 'date-fns/isToday';
import isTomorrow from 'date-fns/isTomorrow';
import isValid from 'date-fns/isValid';
import { enGB, fi, sv } from 'date-fns/locale';
import parse from 'date-fns/parse';
import parseISO from 'date-fns/parseISO';
import startOfDay from 'date-fns/startOfDay';
import subDays from 'date-fns/subDays';

export {
  add,
  enGB,
  fi,
  format,
  isAfter,
  isBefore,
  isFuture,
  isPast,
  isSameDay,
  isToday,
  isTomorrow,
  isValid,
  parse,
  parseISO,
  startOfDay,
  subDays,
  sv,
};
