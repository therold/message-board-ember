import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
    name: DS.attr('string'),

    questionCount: Ember.computed('questions', function() {
      return this.get('questions').get('length');
    })
});
