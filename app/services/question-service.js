import Ember from 'ember';
import moment from 'moment';

export default Ember.Service.extend({
  firebase: Ember.inject.service(),
  store: Ember.inject.service(),
  tagService: Ember.inject.service(),
  userService: Ember.inject.service(),

  all() {
    var store = this.get('store');
    store.unloadAll('question');
    return store.findAll('question');
  },

  find(question_id) {
    var store = this.get('store');
    return store.find('question', question_id);
  },

  findByUserId(user_id) {
    var store = this.get('store');
    var userService = this.get('userService');
    var promises = [];
    var questions = [];
    
    return userService.getQuestionIds(user_id).then(question_ids => {
      question_ids.forEach(question_id => {
        promises.push(
          store.find('question', question_id).then(question => { questions.push(question); })
        );
      });
      return Ember.RSVP.all(promises).then(() => { return questions; });
    });
  },

  add(user_id, title, body, tags) {
    var firebase = this.get('firebase');
    var tagService = this.get('tagService');
    var path = firebase.child('questions');
    var params = { user: user_id, title: title, body: body, timestamp: moment().valueOf() };

    path.push(params).then(question => {
      var question_id = question.getKey();
      path.child(question_id).update({id: question_id});
      firebase.child(`users/${user_id}/questions`).update({ [question_id]: true });
      tagService.addTagsToQuestion(question_id, tags);
    });
  },

  update(question_id, title, body, newTags, removeTags) {
    var firebase = this.get('firebase');
    var tagService = this.get('tagService');
    var promises = [];

    if(removeTags) {
      removeTags.forEach(tag_id => {
        promises.push(tagService.removeFromQuestion(question_id, tag_id));
      });
    }
    if(newTags) {
      promises.push(tagService.addTagsToQuestion(question_id, newTags));
    }
    var params = { title: title, body: body };
    promises.push(firebase.child(`questions/${question_id}`).update(params));
    return Ember.RSVP.all(promises);
  },

  remove(question_id) {
    var promises = [];
    var firebase = this.get('firebase');
    var tagService = this.get('tagService');

    firebase.child(`questions/${question_id}/user`).once('value').then(user => {
      var user_id = user.key;
      promises.push(firebase.child(`users/${user_id}/questions/${question_id}`).remove());
    });
    firebase.child(`questions/${question_id}/tags`).once('value').then(data => {
      data.forEach(tag => {
        promises.push(tagService.removeFromQuestion(tag.key, question_id));
      });
      promises.push(firebase.child(`questions/${question_id}`).remove());
    });
    return Ember.RSVP.all(promises);
  },

  getTagIds(question_id) {
    var firebase = this.get('firebase');
    var tag_ids = [];
    return firebase.child(`questions/${question_id}/tags`).once('value').then(data => {
      data.forEach(tag => { tag_ids.push(tag.key); });
      return tag_ids;
    });
  },

  getAnswerIds(question_id) {
    var firebase = this.get('firebase');
    var answer_ids = [];
    return firebase.child(`questions/${question_id}/answers`).once('value').then(data => {
      data.forEach(answer => { answer_ids.push(answer.key); });
      return answer_ids;
    });
  },

  getUserId(question_id) {
    var firebase = this.get('firebase');
    return firebase.child(`questions/${question_id}/user`).once('value').then(user_id => {
      return user_id.val();
    });
  }

});
