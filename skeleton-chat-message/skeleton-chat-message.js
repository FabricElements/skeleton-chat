/* eslint-disable new-cap */
import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import {GestureEventListeners} from '@polymer/polymer/lib/mixins/gesture-event-listeners.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/paper-item/paper-icon-item.js';
import '@polymer/paper-item/paper-item-body.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-image/iron-image.js';
// import * as moment from 'moment';
import moment from 'moment';
// import * as Autolinker from 'autolinker/dist/Autolinker.min.js';
import 'jquery';
import '@fancyapps/fancybox';
import '../icons.js';

/**
 * Import fancybox styles
 * @type {string}
 */
const cssId = 'fancybox-css';
if (!document.getElementById(cssId)) {
  let head = document.getElementsByTagName('head')[0];
  let link = document.createElement('link');
  link.id = cssId;
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = '/node_modules/@fancyapps/fancybox/dist/jquery.fancybox.min.css';
  link.media = 'all';
  head.appendChild(link);
}

/**
 * `skeleton-chat-message`
 *
 *
 * @license Copyright (c) 2018 FabricElements. All rights reserved.
 * @customElement
 * @polymer
 * @appliesMixin GestureEventListeners
 * @demo demo/index.html
 */
class SkeletonChatMessage extends GestureEventListeners(PolymerElement) {
  /**
   * @return {!HTMLTemplateElement}
   */
  static get template() {
    return html`
    <!--suppress CssInvalidPseudoSelector -->
    <!--suppress CssUnresolvedCustomProperty -->
    <!--suppress CssUnresolvedCustomPropertySet -->
    <style is="custom-style">
      :host {
        display: block;
        box-sizing: border-box;
        max-width: 100%;
        width: 100%;
        padding-bottom: 0.5rem;
        --skeleton-chat-message: {
        };
        @apply --skeleton-chat-message;

        /* Default mixin */
        --skeleton-chat-message-height: 32px;
        min-height: var(--skeleton-chat-message-height);
        --skeleton-chat-message-icon-color: var(--paper-grey-100);
        --skeleton-chat-message-icon-acronym: {
          background-color: var(--paper-grey-400);
        };
        /* Font styles */
        --skeleton-chat-message-font-family: 'Roboto', 'Noto', sans-serif;
        --skeleton-chat-message-font-size: 15px;
        --skeleton-chat-message-font-weight: 400;
        --skeleton-chat-message-font-color: var(--paper-grey-900);
        --skeleton-chat-message-owner-font-color: white;

        /* theme colors */
        --skeleton-chat-message-font-color-dark: var(--paper-grey-200);
        --skeleton-chat-message-owner-font-color-dark: var(--paper-grey-200);
        --skeleton-chat-link-color: var(--paper-blue-a700);
        --skeleton-chat-link-color-dark: var(--paper-blue-a100);
        --skeleton-chat-bubble-color: var(--paper-grey-100);
        --skeleton-chat-owner-bubble-color: var(--paper-blue-500);

        --skeleton-chat-bubble-color-dark: var(--paper-grey-900);
        --skeleton-chat-owner-bubble-color-dark: var(--paper-blue-700);

        /* Message images */
        --skeleton-chat-message-image-width: 18rem;
        --skeleton-chat-message-image-height: 13rem;
        --skeleton-chat-message-container-width: 18rem;
        --skeleton-chat-message-container-height: 13rem;
      }

      :host([theme="dark"]) {
        --skeleton-chat-bubble-color: var(--skeleton-chat-bubble-color-dark);
        --skeleton-chat-message-font-color: var(--skeleton-chat-message-font-color-dark);
        --skeleton-chat-message-owner-font-color: var(--skeleton-chat-message-owner-font-color-dark);
        --skeleton-chat-link-color: var(--skeleton-chat-link-color-dark);
      }

      :host,
      :host > * {
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
      }

      paper-icon-item {
        box-sizing: border-box;
        margin-bottom: 0.5rem;
        --paper-item-focused-before: {
          background-color: transparent;
        };
        --paper-item-selected: {
          background-color: transparent;
        };
        --paper-item-focused: {
          background-color: transparent;
        };
        --paper-icon-item: {
          @apply --layout-end;
        };
        --paper-item-icon-width: calc(var(--skeleton-chat-message-height) * 1.5);
        --paper-item-min-height: var(--skeleton-chat-message-height);
      }

      .icon-container {
        background-color: var(--skeleton-chat-message-icon-color);
        width: calc(var(--skeleton-chat-message-height) + (var(--skeleton-chat-message-font-size) / 4));
        height: calc(var(--skeleton-chat-message-height) + (var(--skeleton-chat-message-font-size) / 4));
        border-radius: 50%;
        overflow: hidden;
        position: relative;
        margin-top: 25px;
      }

      [owner] .icon-container {
        background-color: transparent !important;
      }

      #owner-img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        overflow: hidden;
        @apply --layout-fit;
        z-index: 2;
      }

      #bubble-container {
        @apply --layout-flex-auto;
        position: relative;
        display: block;
        max-width: calc(100% - var(--paper-item-icon-width));
      }

      .bubble {
        box-sizing: border-box;
        min-height: var(--skeleton-chat-message-height);
        background-color: var(--skeleton-chat-bubble-color);
        border-radius: calc(var(--skeleton-chat-message-height) / 2);
        color: white;
        display: inline-block;
        max-width: 100%;
        width: auto;
        transition: max-width ease 0.5s;
        box-shadow: inset 0 0 3px rgba(0, 0, 0, .02);
      }

      [owner] .bubble {
        background-color: var(--skeleton-chat-owner-bubble-color);
      }

      .bubble-content {
        position: relative;
        max-width: 100%;
      }

      .bubble-content[with-media] {
        max-width: var(--skeleton-chat-message-container-width);
      }

      .bubble-content[no-caption] {
        max-height: var(--skeleton-chat-message-container-height);
      }

      .bubble-text {
        min-width: 1rem;
        max-width: 100%;
        color: var(--skeleton-chat-message-font-color);
      }

      [owner] .bubble-text {
        color: var(--skeleton-chat-message-owner-font-color);
      }

      .bubble-text a {
        color: var(--skeleton-chat-link-color);
        text-decoration: underline;
      }
      [owner]{
        @apply --layout-horizontal-reverse;
      }
      
      [owner] .bubble-text a {
        color: inherit;
        text-decoration: underline;
      }

      [owner] #bubble-container {
        text-align: right;
      }

      .bubble-text > * {
        display: inline-block;
        word-wrap: break-word;
        box-sizing: border-box;
        max-width: 100%;
        -webkit-font-smoothing: antialiased;
        line-height: calc(var(--skeleton-chat-message-font-size) * 1.4);
        font-size: var(--skeleton-chat-message-font-size);
        font-weight: var(--skeleton-chat-message-font-weight);
        padding: calc(calc(var(--skeleton-chat-message-height) - var(--skeleton-chat-message-font-size)) / 2) calc(var(--skeleton-chat-message-height) / 2);
      }

      .time {
        padding-top: 3px;
        margin-bottom: 5px;
        @apply --paper-font-caption;
        color: var(--paper-grey-500);
        @apply --layout-horizontal;
        @apply --layout-justified;
      }
      
      .time[type-media="image/jpeg"]{
        width: 100%;
        max-width: var(--skeleton-chat-message-container-width);
      }
      
      [owner] .time[type-media="image/jpeg"]{
        float: right;
      }

      [owner] paper-icon-item {
        text-align: right;
      }

      [owner] #owner-img {
        // display: none !important;
      }

      [hidden] {
        display: none;
      }

      [owner] .text-original[hidden] {
        display: block !important;
      }

      [owner] .text-translation {
        display: none !important;
      }

      .icon-option {
        display: block;
        position: absolute;
        top: 5px;
        bottom: 5px;
        left: 5px;
        right: 5px;
        height: auto;
        width: auto;
      }

      #acronym {
        @apply --paper-font-subhead;
        @apply --paper-font-common-nowrap;
        line-height: var(--skeleton-chat-message-height);
        text-transform: uppercase;
        text-align: center;
        @apply --layout-fit;
        z-index: 1;
        @apply --skeleton-chat-message-icon-acronym;
      }

      .messageImg {
        border-radius: 1rem;
        height: var(--skeleton-chat-message-image-height);
        width: var(--skeleton-chat-message-image-width);
        background-color: var(--paper-grey-200);
        cursor: pointer;
      }

      .messageImg[with-caption] {
        border-radius: 1rem 1rem 0 0;
      }
    </style>

    <paper-icon-item owner$="[[isOwner]]">
      <div class="icon-container" slot="item-icon">
          <iron-image fade="" sizing="cover" src$="[[image]]" hidden$="[[!image]]" id="owner-img"></iron-image>
          <div id="acronym" hidden$="[[!acronym]]">
            [[acronym]]
          </div>
          <iron-icon icon$="chat-icon:[[icon]]" class="icon-option" hidden$="[[!icon]]"></iron-icon>
      </div>
      <div id="bubble-container">
        <div class="time" hidden$="[[!time]]" secondary="" type-media$="[[isImageMedia]]">
          <div class="user-name-string">[[message.user.name]]</div>
          <div class="time-string">[[_getFullTime(time)]]</div>
        </div>
        <div class="bubble" on-down="_bubbleDown" on-up="_bubbleUp">
          <div class="bubble-content" with-media$="[[message.media]]" no-caption$="[[!originalText]]">
            <template is="dom-if" if="[[message.media.url]]">
              <template is="dom-if" if="[[isImageMedia]]">
                <iron-image class="messageImg" fade="" preload="" sizing="cover" with-caption$="[[originalText]]" src="[[message.media.url]]" on-tap="_showFancybox"></iron-image>
              </template>
            </template>
            <template is="dom-if" if="[[originalText]]">
              <div class="bubble-text">
                <div class="text-original" hidden$="[[!showOriginal]]" inner-h-t-m-l="[[originalText]]">
                  [[message.text]]
                </div>
                <div class="text-translation" hidden$="[[showOriginal]]" inner-h-t-m-l="[[text]]">[[message.text]]</div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </paper-icon-item>
`;
  }

