// PHASE 2: guards any route shaped /students/:id(/...) so a student
// can only read or modify their OWN profile/skills. Must run after
// requireAuth (needs req.user) and before the controller.
//
// req.user.studentId is set at token-issue time in authService, so
// this is a simple, fast comparison with no extra DB lookup.
function requireOwnStudent(req, res, next) {
  const { id } = req.params;

  if (!req.user?.studentId || req.user.studentId !== id) {
    const err = new Error('You can only access your own student profile');
    err.status = 403;
    err.expose = true;
    return next(err);
  }

  return next();
}

module.exports = { requireOwnStudent };
