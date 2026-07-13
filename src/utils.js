import { PRICE } from './const.js';

const HOURS_IN_DAY = 24;
const MINUTES_IN_HOUR = 60;

function getRandomNumber(min = PRICE.min, max = PRICE.max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomOffers(offers) {
  const maxOffers = offers.length;
  const checkedOffers = getRandomNumber(0, maxOffers);
  const result = new Set();
  while (result.size < checkedOffers) {
    const randomIndex = getRandomNumber(0, maxOffers - 1);
    const id = offers[randomIndex].id;
    if (!result.has(id)) {
      result.add(id);
    }

  }
  return [...result];

}

const isEsc = (evt) => evt.key === 'Escape';

function updateItem(items, update) {
  return items.map((item) => item.id === update.id ? update : item);
}

function getDuration(start, end) {
  const totalMinutes = end.diff(start, 'minute');
  const formatTwoDigits = (number) => String(number).padStart(2, '0');

  let duration = '';

  if (totalMinutes < MINUTES_IN_HOUR) {
    duration = `${totalMinutes}M`;
  } else if (totalMinutes < HOURS_IN_DAY * MINUTES_IN_HOUR) {
    const hours = Math.floor(totalMinutes / HOURS_IN_DAY);
    const minutes = totalMinutes % HOURS_IN_DAY;
    duration = `${formatTwoDigits(hours)}H ${formatTwoDigits(minutes)}M`;
  } else {
    const days = Math.floor(totalMinutes / (HOURS_IN_DAY * MINUTES_IN_HOUR));
    const hours = Math.floor((totalMinutes % (HOURS_IN_DAY * MINUTES_IN_HOUR)) / HOURS_IN_DAY);
    const minutes = totalMinutes % HOURS_IN_DAY;
    duration = `${formatTwoDigits(days)}D ${formatTwoDigits(hours)}H ${formatTwoDigits(minutes)}M`;
  }

  return duration;
}

export { getRandomNumber, getRandomOffers, isEsc, updateItem, getDuration };
