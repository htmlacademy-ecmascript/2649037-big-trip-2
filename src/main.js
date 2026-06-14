import BoardPresenter from './presenter/board-presenter.js';
import WayPointsModel from './model/points-model.js';

const infoElement = document.querySelector('.trip-main');
const boardElement = document.querySelector('.trip-events');

const wayPointsModel = new WayPointsModel();

const boardPresenter = new BoardPresenter({
  infoContainer: infoElement,
  boardContainer: boardElement,
  wayPointsModel
});

boardPresenter.init();


