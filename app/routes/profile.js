import Ember from 'ember';

export default Ember.Route.extend({
  questionService: Ember.inject.service(),
  userService: Ember.inject.service(),
  answerService: Ember.inject.service(),

  model(params) {
    return Ember.RSVP.hash({
      user: this.get('userService').find(params.user_id),
      questions: this.get('questionService').findByUserId(params.user_id),
      answers: this.get('answerService').findByUserId(params.user_id),
    });
  },

});
