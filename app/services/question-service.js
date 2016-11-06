import Ember from 'ember';
import moment from 'moment';

export default Ember.Service.extend({
  firebase: Ember.inject.service(),
  store: Ember.inject.service(),
  tagService: Ember.inject.service(),

  all() {
    var store = this.get('store');
    return store.findAll('question');
  },

  find(question_id) {
    var store = this.get('store');
    return store.find('question', question_id);
  },

  add(user_id, title, body, tags) {
    var store = this.get('store');
    var firebase = this.get('firebase');
    var path = firebase.child('questions');
    var params = { user: user_id, title: title, body: body, timestamp: moment().valueOf() };

    path.push(params).then(question => {
      var question_id = question.getKey();
      path.child(question_id).update({id: question_id});

      var enteredTags = tags.split(' ');
      enteredTags.forEach(function(tag, i) {
        if(!enteredTags.slice(0, i).includes(tag)) {
          store.query('tag', { orderBy: 'name', equalTo: tag}).then(queryResult => {
            var savedTag = queryResult.objectAt(0);
            if(!savedTag) {
              // No record found with the same name. New tag has been entered. Create new tag record and save both sides of the relationship.
              var tag_params = { name: tag, questions: { [question_id]: true }};
              firebase.child('tags').push(tag_params).then(tag => {
                var tag_id = tag.getKey();
                tag.update({ id: tag_id });
                path.child(`${question_id}/tags`).update({ [tag_id]: true });
              });
            } else {
              // Record found with same name. Existing tag has been entered. Use existing tag and sae both sides of the relationship.
              var tag_id = savedTag.get('id');
              firebase.child(`tags/${tag_id}/questions`).update({ [question_id]: true });
              firebase.child(`questions/${question_id}/tags`).update({ [tag_id]: true });
            }
          });
        }
      });
    });
  },

  update(question_id, title, body, newTags, removeTags) {
    var store = this.get('store');
    var firebase = this.get('firebase');
    var path = firebase.child('questions');
    var promises = [];

    promises.push(removeTags.forEach(tag_id => {
      firebase.child(`tags/${tag_id}/questions/${question_id}`).remove();
      firebase.child(`tags/${tag_id}`).once('value').then(data => {
        if(!data.child('questions').exists()) {
          firebase.child(`tags/${tag_id}`).remove();
        }
      });
      firebase.child(`questions/${question_id}/tags/${tag_id}`).remove();
    }));
    if(newTags) {
      var enteredTags = newTags.split(' ');
      enteredTags.forEach(function(tag, i) {
        if(!enteredTags.slice(0, i).includes(tag)) {
          store.query('tag', { orderBy: 'name', equalTo: tag}).then(queryResult => {
            var savedTag = queryResult.objectAt(0);
            if(!savedTag) {
              // No record found with the same name.
              var tag_params = { name: tag, questions: { [question_id]: true }};
              promises.push(firebase.child('tags').push(tag_params).then(tag => {
                var tag_id = tag.getKey();
                tag.update({ id: tag_id });
                path.child(`${question_id}/tags`).update({ [tag_id]: true });
              }));
            } else {
              // Record found with same name.
              var tag_id = savedTag.get('id');
              promises.push(firebase.child(`tags/${tag_id}/questions`).update({ [question_id]: true }));
              promises.push(firebase.child(`questions/${question_id}/tags`).update({ [tag_id]: true }));
            }
          });
        }
      });
    }
    var params = { title: title, body: body };
    promises.push(firebase.child(`questions/${question_id}`).update(params));
    return Ember.RSVP.all(promises);
  },

  remove(question_id) {
    var promises = [];
    var firebase = this.get('firebase');
    var tagService = this.get('tagService');
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
