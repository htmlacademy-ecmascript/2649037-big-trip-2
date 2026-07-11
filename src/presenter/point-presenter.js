import PointView from '../view/point-view.js';
import EditFormView from '../view/edit-form-view.js';
import { render, replace, remove } from '../framework/render.js';
import { isEsc } from '../utils.js';
import { UserAction, UpdateType } from '../const.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {
  #pointComponent = null;
  #pointEditComponent = null;
  #pointsListContainer = null;
  #point = null;
  #allEvents = null;
  #destinationsList = null;
  #pointsModel = null;
  #handleDataChange = null;
  #handleModeChange = null;
  #mode = Mode.DEFAULT;


  constructor({ pointsModel, container, onDataChange, onModeChange }) {
    this.#pointsModel = pointsModel;
    this.#pointsListContainer = container;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init(point) {
    this.#point = point;
    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    this.#pointComponent = new PointView({
      point: this.#createPointView(point),
      onEditClick: this.#handleEditClick,
      onFavoriteClick: this.#handleFavoriteClick
    });

    this.#pointEditComponent = new EditFormView({
      point,
      offers: this.#pointsModel.offers,
      destinations: this.#pointsModel.destinations,
      onSubmit: this.#handleFormSubmit,
      onDelete: this.#handleDeleteClick,
      onRollup: this.#handleRollupClick
    });

    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this.#pointComponent, this.#pointsListContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointEditComponent, prevPointEditComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  #replaceCardToForm = () => {
    replace(this.#pointEditComponent, this.#pointComponent);
    this.#pointEditComponent._restoreHandlers();
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  };

  #replaceFormToCard = () => {
    replace(this.#pointComponent, this.#pointEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  };

  #createPointView(point) {
    return {
      ...point,
      destination: this.#pointsModel.getDestination(point),
      offers: this.#pointsModel.getOffersForPoint(point),
      eventData: this.#pointsModel.getEventByType(point.type)
    };
  }


  #escKeyDownHandler = (evt) => {
    if (isEsc(evt)) {
      evt.preventDefault();
      this.#pointEditComponent.reset(this.#point);
      this.#replaceFormToCard();
    }
  };

  #handleEditClick = () => {
    this.#replaceCardToForm();
  };

  #handleFormSubmit = (update) => {
    this.setSaving();
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      update,
    );
  };

  #handleRollupClick = () => {
    this.#pointEditComponent.reset(this.#point);
    this.#replaceFormToCard();
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      { ...this.#point, isFavorite: !this.#point.isFavorite },
    );
  };

  #handleDeleteClick = (point) => {
    this.setDeleting();
    this.#handleDataChange(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point,
    );
  };

  destroy() {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#pointEditComponent.reset({
        ...this.#point,
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      });

      this.#replaceFormToCard();
    }

  }

  setSaving() {
    if (this.#mode === Mode.EDITING) {
      this.#pointEditComponent.updateElement({
        ...this.#pointEditComponent._state,
        isDisabled: true,
        isSaving: true,
      });
    }
  }

  setDeleting() {
    if (this.#mode === Mode.EDITING) {
      this.#pointEditComponent.updateElement({
        ...this.#pointEditComponent._state,
        isDisabled: true,
        isDeleting: true,
      });
    }
  }

  setAborting() {
    // Если форма сейчас не открыта — качаем карточку
    if (this.#mode === Mode.DEFAULT) {
      this.#pointComponent.shake();
      return;
    }

    // Если форма открыта — качаем форму и после анимации сбрасываем состояние
    const resetFormState = () => {
      this.#pointEditComponent.updateElement({
        ...this.#pointEditComponent._state,
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#pointEditComponent.shake(resetFormState);
  }

}
