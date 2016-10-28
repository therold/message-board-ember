import Ember from 'ember';

export default Ember.Component.extend({
  showAddAnswer: false,
  answerToUpdate: null,
  actions: {
    showUpdate(answer) {
      this.set('showAddAnswer', false);
      this.set('answerToUpdate', answer.get('id'));
    },
    cancelUpdate() {
      this.set('answerToUpdate', null);
    },
    enableAddAnswer() {
      this.set('answerToUpdate', null);
      this.set('showAddAnswer', true);
    },
    cancelAddAnswer() {
      this.set('showAddAnswer', false);
    },
    save(params) {
      this.set('showAddAnswer', false);
      this.sendAction('save', params);
    },
    update(answer, params) {
      this.sendAction('update', answer, params);
      this.set('answerToUpdate', null);
    }
  }
});
