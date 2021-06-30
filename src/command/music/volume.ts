import Command, {CommandData} from "../../model/command";
import Group from "../../model/group";
import AppendError from "../../util/appendError";
import {queue} from "../../seks";


class Volume extends Command{
constructor() {
    super("volume", ["v"], "changes the volume of the song", Group.music, "!(v/volume)<integer> 1-500");
}
async execute(data: CommandData){
    try {
        let serverQueue = queue.get(data.msg.guild!.id);

        if (!serverQueue) {
            await data.msg.channel.send("There is no queue");
            return;
        }

        if (+data.args[0] >= 0 && +data.args[0] <= 500) {
            //als de volume tussen de 0 en 500 dab
            serverQueue.volume = (+data.args[0] / 100);
            //hier set hij de volume van de dispatcher
            serverQueue.connection.dispatcher.setVolume(+data.args[0] / 100);
            await data.msg.channel.send("changed volume to " + (data.args[0]) + "%");
            //hier overschijf ik de serverQueue zoadat de dispatcher set volumme mee gaat
            queue.set(data.msg.guild!.id, serverQueue);

        } else {
           await data.msg.channel.send("Please change volume (1-500)");
            return;
        }
    } catch (e) {
         AppendError.onError(e + " in volume on line 35");
    }
}
}

export default Volume