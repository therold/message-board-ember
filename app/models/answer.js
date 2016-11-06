import DS from 'ember-data';
import Ember from 'ember';
import moment from 'moment';

export default DS.Model.extend({
  body: DS.attr('string'),
  author: DS.attr('string'),
  score: DS.attr('number', { defaultValue() { return 1; }}),
  timestamp: DS.attr('number', { defaultValue() { return moment(); }}),
  user: DS.attr('string'),
  question: DS.attr('string'),

  body_htmlSafe: Ember.computed('body', function() {
    return Ember.String.htmlSafe(this.get('body').replace(/\r?\n/g, '<br>').replace(/  /g, '&nbsp;&nbsp;'));
  }),
  date: Ember.computed('timestamp', function() {
    var now = moment();
    var then = this.get('timestamp');
    return `${moment.duration(now - then, "milliseconds").humanize()} ago`;
  })
});
