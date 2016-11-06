import Ember from 'ember';
import moment from 'moment';

export default Ember.Service.extend({
  firebase: Ember.inject.service(),
  store: Ember.inject.service(),
  questionService: Ember.inject.service(),

  all() {
    var store = this.get('store');
    store.unloadAll('answer');
    return store.findAll('answer');
  },

  findByQuestionId(question_id) {
    var store = this.get('store');
    var questionService = this.get('questionService');
    var promises = [];
    var answers = [];

    store.unloadAll('answer');
    return questionService.getAnswerIds(question_id).then(answer_ids => {
      answer_ids.forEach(answer_id => {
        promises.push(
          store.find('answer', answer_id).then(answer => { answers.push(answer); })
        );
      });
      return Ember.RSVP.all(promises).then(() => { return answers; });
    });
  },

  add(user_id, question_id, body) {
    var firebase = this.get('firebase');
    var params = { user: user_id, questions: question_id, body: body, score: 1, timestamp: moment().valueOf() };

    return firebase.child('answers').push(params).then(answer => {
      var answer_id = answer.getKey();
      var promises = [];
      promises.push(firebase.child(`questions/${question_id}/answers`).update({ [answer_id]: true }));
      promises.push(firebase.child(`users/${user_id}/answers`).update({ [answer_id]: true }));
      return Ember.RSVP.all(promises);
    });
  },

  remove(answer_id) {
    var firebase = this.get('firebase');
    return firebase.child(`answers/${answer_id}/questions/${question_id}`).remove().then(() => {
      return firebase.child(`tags/${tag_id}`).once('value').then(data => {
        if(!data.child('questions').exists()) {
          return firebase.child(`tags/${tag_id}`).remove();
        }
      });
    });
  },


});
