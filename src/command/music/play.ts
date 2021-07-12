import Command, {CommandData} from "../../model/command";
import Group from "../../model/group";
import sfdl, {Song, SongType} from "../../util/sfdl";
import {queue} from "../../seks";
import ytdl from "ytdl-core";
import ytpl from "ytpl";
import AppendError from "../../util/appendError";
import ytsr, {Video} from "ytsr";
import skip from "./skip";

class play extends Command {
    constructor() {
        super("play", ["p"], "plays your stupid song", Group.music, "^(p/play)<string>youtube/spotify url/.file");
    }

    async execute(data: CommandData) {
        let serverQueue = queue.get(data.msg.guild!.id);

        //als er nog geen serverQueue bestaat dan maak ik er een en set ik die in de queue map
        if (!serverQueue) {
            serverQueue = {
                textChannel: data.msg.channel,
                connection: null,
                songs: [] as Song[],
                volume: 1,
                playing: true
            };
            // hij kijkt eerst of er een connectie is dan gooit hij dat in de construct zodat het ipv null true or false is, dan speelt hij het eerste liedje van de queue
            queue.set(data.msg.guild!.id, serverQueue);
        }


        const voiceChannel = data.msg.member!.voice.channel;
        //als de user niet in een call zit geeft hij een message
        if (!voiceChannel) {
            await data.msg.channel.send('You need to be in a voice channel to play music!');
            return;
        }

        //als die in een voice channel zit dan gaat er in connectie de connectie van de bot van de server anders word hij undefined
        //@ts-ignore
        let connection = data.msg.guild!.voice ? data.msg.guild!.connection : undefined;
        //als er geen connectie is dan join ik de call
        if (!connection) {
            connection = await data.msg.member!.voice.channel!.join();
        }
        //hier zet ik dan ik de serverQueue.connection de connection
        serverQueue.connection = connection;

        //de bot moet de permissions hebben om de channel te kunnen joinen
        const permissions = voiceChannel.permissionsFor(data.msg.client.user!);
        if (!permissions!.has('CONNECT') || !permissions!.has('SPEAK')) {
            await data.msg.channel.send('I need the permissions to join and speak in your voice channel!');
            return;
        }

        // deze is om te kijken of ik een argument heb gekregen
        let start;
        if (data.args[0]) {
            //als de argument begint met een linkje
            if (data.args[0].startsWith('https://www.youtube.com/watch?v')) {
                //hier pak ik de info van het linkje zoals title ect
                const songInfo = await ytdl.getInfo(data.args[0]);
                // blijkt songInfo leeg te zijn of undefined dan geef ik een error
                if (songInfo === null || songInfo === undefined) {
                    await data.msg.channel.send('Geef een geldige youtube link mee');
                    return;
                }
                //hier maak ik een object genaamd songs en daar geef ik een title,url,duration,tumbnail uit songInfo
                const songs: Song = {
                    title: songInfo.videoDetails.title,
                    url: songInfo.videoDetails.video_url,
                    durationSeconds: play.timeToSeconds(songInfo.videoDetails.lengthSeconds),
                    thumbnail: songInfo.videoDetails.thumbnails[0].url,
                    isLive: songInfo.videoDetails.isLiveContent,
                    type: SongType.YOUTUBE,
                    duration: songInfo.videoDetails.lengthSeconds
                }
                //hier push ik songs naar de songs array van serverQueue, dus als serverQueue.songs leeg is speelt hij deze als eerste af
                serverQueue.songs.push(songs);

                //als de argument begint met deze link dan:
            } else if (data.args[0].startsWith('https://www.youtube.com/playlist?list=')) {
                //hier pak ik alle info van de afpeelijst link
                const songInfo = await ytpl(data.args[0]);

                //start is true als er geen liedjes zijn ander blijft hij false
                start = serverQueue.songs.length === 0;

                //hier gooi ik in songs de songInfo.items(aka de songs).map en dan wil ik alleen de:
                //Title, url, duration, en de thumbnail
                const songs = songInfo.items.map(({title, url, duration, bestThumbnail, isLive}): Song => {
                    return {
                        title,
                        url,
                        durationSeconds: play.timeToSeconds(duration),
                        thumbnail: bestThumbnail.url || "",
                        isLive: isLive,
                        duration: duration || "0",
                        type: SongType.YOUTUBE
                    };
                });
                //hier push ik naar serverQueue.songs alles in songs
                serverQueue.songs.push(...songs);

                //pas als de message is gestuurd gaat hij pas door naar de volgende stap
                await data.msg.channel.send(`Added '${songs.length}' songs to the queue!`);
                //als de link begint met https://open.spotify.com/
            } else if (data.args[0].startsWith('https://open.spotify.com/')) {
                try {
                    //hier pak ik alleen de song en songs van sfdl.get(play, linkje(https://open.spotify.com/(track of playlist) een van de 2))

                    const songs = await sfdl.validator(data)
                    //als ik een Playlist heb megegeven
                    if (songs) {
                        //hier stel ik start weer in op false
                        start = serverQueue.songs.length === 0;
                        //hier push ik alle songs van de playlist naar de serverQueue
                        serverQueue.songs.push(...songs);
                        //hij gaat pas verder als ik de message heb gestuurd
                        if (songs.length < 1) {

                        } else {
                            await data.msg.channel.send(`Added '${songs.length}' song to the queue!`);

                        }
                    }
                } catch (error) {
                    AppendError.onError(error + " on line: 151, in file: play.js");
                }
            } else if (data.args[0].endsWith(".mp3") || data.args[0].endsWith(".mov") || data.args[0].endsWith(".mp4")) {

                let url = data.args[0];
                let song : Song = {
                    title: url.slice(0, url.lastIndexOf("/")),
                    url: data.args[0],
                    durationSeconds: 0,
                    thumbnail:  "",
                    type: SongType.MP3,
                    isLive: false,
                    duration: "00:00"
                }
                serverQueue.songs.push(song);

            } else {
                //hier pak ik de argumenten en plaats ik die bij elkaar en gooi ik er een spatie tussen
                const words = data.args.join(' ');

                //in songInfo gooi ik filters van de words
                const songInfo = await ytsr.getFilters(words);
                //hier pak ik de value van de key Type en van Video
                const filter1 = songInfo.get('Type')!.get('Video');
                //hier mag hij er maar 1 pakken
                const options = {limit: 1}
                //en hier gooi ik de url erin met de optie dat het er maar 1 mag zijn
                const searchResults: { items: Video[] } = await ytsr(filter1!.url!, options) as any;
                //hier gooi ik de info in de delen
                const songs: Song = {
                    title: searchResults.items[0].title,
                    url: searchResults.items[0].url,
                    durationSeconds: play.timeToSeconds(searchResults.items[0].duration),
                    thumbnail: searchResults.items[0].bestThumbnail.url || "",
                    type: SongType.YOUTUBE,
                    isLive: searchResults.items[0].isLive,
                    duration: searchResults.items[0].duration || "0"
                };
                //hier push ik de song naar de songs array
                serverQueue.songs.push(songs);
            }
        } else {
            // dit is de eerste foutcode die hij gaat terug geven aan de user dit betekent dat er niks is meegegven
            await data.msg.channel.send('Ewwow You Wneed two swend cowwect uwl ow pawametews');
            return;
        }
        //hier speel ik het nummer af of ik gooi het nummer in de queue
        await this.play(serverQueue, queue, start, data);
        return;
    }


