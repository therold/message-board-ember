import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    cancel() {
      history.back();
    },
    save() {
      var params = {
        title: this.get('title'),
        body: this.get('body'),
        tags: this.get('tags'),
      };
      this.sendAction('save', params);
      this.set('title', '');
      this.set('body', '');
      this.set('tags', '');
    }
  }
});
