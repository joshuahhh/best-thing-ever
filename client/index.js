sessionGetter = function (name) {
  return function () {
    return Session.get(name);
  };
};

branchHelpers = {
  operation: sessionGetter("operation"),
  equal: function (a, b) {return (a == b);},
};

Template.page.helpers(branchHelpers);
Template.footer.helpers(branchHelpers);

Template.pageRanker.helpers({
  showRanking: sessionGetter("showRanking"),
  showBetterFAQ: sessionGetter("showBetterFAQ"),
  id: sessionGetter("session-id"),
  comparisonsSource: function () {
    return Comparisons.find({session: Session.get("session-id")},
			    {sort: {time_issued: -1}});
  },
  loading: function () {
    return !Comparisons.findOne({session: Session.get("session-id")});
  }
});
Template.pageRanker.events({
  'click #better-faq-asterisk': function () {
    Session.set("showBetterFAQ", true);
    $("#better-faq-container")[0].scrollIntoView();
    return false;
  }
});

Template.footerRanker.helpers({
  id: sessionGetter("session-id")
});

Template.pageLive.helpers({
  comparisonsSource: function () {
    return Comparisons.find({choice: {$in: [1, 2]}},
			    {sort: {time_issued: -1},
			     limit: 10});
  }
});

Template.pageResults.helpers({
  bestContenders: function () {
    return Contenders.find({},
			   {sort: {score: -1},
			    limit: 10});
  },
  worstContenders: function () {
    return Contenders.find({},
			   {sort: {score: 1},
			    limit: 10});
  },
  score: function () {
    return this.score.toFixed(2);
  }
});
