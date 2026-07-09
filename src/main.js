import BoardPresenter from './presenter/board-presenter.js';
import WayPointsModel from './model/points-model.js';
import PointApiService from './point-api-service.js';
import InfoPresenter from './presenter/info-presenter.js';

const AUTHORIZATION = 'Basic hS2sfS44wcl1sa2k';
const END_POINT = 'https://22.objects.htmlacademy.pro/big-trip';

const infoElement = document.querySelector('.trip-main');
const boardElement = document.querySelector('.trip-events');

const wayPointsModel = new WayPointsModel({
  pointApiService: new PointApiService(END_POINT, AUTHORIZATION)
});

const boardPresenter = new BoardPresenter({
  infoContainer: infoElement,
  boardContainer: boardElement,
  wayPointsModel
});

const infoPresenter = new InfoPresenter({
  infoContainer: infoElement,
  pointsModel: wayPointsModel
});

boardPresenter.init();
wayPointsModel.init();
infoPresenter.init();
