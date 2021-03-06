import Ember from 'ember';

export default Ember.Service.extend({
  firebase: Ember.inject.service(),
  store: Ember.inject.service(),
  questionService: Ember.inject.service(),

  all() {
    var store = this.get('store');
    store.unloadAll('tag');
    return store.findAll('tag');
  },

  removeFromQuestion(tag_id, question_id) {
    var firebase = this.get('firebase');
    return firebase.child(`tags/${tag_id}/questions/${question_id}`).remove().then(() => {
      return firebase.child(`tags/${tag_id}`).once('value').then(data => {
        if(!data.child('questions').exists()) {
          return firebase.child(`tags/${tag_id}`).remove();
        }
      });
    });
  },

  findByQuestionId(question_id) {
    var store = this.get('store');
    var questionService = this.get('questionService');
    var promises = [];
    var tags = [];

    store.unloadAll('tag');
    return questionService.getTagIds(question_id).then(tag_ids => {
      tag_ids.forEach(tag_id => {
        promises.push(
          store.find('tag', tag_id).then(tag => { tags.push(tag); })
        );
      });
      return Ember.RSVP.all(promises).then(() => { return tags; });
    });
  },


  addTagsToQuestion(question_id, tags) {
    var store = this.get('store');
    var firebase = this.get('firebase');
    var promises = [];
    var enteredTags = tags.split(' ');

    enteredTags.forEach((tag, i) => {
      if(!enteredTags.slice(0, i).includes(tag)) {
        store.query('tag', { orderBy: 'name', equalTo: tag}).then(queryResult => {
          var savedTag = queryResult.objectAt(0);
          if(!savedTag) {
            // No record found with the same name.
            var tag_params = { name: tag, questions: { [question_id]: true }};
            promises.push(firebase.child('tags').push(tag_params).then(tag => {
              var tag_id = tag.getKey();
              tag.update({ id: tag_id });
              firebase.child(`questions/${question_id}/tags`).update({ [tag_id]: true });
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
    return Ember.RSVP.all(promises);
  }

});
