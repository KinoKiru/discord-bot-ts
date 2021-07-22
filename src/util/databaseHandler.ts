import Command from "../model/command";
import path from "path";
import Database from "better-sqlite3";


const db = new Database(path.resolve('./src/database', 'database.sqlite'), {});


class DatabaseHandler {
    constructor() {
    }

    static getStartData() {
        return db.prepare("SELECT * FROM commands ORDER BY command").all();
    }

    static getUses(command: Command) {
        return db.prepare("SELECT use FROM commands WHERE command IS ?").get(command.name);
    }

    static createTables() {
        db.prepare('CREATE TABLE IF NOT EXISTS \'commands\' (command TEXT,description TEXT,usage TEXT ,use INTEGER)').run();
    }

    static insertData(command: Command) {
        db.prepare("INSERT INTO commands VALUES (?,?,?,?)").run(command.name, command.description, command.usage, 0);
    }

    static upDate(command: Command, uses: number) {
        db.prepare("UPDATE commands SET use = ? WHERE command IS ?").run(uses + 1, command.name);
    }

    static delete(commandName: string) {
        db.prepare("DELETE FROM commands WHERE command IS ?").run(commandName);
    }
}

DatabaseHandler.createTables();

export default DatabaseHandler