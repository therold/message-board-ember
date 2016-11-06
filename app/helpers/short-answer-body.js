import Ember from 'ember';

export function shortAnswer(params) {
  var body = params[0].get('body');
  if(body.length < 20) {
    return body;
  } else {
    return body.substr(0, 20) + '...';
  }
}

export default Ember.Helper.helper(shortAnswer);
