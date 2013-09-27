// "COMPARISONS" TEMPLATE 
//   This template should be instantiated in a context where "this" is a
//   set of comparison objects.

Template.comparisons.helpers({
  comparisons: function () {return this;}
});



// "COMPARISON" SUBTEMPLATE
//   This template should be instantiated in a context where "this" is a
//   comparison object.

Template.comparison.helpers({
  wide: function () {return Session.get("wide");},
  option1name: function () {
    if (contender1 = Contenders.findOne({_id: this.option1})) {
      return contender1.name;
    }
  },
  option2name: function () {
    if (contender2 = Contenders.findOne({_id: this.option2})) {
      return contender2.name;
    }
  },
  option1selected: function () {
    return this.choice == 1;
  },
  option2selected: function () {
    return this.choice == 2;
  },
  option1score: function () {
    if (this.choice && (contender1 = Contenders.findOne({_id: this.option1}))) {
      return contender1.score.toFixed(2) || 0;
    }
  },
  option2score: function () {
    if (this.choice && (contender2 = Contenders.findOne({_id: this.option2}))) {
      return contender2.score.toFixed(2) || 0;
    }
  },
  time: function () {
    return "" + new Date(this.time_resolved);
  }
});

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
  },
  'mouseenter .comparison-row, mouseleave .comparison-row': function (event) {
    if (event.type == 'mouseenter') {
      $(event.currentTarget).addClass("hovered");
    } else {  // event.type == 'mouseleave'
      $(event.currentTarget).removeClass("hovered");
    }
    return false;
  },
});

Template.comparison.rendered = function () {
  $(".time").prettyDate();
  setInterval(function(){ $(".time").prettyDate(); }, 2000);
  console.log(this);
  console.log(this.find("tr"));
  console.log(this.firstNode);
  $(this.find("tr"))
    .find('td')
    .wrapInner('<div style="display: block;" />')
    .parent()
    .find('td > div')
    .slideDown(400, function () {
      //$(this).parent().parent().remove();
    });
}

/*
Template.comparison.rendered = function () {
   $('.popovered').popover('show'); //initialize all tooltips in this template
};
*/
