import { render, remove } from '../framework/render.js';
import NewPointFormView from '../view/new-point-form-view.js';

export default class NewPointPresenter {
  #container = null;
  #offers = null;
  #destinations = null;
  #handleSubmit = null;
  #handleCancel = null;
  #formComponent = null;

  constructor({ container, offers, destinations, onSubmit, onCancel }) {
    this.#container = container;
    this.#offers = offers;
    this.#destinations = destinations;
    this.#handleSubmit = onSubmit;
    this.#handleCancel = onCancel;
  }

  init() {
    this.#formComponent = new NewPointFormView({
      offers: this.#offers,
      destinations: this.#destinations,
      onSubmit: this.#handleSubmit,
      onCancel: this.#handleCancel
    });

    this.#formComponent._restoreHandlers();
    render(this.#formComponent, this.#container, 'afterbegin');

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    remove(this.#formComponent);
    this.#formComponent = null;
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #escKeyDownHandler = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.#handleCancel();
    }
  };

  setAborting() {
    const resetFormState = () => {
      this.#formComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#formComponent.shake(resetFormState);
  }
}
