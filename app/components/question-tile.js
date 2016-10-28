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
    update(question, params) {
      this.sendAction('update', question, params);
      this.set('showEdit', false);
    }
  }
});
