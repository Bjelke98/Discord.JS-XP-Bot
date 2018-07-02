const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
var bodyParser = require("body-parser");
var request = require("request");
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

var xpr = fs.readFileSync('./xp.json');
var xp = JSON.parse(xpr);
var infoUrl = "https://discordapp.com/api/guilds/"serverID"/widget.json"; // Server widget url
function giveXP() {
  //console.log("Interval Started");
  request(infoUrl, function(error, response, body){
    if(!error && response.statusCode == 200){
      var parsedData = JSON.parse(body);
      var memberz = parsedData['members'];
      memberz.forEach(function(m){
        if(m['channel_id'] && m['channel_id'] != "262570303346049026"){
          //console.log(m['id'] + " " + m['channel_id'] + " " + m['username']);
          var usr = m['id'];
          if (!xp[usr]) xp[usr] = {xpp: 0};
          xp[usr].xpp++;
          fs.writeFileSync("./xp.json", JSON.stringify(xp, null, 2), (err) => {
            if (err) console.error(err);
          });
        }
      });
    }
  });
}
setInterval(giveXP, 300000, infoUrl, xp);
// 300000
client.on('message', msg => {
  if (msg.content === '!bb help') {
    msg.reply('Commands: !bb xp, !bb help');
  }
  if (msg.content === '!bb xp') {
    var usr2 = msg.author.id;
    if (!xp[usr2]) {
      xp[usr2] = {xpp: 0};
      fs.writeFileSync("./xp.json", JSON.stringify(xp, null, 2), (err) => {
        if (err) console.error(err);
      });
      msg.reply(`Voice XP = 0`);
    } else {
      var oidi = xp[msg.author.id];
      let getDatt = oidi.xpp;
      msg.reply(`Voice XP = ${getDatt}`);
    }
  }
});
client.login('Bot ID Login');
