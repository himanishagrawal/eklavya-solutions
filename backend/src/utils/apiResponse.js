// Consistent response shape across every endpoint in the API,
// so the frontend service layer can rely on one contract.
function success(res, data, meta = null, status = 200) {
  return res.status(status).json({ success: true, data, error: null, meta });
}

function failure(res, message, status = 400, details = null) {
  return res.status(status).json({ success: false, data: null, error: { message, details } });
}

module.exports = { success, failure };
