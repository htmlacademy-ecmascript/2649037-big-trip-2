import { render } from '../framework/render.js';
import FilterView from '../view/filter-view.js';
import InfoView from '../view/info-view.js';
import SortView from '../view/sort-view.js';
import PointPresenter from './point-presenter.js';
import { FilterType, SortType } from '../const.js';


export default class BoardPresenter {
  #infoContainer = {};
  #filterContainer = {};
  #sortContainer = {};
  #wayPointsModel = {};
  #points = [];
  #currentFilter = FilterType.EVERYTHING;
  #currentSort = SortType.DAY;

  constructor({ infoContainer, filterContainer, sortContainer, wayPointsModel }) {
    this.#infoContainer = infoContainer;
    this.#filterContainer = filterContainer;
    this.#sortContainer = sortContainer;
    this.#wayPointsModel = wayPointsModel;
  }

  init() {
    // Рендер информации о маршруте
    render(new InfoView(), this.#infoContainer, 'afterbegin');

    // Рендер фильтров
    render(
      new FilterView({
        onFilterChange: this.#handleFilterChange
      }),
      this.#filterContainer
    );

    // Рендер сортировки
    render(
      new SortView({
        onSortChange: this.#handleSortChange
      }), this.#sortContainer);

    this.#renderPointsList();
  }

  #handleFilterChange = (filterType) => {
    this.#currentFilter = filterType;
    this.#currentSort = SortType.DAY; // сброс сортировки
    this.#clearPointsList();
    this.#renderPointsList();
  };

  #handleSortChange = (sortType) => {
    this.#currentSort = sortType;
    this.#clearPointsList();
    this.#renderPointsList();
  };

  #getFilteredPoints() {
    const points = this.#wayPointsModel.getPoints();
    const now = new Date();

    switch (this.#currentFilter) {
      case FilterType.FUTURE:
        return points.filter((p) => new Date(p.dateFrom) > now);

      case FilterType.PRESENT:
        return points.filter((p) =>
          new Date(p.dateFrom) <= now && new Date(p.dateTo) >= now
        );

      case FilterType.PAST:
        return points.filter((p) => new Date(p.dateTo) < now);

      default:
        return points;
    }
  }

  #getSortedPoints(points) {
    switch (this.#currentSort) {
      case SortType.PRICE:
        return [...points].sort((a, b) => b.basePrice - a.basePrice);

      case SortType.TIME:
        return [...points].sort((a, b) => {
          const durationA = new Date(a.dateTo) - new Date(a.dateFrom);
          const durationB = new Date(b.dateTo) - new Date(b.dateFrom);
          return durationB - durationA;
        });

      default: // DAY
        return [...points].sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom));
    }
  }

  #clearPointsList() {
    const list = this.#sortContainer.querySelector('.trip-events__list');
    if (list) {
      list.remove();
    }
  }

  #renderPointsList() {

    // Создаём контейнер списка
    const listContainer = document.createElement('ul');
    listContainer.classList.add('trip-events__list');
    this.#sortContainer.append(listContainer);

    const filteredPoints = this.#getFilteredPoints();
    this.#points = this.#getSortedPoints(filteredPoints);

    this.#points.forEach((point) => {
      const presenter = new PointPresenter({ pointsModel: this.#wayPointsModel, container: listContainer });
      presenter.init(
        point
      );
    });
  }
}
