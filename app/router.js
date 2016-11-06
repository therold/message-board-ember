import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('new-question');
  this.route('question', {path: '/question/:question_id'});
  this.route('tag', {path: '/tag/:tag_name'});
  this.route('new-user');
  this.route('login');
  this.route('profile', {path: '/profile/:user_id'});
});

export default Router;
