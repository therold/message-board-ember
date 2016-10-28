import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    cancel() {
      history.back();
    },
    save() {
      var params = {
        title: this.get('title'),
        author: this.get('author'),
        body: this.get('body')
      };
      this.sendAction('save', params);
      this.set('title', '');
      this.set('author', '');
      this.set('body', '');
    }
  }
});
