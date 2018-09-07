/* eslint-disable max-len */
/* eslint-disable-next-line max-len */
import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-item/paper-icon-item.js';
import '@polymer/paper-item/paper-item-body.js';
import '@polymer/iron-image/iron-image.js';
import '@polymer/paper-styles/color.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '../skeleton-chat-info/skeleton-chat-info.js';
import '../icons.js';

/**
 * `skeleton-chat-groups-item`
 *
 *
 * @license Copyright (c) 2018 FabricElements. All rights reserved.
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class SkeletonChatGroupsItem extends PolymerElement {
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
        --skeleton-chat-group-item: {
        };
        @apply --skeleton-chat-group-item;

        /* Default mixin */
        --skeleton-chat-group-item-height: 72px;
        min-height: var(--skeleton-chat-group-item-height);
        --skeleton-chat-group-item-image-color: var(--paper-grey-100);
        --skeleton-chat-group-item-image-size: 40px;
        /* Font styles */
        --skeleton-chat-group-item-font-family: 'Roboto', 'Noto', sans-serif;
        --skeleton-chat-group-item-font-size: 16px;
        --skeleton-chat-group-item-font-weight: 400;
        --skeleton-chat-group-item-font-color: var(--paper-grey-900);
        --skeleton-chat-group-item-font-color-dark: var(--paper-grey-50);
      }

      :host([theme="dark"]) {
        --skeleton-chat-group-item-font-color: var(--skeleton-chat-group-item-font-color-dark);
      }

      a {
        color: inherit;
        text-decoration: none;
        display: block;
      }

      [hidden] {
        display: none;
      }

      iron-image {
        display: block;
        border-radius: 50%;
        overflow: hidden;
        @apply --layout-fit;
        z-index: 2;
      }

      paper-icon-item {
        --paper-item-focused-before: {
          /*background-color: transparent;*/
        };
        --paper-icon-item: {
          /*@apply --layout-start;*/
        };
        /*--paper-item-icon-width: calc(var(--skeleton-chat-group-item-height) * 1.5);*/
        --paper-item-min-height: var(--skeleton-chat-group-item-height);
      }

      .image-container {
        background-color: var(--skeleton-chat-group-item-image-color);
        height: var(--skeleton-chat-group-item-image-size);
        width: var(--skeleton-chat-group-item-image-size);
        @apply --layout-vertical;
        @apply --layout-center-center;
        border-radius: 50%;
        overflow: hidden;
        position: relative;
      }

      .image-container iron-icon {
        position: relative;
        z-index: 1;
      }

      .title {
        @apply --paper-font-common-nowrap;
        font-family: var(--skeleton-chat-group-item-font-family);
        font-size: var(--skeleton-chat-group-item-font-size);
        font-weight: var(--skeleton-chat-group-item-font-weight);
        color: var(--skeleton-chat-group-item-font-color);
      }
    </style>

    <skeleton-chat-info group$="[[group]]" info="{{info}}" hidden></skeleton-chat-info>

    <a href$="[[path]]/[[group]]" tabindex="-1">
      <paper-icon-item>
        <div class="image-container" slot="item-icon">
          <iron-image fade sizing="cover" src$="[[info.avatar]]" hidden$="[[!info.avatar]]"></iron-image>
          <iron-icon icon$="chat-icon:[[icon]]" hidden$="[[info.avatar]]"></iron-icon>
        </div>
        <paper-item-body>
          <div class="title">[[info.title]]</div>
        </paper-item-body>
      </paper-icon-item>
    </a>
`;
  }

  /**
   * @return {string}
   */
  static get is() {
    return 'skeleton-chat-groups-item';
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
       * Data object
       */
      data: {
        type: Object,
        value: {
          info: {
            title: {
              original: null,
            },
            description: {
              original: null,
            },
            image: null,
          },
          users: {},
        },
      },

      /**
       * groups
       */
      group: {
        type: String,
        value: null,
      },

      /**
       * Link path
       */
      path: {
        type: String,
        value: '/chat',
      },

      /**
       * Info object
       */
      info: {
        type: Object,
        value: null,
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
    };
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

window.customElements.define(SkeletonChatGroupsItem.is, SkeletonChatGroupsItem);
