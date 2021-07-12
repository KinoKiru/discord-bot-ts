import Command, {CommandData} from "../../model/command";
import Group from "../../model/group";
import AppendError from "../../util/appendError";

class Shutdown extends Command{
    constructor() {
        super("shutdown", ["exit"], "Stops the bot", Group.owner, "^(shutdown/exit)");
    }
    async execute(data: CommandData){
        try {
            if (data.msg.author.id === process.env.userId) {
                data.msg.channel.send('Shutting down...').then(m => {
                    data.bot.destroy();
                });
            } else {
               await data.msg.channel.send("You dont have the rights to preform this action.")
            }
        } catch (error) {
             AppendError.onError(error + " " + "shutdown.ts");
        }
    }
}

export default Shutdown