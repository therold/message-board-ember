import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    userAdded() {
      this.transitionTo('index');
    }
  }
});
