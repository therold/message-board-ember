import Ember from 'ember';

export default Ember.Service.extend({
  firebase: Ember.inject.service(),
  store: Ember.inject.service(),

  findByQuestionId(question_id) {
    var service = this;
    var store = service.get('store');
    var firebase = service.get('firebase');
    var answer_ids = [];
    var output = [];
    var answer_promises = [];

    return firebase.child(`questions/${question_id}/answers`).once('value').then(data => {
      data.forEach(answer => {
        var answer_id = answer.key;
        answer_ids.push(answer_id);
      });
      return answer_ids;
    }).then(answer_ids => {
      answer_ids.forEach(answer_id => {
        answer_promises.push(firebase.child(`answers/${answer_id}`).once('value').then(data => {
          var answerRecord = store.createRecord('answer', data.val());
          output.push(answerRecord);
        }));
      });
      return Ember.RSVP.all(answer_promises).then(() => {
        return output;
      });
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
