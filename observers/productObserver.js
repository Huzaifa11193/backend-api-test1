
const productObserver = (event, doc) => {
switch (event) {
  case "create":
    console.log("product Created Observer", doc);
    break;
  case "update":
    console.log("product Updated Observer", doc);
    break;
  case "delete":
    console.log("product Deleted Observer", doc);
    break;
  default:
    console.log("Unknown event");
}
};

module.exports = productObserver;
