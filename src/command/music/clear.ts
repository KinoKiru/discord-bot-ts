import Command, {CommandData} from "../../model/command";
import Group from "../../model/group";
import {queue} from "../../bot";
import AppendError from "../../util/appendError";

class clear extends Command {
    constructor() {
        super("clear", ["c"], "clears the queue", Group.music, "^<c/clear>");
    }

    async execute(data: CommandData) {
        try {
            let serverQueue = queue.get(data.msg.guild!.id);

            //als er nog geen serverqueue is gemaakt geeft hij een error aan de user
            if (!serverQueue) {
                await data.msg.channel.send("There is no queue");
                return;
            }
            //hier pak ik het eerste liedje die haal ik tijdelijk weg
            const first = serverQueue.songs.shift();
            //dan clear ik de queue (aka de songs)
            serverQueue.songs = []
            //dan gooi ik weer het eerste nummer erin en dan geef ik een message
            serverQueue.songs.unshift(first!);
            await data.msg.channel.send("Cleared queue");
        } catch (e) {
            AppendError.onError(e + " in clear on line 25");
        }
    }
}

export default clear