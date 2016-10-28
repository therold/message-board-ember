import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr('string'),
  body: DS.attr('string'),
  author: DS.attr('string'),
  timestamp: DS.attr('number', { defaultValue() {
    var now = new Date();
    return now.getTime();
    }
  })
});
