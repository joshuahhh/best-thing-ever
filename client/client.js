// Project Best Thing Ever -- client

var Router = Backbone.Router.extend({
  routes: {
    "": "root",
    "live": "live",
    "results": "results",
  },
  root: function () {
   Session.set('operation', 'ranker');
   this.navigate('/');
  },
  live: function (userId) {
   Session.set('operation', 'live');
   this.navigate('live');
  },
  results: function (userId) {
   Session.set('operation', 'results');
   this.navigate('results');
  },
});
var app = new Router;
Meteor.startup(function () {
  Backbone.history.start({pushState: true});
});

Meteor.startup(function () {
  // Why Meteor.startup? Because autorun is pretty aggressive about
  // how early it runs things, and we need our collections to be
  // defined. DEAL WITH IT.
  Deps.autorun(function () {
    if (Session.get('operation') == 'ranker') {
      if (! Session.get("session-id")) {
	console.log("No session id... let's get one");
	var session_id = Sessions.insert({});
	Session.set("session-id", session_id);
	getNewComparison();
      }
      Meteor.subscribe("comparisons-by-session-id", Session.get("session-id"));
    }
    if (Session.get('operation') == 'live') {
      Meteor.subscribe("comparisons-resolved-last-n", 10);
    }
    if (Session.get('operation') == 'results') {
      Meteor.subscribe("contenders-top-n", 10);
      Meteor.subscribe("contenders-top-n", 10, 1);
    }

    Comparisons.find({}).map(function (comp) {
      Meteor.subscribe("contenders-by-id", {$in: [comp.option1, comp.option2]});
    });
  });
});

if (matchMedia) {
  function onWidthChange(mq) {
    Session.set("wide", mq.matches);
  }

  var mq = window.matchMedia("(min-width: 500px)");
  mq.addListener(onWidthChange);
  onWidthChange(mq);
}


getNewComparison = function () {
  Meteor.call("getNewComparison", Session.get("session-id"))
};
