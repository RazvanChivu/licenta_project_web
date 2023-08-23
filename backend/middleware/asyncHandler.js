//function that takes request, response and next and resolve a promise
//if it's resolved it's gonna call next which then calls the next piece of middleware
//so that we don't ave to write catch everytime

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export default asyncHandler;