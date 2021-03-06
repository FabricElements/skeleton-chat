window.Fabric = window.Fabric || {};

const firebase = window.firebase;

/**
 * Fabric.ChatMixin
 *
 * @polymerMixin Fabric.ChatMixin
 * @memberOf Fabric
 * @constructor
 * @summary Custom element base class that provides the core API for
 * @property {boolean} google
 * @param {Function} baseClass
 */
Fabric.ChatMixin = (baseClass) => {
  return class extends baseClass {
    /**
     * @return {object}
     */
    static get properties() {
      return {};
    }

    /**
     * Create chat
     *
     * @param {Array} uids
     */
    create(uids) {
      const timestamp = firebase.firestore.FieldValue.serverTimestamp();
      const data = {
        created: timestamp,
        updated: timestamp,
        owner: uids[0],
        users: uids.reduce((acc, uid) => {
          acc[uid] = true;
          return acc;
        }, {}),
      };
      const db = firebase.firestore();
      db.collection('chat').add(data)
        .then((docRef) => {
          window.dispatchEvent(new CustomEvent('location-changed'));
          window.history.pushState({}, null, `/chat/${docRef.id}`);
        })
        .catch((error) => {
          console.error(error);
          this.dispatchEvent(new CustomEvent('alert', {
            detail: {
              text: 'There was a problem creating your chat',
              time: 3000,
              type: 'error',
            },
            bubbles: true,
            composed: true,
          }));
        });
    }

    /**
     * Remove chat
     *
     * @param {string} id
     * @return {*}
     */
    remove(id) {
      const db = firebase.firestore();
      const docRef = db.collection('chat').doc(id);
      return docRef.delete()
        .then((docRef) => {
          window.dispatchEvent(new CustomEvent('location-changed'));
          window.history.pushState({}, null, `/chat`);
        })
        .catch((error) => {
          console.error(error);
          this.dispatchEvent(new CustomEvent('alert', {
            detail: {
              text: 'There was a problem deleting your chat',
              time: 3000,
              type: 'error',
            },
            bubbles: true,
            composed: true,
          }));
        });
    }

    /**
     * Remove user from chat
     *
     * @param {string} chatId
     * @param {string} uid
     */
    leave(chatId, uid) {
      const db = firebase.firestore();
      const docRef = db.collection('chat').doc(chatId);
      docRef.update({
        [`users.${uid}`]: firebase.firestore.FieldValue.delete(),
      }).then((docRef) => {
        this.dispatchEvent(new CustomEvent('close-chat', {
          bubbles: true,
          composed: true,
        }));
      }).catch((error) => {
        console.error(error);
        this.dispatchEvent(new CustomEvent('alert', {
          detail: {
            text: 'There was a problem leaving your chat',
            time: 3000,
            type: 'error',
          },
          bubbles: true,
          composed: true,
        }));
      });
    }
  };
};