  /**
   * @return {object}
   */
  static get properties() {
    return {
      /**
       * A value to check if the user is signed in.
       */
      signedIn: {
        type: Boolean,
        value: false,
      },

      /**
       * The user Object.
       */
      user: {
        type: Object,
        value: {},
      },

      /**
       * The component theme.
       */
      theme: {
        type: String,
        value: 'light',
      },

      /**
       * The moment when the user sends the message.
       */
      time: {
        type: String,
        value: null,
        readOnly: true,
      },

      /**
       * The user is the message owner.
       */
      isOwner: {
        type: Boolean,
        value: false,
        readOnly: true,
      },

      /**
       * The user is the message owner.
       */
      showOriginal: {
        type: Boolean,
        value: false,
        readOnly: true,
      },

      /**
       * The message owner is anonymous
       */
      isAnonymous: {
        type: Boolean,
        value: true,
        readOnly: true,
      },

      /**
       * The message object
       */
      message: {
        type: Object,
        value: {
          created: null,
          media: null,
          isAnonymous: true,
          text: '...',
          type: 'default',
          uid: null,
          updated: null,
          user: {
            avatar: null,
            name: null,
          },
        },
        observer: '_messageChange',
      },

      /**
       * Text
       */
      text: {
        type: String,
        value: null,
        readOnly: true,
        notify: true,
      },

      /**
       * Original text
       */
      originalText: {
        type: String,
        value: null,
        readOnly: true,
        notify: true,
      },

      /**
       * User name acronym
       */
      acronym: {
        type: String,
        value: null,
        readOnly: true,
        notify: true,
      },

      /**
       * Image url
       */
      image: {
        type: String,
        value: null,
        readOnly: true,
        notify: true,
      },

      /**
       * Time pressed
       */
      timePressed: {
        type: Number,
        value: 0,
        readOnly: true,
        notify: true,
        observer: '_timePressedObserver',
      },

      /**
       *
       */
      timer: {
        type: Object,
        value: null,
        readOnly: true,
        notify: true,
      },

      /**
       * Icon
       */
      icon: {
        type: String,
        value: null,
        readOnly: true,
        computed: '_computeIcon(image, acronym)',
      },
      /**
       * The media is an image
       */
      isImageMedia: {
        type: Boolean,
        value: false,
        readOnly: true,
      },
    };
  }

