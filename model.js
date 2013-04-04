// Best Thing Ever -- data model
// Loaded on both the client and the server

///////////////////////////////////////////////////////////////////////////////
// Contenders

/*
  Each contender is represented by a document in the Contenders collection:
    name: String
    random: Number (random in range 0-1, for sampling)
    score: Int (aka ranking)
*/
Contenders = new Meteor.Collection("contenders");

Contenders.allow({
  insert: function (userId, contender) {
    return false;
  },
  update: function (userId, contender, fields, modifier) {
    return false;
  },
  remove: function (userId, contender) {
    return false;
  }
});

if (Meteor.isServer) {
  Meteor.startup(function () {
    Contenders._ensureIndex({key: 1, random: 1});
    url = "http://web.mit.edu/joshuah/Public/article_names.txt";
    Meteor.http.get(url, function (error, result) {
      names = result.content.split('\n');
      for (var i = 0; i < names.length; i++) {
        if (! Contenders.findOne({name: names[i]})) {
          Contenders.insert({
            name: names[i],
            random: Math.random()
          });
        }
      }
    });
  });
};

randomContender = function () {
  allContenders = Contenders.find().fetch();
  return allContenders[Math.floor(Math.random()*allContenders.length)];

  /*
  // TODO: this doesn't really work
  var rand = Math.random();
  var cmp = Math.random();
  var method1 = {$gte: rand}, method2 = {$lte: rand};
  if (cmp < 0.5) {
    method1 = {$lte: rand}; method2 = {$gte: rand};
  }
  var result = Contenders.findOne({random: method1});
  if (result == null) {
    result = Contenders.findOne({random: method2});
  }
  return result;
  */
};


///////////////////////////////////////////////////////////////////////////////
// Sessions

/*
  Each session is represented by a document in the Sessions collection:
    [currently no parameters; just server-generated id]
*/
Sessions = new Meteor.Collection("sessions");


///////////////////////////////////////////////////////////////////////////////
// Comparisons

/*
  Each comparison is represented by a document in the Comparisons collection:
    option1: contender id
    option2: contender id
    choice: int (1 or 2)
    session: session id
    time_issued: number (time comparison issued)
    time_resolved: number (time comparison resolved)
*/
Comparisons = new Meteor.Collection("comparisons");

Meteor.methods({
  getNewComparison: function(session_id) {
    if (Meteor.isServer) {   // prevent fake randoms on client
      var option1 = randomContender()._id, option2 = option1;
      while (option2 == option1) {
	option2 = randomContender()._id;
      }
      comparison = {option1: option1,
		    option2: option2,
       		    session: session_id,
		    time_issued: Date.now()};
      Comparisons.insert(comparison);
      return comparison;
    }
  },

  submitComparison: function(comparison_id, choice) {
    Comparisons.update({ _id: comparison_id},
                       {$set: {'choice': choice,
                               'time_resolved': Date.now()}});
    if (Meteor.isServer) {
      update_score(Comparisons.findOne({_id:comparison_id}))
    }
  }
});
