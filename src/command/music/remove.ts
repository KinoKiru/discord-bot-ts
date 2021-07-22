import Command, {CommandData} from "../../model/command";
import Group from "../../model/group";
import {queue} from "../../bot";
import skip from "./skip";
import AppendError from "../../util/appendError";


class Remove extends Command {
    constructor() {
        super("remove", ["r"], "removes a song at a givin place", Group.music, "^<r/remove>");
    }

    async execute(data: CommandData) {
        try {
            let serverQueue = queue.get(data.msg.guild!.id);
            const voiceChannel = data.msg.member!.voice.channel;

            if (!serverQueue) {
                await data.msg.channel.send("There is no queue");
                return;
            }

            if (!voiceChannel) {
                await data.msg.channel.send('You need to be in a voice channel to play music!');
                return;
            }

            if (+data.args[0] > serverQueue.songs.length) {
                await data.msg.channel.send("Given value is higher than queue");
                return;
            }

            if (+data.args[0] <= 0) {
                await data.msg.channel.send("Please give a positieve number");
                return;
            }

            if (+data.args[0] === 1) {
                await data.bot.commands.get("skip")!.execute(data);
                return;
            }

            if (!isNaN(+data.args[0])) {
                const song = serverQueue.songs.splice(+data.args[0] - 1, 1)
                await data.msg.channel.send(`Removed song: ${song[0].title}`);
            } else {
                await data.msg.channel.send("Please give an amount!")
            }

        } catch (error) {
            AppendError.onError(error + " in remove on line 43");
        }
    }
}

export default Remove