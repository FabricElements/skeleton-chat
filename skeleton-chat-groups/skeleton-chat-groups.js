import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '@polymer/app-layout/app-header-layout/app-header-layout.js';
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import '@polymer/iron-scroll-threshold/iron-scroll-threshold.js';
import '@polymer/iron-list/iron-list.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '../skeleton-chat-groups-item/skeleton-chat-groups-item.js';
import '../icons.js';

const firebase = window.firebase;

/**
 * `skeleton-chat-groups`
 *
 *
 * @license Copyright (c) 2018 FabricElements. All rights reserved.
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class SkeletonChatGroups extends PolymerElement {
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
        position: relative;
        min-height: 200px;
        height: 100%;
        overflow: hidden;
        @apply --layout-vertical;
      }

      :host([fullbleed]) {
        @apply --layout-fit;
      }

      .container {
        @apply --layout-flex-auto;
        height: 100%;
        position: relative;
      }

      skeleton-chat-groups {
        padding-top: 1rem;
        @apply --layout-fit;
      }

      iron-scroll-threshold {
        @apply --skeleton-chat-groups;
      }

      iron-list {
        --iron-list-items-container: {
          @apply --skeleton-chat-groups-list;
        };
      }
    </style>
    <app-header shadow>
      <app-toolbar>
        <a href$="[[linkBack]]" tabindex="-1">
          <paper-icon-button icon="chat-icon:arrow-back" class="main-action"></paper-icon-button>
        </a>
        <div main-title>Chat</div>
      </app-toolbar>
    </app-header>
    <div class="container">
      <iron-scroll-threshold id="threshold" lower-threshold="0">
        <template is="dom-if" if="{{!empty}}" restamp="true">
          <iron-list items="[[list]]" max-physical-count="50" scroll-offset="100" scroll-target="threshold">
            <template>
              <skeleton-chat-groups-item theme$="[[theme]]" group$="[[item]]"></skeleton-chat-groups-item>
            </template>
          </iron-list>
        </template>
      </iron-scroll-threshold>
    </div>
`;
  }

  /**
   * @return {string}
   */
  static get is() {
    return 'skeleton-chat-groups';
  }

  /**
   * @return {object}
   */
  static get properties() {
    return {
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
        computed: '_computeEmpty(list, list.*)',
      },
      linkBack: {
        type: String,
        value: '/',
      },
    };
  }

  /**
   * connectedCallback
   */
  connectedCallback() {
    super.connectedCallback();
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this._getData(user.uid);
      }
    });
    this.addEventListener('list-changed', (e) => this._notifyResize(), true);
  }

  /**
   * Get data
   *
   * @param {string} uid
   * @private
   */
  _getData(uid) {
    this.set('list', []);
    if (!uid) return;
    const db = firebase.firestore();
    db.collection('chat').orderBy(`users.${uid}`).limit(100).onSnapshot((querySnapshot) => {
      let sortable = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const item = {
          id: doc.id,
          timestamp: data.updated ? Date.parse(data.updated) : Date.now(),
        };
        sortable.push(item);
      });
      sortable.sort((a, b) => {
        return b.timestamp - a.timestamp;
      });
      const finalList = Object.keys(sortable).map((key) => {
        return sortable[key].id;
      });
      this.set('list', finalList);
    }, (error) => {
      console.error(error);
      this._dispatchEvent('error', error);
    });
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

window.customElements.define(SkeletonChatGroups.is, SkeletonChatGroups);
