import Ember from 'ember';

export default Ember.Service.extend({
  firebase: Ember.inject.service(),
  store: Ember.inject.service(),

  find(question_id) {
    var service = this;
    var store = service.get('store');
    var firebase = service.get('firebase');
    var output = [];
    var answer_promises = [];

    var loadedQuestion = store.find('question', question_id);
    if(loadedQuestion) {
      return loadedQuestion;
    } else {
      return firebase.child(`questions/${question_id}`).once('value').then(question => {
        return store.createRecord('question', question.val());
      });
    }
  },


  all() {
    var service = this;
    var store = service.get('store');
    var firebase = service.get('firebase');
    var output = [];
    store.unloadAll();
    return firebase.child('questions').once('value').then(data => {
      data.forEach(question => {
        var questionRecord = store.createRecord('question', question.val());
        output.push(questionRecord);
      });
      return output;
    });
  }
});
