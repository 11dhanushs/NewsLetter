// jshint esversion:6
const express = require("express");
const app = express();
const https = require("https");
const body_parser = require("body-parser");
app.use(express.static("public"));
app.use(body_parser.urlencoded({
  extended: true
}));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});
app.post("/", (req, res) => {
  const fname = req.body.first_name;
  const lname = req.body.last_name;
  const email = req.body.inputEmail;
  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: fname,
        LNAME: lname
      }
    }]
  };

  const jsondata = JSON.stringify(data);
  const url = "https://us2.api.mailchimp.com/3.0/lists/12acec7da7?skip_merge_validation=<SOME_BOOLEAN_VALUE>&skip_duplicate_check=<SOME_BOOLEAN_VALUE";
  const options = {
    method: "POST",
    auth: "e19cse011:dc139f0cc6a9190fb1c3dae0ae016bd7-us2"
  };
  const request = https.request(url, options, (response) => {
    if (response.statusCode==200)
    {
      res.sendFile(__dirname+"/success.html");
    }
    else{
      res.sendFile(__dirname+"/failure.html");
    }
    response.on("data",(data)=>{
      console.log(JSON.parse(data));
    });
  });
  request.write(jsondata);
  request.end();
});
app.post("/failure",(req,res)=>{
  res.redirect("/");
});
app.post("/success",(req,res)=>{
  res.redirect("/");
});
app.listen(process.env.PORT||3000,() => {
  console.log("Server is set up at port 3000");
});
// API Key
// dc139f0cc6a9190fb1c3dae0ae016bd7-us2
//Audience
// 12acec7da7
