import Ember from 'ember';

export default Ember.Component.extend({
  didReceiveAttrs() {
    this.author = this.get('answer.author');
    this.body = this.get('answer.body');
  },

  actions: {
    cancel() {
      this.sendAction('cancel');
    },
    update(answer) {
      var params = {
        author: this.get('author'),
        body: this.get('body'),
      };
      this.sendAction('update', answer, params);
    },
    delete(answer) {
      if(confirm('Are you sure you want to delete this answer?')) {
        this.sendAction('delete', answer);
      }
    }
  }
});
