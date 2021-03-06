import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';

const firebase = window.firebase;

/**
 * `skeleton-chat-info`
 *
 *
 * @license Copyright (c) 2018 FabricElements. All rights reserved.
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class SkeletonChatInfo extends PolymerElement {
  /**
   * @return {!HTMLTemplateElement}
   */
  static get template() {
    return html`
    <style>
      :host {
        display: none;
      }
    </style>
`;
  }

  /**
   * @return {string}
   */
  static get is() {
    return 'skeleton-chat-info';
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
       * Group id
       */
      group: {
        type: String,
        value: null,
      },

      /**
       * Data object
       */
      data: {
        type: Object,
        value: {},
      },

      /**
       * Info data
       */
      info: {
        type: Object,
        notify: true,
        reflectToAttribute: true,
        readOnly: true,
        computed: '_computeInfo(data, user, data.*)',
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
      '_groupObserver(user, group)',
    ];
  }

  /**
   *
   * @param {object} textObject
   * @return {null}
   * @private
   */
  _returnFinalText(textObject) {
    const language = this._getBrowserLanguage();
    const original = textObject.original ? textObject.original : null;
    return textObject[language] ? textObject[language] : original;
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
    const finalLanguage = separator !== -1 ? separator : language.length;
    return language.substring(0, finalLanguage);
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
   * Compute the data and returns the info object
   *
   * @param {object} data
   * @param {object} user
   * @return {{}}
   * @private
   */
  _computeInfo(data, user) {
    let finalData = {};
    if (!data) return finalData;

    if (data) {
      finalData.title = data.title ? data.title : null;
      if (data.title) {
//            finalData.title = this._returnFinalText(data.info.title);
      }
      if (data.description) {
//            finalData.description = this._returnFinalText(data.description);
      }
      finalData.avatar = data.avatar ? data.avatar : null;
    }

    if (data.users) {
      const usersArray = this._usersToArray(data.users);
      finalData.users = usersArray;
      finalData.total = Object.keys(data.users).length;
      const objectUser = this._getObjectUsers(data.users, user);
      finalData.title = objectUser.name || '###';
      finalData.image = objectUser.avatar;
      finalData.isOwner = user.uid === data.owner;
      finalData.owner = data.owner;
    }

    return finalData;
  }

  /**
   * Extract first word from string
   *
   * @param {string} text
   * @return {string}
   * @private
   */
  _returnFistWord(text) {
    const i = text.indexOf(' ');
    return text.substring(0, i);
  }

  /**
   * Get object from users
   *
   * @param {object} users
   * @param {object} user
   * @return {*}
   * @private
   */
  _getObjectUsers(users, user) {
    let finalObject = {
      name: '...',
      image: null,
    };

    if (!user || !user.uid) return finalObject;
    delete users[user.uid];

    let fullNames = [];
    let names = [];
    let person = {};
    for (let key in users) {
      if (users.hasOwnProperty(key)) {
        const userItem = users[key];
        // Set basic person
        person.name = userItem.name ? userItem.name : null;
        person.avatar = userItem.avatar ? userItem.avatar : null;
        // Set fullNames array
        if (userItem.name) {
          fullNames.push(userItem.name);
        }
        // Set names array
        const firstName = userItem.name
          ? this._returnFistWord(userItem.name)
          : '###';
        names.push(firstName);
      }
    }

    if (fullNames.length <= 1) {
      finalObject.name = person.name;
      finalObject.avatar = person.avatar;
    } else {
      finalObject.name = names.join(', ');
      finalObject.avatar = null;
    }
    return finalObject;
  }

  /**
   * Return users array
   *
   * @param {object} users
   * @return {Array}
   * @private
   */
  _usersToArray(users) {
    return Object.keys(users).map((key) => {
      let user = users[key];
      if (user.name) {
        user.acronym = this._acronym(user.name);
      }
      user.uid = key;
      return users[key];
    });
  }

  /**
   * Group observer
   *
   * @param {object} user
   * @param {string} group
   * @private
   */
  _groupObserver(user, group) {
    let data = {};
    if (user && group) {
      const db = firebase.firestore();
      db.collection('chat').doc(group)
        .onSnapshot((doc) => {
          this.data = doc.data();
        }, (error) => {
          console.error(error);
        });
    }
    this.data = data;
  }
}

window.customElements.define(SkeletonChatInfo.is, SkeletonChatInfo);
