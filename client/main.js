import { Template } from 'meteor/templating';
import { Wines } from '../imports/api/wines/wines.js';

import './main.html';

Template.newWine.events({
  "submit #new-wine": function(event, template){
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form
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

Template.body.helpers({
  wines() {
    // Show newest tasks at the top
    return Wines.find({});
  },
});