    async play(serverQueue: any, queue: any, start = false, data: CommandData) {

        const song = serverQueue.songs[0] as Song;

        //als het eerste liedje in de serverqueue undifined is dan cleart hij de queue en dan leaved ie
        if (song === undefined) {
        }

        if (serverQueue.songs.length === 0) {
            queue.delete(data.msg.guild!.id);
            serverQueue.connection.disconnect();
            await data.msg.channel.send('No more songs!');
            return;
        }

        if (serverQueue.songs.length <= 1 || start) {
            let stream ;
            if (song.type === SongType.SPOTIFY) {
                let track = await sfdl.searchYT(song.title + ' ' + song.artist);
                if (track) {
                    song.url = track.url;
                    stream =  ytdl(song.url, {filter: "audioonly", quality: "highestaudio"});
                } else {
                    await data.msg.channel.send(song.title + " isn't found");
                    return;
                }
            }else if (song.type === SongType.MP3){
                stream =  song.url;
            }else if (song.type === SongType.YOUTUBE){
                stream =  ytdl(song.url, {filter: "audioonly", quality: "highestaudio"});
            }
            //als de server.songs.length <= 1 dan speelt hij het liedje af ipv de plaatsen in de queue
            const dispatcher = serverQueue.connection
                .play(stream)
                .on('finish', () => {
                    serverQueue.songs.shift();
                    this.play(serverQueue, queue, true, data);
                })
                .on('error', (err: any) => {
                    AppendError.onError(err.message + " On line: 35, in file: play.js");
                    data.msg.channel.send("song not found");
                    data.bot.commands.get("skip")!.execute(data)
                });
            //als hij t goed doet dan deelt hij de liedjes sound gedeeld door 5? en dan geeft hij een message met de song title
            serverQueue.connection.dispatcher.setVolume(serverQueue.volume);
            await serverQueue.textChannel.send(`Start playing: **${song.title}**`);
            return;
        } else {
            //als het meer zijn dan plaatst hij ze in de queue
            await data.msg.channel.send("Added song to queue");
            return;
        }
    }

    static timeToSeconds(time: string | null) {
        if (!time || time === '') return 0;
        const split = time.split(':');
        let hours = 0;
        let minutes: number;
        let seconds: number;
        if (split.length === 3) {
            const [h, m, s] = split;
            hours = +h;
            minutes = +m;
            seconds = +s;
        } else {
            const [m, s] = split;
            minutes = +m;
            seconds = +s;
        }
        return (hours * 3600) + (minutes * 60) + seconds;
    }
}

export default play
