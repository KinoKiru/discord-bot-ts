import Command, {CommandData} from "../../model/command";
import Group from "../../model/group";
import {queue} from "../../bot";
import AppendError from "../../util/appendError";


class Shuffle extends Command {
    constructor() {
        super("shuffle", ["sh"], "Shuffles the queue", Group.music, "^(sh/shuffle)");
    }

    async execute(data: CommandData) {
        try {
            let serverQueue = queue.get(data.msg.guild!.id);
            if (!serverQueue) {
                await data.msg.channel.send("There is no queue");
                return;
            }
            //hier pak ik het eerste nummer zdat ik die niet shuffle
            const first = serverQueue.songs.shift();
            //dit zijn nu alle nummers behalve de eerste
            const songs = serverQueue.songs;

            //deze shuffle doet ie 1000x
            for (let i = 0; i < (songs.length * 4); i++) {

                const rand1 = Math.floor(Math.random() * songs.length);
                const rand2 = Math.floor(Math.random() * songs.length);

                const tmp = songs[rand1];
                songs[rand1] = songs[rand2];
                songs[rand2] = tmp;
            }
            //en hier voeg ik nummer 1 weer toe op plaats 1
            serverQueue.songs.unshift(first!);

            await data.msg.channel.send("Queue shuffeld!");
        } catch (error) {
            AppendError.onError(error + " in shuffle on line 35");
        }
    }
}

export default Shuffle