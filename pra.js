const login = require("facebook-chat-api");
const fs = require('fs');
const credential = { appState: JSON.parse(fs.readFileSync('appstate.json', 'utf8')) };

login(credential, (err, api) => {
    if (err) return console.error(err);
    api.setOptions({ selfListen: true });

    api.listenMqtt((err, message) => {
        var mess;
        var senderName;
        if (message.body != undefined) {
            //GET THREAD SIZE
            api.getThreadInfo(message.threadID, (err, info) => {
                if (err) return console.error(err);
                var msCount = info.messageCount;
            });

            //GET MESSAGE INFO
            api.getUserInfo(message.senderID, (err, ret) => {
                if (err) return console.error(err);
                for (var i in ret) {
                    senderName = ret[i].name;
                    console.log(senderName + ": " + message.body);
                }
            });

            //SEND MESSAGE
            if (message.body.toString().slice(0, 1) === '!') {
                var mess = message.body.toString().slice(1, message.body.length);
                api.sendMessage({
                    body: ' ' + mess,
                    mentions: [{
                        tag: ' ' + mess,
                        id: message.senderID,
                    }]
                }, message.threadID);

                api.setMessageReaction(':love:', message.messageID, (err) => {
                    if (err) return console.error(err);
                    console.log(message.messageID);
                });
            }
        }
    });

});