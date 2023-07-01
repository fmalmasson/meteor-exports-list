import { Meteor } from 'meteor/meteor';
import { ExportsCollection } from '../../db/ExportsCollection';

Meteor.publish('listExports', function publishExports() {
  return  ExportsCollection.find({}, { sort: { createdAt: -1 } });
});

Meteor.publish('exportStatusChanged', function(exportId) {
  const self = this;

  const observer = ExportsCollection.find({ _id: exportId, status: 100 }).observeChanges({
    changed: function(id, fields) {
      if (fields.hasOwnProperty('status')) {
        self.changed('exports', id, { status: fields.status });
      }
    }
  });

  self.ready();

  self.onStop(function() {
    observer.stop();
  });
});