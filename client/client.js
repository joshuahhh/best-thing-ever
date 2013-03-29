// Ranker -- client

Meteor.startup(function() {
  Deps.autorun(function () {
    if (! Session.get("id")) {
      Session.set("id", Random.id());
    }
  });
});

Template.page.id = function() {
  return Session.get("id");
}

Template.rankings.contenders = function () {
	return Contenders.find({}, {sort: {score: -1, name: 1}})
}