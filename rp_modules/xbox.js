// XBRPC by Anidox#6280

const request = require('request-promise-native'),
    config = require('../config.js');

let rpc;

const Update = async(Discord) => {
    if (!config.xboxapi_key || !config.xuid) return;
    if (!rpc) rpc = Discord("427896754646679553");
    const data = JSON.parse((await request({ url: `https://xboxapi.com/v2/${config.xuid}/presence`, headers: { 'X-Auth': config.xboxapi_key, 'Content-Type': 'application/json' } }))),
        gamertag = await request({ url: `https://xboxapi.com/v2/gamertag/${config.xuid}`, headers: { 'X-Auth': config.xboxapi_key, 'Content-Type': 'application/json' } });
    if (data.state == 'Offline') {
        console.log('Offline, shutting down.');
        process.exit();
    }
    const timeSorted = data.devices[0].titles.sort(function(a, b) { return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime() });
    console.log(`Rich presence updated! You're now playing ${timeSorted[timeSorted.length-1].name}`);
    switch (typeof timeSorted[timeSorted.length - 1].activity) {
        case 'object':
            stateToPlay = timeSorted[timeSorted.length - 1].activity.richPresence;
            break;
        default:
            stateToPlay = undefined;
    }
    rpc.setActivity({
        details: `Playing ${timeSorted[timeSorted.length-1].name}`,
        state: stateToPlay,
        largeImageKey: 'xbl',
        largeImageText: config.show_gamertag ? `${gamertag} | On ${data.devices[0].type}` : `On ${data.devices[0].type}`,
        instance: true
    });
}

module.exports = Update;