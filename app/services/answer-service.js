import Ember from 'ember';

export default Ember.Service.extend({
  firebase: Ember.inject.service(),
  questionService: Ember.inject.service(),
  store: Ember.inject.service(),

  findByQuestionId(question_id) {
    var store = this.get('store');
    var questionService = this.get('questionService');
    var output = [];
    var promises = [];

    return questionService.getAnswerIds(question_id).then(answer_ids => {
      answer_ids.forEach(answer_id => {
        promises.push(
          store.find('answer', answer_id).then(answer => { output.push(answer); })
        );
      });
      return Ember.RSVP.all(promises).then(() => { return output; });
    });
  },

  all() {
    var service = this;
    var store = service.get('store');
    var firebase = service.get('firebase');
    var output = [];
    return firebase.child('answers').once('value').then(data => {
      data.forEach(answer => {
        var answerRecord = store.createRecord('answer', answer.val());
        output.push(answerRecord);
      });
      return output;
    });
  }
});
