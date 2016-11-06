import Ember from 'ember';

export default Ember.Service.extend({
  firebase: Ember.inject.service(),
  store: Ember.inject.service(),
  questionService: Ember.inject.service(),
  currentUser: null,

  find(user_id) {
    var store = this.get('store');
    return store.find('user', user_id);
  },

  findByQuestionId(question_id) {
    var store = this.get('store');
    var questionService = this.get('questionService');

    return questionService.getUserId(question_id).then(user_id => {
      return store.find('user', user_id);
    });
  },



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

  login(name, password) {
    var service = this;
    var firebase = service.get('firebase');
    var params = { name: name, password: password };
    var path = firebase.child('users');
    return new Ember.RSVP.Promise(function(resolve, reject) {
      path.orderByChild('name').equalTo(name).limitToFirst(1).once('value').then(data => {
        var user = data.val();
        if(!user) {
          reject(Error('UserInvalidError'));
        } else {
          var user_id = Object.keys(user)[0];
          if(params.password !== user[user_id].password) {
            reject(Error('UserInvalidError'));
          } else {
            service.set('currentUser', user[user_id]);
            resolve();
          }
        }
      });
    });
  },

  getQuestionIds(user_id) {
    var firebase = this.get('firebase');
    var question_ids = [];
    return firebase.child(`users/${user_id}/questions`).once('value').then(data => {
      data.forEach(question => { question_ids.push(question.key); });

      return question_ids;
    });
  },

  getAnswerIds(user_id) {
    var firebase = this.get('firebase');
    var answer_ids = [];
    return firebase.child(`users/${user_id}/answers`).once('value').then(data => {
      data.forEach(answer => { answer_ids.push(answer.key); });
      return answer_ids;
    });
  },

  // init() {
  //   var params = { id: "-KVhX7UC6W2mQ1VF1tfx", name: 'autoLogin' };
  //   this.set('currentUser', params);
  // },

  logout() {
    this.set('currentUser', null);
  }
});