  /**
   * @return {array}
   */
  static get observers() {
    return [
      '_checkBasics(signedIn, user.*, message)',
    ];
  }

  /**
   * Check if is message basics
   *
   * @param {boolean} signedIn
   * @param {*} userData
   * @param {object} message
   * @return {boolean}
   * @private
   */
  _checkBasics(signedIn, userData, message) {
    // Set default values
    this._setIsOwner(false);
    this._setIsAnonymous(true);

    /**
     * Return if can't handle the basics
     */
    if (!message) {
      return false;
    }

    /**
     * Return if the message has no user
     */
    if (!message.uid) {
      return false;
    }
    /**
     * Check if is an anonymous user
     */
    this._setIsAnonymous(!!message.isAnonymous);

    /**
     * Check if the user is signed in
     */
    if (!signedIn) {
      return;
    }

    /**
     * Check if is the message owner
     */
    this._setIsOwner(this.user.uid === message.uid);
  }

  /**
   * Check message change
   *
   * @param {object} message
   * @private
   */
  _messageChange(message) {
    if (!message) return;

    let baseMessage = message.text;

    if (message.text && message.locales) {
      baseMessage = this._returnFinalMessage(message.text, message.locales);
    }

    const originalText = this._extractHyperlinks(message.text);
    this._setOriginalText(originalText);
    let translatedMessage = this._extractHyperlinks(baseMessage);
    this._setText(translatedMessage);

    if (message.media) {
      if (message.media.type.match(/image\/(gif|bmp|jpeg|png)$/i)) {
        this._setIsImageMedia(message.media.type);
      }
    }

    if (message.created) {
      this._setTime(message.created);
    } else {
      this._setTime(Date.now());
    }
    if (message.user) {
      this._messageUser(message.user);
    }
  }

