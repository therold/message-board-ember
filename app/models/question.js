import DS from 'ember-data';
import Ember from 'ember';
import moment from 'moment';

export default DS.Model.extend({
  title: DS.attr('string'),
  body: DS.attr('string'),
  user: DS.attr('string'),
  timestamp: DS.attr('number'),

  body_htmlSafe: Ember.computed('body', function() {
    return Ember.String.htmlSafe(this.get('body').replace(/\r?\n/g, '<br>').replace(/  /g, '&nbsp;&nbsp;'));
  }),
  date: Ember.computed('timestamp', function() {
    var now = moment();
    var then = this.get('timestamp');
    return `${moment.duration(now - then, "milliseconds").humanize()} ago`;
  })
});
