import Command, {CommandData} from "../../model/command";
import Group from "../../model/group";
import {queue} from "../../bot";
import AppendError from "../../util/appendError";
import {TextChannel} from "discord.js";

class join extends Command {
    constructor() {
        super("join", ["j"], "Joins your current voice channel", Group.music, "^<j/join>");
    }

    async execute(data: CommandData) {
        try {
            const voiceChannel = data.msg.member!.voice.channel;
            let serverQueue = queue.get(data.msg.guild!.id);

            //asl er nog geen serverqueue bestaat dan maak ik er een aan
            if (!serverQueue) {
                serverQueue = {
                    textChannel: data.msg.channel as TextChannel,
                    connection: null,
                    songs: [],
                    volume: 1,
                    playing: true
                };
                //hij gooit de serverqueue als value erin op de plaats van de key van de server.id
                //dit betekent dus dat de serverqueue gelinkt is aan de server
                queue.set(data.msg.guild!.id, serverQueue);
            }
            //als de author van het bericht niet in een call zit dan geeft hij deze message
            if (!voiceChannel)
                await data.msg.channel.send("You need to be in a voice channel to play music!");

            //als je in een call zit dan joined de bot
            serverQueue.connection = await voiceChannel!.join()
        } catch (e) {
            AppendError.onError(e + " in join on line 37");
        }
    }
}

export default join