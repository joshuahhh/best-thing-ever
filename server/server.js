// Best Thing Ever -- server

Meteor.publish("comparisons-by-session-id", function (sessionId) {
  return Comparisons.find({session: sessionId});
});

Meteor.publish("comparisons-all", function (sessionId) {
  return Comparisons.find({});
});

Meteor.publish("comparisons-resolved-last-n", function (n) {
  // TODO: max n?
  return Comparisons.find({choice: {$in: [1, 2]}},
			  {sort: {time_issued: -1},
			   limit: n});
});

Meteor.publish("contenders-by-id", function (contenderId) {
  return Contenders.find({_id: contenderId});
});

Meteor.publish("contenders-all", function () {
  return Contenders.find({});
});

Meteor.publish("contenders-top-n", function (n, sortType) {
  sortType = typeof sortType !== 'undefined' ? sortType : -1;
  return Contenders.find({},
			 {sort: {score: sortType},
			  limit: n});
});
