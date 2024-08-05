class SwipeButtonCard extends HTMLElement {
  static get version() {
    return '0.7.1';
  }
  
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  async setConfig(config) {
    if (!config || !config.swipe_card) {
      throw new Error('Invalid configuration. You need to define at least a swipe_card');
    }

    this.cardId = `swipe-button-card-${Math.random().toString(36).substr(2, 9)}`;

    // Determine the layout based on the number of defined cards
    let layout = 1; // Default to 1 if only swipe_card is defined
    if (config.card_1 && config.card_2) {
      layout = 3;
    } else if (config.card_1 || config.card_2) {
      layout = 2;
    }

    this.config = {
      auto_height: false,
      width: '100%',
      height: '100%',
      card_1: null,
      swipe_card: null,
      card_2: null,
      custom_css: {},
      template: 'swipe-button-horizontal',
      ...config,
      layout: layout
    };

    await this.render();
  }

  async render() {
    const isVertical = this.config.template === 'swipe-button-vertical';
    const styles = `
      :host {
        --card-1-bg: transparent;
        --card-1-border-radius: var(--ha-card-border-radius);

        --swipe-bg: transparent;
        --swipe-border-radius: var(--ha-card-border-radius);

        --card-2-bg: transparent;
        --card-2-border-radius: var(--ha-card-border-radius);

        --swipe-container-bg: transparent;
        --swipe-container-border-radius: var(--ha-card-border-radius);
      }
      #${this.cardId} {
        width: ${this.config.width};
      }
      #${this.cardId} .swipe-container {
        display: flex;
        overflow: auto;
        overflow-${isVertical ? 'y' : 'x'}: scroll;
        scroll-snap-type: ${isVertical ? 'y' : 'x'} mandatory;
        align-content: center;
        ${isVertical ? 'flex-direction: column;' : ''}
        background-color: var(--swipe-container-bg);
        border-radius: var(--swipe-container-border-radius);
      }
      #${this.cardId} .swipe-container::-webkit-scrollbar {
        display: none;
      }
      #${this.cardId} .swipe-element {
        flex: 1;
        scroll-snap-align: start;
        background-color: var(--swipe-bg);
        border-radius: var(--swipe-border-radius);
      }
      #${this.cardId} .action,
      #${this.cardId} .swipe-element {
        display: flex;
        min-height: 100%;
        min-width: 100%;
        flex-flow: column;
        justify-content: center;
        align-items: center;
      }
      #${this.cardId} .card-1-container {
        flex: 1;
        ${isVertical ? 'width: 100%;' : 'height: 100%;'}
        background-color: var(--card-1-bg);
        border-radius: var(--card-1-border-radius);
        align-content: ${isVertical ? 'flex-start;' : 'center;'}
        justify-content: ${isVertical ? 'center;' : 'flex-start;'}
      }
      #${this.cardId} .card-2-container {
        flex: 1;
        ${isVertical ? 'width: 100%;' : 'height: 100%;'}
        background-color: var(--card-2-bg);
        border-radius: var(--card-2-border-radius);
        align-content: ${isVertical ? 'flex-end;' : 'center;'}
        justify-content: ${isVertical ? 'center;' : 'flex-end;'}
      }
      #${this.cardId} .card_1 {
        flex: 1;
        position: sticky;
        ${isVertical ? 'width: 100%;' : 'height: 100%;'}
        ${isVertical ? 'top' : 'left'}: 0px;
        align-content: ${isVertical ? 'flex-start;' : 'center;'}
        border-radius: var(--card-1-border-radius);
      }
      #${this.cardId} .swipe-card {
        flex: 1;
        width: 100%;
        height: 100%;
        justify-self: center;
        align-content: center;
        border-radius: var(--swipe-border-radius);
        overflow: hidden;
      }
      #${this.cardId} .card_2 {
        flex: 1;
        position: sticky;
        ${isVertical ? 'width: 100%;' : 'height: 100%;'}
        ${isVertical ? 'bottom' : 'right'}: 0px;
        align-content: ${isVertical ? 'flex-end;' : 'center;'}
        border-radius: var(--card-2-border-radius);
      }
    `;

    let html = `
      <div id="${this.cardId}">
        <div class="swipe-container">
    `;

    if (this.config.layout === 2) {
      if (this.config.card_1) {
        html += '<div class="action card-1-container"></div>';
      }
      html += '<div class="swipe-element"></div>';
      if (this.config.card_2) {
        html += '<div class="action card-2-container"></div>';
      }
    } else {
      html += `
        <div class="action card-1-container"></div>
        <div class="swipe-element"></div>
        <div class="action card-2-container"></div>
      `;
    }

    html += `
        </div>
      </div>
    `;

    this.shadowRoot.innerHTML = `<style>${styles}</style>${html}`;

    const swipeCardContainer = this.shadowRoot.querySelector('.swipe-element');
    const swipeCard = await this.createCardElement(this.config.swipe_card);
    swipeCard.classList.add('swipe-card');
    swipeCardContainer.appendChild(swipeCard);

    if (this.config.layout === 2) {
      if (this.config.card_1) {
        const card1Container = this.shadowRoot.querySelector('.card-1-container');
        const card1 = await this.createCardElement(this.config.card_1);
        card1.classList.add('card_1');
        card1Container.appendChild(card1);
      }
      if (this.config.card_2) {
        const card2Container = this.shadowRoot.querySelector('.card-2-container');
        const card2 = await this.createCardElement(this.config.card_2);
        card2.classList.add('card_2');
        card2Container.appendChild(card2);
      }
    } else {
      const card1Container = this.shadowRoot.querySelector('.card-1-container');
      const card2Container = this.shadowRoot.querySelector('.card-2-container');

      const card1 = await this.createCardElement(this.config.card_1);
      const card2 = await this.createCardElement(this.config.card_2);

      card1.classList.add('card_1');
      card2.classList.add('card_2');

      card1Container.appendChild(card1);
      card2Container.appendChild(card2);
    }

    if (this.config.auto_height) {
      const observer = new MutationObserver(() => {
        if (this.config.template === 'swipe-button-horizontal') {
          this.adjustCardContainerHeightHorizont();
        } else if (this.config.template === 'swipe-button-vertical') {
          this.adjustCardContainerHeightVertical();
        }
        observer.disconnect();
      });

      observer.observe(this.shadowRoot, { childList: true, subtree: true });
    } else {
      if (this.config.template === 'swipe-button-horizontal') {
        this.setManualHeightHorizontal();
      } else if (this.config.template === 'swipe-button-vertical') {
        this.setManualHeightVertical();
      }
    }

    this.applyCustomStyles();

    const swipeContainer = this.shadowRoot.querySelector('.swipe-container');
    swipeContainer.addEventListener('touchstart', this.onTouchStart.bind(this));
    swipeContainer.addEventListener('touchmove', this.onTouchMove.bind(this));
    swipeContainer.addEventListener('touchend', this.onTouchEnd.bind(this));
  }

  applyCustomStyles() {
    const customStyles = this.config.custom_css;
    Object.keys(customStyles).forEach(variable => {
      this.shadowRoot.host.style.setProperty(variable, customStyles[variable]);
    });
  }

  async createCardElement(cardConfig) {
    try {
      const createCard = (await loadCardHelpers()).createCardElement;
      const element = createCard(cardConfig);
      element.hass = this._hass;
      return element;
    } catch (error) {
      console.error('Error creating card element:', error);
      throw new Error('Failed to create card element');
    }
  }

  async adjustCardContainerHeightHorizont() {
    const maxHeight = await this.getCardSize();
    const swipeContainer = this.shadowRoot.querySelector('.swipe-container');
    swipeContainer.style.maxHeight = `${maxHeight}px`;

    const cards = [
      this.shadowRoot.querySelector('.swipe-card'),
    ].filter(Boolean);

    cards.forEach(card => {
      card.style.maxHeight = `${maxHeight}px`;
      if (card.shadowRoot) {
        const haCard = card.shadowRoot.querySelector('ha-card');
        if (haCard) {
          haCard.style.maxHeight = `${maxHeight}px`;
        }
      }
    });
  }
  
  async adjustCardContainerHeightVertical() {
    const swipeCard = this.shadowRoot.querySelector('.swipe-card');
    await swipeCard.updateComplete;

    const swipeCardHeight = swipeCard.offsetHeight;
    const swipeCardHaCard = swipeCard.shadowRoot.querySelector('ha-card');
    const swipeCardHaCardHeight = swipeCardHaCard ? swipeCardHaCard.offsetHeight : swipeCardHeight;

    const swipeContainer = this.shadowRoot.querySelector('.swipe-container');
    swipeContainer.style.height = `${swipeCardHaCardHeight}px`;

    const swipeElement = this.shadowRoot.querySelector('.swipe-element');
    swipeElement.style.height = `${swipeCardHaCardHeight}px`;

    swipeCard.style.height = `${swipeCardHaCardHeight}px`;
    if (swipeCardHaCard) {
      swipeCardHaCard.style.height = `${swipeCardHaCardHeight}px`;
    }
  }

  setManualHeightHorizontal() {
    const height = this.config.height;
    const swipeContainer = this.shadowRoot.querySelector('.swipe-container');
    swipeContainer.style.height = `${height}`;

    const cards = [
      this.shadowRoot.querySelector('.card_1'),
      this.shadowRoot.querySelector('.swipe-card'),
      this.shadowRoot.querySelector('.card_2')
    ].filter(Boolean);

    cards.forEach(card => {
      card.style.height = `${height}`;
      if (card.shadowRoot) {
        const haCard = card.shadowRoot.querySelector('ha-card');
        if (haCard) {
          haCard.style.height = `${height}`;
        }
      }
    });
  }

  setManualHeightVertical() {
    const height = this.config.height;
    const swipeContainer = this.shadowRoot.querySelector('.swipe-container');
    swipeContainer.style.height = `${height}`;

    const swipeElement = this.shadowRoot.querySelector('.swipe-element');
    swipeElement.style.height = `${height}`;

    const swipeCard = this.shadowRoot.querySelector('.swipe-card');
    swipeCard.style.height = `${height}`;
    if (swipeCard.shadowRoot) {
      const haCard = swipeCard.shadowRoot.querySelector('ha-card');
      if (haCard) {
        haCard.style.height = `${height}`;
      }
    }
  }

  async getCardSize() {
    const cards = [
      this.shadowRoot.querySelector('.card_1'),
      this.shadowRoot.querySelector('.swipe-card'),
      this.shadowRoot.querySelector('.card_2')
    ].filter(Boolean);

    let maxHeight = 0;

    for (const card of cards) {
      if (card.getCardSize) {
        const size = await card.getCardSize();
        maxHeight = Math.max(maxHeight, size * 50);
      } else {
        const rect = card.getBoundingClientRect();
        maxHeight = Math.max(maxHeight, rect.height);
      }
    }

    return maxHeight || 140; // fallback to 150 if maxHeight is 0
  }

  onTouchStart(event) {
    this.isSwiping = false;
    this.startX = event.touches[0].pageX;
    this.startY = event.touches[0].pageY;
  }

  onTouchMove(event) {
    const moveX = event.touches[0].pageX;
    const moveY = event.touches[0].pageY;
    const deltaX = moveX - this.startX;
    const deltaY = moveY - this.startY;

    const isVertical = this.config.template === 'swipe-button-vertical';

    if (isVertical) {
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        this.isSwiping = true;
      }
    } else {
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        this.isSwiping = true;
      }
    }
  }

  onTouchEnd(event) {
    const isVertical = this.config.template === 'swipe-button-vertical';
    const endX = event.changedTouches[0].pageX;
    const endY = event.changedTouches[0].pageY;
    const swipeDistance = isVertical ? this.startY - endY : this.startX - endX;
    const minDistance = 80;

    if (this.isSwiping) {
      if (this.config.layout === 2) {
        if (this.config.card_1 && swipeDistance < -minDistance) {
          this.dispatchClickEvent(this.shadowRoot.querySelector('.card-1-container').firstChild.shadowRoot.querySelector('ha-card'));
        } else if (this.config.card_2 && swipeDistance > minDistance) {
          this.dispatchClickEvent(this.shadowRoot.querySelector('.card-2-container').firstChild.shadowRoot.querySelector('ha-card'));
        }
      } else {
        if (swipeDistance > minDistance) {
          this.dispatchClickEvent(this.shadowRoot.querySelector('.card-2-container').firstChild.shadowRoot.querySelector('ha-card'));
        } else if (swipeDistance < -minDistance) {
          this.dispatchClickEvent(this.shadowRoot.querySelector('.card-1-container').firstChild.shadowRoot.querySelector('ha-card'));
        }
      }
    } else {
      this.dispatchClickEvent(event.target.closest('.swipe-card'));
    }

    this.isSwiping = false;
  }

  dispatchClickEvent(element) {
    if (element) {
      const event = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      });
      element.dispatchEvent(event);
    }
  }

  set hass(hass) {
    this._hass = hass;
    this.shadowRoot.querySelectorAll('.card_1, .swipe-card, .card_2').forEach(card => {
      if (card) {
        card.hass = hass;
      }
    });
  }

  getCardSize() {
    return 3;
  }
}

customElements.define('swipe-button-card', SwipeButtonCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "swipe-button-card",
  name: "Swipe Button Card",
  description: "A custom card that allows swiping between multiple cards"
});
