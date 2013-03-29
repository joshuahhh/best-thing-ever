// Best Thing Ever -- data model
// Loaded on both the client and the server

///////////////////////////////////////////////////////////////////////////////
// Contenders

/*
  Each contender is represented by a document in the Contenders collection:
    name: String
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
  submitComparison: function(comparison) {
    Comparisons.insert(comparison);

    if (Meteor.isServer) {
      updateRankings();
    }
  }
});
