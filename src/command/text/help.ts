import Command, {CommandData} from "../../model/command";
import Group from "../../model/group";
import {EmbedField, MessageEmbed} from "discord.js";

class help extends Command {
    constructor() {
        super("help", [], "gives a list with commands or the use case", Group.misc, "^help",);
    }

    async execute(data: CommandData) {
        const dataArr = [];
        const {groups, commands} = data.bot;

        //als de argument geen legnte heeft dan laat hij de opties zien qua
        if (!data.args.length) {
            const embed = new MessageEmbed()
                .setTitle("Commands")
                .setColor(1127128)
                .addFields(
                    ...groups.filter((commands: Command[], group: Group) => {
                        return data.msg.author.id === process.env.userId || group !== Group.owner
                    })
                        .map((commands: Command[], group: Group) => {
                            return {
                                name: group,
                                value: "```apache\n" + commands.map(c => c.name).join("\r\n") + "```",
                                inline: true
                            } as EmbedField
                        })
                )
                .addField("\u200b", ` \nYou can send\`${data.bot.prefix}help [command name]\` to get info on a specific command!`)
            ;
            await data.msg.author.send(embed)
                .then(() => {
                    if (data.msg.channel.type === 'dm') return;
                    data.msg.reply('I\'ve sent you a DM with all my commands!');
                })
                .catch(error => {
                    //als ik je niet een dm kan sturen geef ik je een fout melding en die krijg ik ook
                    console.error(`Could not send help DM to ${data.msg.author.tag}.\n`, error);
                    data.msg.reply('it seems like I can\'t DM you! Do you have DMs disabled?');
                });
            return;
        }

        //hier stuur ik de Help naar je DM's en dan geef ik je een input terug

        //dit is de naam van de command
        const name = data.args[0].toLowerCase();
        //hier pak ik de naam van de command of als er een alias is voor de command dan pak ik een van de 2
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        //als de command niet bestaat met die naam, dan reply ik
        if (!command) {
            await data.msg.reply('that\'s not a valid command!');
            return;
        }

        //hier push ik de naam van de command naar de data array
        dataArr.push(`**Name:** ${command.name}`);
        //als ik een alias gebruik dan push ik die ook naar de array
        if (command.aliases) dataArr.push(`**Aliases:** ${command.aliases.join(', ')}`);
        //als ik een description heb dan push ik die naar de array
        if (command.description) dataArr.push(`**Description:** ${command.description}`);
        //als ik een usage heb meegegeven dan push ik die naar de array
        if (command.usage) dataArr.push(`**Usage:** ${command.usage}`);

        //hier send ik de aparte !help Command
        await data.msg.channel.send(dataArr, {split: true});

    } //execute

}


export default help