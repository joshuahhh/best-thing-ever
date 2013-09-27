////////// Server-only aggregation functions //////////

update_score = function (cont) {
  var tot = cont.wins + cont.losses;
  var score = cont.wins/tot - 1/Math.sqrt(tot);
  // var score = (cont.wins || 0) - (cont.losses || 0);
  Contenders.update({_id: cont._id}, {$set: {score: score}});
}

apply_comparison = function (comp) {
  var winnerID = (comp.choice == 1 ? comp.option1 : comp.option2);
  var loserID  = (comp.choice == 1 ? comp.option2 : comp.option1);
  Contenders.update({_id: winnerID}, {$inc: {wins: 1}});
  Contenders.update({_id: loserID}, {$inc: {losses: 1}});
  Contenders.find({_id: {$in: [winnerID, loserID]}}).forEach(update_score);
};

create_scores = function () {
  Comparisons.find({}).forEach(apply_comparison);
};

reset_scores = function () {
  Contenders.update({},
		    {$set: {score: 0, wins: 0, losses: 0}},
		    {multi: true});
};
