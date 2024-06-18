
const orderObserver = (event, doc) => {
switch (event) {
  case "create":
    console.log("order Created Observer", doc);
    break;
  case "update":
    console.log("order Updated Observer", doc);
    break;
  case "delete":
    console.log("order Deleted Observer", doc);
    break;
  default:
    console.log("Unknown event");
}
};

module.exports = orderObserver;
