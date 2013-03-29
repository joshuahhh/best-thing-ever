// Ranker -- client

Meteor.startup(function() {
  Deps.autorun(function () {
    if (! Session.get("session-id")) {
      var session_id = Sessions.insert({});
      Session.set("session-id", session_id);
      Meteor.subscribe("comparisons", session_id);
      getNewComparison();
    }
  });
});

getNewComparison = function () {
  Meteor.call("getNewComparison", Session.get("session-id"));
};

Template.page.id = function () {
  console.log("session-id is...")
  console.log(Session.get("session-id"));
  return Session.get("session-id");
};

Template.comparisons.comparisons = function () {
  // console.log(Session.get("comparisons"));
  return Comparisons.find({session: Session.get("session-id")});
};

Template.comparison.option1name = function () {
  return Contenders.findOne({_id: this.option1}).name;
}
Template.comparison.option2name = function () {
  return Contenders.findOne({_id: this.option2}).name;
}
Template.comparison.option1selected = function () {
  return this.choice == 1;
}
Template.comparison.option2selected = function () {
  return this.choice == 2;
}

Template.comparison.events({
  'click .option1': function () {
    Comparisons.update({ _id: this._id},
                       {$set: { 'choice': 1}});
    getNewComparison();
    return false;
  },
  'click .option2': function () {
    Comparisons.update({ _id: this._id},
                       {$set: { 'choice': 2}});
    getNewComparison();
    return false;
  }
});

Template.rankings.contenders = function () {
    return Contenders.find({}, {sort: {score: -1, name: 1}})
}
