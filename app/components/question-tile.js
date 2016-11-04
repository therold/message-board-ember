import Ember from 'ember';

export default Ember.Component.extend({
  questionService: Ember.inject.service(),
  showEdit: false,
  tagService: Ember.inject.service(),

  actions: {
    enableUpdate() {
      this.set('showEdit', true);
    },
    cancelUpdate() {
      this.set('showEdit', false);
    },
    update(question, params, newTags, removeTags) {
      this.get('questionService').update(question.id, params.title, params.body, newTags, removeTags).then(() => {
        this.set('showEdit', false);
      });
    },
    delete(question) {
      this.sendAction('delete', question);
    }
  }
});
