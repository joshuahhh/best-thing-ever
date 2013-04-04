////////// Server-only aggregation functions //////////


update_score = function (comp) {
  var winnerID = (comp.choice == 1 ? comp.option1 : comp.option2);
  Contenders.update({_id: winnerID}, {$inc: {score: 1}});
};

create_scores = function () {
  Comparisons.find({}).forEach(update_score);
};

reset_scores = function () {
  Contenders.update({}, {$set: {score: 0}}, {multi: true});
};
