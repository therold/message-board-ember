import Ember from 'ember';

export function shortAnswer(params) {
  var answer = params[0];
  const BODYLENGTH = 80;
  if(answer.get('body').length < BODYLENGTH) {
    return answer.get('body_htmlSafe');
  } else {
    return Ember.String.htmlSafe(answer.get('body').substr(0, BODYLENGTH).replace(/\r?\n/g, '<br>').replace(/  /g, '&nbsp;&nbsp;') + '...' );
  }
}

export default Ember.Helper.helper(shortAnswer);
