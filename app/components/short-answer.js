import Ember from 'ember';

export default Ember.Component.extend({
  questionService: Ember.inject.service(),
  question: null,
  didReceiveAttrs() {
    var question_id = this.get('answer').get('question');
    if(question_id) {
      var question = this.get('questionService').find(question_id);
      this.set('question', question);
    }
  }
});
