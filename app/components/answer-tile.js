import Ember from 'ember';

export default Ember.Component.extend({
  showAddAnswer: false,
  answerToUpdate: null,
  actions: {
    showUpdate(answer) {
      this.set('answerToUpdate', answer.get('id'));
    },
    cancelUpdate() {
      this.set('answerToUpdate', null);
    },
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
