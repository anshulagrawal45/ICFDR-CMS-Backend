const { default: axios } = require("axios");
require("dotenv").config();
// let CLIENT_ID = "390139244489-92v6mqj5oljo5a6iago8q8445eu35lpd.apps.googleusercontent.com"
// let CLIENT_SECRET = "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"

exports.sendWhatsapp = (app) => {
  app.post("/sendWhatsapp", async (req, res) => {
    let { number, name, userid, password } = req.body;
    try {
      axios
        .get(
          `https://voice.roundsms.co/api/sendmsg.php?user=ICFDRWA&pass=123456&sender=BUZWAP&phone=${number}&text=platform1&priority=wa&stype=normal&Params=${name},${userid},${password}`
        )
        .then((data) => res.send(data));
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  });
};
