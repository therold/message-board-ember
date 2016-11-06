import Ember from 'ember';
import moment from 'moment';

export default Ember.Service.extend({
  firebase: Ember.inject.service(),
  store: Ember.inject.service(),
  questionService: Ember.inject.service(),
  userService: Ember.inject.service(),

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

    return questionService.getAnswerIds(question_id).then(answer_ids => {
      answer_ids.forEach(answer_id => {
        promises.push(
          store.find('answer', answer_id).then(answer => { answers.push(answer); })
        );
      });
      return Ember.RSVP.all(promises).then(() => { return answers; });
    });
  },

  findByUserId(user_id) {
    var store = this.get('store');
    var userService = this.get('userService');
    var promises = [];
    var answers = [];

    store.unloadAll('answer');
    return userService.getAnswerIds(user_id).then(answer_ids => {
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
    var params = { user: user_id, question: question_id, body: body, score: 1, timestamp: moment().valueOf() };

    return firebase.child('answers').push(params).then(answer => {
      var answer_id = answer.getKey();
      var promises = [];
      promises.push(firebase.child(`questions/${question_id}/answers`).update({ [answer_id]: true }));
      promises.push(firebase.child(`users/${user_id}/answers`).update({ [answer_id]: true }));
      return Ember.RSVP.all(promises);
    });
  },

  update(answer_id, body) {
    var firebase = this.get('firebase');

    var params = { body: body };
    return firebase.child(`answers/${answer_id}`).update(params);
  },

  remove(answer_id) {
    var firebase = this.get('firebase');
    var promises = [];
    promises.push(firebase.child(`answers/${answer_id}/question`).once('value').then(question => {
      return firebase.child(`questions/${question.val()}/answers/${answer_id}`).remove();
    }));
    promises.push(firebase.child(`answers/${answer_id}/user`).once('value').then(user => {
      return firebase.child(`users/${user.val()}/answers/${answer_id}`).remove();
    }));
    promises.push(firebase.child(`answers/${answer_id}`).remove());
    return Ember.RSVP.all(promises);
  },


});
