// Best Thing Ever -- data model
// Loaded on both the client and the server

///////////////////////////////////////////////////////////////////////////////
// Contenders

/*
  Each contender is represented by a document in the Contenders collection:
    name: String
    random: Number (random in range 0-1, for sampling)
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

dumb_names = [
  'Devil (film)',
  'Nicole Polizzi',
  'The Chronicles of Narnia: Prince Caspian',
  'The Green Hornet',
  'Scientology',
  'Keyshia Cole',
  'Florence and the Machine',
  'Jeffrey Dahmer',
  'Ottoman Empire',
  'Ted Bundy',
  'Nikola Tesla',
  'Belarus',
  'The Twilight Saga: Breaking Dawn',
  'Pornography',
  'The Hangover (film)',
  'Super Bowl XLV',
  'Hungary',
  'Darren Aronofsky',
  'CSI: Crime Scene Investigation',
  'Swan Lake'
]

if (Meteor.isServer) {
  Meteor.startup(function () {
    Contenders._ensureIndex({key: 1, random: 1});

    /* TODO: populate database for real */
    for (var i = 0; i < dumb_names.length; i++) {
      if (! Contenders.findOne({name: dumb_names[i]})) {
        Contenders.insert({
          name: dumb_names[i],
          random: Math.random()
        });
      }
    }
  });
};

randomContender = function () {
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
};


///////////////////////////////////////////////////////////////////////////////
// Sessions

/*
  Each session is represented by a document in the Sessions collection:
    id: client-generated id
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
*/
Comparisons = new Meteor.Collection("comparisons");

Meteor.methods({
  getNewComparison: function(session_id) {
    // TODO: could be the same???
    var option1 = randomContender()._id, option2 = option1;
    while (option2 == option1) {
      option2 = randomContender()._id;
    }
    comparison = {option1: option1,
		  option2: option2,
		  session: session_id};
    return Comparisons.insert(comparison);
  },

  submitComparison: function(comparison) {
    Comparisons.insert(comparison);

    if (Meteor.isServer) {
      // TODO: figure this out
      /*updateRankings();*/
    }
  }
});
