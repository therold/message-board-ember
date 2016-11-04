import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
    name: DS.attr('string'),
    questions: DS.attr('Object'),

    questionCount: Ember.computed('questions', function() {
      return Object.keys(this.get('questions')).length;
    })
});
