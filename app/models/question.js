import DS from 'ember-data';
import Ember from 'ember';
import moment from 'moment';

export default DS.Model.extend({
  title: DS.attr('string'),
  body: DS.attr('string'),
  author: DS.attr('string'),
  timestamp: DS.attr('number', { defaultValue() { return moment(); }}),
  answers: DS.hasMany('answer', { async: true }),
  tags: DS.hasMany('tag', { async: true }),

  date: Ember.computed('timestamp', function() {
    var now = moment();
    var then = this.get('timestamp');
    return `${moment.duration(now - then, "milliseconds").humanize()} ago`;
  })
});
