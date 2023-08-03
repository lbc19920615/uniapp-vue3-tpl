/**
 *
 * @returns {Date}
 */
Date.getLocalDate = function() {
  const now = new Date();
  return  new Date(now.getTime() - now.getTimezoneOffset() * 60000);
}
