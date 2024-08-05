class ChatbotCard extends HTMLElement {
  static get version() {
    return 'v0.7.0';
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  async setConfig(config) {
    this.config = {
      custom_css: {},
      ...config
    };

    this.cardId = `chatbot-card-${Math.random().toString(36).substr(2, 9)}`;

    await this.render();
  }

  async render() {
    const styles = `
      :host {
        /* Card Variables */
        --card-background-color: transparent;
        --assistant-width: 50;
        --assistant-scaler: calc(var(--assistant-width) / 200);
        --assistant-color: var(--primary-text-color, #3D3E45);
        --assistant-background-color: transparent;
      }
      ha-card {
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        padding: 16px;
        width: 100%
        height: 100%;
        background-color: var(--card-background-color);
      }
      #${this.cardId} .assistant-container {
        flex: 1;
        margin: auto;
        height: calc(200px * var(--assistant-scaler));
        width: calc(200px * var(--assistant-scaler));
        animation: up-down 7.5s infinite ease-in-out;
        background-color: var(--assistant-background-color);
      }
      #${this.cardId} .assistant-container #assistant {
        margin: auto;
        position: absolute;
        bottom: 0;
        left: 0;
        top: 0;
        right: 0;
        width: calc(150px * var(--assistant-scaler));
        height: calc(85px * var(--assistant-scaler));
        border: calc(12px * var(--assistant-scaler)) solid var(--assistant-color);
        border-radius: 5rem;
      }
      #${this.cardId} .assistant-container #assistant-corner {
        margin: auto;
        position: absolute;
        bottom: 0;
        left: 0;
        top: 0;
        right: 0;
        top: calc(105px * var(--assistant-scaler));
        left: calc(-65px * var(--assistant-scaler));
        width: 0;
        height: 0;
        border-left: calc(20px * var(--assistant-scaler)) solid transparent;
        border-right: calc(20px * var(--assistant-scaler)) solid transparent;
        border-top: calc(25px * var(--assistant-scaler)) solid var(--assistant-color);
        transform: rotate(140deg);
      }
      #${this.cardId} .assistant-container #assistant-antenna {
        margin: auto;
        position: absolute;
        bottom: 0;
        left: 0;
        top: 0;
        right: 0;
        top: calc(-125px * var(--assistant-scaler));
        height: calc(20px * var(--assistant-scaler));
        width: calc(10px * var(--assistant-scaler));
        background-color: var(--assistant-color);
        animation: antenna-appear 7.5s infinite ease-in-out;
      }
      #${this.cardId} .assistant-container #assistant-antenna #assistant-beam {
        position: absolute;
        top: calc(-12.5px * var(--assistant-scaler));
        left: calc(-5px * var(--assistant-scaler));
        height: calc(20px * var(--assistant-scaler));
        width: calc(20px * var(--assistant-scaler));
        border-radius: 50%;
        background-color: var(--assistant-color);
        animation: beam-appear 7.5s infinite ease-in-out;
      }
      #${this.cardId} .assistant-container #assistant-antenna #assistant-beam-pulsar {
        position: absolute;
        top: calc(-12.5px * var(--assistant-scaler));
        left: calc(-5px * var(--assistant-scaler));
        height: calc(20px * var(--assistant-scaler));
        width: calc(20px * var(--assistant-scaler));
        border-radius: 50%;
        background-color: var(--assistant-color);
        animation: beam-pulsar-appear 7.5s infinite ease-in-out;
      }
      #${this.cardId} .assistant-container .assistant-dot {
        height: calc(17.5px * var(--assistant-scaler));
        width: calc(17.5px * var(--assistant-scaler));
        margin: auto;
        position: absolute;
        bottom: 0;
        left: 0;
        top: 0;
        right: 0;
        left: calc(-65px * var(--assistant-scaler));
        background-color: var(--assistant-color);
        border-radius: 50%;
        animation: pulse-outer 7.5s infinite ease-in-out;
      }
      #${this.cardId} .assistant-container .assistant-dot:nth-child(2) {
        left: 0;
        animation: pulse-inner 7.5s infinite ease-in-out;
        animation-delay: 0.2s;
      }
      #${this.cardId} .assistant-container .assistant-dot:nth-child(3) {
        left: calc(65px * var(--assistant-scaler));
        animation: pulse-outer 7.5s infinite ease-in-out;
        animation-delay: 0.4s;
      }
      @keyframes pulse-inner {
        0% { transform: scale(1); }
        7.5% { transform: scale(1.5); }
        15% { transform: scale(1); }
        22.5% { transform: scale(1.5); }
        30% { transform: scale(1); }
        37.5% { transform: scale(1.5); }
        45% { top: 0; transform: scale(1); height: calc(17.5px * var(--assistant-scaler)); border-bottom-left-radius: 50%; border-bottom-right-radius: 50%; transform: rotate(-370deg); }
        50% { top: calc(22.5px * var(--assistant-scaler)); height: calc(10px * var(--assistant-scaler)); border-top-left-radius: 50%; border-top-right-radius: 50%; border-bottom-left-radius: 3rem; border-bottom-right-radius: 3rem; transform: rotate(10deg); }
        55% { transform: rotate(-10deg); }
        60% { transform: rotate(10deg); }
        65% { transform: rotate(-10deg); }
        85% { top: calc(22.5px * var(--assistant-scaler)); height: calc(10px * var(--assistant-scaler)); border-top-left-radius: 50%; border-top-right-radius: 50%; border-bottom-left-radius: 3rem; border-bottom-right-radius: 3rem; transform: rotate(0deg); }
        92.5% { top: calc(22.5px * var(--assistant-scaler)); height: calc(10px * var(--assistant-scaler)); border-top-left-radius: 50%; border-top-right-radius: 50%; border-bottom-left-radius: 2.5rem; border-bottom-right-radius: 2.5rem; transform: rotate(0deg); }
        100% { top: 0; height: calc(17.5px * var(--assistant-scaler)); border-radius: 50%; transform: rotate(-360deg); }
      }
      @keyframes pulse-outer {
        0% { transform: scale(1); }
        7.5% { transform: scale(1.5); }
        15% { transform: scale(1);  }
        22.5% { transform: scale(1.5); }
        30% { transform: scale(1); }
        37.5% {transform: scale(1.5); }
        45% { transform: scale(1); height: calc(17.5px * var(--assistant-scaler)); }
        55% { tranform: scale(1); height: calc(5px * var(--assistant-scaler)); }
        60% { height: calc(17.5px * var(--assistant-scaler)); }
        75% { height: calc(17.5px * var(--assistant-scaler)); }
        80% { tranform: scale(1); height: calc(5px * var(--assistant-scaler)); }
        85% { height: calc(17.5px * var(--assistant-scaler)); }
        100% { height: calc(17.5px * var(--assistant-scaler)); }
      }
      @keyframes antenna-appear {
        0% { visibility: hidden; top: calc(-100px * var(--assistant-scaler)); height: 0; } 
        50% { visibility: hidden; top: calc(-100px * var(--assistant-scaler)); height: 0; }
        55% { visibility: visible; top: calc(-125px * var(--assistant-scaler)); height: calc(20px * var(--assistant-scaler)); }
        95% { visibility: visible; top: calc(-125px * var(--assistant-scaler)); height: calc(20px * var(--assistant-scaler)); }
        100% { top: calc(-100px * var(--assistant-scaler)); height: 0; }
      }
      @keyframes beam-appear {
        0% { visibility: hidden; top: calc(-12.5px * var(--assistant-scaler)); height: 0; }
        50% { visibility: hidden; top: calc(-12.5px * var(--assistant-scaler)); height: 0; }
        55% { visibility: visible; top: calc(-12.5px * var(--assistant-scaler)); height: calc(20px * var(--assistant-scaler)); width: calc(20px * var(--assistant-scaler)); }
        100% { visibility: visible; top: calc(-12.5px * var(--assistant-scaler)); height: calc(20px * var(--assistant-scaler)); width: calc(20px * var(--assistant-scaler)); }
      }
      @keyframes beam-pulsar-appear {
        0% { visibility: hidden; top: calc(-12.5px * var(--assistant-scaler)); height: 0; }
        50% { visibility: hidden; top: calc(-12.5px * var(--assistant-scaler)); height: 0; }
        55% { visibility: visible; top: calc(-12.5px * var(--assistant-scaler)); left: calc(-5px * var(--assistant-scaler)); height: calc(20px * var(--assistant-scaler)); width: cal(20px * var(--assistant-scaler)); opacity: 1; }
        65% { top: calc(-25px * var(--assistant-scaler)); left: calc(-15px * var(--assistant-scaler)); height: calc(40px * var(--assistant-scaler)); width: calc(40px * var(--assistant-scaler)); opacity: 0; visibility: visible; }
        74% { visibility: hidden; opacity: 0; }
        75% { visibility: visible; top: calc(-12.5px * var(--assistant-scaler)); left: calc(-5px * var(--assistant-scaler)); height: calc(20px * var(--assistant-scaler)); width: calc(20px * var(--assistant-scaler)); opacity: 1; }
        85% { top: calc(-25px * var(--assistant-scaler)); left: calc(-15px * var(--assistant-scaler)); height: calc(40px * var(--assistant-scaler)); width: calc(40px * var(--assistant-scaler)); opacity: 0; visibility: visible; }
        94% { visibility: hidden; opacity: 0; }
        100% { visibility: hidden; opacity: 0; }
      }
      @keyframes up-down {
        0% { transform: translate(0); }
        2.5% { transform: translate(0, 2%); }
        25% { transform: translate(0); }
        37.5% { transform: translate(0, 2%); }
        50% { transform: translate(0); }
        62.5% { transform: translate(0, 2%); }
        75% { transform: translate(0); }
        87.5% { transform: translate(0, 2%); }
        100% { transform: translate(0); }
      }
    `;

    let html = `
      <ha-card>
        <div id="${this.cardId}">
          <div class="assistant-container">
            <div id="assistant">
              <div class="assistant-dot"></div>
              <div class="assistant-dot"></div>
              <div class="assistant-dot"></div>
            </div>
            <div id="assistant-corner"></div>
            <div id="assistant-antenna">
              <div id="assistant-beam"></div>
              <div id="assistant-beam-pulsar"></div>
            </div>
          </div>
        </div>
      </ha-card>
    `;

    this.shadowRoot.innerHTML = `<style>${styles}</style>${html}`;

    this.applyCustomStyles();

    const card = this.shadowRoot.querySelector('ha-card');
    card.addEventListener('click', () => {
      this._hass.callService('conversation', 'process', { text: 'open chat' });
    });
  }

  applyCustomStyles() {
    const customStyles = this.config.custom_css;
    Object.keys(customStyles).forEach(variable => {
      this.shadowRoot.host.style.setProperty(variable, customStyles[variable]);
    });
  }

  set hass(hass) {
    this._hass = hass;
  }

  getCardSize() {
    return 3;
  }
}

customElements.define('chatbot-card', ChatbotCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "chatbot-card",
  name: "Chatbot Card",
  description: "A custom card for chatbot interface"
});
