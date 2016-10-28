import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    cancel() {
      this.sendAction('cancel');
    },
    save() {
      var params = {
        author: this.get('author'),
        body: this.get('body'),
        question: this.get('question')
      };
      this.sendAction('save', params);
      this.set('author', '');
      this.set('body', '');
    }
  }
});
