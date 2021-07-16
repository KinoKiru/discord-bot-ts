import {Database} from "better-sqlite3";
import Command from "../model/command";


class DatabaseHandeler {
    constructor() {
    }

    static getStartData(db: Database) {
        return db.prepare("SELECT * FROM commands ORDER BY command").all();
    }

    static getUses(db: Database, command: Command) {
        return db.prepare("SELECT use FROM commands WHERE command IS ?").get(command.name);
    }

    static createTables(db: Database) {
        db.prepare('CREATE TABLE IF NOT EXISTS \'commands\' (command TEXT,description TEXT, use INTEGER)').run();
    }

    static insertData(db: Database, command: Command) {
        db.prepare("INSERT INTO commands VALUES (?,?,?)").run(command.name, command.description, 0);
    }

    static upDate(db: Database, command: Command, uses: number) {
        db.prepare("UPDATE commands SET use = ? WHERE command IS ?").run(uses + 1, command.name);
    }

    static delete(db: Database, commandName: string){
        db.prepare("DELETE FROM commands WHERE command IS ?").run(commandName);
    }
}

export default DatabaseHandeler