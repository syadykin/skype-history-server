module.exports = ['Resource', function(Resource) {
  return Resource('rooms/:displayname', {}, {
    all: {method: 'get', isArray: true},
    room: {method: 'get'}
  });
}];
