import Ember from 'ember';

export default Ember.Component.extend({
  userService: Ember.inject.service(),

  actions: {
    logout() {
      this.get('userService').logout();
    }
  }

});
