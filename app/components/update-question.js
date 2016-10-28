import Ember from 'ember';

export default Ember.Component.extend({
  didReceiveAttrs() {
    this.title = this.get('question.title');
    this.author = this.get('question.author');
    this.body = this.get('question.body');
  },
  actions: {
    cancel() {
      this.sendAction('cancel');
    },
    update(question) {
      var params = {
        title: this.get('title'),
        author: this.get('author'),
        body: this.get('body'),
      };
      this.sendAction('update', question, params);
    },
    delete(question) {
      if(confirm('Are you sure you want to delete this question?')) {
        this.sendAction('delete', question);
      }
    }
  }
});
