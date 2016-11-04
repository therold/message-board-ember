import Ember from 'ember';

export default Ember.Service.extend({
  firebase: Ember.inject.service(),
  currentUser: null,

  add(name, password) {
      var service = this;
      var firebase = service.get('firebase');
      var params = { name: name, password: password };
      var path = firebase.child('users');
      return new Ember.RSVP.Promise(function(resolve, reject) {
        path.orderByChild('name').equalTo(name).limitToFirst(1).once('value').then(user => {
          if(user.val()) {
            reject(Error('UserExistsError'));
          } else {
            path.push(params).then(user => {
              var id = user.getKey();
              path.child(id).update({id: id}).then(() => {
                user.once('value').then(user => {
                  service.set('currentUser', user.val());
                  resolve();
                });
              });
            });
          }
        });
      });
    },

});
