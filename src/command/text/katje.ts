import Command, {CommandData} from "../../model/command";
import Group from "../../model/group";
import fetch from "node-fetch";
import {MessageEmbed, MessageReaction} from "discord.js";

class Katje extends Command {
    constructor() {
        super("katje", ["poesj"], "gives a random cat image", Group.misc, "^<katje,poesj>");
    }

    async execute(data: CommandData) {

        let embed = new MessageEmbed()
            .setTitle('poesj')
            .setImage(await this.getCat())

        let sendMessage = await data.msg.channel.send(embed)
        await sendMessage.react('▶️')
        const filter = (reaction: MessageReaction) => {
            return ['◀️', '▶️'].includes(reaction.emoji.name)
        }
        while (true) {
            const collected = await sendMessage.awaitReactions(filter, {max: 1, time: 50000, errors: ['time']})
            let embed

            embed = new MessageEmbed()
                .setTitle('poesj')
                .setImage(await this.getCat())
            await sendMessage.edit(embed);
            await sendMessage.reactions.removeAll();
            await sendMessage.react('▶️');
        }
    }

    async getCat() {
        let reponse = await fetch(`https://api.thecatapi.com/v1/images/search?api_key=${process.env.CatID}`);
        let jsonResppnse = await reponse.json();
        return jsonResppnse[0].url;
    }
}
export default Katje