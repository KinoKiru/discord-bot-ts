import Command, {CommandData} from "../../model/command";
import {MessageEmbed} from "discord.js";
import Group from "../../model/group";

class makeEmbed extends Command {
    constructor() {
        super("makeembed", ["me", "make"], "Maakt een embed die gebruikt kan worden", Group.misc, "^<me/make/makeembed>");
    }

    async execute(data: CommandData) {
        await data.msg.channel.send(new MessageEmbed().setTitle(data.args.shift()).setAuthor(data.args.shift()).setDescription(data.args.join(' ')))
    }
}

export default makeEmbed