import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import '@polymer/paper-menu-button/paper-menu-button.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '../chat-mixin/chat-mixin.js';
import '../skeleton-chat-info/skeleton-chat-info.js';
import '../skeleton-chat-messages/skeleton-chat-messages.js';
import '../skeleton-chat-input/skeleton-chat-input.js';
import '../icons.js';

const firebase = window.firebase;

/**
 * `skeleton-chat-box`
 *
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class SkeletonChatBox extends Fabric.ChatMixin(PolymerElement) {
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
        background-color: var(--skeleton-chat-bg-color, #ffffff);
        @apply --layout-vertical;
        @apply --skeleton-chat-box;
      }

      :host([fullbleed]) {
        @apply --layout-fit;
      }

      app-header {
        z-index: 1;
      }

      app-toolbar > * {
        margin-left: .5rem;
      }

      app-toolbar > *:first-child {
        margin-left: .5rem;
      }

      .image-container {
        background-color: var(--paper-grey-100);
        height: 2.5rem;
        width: 2.5rem;
        @apply --layout-vertical;
        @apply --layout-center-center;
        border-radius: 50%;
        overflow: hidden;
        position: relative;
      }

      iron-image {
        display: block;
        border-radius: 50%;
        overflow: hidden;
        @apply --layout-fit;
        z-index: 2;
      }

      .image-container iron-image {
        /*@apply --layout-flex-auto;*/
        /*height: 2.5rem;*/
        /*width: 2.5rem;*/
        border-radius: 50%;
        overflow: hidden;
      }

      .image-container iron-icon {
        position: relative;
        z-index: 1;
      }

      skeleton-chat-messages {
        @apply --layout-flex-auto;
        --skeleton-chat-box-bottom: 78px;
      }

      app-header {
        background: var(--paper-grey-50);
      }

      #status {
        background-color: var(--paper-grey-200);
        display: block;
        height: 1rem;
        width: 1rem;
        border-radius: 50%;
      }

      #status[online] {
        background-color: var(--paper-green-a400);
      }

      :host([theme="dark"]) {
        background-color: var(--skeleton-chat-bg-color-dark, var(--paper-grey-800));
      }

      [hidden] {
        display: none;
      }
    </style>
    <skeleton-chat-info group$="[[group]]" info="{{info}}"></skeleton-chat-info>
    <app-header shadow>
      <app-toolbar>
        <a href="/chat" tabindex="-1">
          <paper-icon-button icon="chat-icon:close" class="main-action"></paper-icon-button>
        </a>
        <div class="image-container">
          <iron-image fade sizing="cover" src$="[[info.image]]" hidden$="[[!info.image]]"></iron-image>
          <iron-icon icon$="chat-icon:[[icon]]" hidden$="[[info.image]]"></iron-icon>
        </div>
        <div main-title class="title">[[info.title]]</div>
        <div id="status" online></div>

        <paper-menu-button vertical-align="top" vertical-offset="70" horizontal-align="right">
          <paper-icon-button icon="chat-icon:more-vert" slot="dropdown-trigger"></paper-icon-button>
          <paper-listbox slot="dropdown-content">
            <paper-icon-item on-tap="_leaveChat">
              <iron-icon icon="chat-icon:cancel" slot="item-icon"></iron-icon>
              <paper-item-body>
                Exit chat
              </paper-item-body>
            </paper-icon-item>
            <template is="dom-if" if="[[info.isOwner]]">
              <paper-icon-item on-tap="_deleteChat">
                <iron-icon icon="chat-icon:cancel" slot="item-icon"></iron-icon>
                <paper-item-body>
                  Delete chat
                </paper-item-body>
              </paper-icon-item>
            </template>
          </paper-listbox>
        </paper-menu-button>
      </app-toolbar>
    </app-header>
    <skeleton-chat-messages theme$="[[theme]]" group$="[[group]]" owner$="[[info.owner]]">
      <skeleton-chat-input theme$="[[theme]]" group$="[[group]]" mic$="[[mic]]" camera$="[[camera]]" emoji$="[[emoji]]" maxlength$="[[maxlength]]" label$="[[label]]"></skeleton-chat-input>
    </skeleton-chat-messages>
`;
  }

  /**
   * @return {string}
   */
  static get is() {
    return 'skeleton-chat-box';
  }

  /**
   * @return {object}
   */
  static get properties() {
    return {
      /**
       * The component theme.
       */
      theme: {
        type: String,
        value: 'light',
      },

      /**
       * Group id
       */
      group: {
        type: String,
        value: null,
      },
      /**
       * Displays emoji
       */
      emoji: {
        type: Boolean,
        value: false,
      },
      /**
       * Displays camera
       */
      camera: {
        type: Boolean,
        value: false,
      },
      /**
       * Displays microphone
       */
      mic: {
        type: Boolean,
        value: false,
      },
      /**
       * max length
       */
      maxlength: {
        type: Number,
      },
      /**
       * Chat input label
       */
      label: {
        type: String,
      },
      /**
       * Displays delete button
       */
      canDelete: {
        type: Boolean,
        value: false,
      },
      /**
       * Icon
       */
      icon: {
        type: String,
        value: null,
        readOnly: true,
        computed: '_computeIcon(info, info.*)',
      },
      /**
       * The user Object.
       */
      user: {
        type: Object,
        value: {},
      },
    };
  }

  /**
   * Connected callback
   */
  connectedCallback() {
    super.connectedCallback();
    firebase.auth().onAuthStateChanged((user) => {
      this.user = user;
      this.signedIn = !(!user);
    });
  }

  /**
   * Leave chat
   *
   * @private
   */
  _leaveChat() {
    this.leave(this.group, this.user.uid);
  }

  /**
   * Delete chat
   *
   * @private
   */
  _deleteChat() {
    this.remove(this.group);
  }

  /**
   * Compute icon
   *
   * @param {object} info
   * @return {string}
   * @private
   */
  _computeIcon(info) {
    let icon = 'person';
    let groupIcon = 'group';
    if (!info) return icon;
    return info.total >= 3 ? groupIcon : icon;
  }
}

window.customElements.define(SkeletonChatBox.is, SkeletonChatBox);