  /**
   * User specific data
   *
   * @param {object} user
   * @private
   */
  _messageUser(user) {
    /**
     * Set Image
     */
    const image = user.avatar ? user.avatar : null;
    this._setImage(image);

    const name = user.name ? user.name : '';
    const acronym = name ? this._acronym(name) : null;
    this._setAcronym(acronym);
  }

  /**
   * Set final message text
   *
   * @param {string} text
   * @param {object} locales
   * @return {string|null}
   * @private
   */
  _returnFinalMessage(text, locales) {
    const language = this._getBrowserLanguage();
    return locales[language] ? locales[language] : text;
  }

  /**
   * Return browser language
   *
   * @return {string}
   * @private
   */
  _getBrowserLanguage() {
    const language = (navigator.language || navigator.userLanguage) ?
      navigator.language : navigator.userLanguage;
    const separator = language.indexOf('-');
// eslint-disable-next-line max-len
    return language.substring(0, separator !== -1 ? separator : language.length);
  }

  /**
   * Returns an acronym from string
   *
   * @param {string} text
   * @return {string}
   * @private
   */
  _acronym(text) {
    const matches = text.match(/\b(\w)/g);
    const finalMatches = matches.join('');
    return finalMatches.substring(0, 2);
  }

  /**
   * Bubble was pressed down
   *
   * @param {object} event
   * @private
   */
  _bubbleDown(event) {
    this._pressTimeOut();
  }

  /**
   * Bubble was released
   *
   * @param {object} event
   * @private
   */
  _bubbleUp(event) {
    window.clearInterval(this.timer);
    this._setTimePressed(0);
  }

  /**
   * The time that the the bubble has been pressed in seconds
   *
   * @param {number} time
   * @private
   */
  _timePressedObserver(time) {
    this._setShowOriginal(this.isOwner);
    if (time >= 1) {
      this._setShowOriginal(true);
    }
  }

  /**
   * Pressed time out
   *
   * @private
   */
  _pressTimeOut() {
    let time = 1;
    const timer = window.setInterval(() => {
      this._setTimePressed(time++);
    }, 1000);
    this._setTimer(timer);
  }

  /**
   * Compute icon
   *
   * @param {string} image
   * @param {string} acronym
   * @return {string}
   * @private
   */
  _computeIcon(image, acronym) {
    return !image && !acronym ? 'person' : null;
  }

  /**
   * Return real time
   * @param {string|null} time
   * @return {*}
   * @private
   */
  _getFullTime(time) {
    if (!time) return;
    // Check if time is bigger than 24h from now
    if (moment().diff(time, 'days') > 0) {
      return moment(time).format('DD/MM/YYYY h:mm a');
    } else {
      return moment(time).fromNow();
    }
  }

  /**
   * Extracts links from the message
   *
   * @param {string} text
   * @return {string}
   * @private
   */
  _extractHyperlinks(text) {
    if (!text) return '';
    // if (typeof Autolinker === 'function') {
    //   // const init = new Autolinker();
    //   // return init.link(text);
    // }
    return text;
  }

  /**
   * Shows FancyBox 3 modal.
   * @private
   */
  _showFancybox() {
    $.fancybox.open(
      {
        src: this.message.media.url, // Source of the content
        type: 'image', // Content type: image|inline|ajax|iframe|html (optional)
        opts: {}, // Object containing item options (optional)
      });
  }
}

window.customElements.define('skeleton-chat-message', SkeletonChatMessage);
