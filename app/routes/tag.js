import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    return Ember.RSVP.hash({
      name: params.tag_name,
      tag: this.store.query('tag', { orderBy: 'name', equalTo: params.tag_name})
      .then(result => { return result.objectAt(0); }),
      topTags: this.store.findAll('tag')
        .then(tag => tag.sortBy('questionCount').reverse().objectsAt([0,1,2,3,4]))
    });
  },

  actions: {
    search(name) {
      this.transitionTo('tag', name);
    }
  }
});
