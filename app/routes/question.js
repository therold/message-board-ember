import Ember from 'ember';

export default Ember.Route.extend({
  tagService: Ember.inject.service(),
  questionService: Ember.inject.service(),
  answerService: Ember.inject.service(),

  model(params) {
    return Ember.RSVP.hash({
      tags: this.get('tagService').findByQuestionId(params.question_id),
      question: this.get('questionService').find(params.question_id),
      answers: this.get('answerService').findByQuestionId(params.question_id),
    });
  },

  actions: {
    updateQuestion(question, params, newTags, removeTags) {
      var controller = this;
      removeTags.forEach(id => {
        this.store.findRecord('tag', id).then(tag => {
          question.get('tags').removeObject(tag);
          question.save();
          // remove the question's link to the tag
          tag.get('questions').removeObject(question);
          tag.save().then(tag => {
            if(tag.get('questions').get('length') === 0) {
              // Tag is now an orphan. Tag has no associated questions.
              tag.destroyRecord();
            }
          });
        });
      });
      if(newTags) {
        var enteredTags = newTags.split(' ');
        enteredTags.forEach(function(tag, i) {
          if(!enteredTags.slice(0, i).includes(tag)) {
            controller.store.query('tag', { orderBy: 'name', equalTo: tag}).then(queryResult => {
              var savedTag = queryResult.objectAt(0);
              var params = { name: tag, question: question };
              if(!savedTag) {
                // new tag entered.
                var newTag = controller.store.createRecord('tag', params);
                question.get('tags').addObject(newTag);
                question.save().then(() => {
                  newTag.get('questions').addObject(question);
                  newTag.save();
                });
              } else {
                // existing tag entered.
                question.get('tags').addObject(savedTag);
                question.save().then(() => {
                  savedTag.get('questions').addObject(question);
                  savedTag.save();
                });
              }
            });
          }
        });
      }
      Object.keys(params).forEach(function(key) {
        question.set(key, params[key]);
      });
      question.save();
    },
    deleteQuestion(question) {
      this.get('questionService').remove(question.id).then(() => {
        this.transitionTo('index');
      });
    },
    saveAnswer(params) {
      var answer = this.store.createRecord('answer', params);
      var question = params.question;
      question.get('answers').addObject(answer);
      answer.save().then(() => {
        return question.save();
      });
      this.transitionTo('question');
    },
    updateAnswer(answer, params) {
      Object.keys(params).forEach(function(key) {
        answer.set(key, params[key]);
      });
      answer.save();
    },
    deleteAnswer(answer) {
      answer.destroyRecord();
    },
    upvoteAnswer(answer) {
      answer.set('score', answer.get('score') + 1);
      answer.save();
    },
    downvoteAnswer(answer) {
      answer.set('score', answer.get('score') - 1);
      answer.save();
    }
  }

});
