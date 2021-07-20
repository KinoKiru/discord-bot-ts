import AppendError from "../../util/appendError";
import Command, {CommandData} from "../../model/command";
import Group from "../../model/group";
import {queue} from "../../bot";
import play from "./play";

class skip extends Command {

    constructor() {
        super("skip", ["s"], "Skipt je stomme liedje", Group.music, "^(s/skip)");
    }


    async execute(data: CommandData) {
        try {

            let serverQueue = queue.get(data.msg.guild!.id);
            //hij kijkt of je wel in de voice channel zit zo nee dan wordt dat vermeld
            if (!data.msg.member?.voice.channel) {
                await data.msg.channel.send(
                    "You have to be in a voice channel to stop the music!"
                );
                return;
            }

            //als er nog geen serverqueue bestaat of dat er geen liedjes zijn dan leaved ie en geeft hij een message aan de user
            if (!serverQueue || serverQueue.songs.length === 0) {
                data.msg.member.voice.channel.leave();
                await data.msg.channel.send("There is no song that I could skip!");
                return;
            }

            //als er 1 of meer liedjes in de queue zitten dan geeft hij aan welk nummer hij skipt en dan gaat hij naar het volgend nummer
            if (serverQueue.songs.length >= 1) {
                await data.msg.channel.send(`Skipped **${serverQueue.songs[0].title}**`);
                serverQueue.songs.shift();
                await (data.bot.commands.get("play")! as play)!.play(serverQueue, queue, true, data);
            }
        } catch (e) {
            AppendError.onError(e + " in skip on line 32");
        }
    }

}

export default skip