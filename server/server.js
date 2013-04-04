// Best Thing Ever -- server

Meteor.publish("comparisons-by-session-id", function (sessionId) {
  return Comparisons.find({session: sessionId});
});

Meteor.publish("comparisons-all", function (sessionId) {
  return Comparisons.find({});
});

Meteor.publish("contenders-by-id", function (contenderId) {
  return Contenders.find({_id: contenderId});
});

Meteor.publish("contenders-all", function () {
  return Contenders.find({});
});
