import Command, {CommandData} from "../../model/command";
import Group from "../../model/group";

class ping extends Command{
    constructor() {
        super("ping", [], "shows the delay", Group.misc, "!ping");
    }
    async execute(data:CommandData){
        const before : number = Date.now();
        data.msg = await data.msg.channel.send('Pong!');
        const diff : number = Date.now() - before;
        await data.msg.edit('Pong ' + diff + ' ms');
    }
}

export default ping