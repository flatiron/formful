var macros  = exports,
    http    = require('http'),
    formful = require('../../lib/formful');

macros.relationalTest = require('./relational');

macros.resourceTest = function (name, _id, context) {
  
  //
  // TODO: Remove this block of code, we should get back ID from created entities,
  //       and specify it for further test paths using context.before()
  //
  if (_id === null) {
    _id = 1;
  }

  return context
    .get('/')
      .expect(200)
    .get('/creatures')
      .expect(200)
    .next()
      .post('/creatures/' + _id, {})
        .expect(200)
    .next()
      .get('/creatures/' + _id)
        .expect(200)
    .next()
      .put('/creatures/' + _id, { 'type' : "Dragon" })
        .expect(200)
    .next()
      .get('/creatures/' + _id)
        .expect(200)
    .next()
      .put('/creatures/' + _id, { 'type' : "Unicorn", "life": 10 })
        .expect(200)
    .next()
      .get('/creatures/' + _id)
        .expect(200)
        /*
        .expect("should have correct type", function (err, res, body) {
           var result = JSON.parse(body);
           assert.isObject(result.creature)
           assert.equal(result.creature.type, "Unicorn");
        })
        */
    .next()
      .del('/creatures/' + _id)
        .expect(200)
    .next()
      .get('/creatures/' + _id)
        .expect(404)
};
