const config = require('./config');
const RtmClient = require('@slack/client').RtmClient;
const IncomingWebhook = require('@slack/client').IncomingWebhook;
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
const rtm = new RtmClient(config.BOT_USER_ACCESS_TOKEN);
const webhook = new IncomingWebhook(config.WEBHOOK_URL);
const messages = {
    text: "Would you like to play a game?",
    response_type: "in_channel",
    "attachments": [
        {
            "text": "Choose a game to play",
            "fallback": "If you could read this message, you'd be choosing something fun to do right now.",
            "color": "#3AA3E3",
            "attachment_type": "default",
            "callback_id": "game_selection",
            "actions": [
                {
                    "name": "games_list",
                    "text": "Pick a game...",
                    "type": "select",
                    "options": [
                        {
                            "text": "Hearts",
                            "value": "hearts"
                        },
                        {
                            "text": "Bridge",
                            "value": "bridge"
                        },
                        {
                            "text": "Checkers",
                            "value": "checkers"
                        },
                        {
                            "text": "Chess",
                            "value": "chess"
                        },
                        {
                            "text": "Poker",
                            "value": "poker"
                        },
                        {
                            "text": "Falken's Maze",
                            "value": "maze"
                        },
                        {
                            "text": "Global Thermonuclear War",
                            "value": "war"
                        }
                    ]
                }
            ]
        }
    ]
};


let channel;

// The client will emit an RTM.AUTHENTICATED event on successful connection, with the `rtm.start` payload
rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, (rtmStartData) => {
    for (const c of rtmStartData.channels) {
        console.log('chanel', c.id);
        if (c.is_member) {
            channel = c.id
        }
    }
    console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
});

// you need to wait for the client to fully connect before you can send messages
rtm.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, function () {
    webhook.send('Hi I am bot', function (err, header, statusCode, body) {
        if (err) {
            console.log('Error:', err);
        } else {
            console.log('Received', statusCode, 'from Slack');
        }
    });
});

rtm.on(CLIENT_EVENTS.RTM.RAW_MESSAGE, function (data) {
    let rep = JSON.parse(data);
    if (rep.text === 'hello bot') {
        console.log(rep);
        webhook.send(messages, function (err, header, statusCode, body) {
            if (err) {
                console.log('Error:', err);
            } else {
                console.log('Received', statusCode, 'from Slack');
            }
        });
    }

});

rtm.start();