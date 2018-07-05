/**
@license
Copyright (c) 2018 FabricElements. All rights reserved.

@group Skeleton Chat
@demo demo/index.html
*/
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

import './chat-mixin/chat-mixin.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/app-route/app-location.js';
import '@polymer/app-route/app-route.js';
import './skeleton-chat-groups/skeleton-chat-groups.js';
import './skeleton-chat-box/skeleton-chat-box.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
/**
 * `skeleton-chat`
 *
 *
 * @customElement
 * @polymer
 * @appliesMixin Fabric.ChatMixin
 * @demo demo/index.html
 */
class SkeletonChat extends Fabric.ChatMixin(PolymerElement) {
  static get template() {
    return html`
    <style>
      :host {
        display: block;
        position: relative;
        height: 100%;
        overflow: hidden;
        @apply --layout-fit;
      }

      skeleton-chat-box {
        z-index: 100;
        transition: all ease-in-out 300ms;
        transform: translateY(120%);
        top: 100%;
      }

      skeleton-chat-box[opened] {
        transform: translateY(0);
        height: 100%;
        top: 0;
      }
    </style>
    <app-location route="{{route}}"></app-location>
    <app-route route="{{route}}" pattern\$="/[[routeChat]]" tail="{{chatRouteTail}}"></app-route>
    <app-route route="{{chatRouteTail}}" pattern="/:id" active="{{chatBoxActive}}" data="{{subrouteData}}"></app-route>
    <skeleton-chat-groups link-back\$="[[linkBack]]"></skeleton-chat-groups>
    <skeleton-chat-box fullbleed="" group\$="[[subrouteData.id]]" opened\$="[[chatBoxActive]]"></skeleton-chat-box>
`;
  }

  /**
   * @return {string}
   */
  static get is() {
    return 'skeleton-chat';
  }

  /**
   * @return {object}
   */
  static get properties() {
    return {
      /** Route */
      route: {
        type: Object,
      },
      /** Route data */
      routeData: {
        type: Object,
        value: {
          page: null,
        },
      },
      subrouteData: {
        type: Object,
        value: {
          id: null,
        },
      },
      chatBoxActive: {
        type: Boolean,
        value: false,
        notify: true,
      },
      linkBack: {
        type: String,
        value: '/',
      },
      routeChat: {
        type: String,
        value: 'chat',
      },
      routeLeave: {
        type: String,
        value: null,
      },
    };
  }

  /**
   * Connected callback
   */
  connectedCallback() {
   super.connectedCallback();
   this.addEventListener('close-chat', () => {
     this.routeData.page = this.routeLeave ? this.routeLeave : this.routeChat;
     this.notifyPath('routeData');
     this.notifyPath('routeData.page');
     this.chatBoxActive = false;
   }, true);
 }
}

window.customElements.define(SkeletonChat.is, SkeletonChat);
