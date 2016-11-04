import Ember from 'ember';

export default Ember.Service.extend({
  firebase: Ember.inject.service(),

  all() {
    var service = this;
    var firebase = service.get('firebase');
    var output = [];
    return firebase.child('questions').once('value').then(data => {
      data.forEach(question => {
        output.push(question.val());
      });
      return output;
    });
  }
});
