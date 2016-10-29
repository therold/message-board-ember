import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    return Ember.RSVP.hash({
      name: params.tag_name,
      tag: this.store.query('tag', { orderBy: 'name', equalTo: params.tag_name})
      .then(result => { return result.objectAt(0); })
    });
  },

  actions: {
    search(name) {
      this.transitionTo('tag', name);
    }
  }
});
