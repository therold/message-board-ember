import Ember from 'ember';

export default Ember.Component.extend({
  userService: Ember.inject.service(),
  userInvalid: false,

  actions: {
    cancel() {
      this.sendAction('cancel');
    },
    login() {
      var params = {
        name: this.get('name'),
        password: this.get('password')
      };
      this.get('userService').login(params.name, params.password)
      .then(() => {
        this.sendAction('loginComplete');
      })
      .catch((error) => {
        if(error.message === 'UserInvalidError') {
          this.set('userInvalid', true);
        }
      });
    }
  }
});
