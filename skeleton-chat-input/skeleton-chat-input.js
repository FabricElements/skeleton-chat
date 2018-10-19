/* eslint-disable max-len */
/* eslint-disable-next-line max-len */
import {
  html,
  PolymerElement,
} from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-styles/shadow.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-input/paper-textarea.js';
import '@polymer/app-media/app-media.js';
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
    return html `
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
    </style>

    <div id="input">
      <paper-textarea label$="[[label]]"
                      value="{{text}}"
                      on-keydown="_checkForEnter"
                      no-label-float
                      max-rows="0"
                      maxlength$="[[maxlength]]"></paper-textarea>
    </div>
    <input id="media-upload"
           type="file"
           accept="[[accept]]"
           on-change="_upload"
           hidden>
    <paper-icon-button icon="chat-icon:photo-camera" data-item="camera" class="icon-camera" on-tap="_tapButton"></paper-icon-button>
    <paper-icon-button icon="chat-icon:attach-file" data-item="file" class="icon-file" on-tap="_tapButton"></paper-icon-button>
    <paper-icon-button icon="chat-icon:arrow-upward" class="icon-send" on-tap="_sendMessage" hidden$="[[!text]]" disabled$="[[!text]]"></paper-icon-button>
    <paper-icon-button icon="chat-icon:mic" class="icon-mic" on-down="_inputAudioStarts" on-up="_inputAudioEnds" hidden$="[[!_showMic]]"></paper-icon-button>
    <app-media-devices
            kind="audioinput"
            selected-device="{{audioDevice}}">
        </app-media-devices>
        <!-- The computer is connected to devices... -->
    <app-media-recorder
            id="recorder"
            stream="[[stream]]"
            duration="[[duration]]"
            elapsed="{{elapsed}}"
            data="{{recording}}">
        </app-media-recorder>
        <!-- ...media stream is connected to the video output... -->
        <app-media-video
            id="video"
            source="[[stream]]"
            on-click="record"
            autoplay
            muted
            mirror>
        </app-media-video>

        <!-- ...and the recorder... -->
        <app-media-recorder
            id="recorder"
            stream="[[stream]]"
            duration="[[duration]]"
            elapsed="{{elapsed}}"
            data="{{recording}}">
        </app-media-recorder>

        <!-- ...and the audio analyser... -->
        <app-media-audio
            source="[[stream]]"
            analyser="{{analyser}}">
        </app-media-audio>
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
      recording: {
        type: Blob,
        observer: '_recordingChanged',
      },
      recordings: {
        type: Array,
        value: () => {
          return [];
        },
      },
      duration: {
        type: Number,
        value: 3000,
      },
      elapsed: {
        type: Number,
        observer: '_elapsedChanged',
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
      maxSize: {
        type: Number,
        value: 0,
      },
      minSize: {
        type: Number,
        value: 0,
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
    console.log('Recording STARTS ...');
    this.record();
    /* this._dispatchEvent('capture-audio-starts', {
      chatId: this.group,
    });*/
  }
  /**
   * Input audio ends
   *
   * @param {Object} e
   * @private
   */
  _inputAudioEnds(e) {
    console.log('Recording ENDS');
    this.shadowRoot.querySelector('#recorder').end();
    /* this._dispatchEvent('capture-audio-ends', {
      chatId: this.group,
    });*/
  }
  /**
   * Starts recording
   */
  record() {
    this.classList.add('recording');
    this.shadowRoot.querySelector('#recorder').start();
  }
  /**
   * Recording Changed
   *
   * @param {Object} recording
   * @private
   */
  _recordingChanged(recording) {
    if (recording != null) {
      this.push('recordings', recording);
    }
    this.classList.remove('recording');
  }
  /**
   * Function to save
   *
   * @param {Object} blob
   * @return {string}
   * @private
   */
  _toObjectURL(blob) {
    return URL.createObjectURL(blob);
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
