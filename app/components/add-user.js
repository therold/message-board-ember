import Ember from 'ember';

export default Ember.Component.extend({
  userService: Ember.inject.service(),
  userExists: false,

  actions: {
    cancel() {
      this.sendAction('cancel');
    },
    addUser() {
      var params = {
        name: this.get('name'),
        password: this.get('password')
      };
      this.get('userService').add(params.name, params.password)
      .then(() => {
        this.sendAction('userAdded');
      })
      .catch((error) => {
        if(error.message === 'UserExistsError') {
          this.set('userExists', true);
        }
      });
    }
  }
});
