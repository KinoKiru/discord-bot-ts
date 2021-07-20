import Command, {CommandData} from "../../model/command";
import Group from "../../model/group";
import AppendError from "../../util/appendError";
import {queue} from "../../bot";

class Leave extends Command {
    constructor() {
        super("leave", [], "Leaves the current channel its in", Group.music, "^leave");
    }

    async execute(data: CommandData) {
        try {

            let serverQueue = queue.get(data.msg.guild!.id);

            //als er geen serverqueue is of er zijn geen liedjes dan leaved de bot
            if (!serverQueue || serverQueue.songs.length === 0) {
                await data.msg.member!.voice.channel!.leave();
            } else {
                //als er wel liedjes zijn dan clear ik alle liedjes en dan eindig ik de afspeler en leaved de bot
                serverQueue.songs = [];
                serverQueue.connection!.dispatcher.end();
            }
        } catch (e) {
            AppendError.onError(e + " in leave on line 22");
        }
    }
}

export default Leave