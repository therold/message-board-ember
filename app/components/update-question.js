import Ember from 'ember';

export default Ember.Component.extend({
  isUpdateShowing: false,
  isNewTagsShowing: false,
  removeTags: Ember.A([]),
  didReceiveAttrs() {
    this.title = this.get('question.title');
    this.author = this.get('question.author');
    this.body = this.get('question.body');
    this.removeTags.clear();
  },
  actions: {
    removeTag(tag) {
      this.removeTags.pushObject(tag.get('id'));
    },
    undoRemoveTag(tag) {
      var index = this.removeTags.indexOf(tag.get('id'));
      this.removeTags.removeAt(index);
    },
    showNewTags() {
      this.set('isNewTagsShowing', true);
    },
    cancel() {
      this.sendAction('cancel');
    },
    update(question) {
      var newTags = this.get("newTags");
      var removeTags = this.removeTags;
      var params = {
        title: this.get('title'),
        author: this.get('author'),
        body: this.get('body'),
      };
      this.sendAction('update', question, params, newTags, removeTags);
    },
    delete(question) {
      if(confirm('Are you sure you want to delete this question?')) {
        this.sendAction('delete', question);
      }
    }
  }
});
