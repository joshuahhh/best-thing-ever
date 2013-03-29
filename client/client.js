// Ranker -- client

Meteor.startup(function() {
  Deps.autorun(function () {
    if (! Session.get("session-id")) {
      var session_id = Sessions.insert({});
      Session.set("session-id", session_id);
    }
  });
});

Template.page.id = function() {
  return Session.get("session-id");
}
