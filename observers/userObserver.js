const userObserver = (event, doc) => {
  switch (event) {
    case "create":
      console.log("User Created Observer", doc);
      break;
    case "update":
      console.log("User Updated Observer", doc);
      break;
    case "delete":
      console.log("User Deleted Observer", doc);
      break;
    default:
      console.log("Unknown event");
  }
};

module.exports = userObserver;
