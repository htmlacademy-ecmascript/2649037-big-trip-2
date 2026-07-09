import InfoView from '../view/info-view.js';
import { render, replace, remove } from '../framework/render.js';
import { UpdateType } from '../const.js';

export default class InfoPresenter {
  #container = null;
  #pointsModel = null;
  #infoComponent = null;

  constructor({ infoContainer, pointsModel }) {
    this.#container = infoContainer;
    this.#pointsModel = pointsModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  init() {
    //this.#renderInfo();
  }

  #renderInfo() {
    const tripInfo = this.#pointsModel.getTripInfo();
    const previousComponent = this.#infoComponent;

    this.#infoComponent = new InfoView(tripInfo);

    if (!previousComponent) {
      render(this.#infoComponent, this.#container, 'afterbegin');
      return;
    }

    replace(this.#infoComponent, previousComponent);
    remove(previousComponent);
  }

  #handleModelEvent = (updateType) => {
    if(updateType !== UpdateType.ERROR){
      this.#renderInfo();
    }
  };
}
