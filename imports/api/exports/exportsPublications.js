import { Meteor } from 'meteor/meteor';
import { ExportsCollection } from '../../db/ExportsCollection';

Meteor.publish('listExports', function publishExports() {
  return  ExportsCollection.find({}, { sort: { createdAt: -1 } });
});

Meteor.publish('exportStatusChanged', function () {
  const publication = this;

  // Observe the changes in the collection
  const observer = ExportsCollection.find().observeChanges({
    changed: function (id, fields) {
      // Check if the "status" field has changed
      if ('status' in fields) {
        // Publish the updated document to the client
        publication.changed('ExportsCollection', id, fields);
      }
    }
  });

  // Stop observing when the subscription is stopped
  publication.onStop(function () {
    observer.stop();
  });

  publication.ready();
});