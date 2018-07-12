import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-scroll-threshold/iron-scroll-threshold.js';
import '@polymer/iron-list/iron-list.js';
import { IronResizableBehavior } from '@polymer/iron-resizable-behavior/iron-resizable-behavior.js';
import '../skeleton-chat-message/skeleton-chat-message.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import 'firebase/firebase-firestore.js';
/**
 * `skeleton-chat-messages`
 *
 *
 * @license Copyright (c) 2018 FabricElements. All rights reserved.
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class SkeletonChatMessages extends mixinBehaviors([
  IronResizableBehavior,
], PolymerElement) {
  static get template() {
    return html`
    <!--suppress CssInvalidPseudoSelector -->
    <!--suppress CssUnresolvedCustomProperty -->
    <!--suppress CssUnresolvedCustomPropertySet -->
    <style is="custom-style">
      :host {
        display: block;
        position: relative;
        z-index: 0;
        @apply --layout-vertical;
        @apply --layout-flex-auto;
        background-color: var(--skeleton-chat-bg-color, #ffffff);
      }

      :host([theme="dark"]) {
        background-color: var(--skeleton-chat-bg-color-dark, var(--paper-grey-800));
      }

      :host > * {
        width: 100%;
        max-width: 100%;
        box-sizing: border-box;
      }

      iron-scroll-threshold {
        @apply --layout-flex-auto;
        bottom: var(--skeleton-chat-box-bottom);
        box-sizing: border-box;
        padding-top: 1rem;
        /*padding-bottom: 1rem;*/
        @apply --skeleton-chat-messages;
      }

      iron-list {
        --iron-list-items-container: {
          @apply --skeleton-chat-messages-list;
        };
      }

      #input-box {
        background-color: var(--skeleton-chat-input-box-color, var(--paper-grey-50));
        @apply --skeleton-chat-messages-input;
      }

      :host([theme="dark"]) #input-box {
        background-color: var(--skeleton-chat-input-box-color-dark, var(--paper-grey-800));
      }
    </style>

    <iron-scroll-threshold id="threshold" lower-threshold="0">
      <template is="dom-if" if="{{!empty}}" restamp="true">
        <iron-list items="[[list]]" as="message" max-physical-count="50" scroll-offset="100" scroll-target="threshold" on-iron-resize="_scrollToLast">
          <template>
            <skeleton-chat-message theme\$="[[theme]]" message="[[message]]" user="[[user]]" signed-in\$="[[signedIn]]"></skeleton-chat-message>
          </template>
        </iron-list>
      </template>
    </iron-scroll-threshold>
    <div id="input-box">
      <slot></slot>
    </div>
`;
  }

  /**
   * @return {string}
   */
  static get is() {
    return 'skeleton-chat-messages';
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
       * List of messages
       */
      list: {
        type: Array,
        notify: true,
      },
      /**
       * List is empty
       */
      empty: {
        type: Boolean,
        value: false,
        notify: true,
        computed: '_computeEmpty(list, list.*)',
      },
      /**
       * Group id
       */
      group: {
        type: String,
        value: null,
      },
    };
  }

  /**
   * connectedCallback
   */
  connectedCallback() {
    super.connectedCallback();
    firebase.auth().onAuthStateChanged((user) => {
      this.user = user;
    });
    this.addEventListener('list-changed', (e) => this._notifyResize(), true);
    this.addEventListener('iron-resize', (e) => this._scrollToLast(), true);
  }

  /**
   * @return {array}
   */
  static get observers() {
    return [
      '_getData(user, group)',
    ];
  }

  /**
   * Get data
   *
   * @param {object} user
   * @param {string} group
   * @private
   */
  _getData(user, group) {
    this.set('list', []);
    if (!user || !group) return;
    const chatRef = `chat/${group}/messages`;
    const db = firebase.firestore();
    db.collection(chatRef)
      .orderBy('created', 'desc')
      .limit(200)
      .onSnapshot((querySnapshot) => {
        let base = [];
        querySnapshot.forEach((doc) => {
          base.unshift(doc.data());
        });
        this.set('list', base);
      }, (err) => {
        console.error(err);
        this._dispatchEvent('error', err);
        this.set('list', []);
      });
  }

  /**
   * Scroll the list to last  item
   *
   * @private
   */
  _scrollToLast() {
    const list = this.shadowRoot.querySelector('iron-list');
    if (!list) return;
    list.scrollToIndex(this.list.length - 1);
  }

  /**
   * Notify iron-list that the list has been updated
   *
   * @private
   */
  _notifyResize() {
    const list = this.shadowRoot.querySelector('iron-list');
    if (!list) return;
    list.fire('iron-resize');
  }

  /**
   * Compute empty
   *
   * @param {Array} list
   * @return {boolean}
   * @private
   */
  _computeEmpty(list) {
    return list.length < 1;
  }

  /**
   * Dispatch event
   *
   * @param {string} event
   * @param  {string} detail
   * @private
   */
  _dispatchEvent(event, detail) {
    this.dispatchEvent(new CustomEvent(event, {
      detail: detail,
      bubbles: true,
      composed: true,
    }));
  }
}

window.customElements.define(SkeletonChatMessages.is, SkeletonChatMessages);