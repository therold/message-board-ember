import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.store.findAll('question', { reload: true }).then(question => {
      return question.sortBy('timestamp').reverse();
    });
  },
});
