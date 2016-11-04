import Ember from 'ember';

export default Ember.Route.extend({
  questionService: Ember.inject.service(),
  tagService: Ember.inject.service(),

  model() {
    return Ember.RSVP.hash({
      question: this.get('questionService').all(),
      topTags: this.get('tagService').all()
        .then(tag => tag.sortBy('questionCount').reverse().objectsAt([0,1,2,3,4]))
    });
  },
});
