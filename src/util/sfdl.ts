import {Spotify} from 'simple-spotify';
import {CommandData} from "../model/command";
import ytsr, {Video} from "ytsr";
import AppendError from "./appendError";


export interface Song {
    title: string,
    url: string,
    isLive: boolean,
    duration: string,
    durationSeconds: number,
    thumbnail: string
}

// Create an instance of the Spotify class
const spotify = new Spotify();

class sfdl {

    static async validator(data: CommandData) {
        if (spotify.albumRegex.test(data.args[0])) {

            const album = await spotify.album(data.args[0]);
            const songs = await album.tracks(true);
            const songArr: Song[] = [];

            for (const song of songs) {
                try {
                    const track = await this.searchYT(song.name + ' ' + song.artists[0].name);
                    if (track) {
                        songArr.push(track);
                    }
                } catch (e) {
                    await data.msg.channel.send("Couldn't find youtube equivalent of " + song.name);
                    AppendError.onError(e + " " + "sfdl.ts");
                }
            }
            return songArr;
        } else if (spotify.trackRegex.test(data.args[0])) {

            const info = await spotify.track(data.args[0]);

            try {
                return [await this.searchYT(info.name + ' ' + info.artists[0].name)];
            } catch (e) {
                AppendError.onError(e + " " + "sfdl.ts");
            }

        } else if (spotify.playlistRegex.test(data.args[0])) {

            const playlist = await spotify.playlist(data.args[0], true);
            const songs: Song[] = [];
            for (const item of playlist.tracks.items) {
                if (item.track) {
                    try {
                        let track = await this.searchYT(item.track.name + ' ' + item.track.artists[0].name);
                        if (track) {
                            songs.push(track);
                        }
                    } catch (e) {
                        await data.msg.channel.send("Couldn't find youtube equivalent of " + item.track.name);
                        AppendError.onError(e + " " + "sfdl.ts");
                    }

                }

            }
            return songs;
        }
    }

    static async searchYT(query: string): Promise<Song | undefined> {
        const filters1 = await ytsr.getFilters(query);
        const filter1 = filters1.get('Type')!.get('Video');

        if (filter1!.url) {
            //hij pakt 20 songs en kijkt welke tussen de timespan past en pakt dan de relavante
            const [result]: any[] = (await ytsr(filter1!.url, {limit: 20})).items.filter((track: any) => {
                //true meenemen false niet meenemen
                let songToSeconds = this.timeToSeconds(track.duration);
                let trackTime = songToSeconds;
                // return of true als het binnen 2 minuten range is anders false en wordt hij niet meegenomen
                return trackTime < (songToSeconds + 120) && trackTime > (songToSeconds - 120);
            });

            if (result) {
                return {
                    title: result.title,
                    url: result.url,
                    isLive: result.isLive,
                    duration: result.duration || '',
                    durationSeconds: this.timeToSeconds(result.duration),
                    thumbnail: result.bestThumbnail.url
                };
            }
        }
    }

    static timeToSeconds(time: any) {
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

export default sfdl