// Ranker -- client

Meteor.startup(function () {
  Deps.autorun(function () {
    if (! Session.get("session-id")) {
      console.log("No session id... let's get one");
      var session_id = Sessions.insert({});
      Session.set("session-id", session_id);
      getNewComparison();
    }
  });
  Deps.autorun(function () {
    Meteor.subscribe("comparisons-by-session-id", Session.get("session-id"));
  });
  Deps.autorun(function () {
    Comparisons.find({}).map(function (comp) {
      Meteor.subscribe("contenders-by-id", {$in: [comp.option1, comp.option2]});
    });
  });
});

getNewComparison = function () {
  Meteor.call("getNewComparison", Session.get("session-id"))
};

Template.page.showRanking = function () {
  return Session.get("showRanking");
}

Template.page.showBetterFAQ = function () {
  return Session.get("showBetterFAQ");
}

Template.page.id = function () {
  console.log("session-id is...");
  console.log(Session.get("session-id"));
  return Session.get("session-id");
};

Template.comparisons.comparisons = function () {
  return Comparisons.find({session: Session.get("session-id")},
			  {sort: {time_issued: -1}});
};

Template.comparisons.loading = function () {
  return !Comparisons.findOne({session: Session.get("session-id")});
};

Template.comparisons.events({
  'click #better-faq-asterisk': function () {
    var old = Session.get("showBetterFAQ");
    Session.set("showBetterFAQ", !old);
    return !old;  // if the faq is present, go to it!
  }
});

Template.comparison.option1name = function () {
  if (contender1 = Contenders.findOne({_id: this.option1})) {
    return contender1.name;
  }
}
Template.comparison.option2name = function () {
  if (contender2 = Contenders.findOne({_id: this.option2})) {
    return contender2.name;
  }
}
Template.comparison.option1selected = function () {
  return this.choice == 1;
}
Template.comparison.option2selected = function () {
  return this.choice == 2;
}

Template.comparison.events({
  'click .option1': function () {
    if (!this.choice) {
	Meteor.call("submitComparison", this._id, 1);
	getNewComparison();
    }
    return false;
  },
  'click .option2': function () {
    if (!this.choice) {
	Meteor.call("submitComparison", this._id, 2);
	getNewComparison();
    }
    return false;
  }
});

Template.ranking.contenders = function () {
    return Contenders.find({}, {sort: {score: -1, name: 1}});
}
