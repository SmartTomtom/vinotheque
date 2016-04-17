import { Template } from 'meteor/templating';
import { Wines } from '../imports/api/wines/wines.js';
import { Bottles } from '../imports/api/bottles/bottles.js';
import { CellarEvents } from '../imports/api/cellar-events/cellar-events.js';

import './main.html';

Template.body.helpers({
  wines() {
    // Show wines
    return Wines.find({});
  },
  bottles() {
    // Show bottles
    return Bottles.find({});
  },
  entries() {
    // Show entries
    return CellarEvents.find({ type: "in"});
  },
});

Template.newEntry.helpers({
  wines() {
    // Show wines
    return Wines.find({});
  },
});

Template.newEntry.events({
  "submit #new-entry": function(event, template){
    // Prevent default browser form submit
    event.preventDefault();

    // Get values from form
    const target = event.target;
    const date = target.date.value;
    const index = target.wine.selectedIndex;
    const wineId = target.wine.options[index].value;
    const millesime = target.millesime.value;
    const quantity = target.quantity.value;
    const comments = target.comments.value;

    // Insert bottles into the collection
    Bottles.insert({
      wineId: wineId,
      millesime: millesime,
      quantity: quantity,
    });

    // Insert entries into the collection
    // CellarEvents.insert({
    //   date: date,
    //   type: "in",
    //   quantity: quantity,
    //   bottleId: bottleId,
    // });

    // Clear form
    target.date.value = '';
    target.wine.selectedIndex=0;
    target.millesime.value = '';
    target.quantity.value = '';
    target.comments.value = '';
  }
});

Template.newWine.events({
  "submit #new-wine": function(event, template){
    // Prevent default browser form submit
    event.preventDefault();

    // Get values from form
    const target = event.target;
    const color = target.color.value;
    const designation = target.designation.value;
    const domain = target.domain.value;

    // Insert a wine into the collection
    Wines.insert({
      color: color,
      designation: designation,
      domain: domain,
    });

    // Clear form
    target.color.value = '';
    target.designation.value = '';
    target.domain.value = '';
  }
});
