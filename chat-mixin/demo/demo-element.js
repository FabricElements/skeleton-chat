import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-input/paper-input.js';
import '../chat-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
/**
 * `demo-element`
 *
 * @customElement
 * @polymer
 * @constructor
 * @appliesMixin Fabric.ChatMixin
 * @extends Polymer.Element
 * @demo demo/index.html
 */
class DemoElement extends Fabric.ChatMixin(PolymerElement) {
  static get template() {
    return html`
    <style>
      :host {
        display: block;
      }
    </style>

    <paper-input value="{{myUid}}" type="text" label="Insert your user uid">
    </paper-input>

    <paper-input value="{{friendUid}}" type="text" label="Insert your friend uid">
    </paper-input>

    <paper-button class="email" on-tap="onCreate">
      <span>Create Chat</span>
    </paper-button>

    <paper-input value="{{chatId}}" type="text" label="Insert chat ID">
    </paper-input>

    <paper-button class="email" on-tap="onRemove">
      <span>Remove Chat</span>
    </paper-button>

    <paper-input value="{{chat}}" type="text" label="Insert chat ID">
    </paper-input>

    <paper-input value="{{userUid}}" type="text" label="Insert user uid">
    </paper-input>

    <paper-button class="email" on-tap="onLeave">
      <span>Remove user</span>
    </paper-button>
`;
  }

  /**
   * @return {string}
   */
  static get is() {
    return 'demo-element';
  }

  /**
   * @return {object}
   */
  static get properties() {
    return {
      myUid: {
        type: String,
        value: null,
      },
      friendUid: {
        type: String,
        value: null,
      },
      chatId: {
        type: String,
        value: null,
      },
      chat: {
        type: String,
        value: null,
      },
      userUid: {
        type: String,
        value: null,
      },
    };
  }

  /**
   * onCreate
   */
  onCreate() {
    this.create([this.myUid, this.friendUid]);
    console.log('Chat created');
  }

  /**
   * onRemove
   */
  onRemove() {
    this.remove(this.chatId);
    console.log('Chat removed');
  }

  /**
   * onLeave
   */
  onLeave() {
    this.leave(this.chat, this.userUid);
    console.log('User removed');
  }
}

window.customElements.define(DemoElement.is, DemoElement);
