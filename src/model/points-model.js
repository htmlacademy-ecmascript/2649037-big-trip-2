import { events } from '../mocks/offers-data.js';
import { destinations } from '../mocks/destination.js';
import Observable from '../framework/observable.js';
import { UpdateType } from '../const.js';

export default class WayPointsModel extends Observable {
  #wayPoints = [];
  #pointApiService = null;

  constructor({ pointApiService }) {
    super();
    this.#pointApiService = pointApiService;
  }

  get points() {
    return this.#wayPoints;
  }

  get events() {
    return events;
  }

  get destinations() {
    return destinations;
  }

  async init() {
    try {
      const points = await this.#pointApiService.points;
      this.#wayPoints = points.map(this.#adaptToClient);
    } catch (err) {
      this.#wayPoints = [];
    }
    this._notify(UpdateType.INIT);
  }


  updatePoint(updateType, update) {
    const index = this.#wayPoints.findIndex((point) => point.id === update.id);

    if (!~index) {
      throw new Error('Can\'t update unexacting point');
    }

    this.#wayPoints = [
      ...this.#wayPoints.slice(0, index),
      update,
      ...this.#wayPoints.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  async addPoint(updatePoint, update) {
    try {
      const response = await this.#pointApiService.addPoint(update);
      const newPoint = this.#adaptToClient(response);
      this.#wayPoints = [newPoint, ...this.#wayPoints];
      this._notify(updatePoint, newPoint);
    } catch (err) {
      throw new Error('Can\'t add point');
    }
  }

  async deletePoint(updateType, update) {
    const index = this.#wayPoints.findIndex((point) => point.id === update.id);

    if (!~index) {
      throw new Error('Can\'t delete unexacting point');
    }
    try {
      // Обратите внимание, метод удаления задачи на сервере
      // ничего не возвращает. Это и верно,
      // ведь что можно вернуть при удалении задачи?
      await this.#pointApiService.deletePoint(update);
      this.#wayPoints = [
        ...this.#wayPoints.slice(0, index),
        ...this.#wayPoints.slice(index + 1),
      ];
      this._notify(updateType);
    } catch (err) {
      throw new Error('Can\'t delete point');
    }
  }

  // находим все предложения для переданного типа.
  getEventByType(type) {
    return events.find((event) => event.type === type);
  }

  // находим название города по ID
  getDestination(point) {
    const destination = destinations.find((currentDestination) => currentDestination.id === point.destination);
    return destination ? destination.name : '';
  }


  getOffersForPoint = (point) => {
    const eventType = this.getEventByType(point.type);

    return point.offers
      .map((offerId) => eventType.offers.find((offer) => offer.id === offerId))
      .filter(Boolean); // на случай, если id нет
  };

  #adaptToClient(point) {
    const adaptedPoint = {
      ...point,
      basePrice: point['base_price'],
      dateFrom: point['date_from'],
      dateTo: point['date_to'],
      destination: point['destination'], // ID
      isFavorite: point['is_favorite'],
      offers: point['offers'], // массив ID
    };

    delete adaptedPoint['base_price'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['is_favorite'];

    return adaptedPoint;
  }
}

