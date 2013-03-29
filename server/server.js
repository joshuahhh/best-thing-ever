// Best Thing Ever -- server

Meteor.publish("comparisons", function (sessionId) {
  return Comparisons.find({session: sessionId});
});
