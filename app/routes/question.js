import Ember from 'ember';

export default Ember.Route.extend({
  tagService: Ember.inject.service(),
  questionService: Ember.inject.service(),
  answerService: Ember.inject.service(),
  userService: Ember.inject.service(),

  model(params) {
    return Ember.RSVP.hash({
      tags: this.get('tagService').findByQuestionId(params.question_id),
      question: this.get('questionService').find(params.question_id),
      user: this.get('userService').findByQuestionId(params.question_id),
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
      var question_id = params.question.get('id');
      var user_id = this.get('userService').currentUser.id;
      this.get('answerService').add(user_id, question_id, params.body).then(() => {
        this.transitionTo('index');
      });
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
