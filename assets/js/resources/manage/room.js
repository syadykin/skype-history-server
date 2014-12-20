module.exports = ['Resource', function(Resource) {
  return Resource('manage/rooms/:id', {id: '@_id'});
}];
