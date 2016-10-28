import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    return this.store.findRecord('question', params.question_id);
  },

  actions: {
    saveAnswer(params) {
      var answer = this.store.createRecord('answer', params);
      var question = params.question;
      question.get('answers').addObject(answer);
      answer.save().then(() => {
        return question.save();
      });
      this.transitionTo('question', question);
    },
    updateAnswer(answer, params) {
      Object.keys(params).forEach(function(key) {
        answer.set(key, params[key]);
      });
      answer.save();
    }
  }

});
