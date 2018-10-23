/* eslint-disable max-len */
/* eslint-disable-next-line max-len */
import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-styles/shadow.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-input/paper-textarea.js';
import '@polymer/iron-icon/iron-icon.js';
import '../icons.js';

const firebase = window.firebase;

/**
 * `skeleton-chat-input`
 *
 * @license Copyright (c) 2018 FabricElements. All rights reserved.
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class SkeletonChatInput extends PolymerElement {
  /**
   * @return {!HTMLTemplateElement}
   */
  static get template() {
    return html`
    <!--suppress CssInvalidPseudoSelector -->
    <!--suppress CssUnresolvedCustomProperty -->
    <!--suppress CssUnresolvedCustomPropertySet -->
    <style>
      :host {
        @apply --shadow-elevation-2dp;
        display: block;
        overflow-x: hidden;
        position: relative;
        margin: 1rem;
        /*width: 100%;*/
        box-sizing: border-box;
        /*border-top: 1px solid var(--skeleton-chat-input-border-color, var(--paper-grey-50));*/
        @apply --layout-inline;
        @apply --layout-horizontal;
        -ms-flex-wrap: nowrap;
        -webkit-flex-wrap: nowrap;
        border-radius: 28px;
        /*border: 1px solid red;*/
        @apply --skeleton-chat-input;

        /*-webkit-box-shadow: 0 -2px 3px -1px rgba(0, 0, 0, 0.14);*/
        /*box-shadow: 0 -1px 1px -2px rgba(0, 0, 0, 0.14),*/
        /*0 -2px 2px -2px rgba(0, 0, 0, 0.12),*/
        /*0 -3px 3px -2px rgba(0, 0, 0, 0.2);*/
        --skeleton-chat-input-container: {
          box-sizing: border-box;
        };
        /*Default reset*/
        --paper-input-container-underline: {
          display: none;
        };
        --paper-input-container-underline-focus: {
          display: none;
        };
        --paper-input-container: {
          padding: 0;
          @apply --skeleton-chat-input-container;
        };
        --paper-input-container-label: {
          /*padding: .5rem calc(40px + 0.5rem) .5rem .6rem;*/
          padding: 14px 10px;
        };
        --iron-autogrow-textarea: {
          box-sizing: border-box;
          padding: 14px 10px;
          word-break: break-all;
          min-height: 20px;
          max-height: 120px;
        };
        --paper-input-container-underline: {
          display: none;
        };
        --iron-autogrow-textarea-placeholder: {
          padding: 1rem;
          margin: 1rem;
          line-height: 56px;
        };
        --paper-icon-button: {
          border-radius: 50%;
          /*margin-left: 2px;*/
        };
        background-color: var(--skeleton-chat-input-bg, #ffffff);

        --no-select: {
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
          -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        };
      }

      :host > * {
        @apply --no-select;
        @apply --layout-end-aligned;
      }

      :host([theme="dark"]) {
        /*border-top-color: var(--skeleton-chat-input-border-color-dark, var(--paper-grey-700));*/
        /*background-color: var(--skeleton-chat-bg-color-dark, var(--paper-grey-800));*/
        background-color: var(--skeleton-chat-input-bg, var(--paper-grey-900));
        --paper-input-container: {
          padding: 0;
          @apply --skeleton-chat-input-container;
        };
        --skeleton-chat-input-icon: {
          color: white;
        };
        --paper-input-container-input: {
          color: white;
        };
        --paper-input-container-color: var(--paper-grey-50);
      }

      :host > * {
        max-width: 100%;
      }

      [hide] {
        opacity: 0;
      }

      [hidden] {
        display: none;
      }

      #input {
        @apply --layout-flex-auto;
        box-sizing: border-box;
        position: relative;
        display: flex;
      }

      paper-textarea {
        box-sizing: border-box;
        @apply --layout-flex-none;
        width: 100%;
        max-width: 100%;
        @apply --skeleton-chat-input-input;
      }

      paper-icon-button {
        transition: all .3s ease-in-out;
        color: var(--paper-grey-800);
        margin: .5rem .5rem .5rem 0;
        width: 40px;
        height: 40px;
        flex-shrink: 0;
        flex-grow: 0;
        @apply --layout-self-end;
        @apply --skeleton-chat-input-icon;
      }

      .icon-camera {
        @apply --skeleton-chat-input-icon-camera;
      }

      .icon-mic,
      .icon-send {
        background-color: var(--skeleton-chat-input-action-bg, var(--accent-color));
        color: var(--skeleton-chat-input-action-color, #ffffff);
        --paper-icon-button: {
          padding: 5px;
          border-radius: 50%;
        };
      }

      .icon-mic {
        @apply --skeleton-chat-input-icon-mic;
      }

      .icon-send {
        @apply --skeleton-chat-input-icon-send;
      }

      #progress-circle {
        border-radius: 50%;
        box-sizing: border-box;
        margin: 3px 3px 0 0;
        height: 3rem;
        overflow: hidden;
        position: relative;
        width: 3rem;
      }

      #progress-circle * {
        box-sizing: border-box;
      }

      .progress {
        transform: rotate(-90deg);
        width: 100%;
        height: 100%;
      }

      #progress-value {
        stroke-dasharray: 314.16;
        stroke-linecap: none;
        stroke: var(--skeleton-chat-input-action-bg, var(--accent-color));
        transition: all 100ms linear;
      }

      .thumbnail,
      .icon-hue {
        height: 100%;
        left: 0;
        position: absolute;
        top: 0;
        object-fit: cover;
        width: 100%;
      }

      .icon-hue {
        color: var(--paper-grey-800);
        display: flex;
        justify-content: center;
        align-items: center;
      }
    </style>
    <div id="input">
      <paper-textarea label$="[[label]]"
                      value="{{text}}"
                      on-keydown="_checkForEnter"
                      no-label-float
                      max-rows="0"
                      maxlength$="[[maxlength]]"
                      disabled$="[[uploading]]"></paper-textarea>
    </div>
    <input id="media-upload"
          type="file"
          accept="[[accept]]"
          on-change="_upload"
          hidden>

    <template is="dom-if" if="[[uploading]]">
      <div id="progress-circle">
        <template is="dom-if" if="[[imageType]]">
          <img class="thumbnail" src="[[thumbnail]]" />
        </template>
        <template is="dom-if" if="[[!imageType]]">
        <div class="icon-hue">
          <iron-icon icon$="chat-icon:[[icon]]" hidden$="[[info.image]]"></iron-icon>
        </div>
        </template>
        <svg class="progress" viewBox="0 0 100 100">
          <circle id="progress-value"
                  cx="50"
                  cy="50"
                  fill="none"
                  r="47"
                  stroke-width="6"
                  stroke-dashoffset$="[[progressValue]]"></circle>
        </svg>
      </div>
    </template>

    <template is="dom-if" if="[[!uploading]]">
      <paper-icon-button icon="chat-icon:photo-camera" data-item="camera" class="icon-camera" on-tap="_tapButton"></paper-icon-button>
      <paper-icon-button icon="chat-icon:attach-file" data-item="file" class="icon-file" on-tap="_tapButton"></paper-icon-button>
      <paper-icon-button icon="chat-icon:arrow-upward" class="icon-send" on-tap="_sendMessage" hidden$="[[!text]]" disabled$="[[!text]]"></paper-icon-button>
      <paper-icon-button icon="chat-icon:mic" class="icon-mic" on-down="_inputAudioStarts" on-up="_inputAudioEnds" hidden$="[[!_showMic]]"></paper-icon-button>
    </template>
`;
  }

  /**
   * @return {string}
   */
  static get is() {
    return 'skeleton-chat-input';
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
       * The message to send
       */
      text: {
        type: String,
        value: null,
      },
      /**
       * The chat group.
       */
      group: {
        type: String,
        value: null,
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
        value: 'Say something...',
      },
      /**
       * Show mic computed
       */
      _showMic: {
        type: Boolean,
        value: false,
        computed: '_computeShowMic(mic, text)',
      },
      path: {
        type: String,
        value: null,
      },
      extension: {
        type: String,
        value: null,
      },
      fileType: {
        type: String,
        value: null,
      },
      accept: {
        type: String,
        value: null,
      },
      metadata: {
        type: Object,
        value: {},
      },
      downloadUrl: {
        type: String,
        value: null,
      },
      uploadProgress: {
        type: Number,
        value: 0,
      },
      uploading: {
        type: Boolean,
        value: false,
        notify: true,
        computed: '_computeProgress(uploadProgress)',
      },
      maxSize: {
        type: Number,
        value: 0,
      },
      minSize: {
        type: Number,
        value: 0,
      },
      progressValue: {
        type: Number,
        value: null,
        computed: '_dashOffset(uploadProgress)',
      },
      thumbnail: {
        type: String,
        value: null,
      },
      icon: {
        type: String,
        value: null,
        notify: true,
      },
      imageType: {
        type: Boolean,
        notify: true,
        value: false,
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
   * @return {array}
   */
  static get observers() {
    return [
      '_resetOnChange(user, group)',
    ];
  }

  /**
   * Function to send message on Enter key press.
   *
   * @param {object} event
   * @private
   */
  _checkForEnter(event) {
    // check if 'enter' was pressed
    if (event.keyCode === 13) {
      event.preventDefault();
      this._sendMessage();
    }
  }

  /**
   * Send message
   *
   * @return {*}
   * @private
   */
  _sendMessage() {
    if (!this.group) {
      return this._dispatchEvent('error', 'Define the group first.');
    }
    if (!this.user) {
      return this._dispatchEvent('error', 'You need to sign in first.');
    }

    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    const baseText = this.text;
    const group = this.group;
    const user = this.user;
    /**
     * Format message
     */

    const message = {
      backup: false,
      created: timestamp,
      isAnonymous: user.isAnonymous,
      group: group,
      processed: false,
      text: baseText,
      type: 'default',
      uid: user.uid,
      updated: timestamp,
      user: {
        name: user.displayName ? user.displayName : null,
        avatar: user.photoURL ? user.photoURL : null,
      },
      media: {
        type: this.fileType || null,
        url: this.downloadURL || null,
      },
    };
    this.text = null;
    const chatRef = `chat-message`;
    const db = firebase.firestore();
    db.collection(chatRef).add(message)
      .then(() => {
        this._dispatchEvent('message', 'ok');
      })
      .catch((err) => {
        this.text = baseText;
        console.error(err);
        this._dispatchEvent('error', err);
      });
  }

  /**
   * Tap button
   * @param {object} event
   * @private
   */
  _tapButton(event) {
    const item = event.target.dataset.item;
    if (item === 'camera') {
      this.accept = 'image/*';
    } else {
      this.accept = 'audio/*,video/*,application/pdf';
    }
    const input = this.shadowRoot.querySelector('input');
    input.value = null;
    input.click();
  }

  /**
   * Compute progress
   * @param {number} progress
   * @return {*}
   * @private
   */
  _computeProgress(progress) {
    if (progress > 0 && progress < 100) {
      return true;
    }
  }

  /**
   * dash offset
   *
   * @param {number} uploadProgress
   * @private
   * @return {*}
   */
  _dashOffset(uploadProgress) {
    return Math.PI * (100 - uploadProgress);
  }

  /**
   * dash offset
   *
   * @param {FileReader} file
   * @private
   * @return {Promise<string>}
   */
  getThumbnail(file) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = window.URL.createObjectURL(file);
      image.onload = (e) => {
        resolve(image.src);
      };
    });
  }

  /**
   * Upload
   *
   * @param {object} event
   * @param {object} fileObject
   * @private
   */
  _upload(event, fileObject) {
    const file = fileObject ?
    fileObject :
    this.shadowRoot.querySelector('#media-upload').files[0];

    this.getThumbnail(file).then((file) => {
      this.thumbnail = file;
    });

    if (file.type.match(/image\/(gif|bmp|jpeg|png)$/i)) {
      this.imageType = true;
    } else if (file.type.match(/audio\/(ogg|mp3|wav)$/i)) {
      this.icon = 'library-music';
      this.imageType = false;
    } else {
      this.icon = 'attach-file';
      this.imageType = false;
    }

    const fileSize = this.shadowRoot.querySelector('#media-upload').files[0].size;
    if (this.maxSize != 0 && fileSize > this.maxSize) {
      this._dispatchEvent('error', 'File size is bigger than specified');
      return;
    }
    if (this.minSize != 0 && fileSize < this.minSize) {
      this._dispatchEvent('error', 'File size is smaller than specified');
      return;
    }
    this.downloadURL = null;
    let fileExt = /\.[\w]+/.exec(file.name);

    const storageRef = firebase.storage().ref(this.path + fileExt);
    let metadataObject = null;
    if (this.metadata && typeof this.metadata === 'object') {
      metadataObject = {
        customMetadata: this.metadata,
      };
    } else if (this.metadata && typeof this.metadata !== 'object') {
      this._dispatchEvent('error', 'Metadata should be an object');
      return;
    }
    this.task = storageRef.put(file, metadataObject);
    this.task.on('state_changed', (snapshot) => {
      // Observe state change events such as progress, pause, and resume
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      this.uploadProgress = progress;
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
          this._dispatchEvent('paused', 'Upload is paused');
          break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
          this._dispatchEvent('running', 'Upload is running');
          break;
      }
    }, (error) => {
      // Handle unsuccessful uploads
      this._dispatchEvent('error', error);
    }, () => {
      this.task.snapshot.ref.getDownloadURL().then((downloadURL) => {
        // Handle successful uploads on complete
        this.downloadURL = downloadURL;
        this.fileType = file.type;
        this.extension = fileExt[0];
        this._sendMessage();
        this.downloadURL = null;
        this.fileType = null;
        this.extension = null;
      });
    });
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

  /**
   * Input audio starts
   *
   * @param {Object} e
   * @private
   */
  _inputAudioStarts(e) {
    this._dispatchEvent('capture-audio-starts', {
      chatId: this.group,
    });
  }

  /**
   * Input audio ends
   *
   * @param {Object} e
   * @private
   */
  _inputAudioEnds(e) {
    this._dispatchEvent('capture-audio-ends', {
      chatId: this.group,
    });
  }

  /**
   * Show/hide mic
   *
   * @param {boolean} mic
   * @param {boolean} text
   * @return {boolean}
   * @private
   */
  _computeShowMic(mic, text) {
    return mic && !text;
  }

  /**
   * Reset on change
   *
   * @param {string|null} user
   * @param {string|null} group
   * @private
   */
  _resetOnChange(user, group) {
    this.text = null;
  }
}

window.customElements.define(SkeletonChatInput.is, SkeletonChatInput);
