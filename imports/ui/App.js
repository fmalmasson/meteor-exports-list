import { Template } from 'meteor/templating';
import { ExportsCollection } from '../db/ExportsCollection';
import { CustomersCollection } from '../db/CustomersCollection';

import 'toastr/build/toastr.min.css';
import toastr from 'toastr';

import './App.html';
import './templates/customers/customer.html';
import './templates/customers/customer-form.html';
import './templates/exports/export.html';

const URL_LIST = "urlList";

Template.mainContainer.onCreated(function mainContainerOnCreated() {
  Meteor.subscribe('listExports');
  Meteor.subscribe('listCustomers');
});

Template.mainContainer.helpers({
  exports() {
    return ExportsCollection.find({}, { sort: { createdAt: -1 } });
  },
  customers() {
    return CustomersCollection.find({});
  },
  customersTotal() {
    return CustomersCollection.find().count();
  },
  exportsTotal() {
    return ExportsCollection.find().count();
  },
});

Template.export.onCreated(function exportOnCreated() {
  const self = this;
  const exportId = this.data._id;

  self.autorun(() => {
    const subscription = Meteor.subscribe('exportStatusChanged', exportId);

    if (subscription.ready()) {
      const exportData = ExportsCollection.findOne({ _id: exportId });
      if (exportData && exportData.status === 100) {
        toastr.success(`Your export ${exportId} is ready`);
      }
    }
  });
});

Template.export.helpers({
  formatedDate(date) {
    return new Date(date).toLocaleString();
  },
  fileName() {
    return `Export-${this._id}`;
  },
  // when export is processed, show loader, when done, show url as status
  showExportStatus() {
    return typeof this.status === 'string';
  },
  progress() {
    if( typeof this.status === 'number')
    return `${this.status} %`;
  },
  alert() {
    if (typeof this.status === 'string') {
      toastr.success(`Your export ${this._id} is ready`);
    }
  }
})

Template.mainContainer.events({
  "click #btn-export-selection"() {
    Meteor.call('exports.insert');
  },

  "click #delete-customer"() {
    Meteor.call('customers.remove', this._id);
  },

  "click #delete-export"() {
    Meteor.call('exports.remove', this._id);
  }
})

Template.customerForm.events({
  "submit .customer-form"(event) {
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    const target = event.target;

    const infos = {
      firstname: target.firstname.value,
      lastname: target.lastname.value,
      email: target.email.value
    }

    // Insert a customer into the collection
    Meteor.call('customers.insert', infos);

    // Clear form
    [
      'firstname',
      'lastname',
      'email',
    ].forEach(input => target[input].value = '')
  }
})