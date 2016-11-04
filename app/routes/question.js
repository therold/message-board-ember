import Ember from 'ember';

export default Ember.Route.extend({
  tagService: Ember.inject.service(),
  questionService: Ember.inject.service(),
  answerService: Ember.inject.service(),

  model(params) {
    return Ember.RSVP.hash({
      tags: this.get('tagService').findByQuestionId(params.question_id),
      question: this.get('questionService').find(params.question_id),
      answers: this.get('answerService').findByQuestionId(params.question_id),
    });
  },

  actions: {
    deleteQuestion(question) {
      this.get('questionService').remove(question.id).then(() => {
        this.transitionTo('index');
      });
    },
    saveAnswer(params) {
      var answer = this.store.createRecord('answer', params);
      var question = params.question;
      question.get('answers').addObject(answer);
      answer.save().then(() => {
        return question.save();
      });
      this.transitionTo('question');
    },
    updateAnswer(answer, params) {
      Object.keys(params).forEach(function(key) {
        answer.set(key, params[key]);
      });
      answer.save();
    },
    deleteAnswer(answer) {
      answer.destroyRecord();
    },
    upvoteAnswer(answer) {
      answer.set('score', answer.get('score') + 1);
      answer.save();
    },
    downvoteAnswer(answer) {
      answer.set('score', answer.get('score') - 1);
      answer.save();
    }
  }

});
