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
import '@fabricelements/skeleton-player/skeleton-player.js';
import '../icons.js';

/**
 * Import fancybox styles
 * @type {string}
 */
const cssId = 'fancybox-css';
if (!document.getElementById(cssId)) {
  const head = document.getElementsByTagName('head')[0];
  const link = document.createElement('link');
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
        border: 2px solid transparent;
      }

      [lider] .icon-container {
        border: 2px solid var(--paper-blue-a400);
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
        /*@apply --layout-flex-auto;*/
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
        min-width: 10rem;
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
      
      .audio-player-container{
        @apply --layout-horizontal;
      }
      
      skeleton-audio{
        @apply --layout-flex-auto;
        flex-shrink: 0;
        --skeleton-player-slider-knob-color: transparent;
        --skeleton-player-slider-active-color: var(--paper-blue-700);
        --skeleton-player-slider-bar-color: var(--paper-gey-300);
        --paper-icon-button: {
          color: var(--paper-blue-700);
        };
      }
      
      [owner] skeleton-audio{
        --skeleton-player-slider-active-color: white;
        --skeleton-player-slider-container-color: var(--paper-blue-600);
        --paper-icon-button: {
          color: white;
        };
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
        --paper-item-icon:{
          @apply --layout-end-justified;
        };
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
      
      .time[type-media="image/jpeg"],
      .time[file-type]{
        width: 100%;
        max-width: var(--skeleton-chat-message-container-width);
      }
      
      [owner] .time[type-media="image/jpeg"],
      [owner] .time[file-type]{
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
        align-items: center;
        background-color: var(--skeleton-chat-message-icon-acronym_-_background-color);
        display: flex;
        height: 35.75px;
        justify-content: center;
        width: 35.75px;
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

      .player-progress{
        color: var(--paper-grey-500);
        font-size: 12px;
        text-align: center;
        flex-grow: 0;
        width: 50px;
        overflow: hidden;
        line-height: 50px;
      }

      .bubble-file{
        background-color: var(--paper-grey-300);
        margin: 15px 15px 5px 15px;
        padding: 10px;
        border-radius: 5px;
        cursor: pointer;
      }

      .bubble-file a {
        text-decoration: none;
        align-items: center;
        display: flex;
      }

      .file-icon {
        color: var(--paper-blue-500);
        padding: .2rem;
        --iron-icon-width: 2rem;
        --iron-icon-height: 2rem;
      }

      .bubble-file-name {
        color: var(--paper-grey-900);;
        direction: rtl;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 15rem;
      }

      .bubble-file-size{
        margin: 0 15px 15px 15px;
        color: var(--paper-grey-500);
        font-size: 12px;
        text-align: right;
      }
      
      [owner] .player-progress{
        color: white;
      }

      [owner] .bubble-file{
        background-color: var(--paper-blue-600);
      }
      
      [owner] .file-icon{
        --iron-icon-fill-color: white;
       }
       
      [owner] .bubble-file .bubble-file-name{
        color: white;
      }
      
      [owner] .bubble-file-size{
       color: white;
      }
    </style>

    <paper-icon-item owner$="[[isOwner]]" lider$="[[isChatOwner]]" type-media$="[[message.media.type]]">
      <div class="icon-container" slot="item-icon">
          <iron-image fade sizing="cover" src$="[[image]]" hidden$="[[!image]]" id="owner-img"></iron-image>
          <div id="acronym" hidden$="[[!acronym]]">
            <span>[[acronym]]</span>
          </div>
          <iron-icon icon$="chat-icon:[[icon]]" class="icon-option" hidden$="[[!icon]]"></iron-icon>
      </div>
      <div id="bubble-container">
        <div class="time" hidden$="[[!time]]" secondary type-media$="[[isImageMedia]]" file-type$="[[isFileType]]">
          <div class="user-name-string">[[message.user.name]]</div>
          <div class="time-string">[[_getFullTime(time)]]</div>
        </div>
        <div class="bubble" on-down="_bubbleDown" on-up="_bubbleUp">
          <div class="bubble-content" with-media$="[[message.media]]" no-caption$="[[!originalText]]">
            <template is="dom-if" if="[[message.media.url]]" restamp="true">
              <template is="dom-if" if="[[isImageMedia]]" restamp="true">
                <iron-image class="messageImg" fade preload sizing="cover" with-caption$="[[message.text]]" src="[[message.media.url]]" on-tap="_showFancybox"></iron-image>
              </template>
            </template>
            <template is="dom-if" if="[[isFileType]]" restamp="true">
              <div class="bubble-file">
                <a href$="[[message.media.url]]" target="_blank">
                  <iron-icon class="file-icon" icon="chat-icon:attach-file"></iron-icon>
                  <p class="bubble-file-name">[[message.media.url]]</p>
                </a>
              </div>
              <div class="bubble-file-size">pdf · 2 mb</div>
            </template>
            <template is="dom-if" if="[[isAudioType]]" restamp="true">
              <div class="audio-player-container">
                <skeleton-audio src$="[[message.media.url]]" controls preload time-left="{{playerProgress}}"></skeleton-audio>
                <span class="player-progress">{{_formatPlayerTime(playerProgress)}}</span>
              </div>
            </template>
            <template is="dom-if" if="[[originalText]]" restamp="true">
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
      /**
       * The media is a file
       */
      isFileType: {
        type: Boolean,
        value: false,
      },
      /**
       * The media is an audio file
       */
      isAudioType: {
        type: Boolean,
        value: false,
      },
      playerProgress: {
        type: String,
        value: null,
      },
      group: {
        type: String,
        value: null,
      },
      ownerUid: {
        type: String,
        value: null,
      },
      isChatOwner: {
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
    this._setIsChatOwner(false);
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

    /**
     * Check if is the chat owner
     */
    this._setIsChatOwner(message.uid === this.ownerUid);
  }

  /**
   * Player time format
   * @param {number} seconds
   * @return {*}
   * @private
   */
  _formatPlayerTime(seconds) {
    // https://jsfiddle.net/okachynskyy/4ehb0L5p/
    // https://stackoverflow.com/questions/5539028/converting-seconds-into-hhmmss
    return this._secondsToHms(seconds);
  }

  /**
   * Seconds to Hms
   * @param {number} d
   * @return {string}
   * @private
   */
  _secondsToHms(d) {
    d = Number(d);

    // let h = Math.floor(d / 3600);
    const m = Math.floor(d % 3600 / 60);
    const s = Math.floor(d % 3600 % 60);

    return ('0' + m).slice(-2) + ':' + ('0' + s).slice(-2);
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
    const translatedMessage = this._extractHyperlinks(baseMessage);
    this._setText(translatedMessage);
    if (message.media && message.media.type) {
      if (message.media.type.match(/image\/(gif|bmp|jpeg|png)$/i)) {
        this._setIsImageMedia(message.media.type);
      } else if (message.media.type.match(/audio\/(ogg|webm|wav)$/i)) {
        this.isAudioType = true;
      } else {
        this.isFileType = true;
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
    $.fancybox.open({
      src: this.message.media.url, // Source of the content
      type: 'image', // Content type: image|inline|ajax|iframe|html (optional)
      opts: {}, // Object containing item options (optional)
    });
  }
}

window.customElements.define('skeleton-chat-message', SkeletonChatMessage);
