import Ember from 'ember';
import moment from 'moment';

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
  },

  add(user_id, title, body, tags) {
    var service = this;
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

  remove(question_id) {
    var firebase = this.get('firebase');

    // Remove question from all associated tags. Also remove any tag that no longer has at least one associated question.
    return firebase.child(`questions/${question_id}/tags`).once('value').then(data => {
      data.forEach(tag => {
        var tag_id = tag.getKey();
        firebase.child(`tags/${tag_id}/questions/${question_id}`).remove();
        firebase.child(`tags/${tag_id}`).once('value').then(data => {
          if(!data.child('questions').exists()) {
            firebase.child(`tags/${tag_id}`).remove();
          }
        });
      });
      // Remove the question itself
      return firebase.child(`questions/${question_id}`).remove();
    });
  }

});
