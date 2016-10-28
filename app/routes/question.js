import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    return this.store.findRecord('question', params.question_id);
  },

  actions: {
    updateQuestion(question, params) {
      Object.keys(params).forEach(function(key) {
        question.set(key, params[key]);
      });
      question.save();
    },
    deleteQuestion(question) {
      var answer_deletions = question.get('answers').map(answer => {
        return answer.destroyRecord();
      });
      Ember.RSVP.all(answer_deletions).then(() => {
        return question.destroyRecord();
      }).then(() => this.transitionTo('index'));
    },
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
    },
    deleteAnswer(answer) {
      answer.destroyRecord();
    }
  }

});
