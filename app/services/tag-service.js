import Ember from 'ember';

export default Ember.Service.extend({
  firebase: Ember.inject.service(),
  store: Ember.inject.service(),

  findByQuestionId(question_id) {
    var service = this;
    var store = service.get('store');
    var firebase = service.get('firebase');
    var tag_ids = [];
    var output = [];
    var tag_promises = [];

    store.unloadAll();
    return firebase.child(`questions/${question_id}/tags`).once('value').then(data => {
      data.forEach(tag => {
        var tag_id = tag.key;
        tag_ids.push(tag_id);
      });
      return tag_ids;
    }).then(tag_ids => {
      tag_ids.forEach(tag_id => {
        tag_promises.push(firebase.child(`tags/${tag_id}`).once('value').then(data => {
          var tagRecord = store.createRecord('tag', data.val());
          output.push(tagRecord);
        }));
      });
      return Ember.RSVP.all(tag_promises).then(() => {
        return output;
      });
    });
  },

  all() {
    var service = this;
    var store = service.get('store');
    var firebase = service.get('firebase');
    var output = [];
    return firebase.child('tags').once('value').then(data => {
      data.forEach(tag => {
        var tagRecord = store.createRecord('tag', tag.val());
        output.push(tagRecord);
      });
      return output;
    });
  }
});
