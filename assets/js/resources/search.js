module.exports = ['Resource', function(Resource) {
  return Resource('search/:query/:displayname', {}, {
    query: {method: 'get'}
  });
}];
