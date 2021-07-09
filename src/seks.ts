import {Client, Collection, Message, VoiceState} from 'discord.js';
import {config} from 'dotenv';
import Command from "./model/command";
import CommandLoader from "./util/command_loader";
import Group from "./model/group";

class Seks extends Client {

    public readonly prefix: string;
    public readonly commands: Collection<string, Command>;
    public readonly groups: Collection<Group, Command[]>

    /**
     *
     * @param token
     * @param prefix
     */
    constructor(token: string, prefix: string) {

        //dit roept de constructor van de client aan
        super();
        this.login(token);
        this.prefix = prefix;
        this.commands = new Collection<string, Command>();
        this.groups = new Collection<Group, Command[]>()
        //als er een message binnen komt dan roept hij onMessage aan
        this.on("message", this.onMessage);
        this.on("ready", this.onReady);
        this.on("voiceStateUpdate", this.onVoiceStateUpdate);
        CommandLoader.load(__dirname + "/command", this.commands);

        this.commands.forEach(command => {
            let group = this.groups.get(command.group);
            if (!group) {
                group = [];
                this.groups.set(command.group, group)
            }
            group.push(command)
        })
    }

    async onMessage(msg: Message) {

        //als het bericht niet begint met de prefix of een andere bot voert de command uit doet de bot niks
        if (!msg.content.startsWith(this.prefix) || msg.author.bot) return;

        //hier pak ik de argument die na de command komt
        const args = msg.content.slice(this.prefix.length).trim().split(/ +/);
        let commandName = args.shift();

        if (commandName) {
            commandName = commandName.toLowerCase();
        } else {
            return;
        }
        const command = this.commands.get(commandName) || this.commands.find(command => (command.aliases || []).includes(commandName!));
        if (!command) {
            return;
        }
        try {
            if (msg.channel.type === "dm" && command.name !== "help" && command.name !== "shutdown") {
                return msg.author.send("This command can only be used in a server");
            } else {
                await command.execute({commandName, msg, args, bot: this});
            }
        } catch (e) {
            console.log(e);
        }
    }

    onReady() {
        // !: weet zeker dat het niet null of undefined is
        // this is de client
        console.log(`Logged in as ${this.user!.tag}!`);
        this.user!.setActivity("use ^help", {
            type: "PLAYING"
        });
    }

   onVoiceStateUpdate(oldMember : VoiceState, newMember: VoiceState){
        if(oldMember.id === this.user?.id)
        if (oldMember.channel && !newMember.channel) {
            queue.delete(oldMember.guild.id);
            console.log('old: leaved');
        } else if (newMember.channel && !oldMember.channel) {
            console.log('new: joined');
        } else if (!oldMember.channel && !newMember.channel) {
            console.log('nothing');
        } else if (oldMember.channel === newMember.channel) {
            console.log('same');
        } else {
            console.log('old', oldMember.channel);
            console.log('new', newMember.channel);
        }
    }
}

const queue = new Map();
export {queue};


config()
const seks = new Seks(process.env.token!, process.env.prefix!);
export default Seks;
