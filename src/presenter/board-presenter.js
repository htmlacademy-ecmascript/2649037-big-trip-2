import { render } from '../render.js';
import FilterView from '../view/filter-view.js';
import InfoView from '../view/info-view.js';
import SortView from '../view/sort-view.js';
import EditFormView from '../view/edit-form-view.js';
import ItemView from '../view/item-view.js';

export default class BoardPresenter {

  constructor({ infoContainer, filterContainer, sortContainer, wayPointsModel }) {
    this.infoContainer = infoContainer;
    this.filterContainer = filterContainer;
    this.sortContainer = sortContainer;
    this.wayPointsModel = wayPointsModel;
  }

  init() {
    // Рендер информации о маршруте
    render(new InfoView(), this.infoContainer, 'afterbegin');

    // Рендер фильтров
    render(new FilterView(), this.filterContainer);

    // Рендер сортировки
    render(new SortView(), this.sortContainer);

    // Создаём контейнер списка
    const listContainer = document.createElement('ul');
    listContainer.classList.add('trip-events__list');
    this.sortContainer.append(listContainer);

    // Форма редактирования — первая в списке
    render(new EditFormView(), listContainer);


    // Создаем точки маршрута
    this.points = this.wayPointsModel.getPoints();
    for (let i = 0; i < this.points.length; i++) {
      render(new ItemView({point: this.points[i]}), listContainer);
    }
  }
}
