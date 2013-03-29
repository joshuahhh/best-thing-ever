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
