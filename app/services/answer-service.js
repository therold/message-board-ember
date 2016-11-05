import Ember from 'ember';

export default Ember.Service.extend({
  firebase: Ember.inject.service(),
  store: Ember.inject.service(),
  questionService: Ember.inject.service(),

  all() {
    var store = this.get('store');
    return store.findAll('question');
  },

  findByQuestionId(question_id) {
    var store = this.get('store');
    var questionService = this.get('questionService');
    var promises = [];
    var answers = [];

    return questionService.getAnswerIds(question_id).then(answer_ids => {
      answer_ids.forEach(answer_id => {
        promises.push(
          store.find('answer', answer_id).then(answer => { answers.push(answer); })
        );
      });
      return Ember.RSVP.all(promises).then(() => { return answers; });
    });
  },

});
