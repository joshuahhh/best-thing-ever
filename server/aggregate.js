////////// Server only aggregation functions//////////


update_score = function (comparison) {
  if (comparison.choice===1) {
    Contenders.update({_id: comparison.option1}, {$inc: {score: 1}});
  }
  else {
    Contenders.update({_id: comparison.option2}, {$inc: {score: 1}});
  }
  console.log(Contenders);
};

create_scores = function () {
  var comparisons = Comparisons.find();
  comparisons.forEach(update_score);
};

reset_scores = function () {
  var contenders = Contenders.find();
  Contenders.update({}, {$set: {score: 0}}, {multi: true});
};



/*
  Each comparison is represented by a document in the Comparisons collection:
    option1: contender id
    option2: contender id
    choice: int (1 or 2)
    session: session id
*/
