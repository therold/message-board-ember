import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    save(params, tags) {
      // This is a bit complicated to support the many-to-many relationship between tags and questions.
      var controller = this;
      // Create and save the question.
      var newQuestion = controller.store.createRecord('question', params);
      newQuestion.save().then(() => {
        // We took the tags as one long string for user convenience. Split it up into an array for processing here.
        var enteredTags = tags.split(' ');
        enteredTags.forEach(function(tag, i) {
          var params = { name: tag, question: newQuestion };
          // Filter out duplicate entries.
          if(!enteredTags.slice(0, i).includes(tag)) {
            //Search DB for an existing tag record with the same name
            controller.store.query('tag', { orderBy: 'name', equalTo: tag}).then(queryResult => {
              var savedTag = queryResult.objectAt(0);
              if(!savedTag) {
                // No record found with the same name. New tag has been entered. Create new tag record and save both sides of the relationship.
                var newTag = controller.store.createRecord('tag', params);
                newQuestion.get('tags').addObject(newTag);
                newQuestion.save().then(() => {
                  newTag.get('questions').addObject(newQuestion);
                  newTag.save();
                });
              } else {
                // Record found with same name. Existing tag has been entered. Use existing tag and sae both sides of the relationship.
                newQuestion.get('tags').addObject(savedTag);
                newQuestion.save().then(() => {
                  savedTag.get('questions').addObject(newQuestion);
                  savedTag.save();
                });
              }
            });
          }
        });
      }).then(() => this.transitionTo('index'));
    }
  }
});


// () => controller.transitionTo('index')
