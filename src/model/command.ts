import {Message} from "discord.js";
import Group from "./group";
import Bot from "../bot";

export interface CommandData {
    commandName: string
    args: string[]
    msg: Message
    bot: Bot
}

abstract class Command {

    public readonly name: string;
    public readonly aliases: string[];
    public readonly description: string;
    public readonly group: Group;
    public readonly usage: string

    constructor(name: string, aliases: string[], description: string, group: Group, usage: string) {
        this.name = name;
        this.aliases = aliases;
        this.description = description;
        this.group = group
        this.usage = usage
    }

    //promise krijg je terug van een async functie
    //void zegt wat ie terug kijgt van die async functie
    public abstract execute(data: CommandData): Promise<void> ;
}

export default Command