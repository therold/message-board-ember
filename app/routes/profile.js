import Ember from 'ember';

export default Ember.Route.extend({
  questionService: Ember.inject.service(),
  userService: Ember.inject.service(),
  tagService: Ember.inject.service(),

  model(params) {
    return Ember.RSVP.hash({
      questions: this.get('questionService').findByUserId(params.user_id),
      user: this.get('userService').find(params.user_id),
      topTags: this.get('tagService').all()
        .then(tag => tag.sortBy('questionCount').reverse().objectsAt([0,1,2,3,4]))
    });
  },
});
