const app = require("./kernel");

const port = process.env.PORT || 9000;

app.listen(port, function () {
  console.log(`Server Started on port : ${port}`);
});
