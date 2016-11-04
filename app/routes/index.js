import Ember from 'ember';

export default Ember.Route.extend({
  questionService: Ember.inject.service(),

  model() {
    return Ember.RSVP.hash({
      question: this.get('questionService').all(),
      // topTags: this.store.findAll('tag')
      //   .then(tag => tag.sortBy('questionCount').reverse().objectsAt([0,1,2,3,4]))
    });
  },
});
