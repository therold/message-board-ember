import Ember from 'ember';

export default Ember.Component.extend({
  userService: Ember.inject.service(),
  user: null,
  didReceiveAttrs() {
    var user_id = this.get('answer').get('user');
    if(user_id) {
      var user = this.get('userService').find(user_id);
      this.set('user', user);
    }
  },
});
