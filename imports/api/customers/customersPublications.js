import { Meteor } from 'meteor/meteor';
import { CustomersCollection } from '../../db/CustomersCollection';

Meteor.publish('listCustomers', function publishExports() {
  return  CustomersCollection.find({}, { sort: { createdAt: -1 } });
});