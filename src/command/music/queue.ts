import Command, {CommandData} from "../../model/command";
import Group from "../../model/group";
import {queue} from "../../seks";
import {Song} from "../../util/sfdl";
import AppendError from "../../util/appendError";

class Queue extends Command{
    constructor() {
        super("queue", ["q"], "Shows the song queue", Group.music, "!(q/queue)");
    }
    async execute(data: CommandData){
        try {
            let serverQueue = queue.get(data.msg.guild!.id);

            if (serverQueue !== undefined && serverQueue.songs.length !== 0) {
                //in allSongs gaan de eerste 20 nummers van de serverQueue en hier pak ik de induvuele song van
                const allSongs = serverQueue.songs.slice(0, 20).map((song : Song, index: number) => {
                    //returnt de nummer van het liede in de queue, de duration van het liedje en dan de title van het liedje
                    return (index + 1) + ") " + this.secondsToTime(song.durationSeconds) + " " + song.title;
                }).join('\n');

                let totaltime = 0;
                for (let song of serverQueue.songs) {
                    totaltime += song.durationSeconds;
                }

                //dan stuur ik 1 message met de 20 nummers en replace ik de blokhaken met niks
               await data.msg.channel.send('```apache\n' + `total: ${serverQueue.songs.length}\nduration: ${this.secondsToTime(totaltime)}\n\n` +
                    allSongs.replace(/\[/g, "").replace(/\]/g, "") + '```');

            } else {
               await data.msg.channel.send("Queue is empty");
            }
        } catch (error){
            AppendError.onError(error + " In file queue line 29 ");
        }
    }
    secondsToTime(seconds: number) {
        const hours = Math.floor(seconds / 3600).toFixed(0);
        const minutes = Math.floor(seconds / 60 % 60).toFixed(0);
        const seconds2 = (seconds % 60 - 1).toFixed(0);
        return (hours === '0' ? '' : hours.padStart(2, '0') + ':') + minutes.padStart(2, '0') + ':' + seconds2.padStart(2, '0');
    }
}

export default Queue