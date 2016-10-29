import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return Ember.RSVP.hash({
      question: this.store.findAll('question', { reload: true }).then(question => {
        return question.sortBy('timestamp').reverse();
      }),
      topTags: this.store.findAll('tag')
        .then(tag => tag.sortBy('questionCount').reverse().objectsAt([0,1,2,3,4]))
    });
  },
});
