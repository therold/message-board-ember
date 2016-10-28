import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    save(params) {
      var question = this.store.createRecord('question', params);
      question.save().then(() => this.transitionTo('index'));
    }
  }
});
