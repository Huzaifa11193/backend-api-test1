//checkpermission middleware
const checkPermission = (status) => (req, res, next) => {
  if (status) {
    next();
  } else {
    res.status(403).json({ message: "Forbidden" });
  }
};
module.exports = { checkPermission };

//checkPermission(true)(req, res, () => {});
