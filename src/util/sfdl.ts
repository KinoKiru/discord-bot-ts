import {Spotify} from 'simple-spotify';
import {CommandData} from "../model/command";
import ytsr, {Video} from "ytsr";
import AppendError from "./appendError";
import play from "../command/music/play";

export enum SongType {
    YOUTUBE,
    SPOTIFY,
    MP3
}

export interface Song {
    title: string,
    url: string,
    isLive: boolean,
    duration: string,
    durationSeconds: number,
    thumbnail: string,
    type: SongType,
    artist?: string
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
                    // const track = await this.searchYT(song.name + ' ' + song.artists[0].name);

                    songArr.push({
                        title: song.name,
                        url: song.preview_url || '',
                        duration: this.secondsToTime(song.duration_ms),
                        isLive: false,
                        durationSeconds: (song.duration_ms / 1000),
                        thumbnail: song.album?.images[0]!.url || "",
                        type: SongType.SPOTIFY,
                        artist: song.artists[0].name
                    });

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
                    const track = item.track
                    try {

                        songs.push(
                            {
                                title: track.name,
                                url: track.preview_url || '',
                                duration: this.secondsToTime(track.duration_ms),
                                isLive: false,
                                durationSeconds: (track.duration_ms / 1000),
                                thumbnail: track.album?.images[0]!.url || "",
                                type: SongType.SPOTIFY,
                                artist: track.artists[0].name
                            }
                        );

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
                let songToSeconds = play.timeToSeconds(track.duration);
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
                    durationSeconds: play.timeToSeconds(result.duration),
                    thumbnail: result.bestThumbnail.url,
                    type: SongType.YOUTUBE
                };
            }
        }

    }

    static secondsToTime(seconds: number) {
        const hours = Math.floor(seconds / 3600).toString();
        const minutes = Math.floor(seconds / 60 % 60).toString();
        const seconds2 = Math.max(0, seconds % 60 - 1).toString();
        return (hours === '0' ? '' : hours.padStart(2, '0') + ':') + minutes.padStart(2, '0') + ':' + seconds2.padStart(2, '0');
    }

}

export default sfdl