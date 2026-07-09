import AbstractView from '../framework/view/abstract-view.js';
import dayjs from 'dayjs';

const CITY_MAX_COUNT = 3;

function createInfoTemplate({ routeString, datesString, totalCost }) {
  return (
    `<section class="trip-main__trip-info trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${routeString}</h1>
        <p class="trip-info__dates">${datesString}</p>
      </div>

      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalCost}</span>
      </p>
    </section>`
  );
}

export default class InfoView extends AbstractView {
  #tripInfo = null;

  constructor(tripInfo) {
    super();
    this.#tripInfo = tripInfo;
  }

  get template() {
    const routeString = this.#createRouteString();
    const datesString = this.#createDatesString();
    const totalCost = this.#tripInfo.totalCost;

    return createInfoTemplate({ routeString, datesString, totalCost });
  }

  #createRouteString() {
    const { firstCity, lastCity, citiesCount } = this.#tripInfo;

    if (citiesCount === 0) {
      return '';
    }

    if (citiesCount === 1) {
      return firstCity;
    }

    if (citiesCount <= CITY_MAX_COUNT) {
      return `${firstCity}&nbsp;&mdash;&nbsp;${lastCity}`;
    }

    // многоточие через HTML-сущность
    return `${firstCity}&nbsp;&mdash;&nbsp;&hellip;&nbsp;&mdash;&nbsp;${lastCity}`;
  }

  #createDatesString() {
    const { startDate, endDate } = this.#tripInfo;

    if (!startDate || !endDate) {
      return '';
    }

    const start = dayjs(startDate);
    const end = dayjs(endDate);

    // если месяц одинаковый
    if (start.month() === end.month()) {
      return `${start.format('DD')}&nbsp;&mdash;&nbsp;${end.format('DD MMM')}`;
    }

    // если разные месяцы
    return `${start.format('DD MMM')}&nbsp;&mdash;&nbsp;${end.format('DD MMM')}`;
  }
}
