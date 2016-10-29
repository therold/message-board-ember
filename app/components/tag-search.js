import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    search() {
      this.sendAction('search', this.get('name').replace(/\s/g, ''));
    }
  }
});
