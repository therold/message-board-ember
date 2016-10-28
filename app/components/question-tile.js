import Ember from 'ember';

export default Ember.Component.extend({
  showEdit: false,

  actions: {
    enableUpdate() {
      this.set('showEdit', true);
    },
    cancelUpdate() {
      this.set('showEdit', false);
    },
    update(question, params, newTags, removeTags) {
      this.sendAction('update', question, params, newTags, removeTags);
      this.set('showEdit', false);
    },
    delete(question) {
      this.sendAction('delete', question);
    }
  }
});
