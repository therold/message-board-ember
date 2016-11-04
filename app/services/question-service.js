import Ember from 'ember';

export default Ember.Service.extend({
  firebase: Ember.inject.service(),
  store: Ember.inject.service(),

  all() {
    var service = this;
    var store = service.get('store');
    var firebase = service.get('firebase');
    var output = [];
    return firebase.child('questions').once('value').then(data => {
      data.forEach(question => {
        var questionRecord = store.createRecord('question', question.val());
        output.push(questionRecord);
      });
      return output;
    });
  }
});
