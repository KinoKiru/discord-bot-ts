import Command, {CommandData} from "../../model/command";
import Group from "../../model/group";
import {queue} from "../../seks";
import {MessageEmbed} from "discord.js";
import AppendError from "../../util/appendError";

class np extends Command {
    constructor() {
        super("np", [], "show the current song", Group.music, "^np");
    }

    async execute(data: CommandData) {
        try {
            let serverQueue = queue.get(data.msg.guild!.id);

            //als er nog geen queue is dan geef ik een message terug aan de user
            if (!serverQueue) {
                await data.msg.channel.send("There is no queue");
                return;
            }

            //als er wel een serverqueue is maar er is geen liedje dan geef ik dit terug aan de user
            if (serverQueue.songs[0] === undefined) {
                await data.msg.channel.send('Currently there is no song playing');
                return;
            }
            //speelt er nu wel een liedje? dan maak ik een embed die de song title en de foto meegeeft
            await data.msg.channel.send(new MessageEmbed().setTitle(serverQueue.songs[0].title).setThumbnail(serverQueue.songs[0].thumbnail).setURL(serverQueue.songs[0].url));
        } catch (e) {
            AppendError.onError(e + " in np on line 28");
        }
    }
}

export default np