import fs from 'fs';
import path from 'path';
import Command from "../model/command";
import {Collection} from "discord.js";

class CommandLoader {

    static load(commandFolder: string, commandList: Collection<string, Command>) {
        CommandLoader.loadRecursive(commandFolder, commandList);
    }

    private static loadRecursive(folder: string, commandList: Collection<string, Command>) {
        //leest een folder uit per keer
        const files = fs.readdirSync(folder);

        for (const file of files) {
            //bijv ../../../commands/file.js
            const pathname = path.join(folder, file);
            const stats = fs.lstatSync(pathname)

            //als het een directory is dan roep ik deze functie weer aan
            if (stats.isDirectory()) {
                this.loadRecursive(pathname, commandList);
            }
            //als de file endigd op de naam .js dan
            else if (path.extname(pathname) === ".js") {
                try {
                    //de default is bijv Test(aka class)
                    const command = new (require(pathname).default)();
                    if (command instanceof Command) {
                        commandList.set(command.name, command);
                    } else {
                        console.log("command not instance of Command", pathname);
                    }
                } catch (e) {
                    console.log(e)
                }
            }
        }
    }
}

export default CommandLoader;