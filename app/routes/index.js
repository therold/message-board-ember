import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.store.findAll('question').then(question => {
      return question.sortBy('timestamp').reverse();
    });
  },
});
