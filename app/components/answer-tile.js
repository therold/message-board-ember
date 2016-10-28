import Ember from 'ember';

export default Ember.Component.extend({
  showAddAnswer: false,
  actions: {
    enableAddAnswer() {
      this.set('showAddAnswer', true);
    },
    cancelAddAnswer() {
      this.set('showAddAnswer', false);
    },
    save(params) {
      this.set('showAddAnswer', false);
      this.sendAction('save', params);
    }
  }
});
