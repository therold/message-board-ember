import Ember from 'ember';

export default Ember.Route.extend({
  userService: Ember.inject.service(),
  questionService: Ember.inject.service(),

  actions: {
    save(params) {
      var user_id = this.get('userService').currentUser.id;
      this.get('questionService').add(user_id, params.title, params.body, params.tags);
      this.transitionTo('index');
    }
  }
});
