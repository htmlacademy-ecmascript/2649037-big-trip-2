import BoardPresenter from './presenter/board-presenter.js';

const infoElement = document.querySelector('.trip-main');
const filterElement = document.querySelector('.trip-controls__filters');
const sortElement = document.querySelector('.trip-events');

const boardPresenter = new BoardPresenter({
  infoContainer: infoElement,
  filterContainer: filterElement,
  sortContainer: sortElement
});

boardPresenter.init();
