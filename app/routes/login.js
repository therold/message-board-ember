import Ember from 'ember';

export default Ember.Route.extend({
  userService: Ember.inject.service(),

  actions: {
    cancel() {
      history.back();
    },
    loginComplete() {
      this.transitionTo('index');
    }
  }
});
