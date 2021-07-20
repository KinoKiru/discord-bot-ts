import fs from 'fs';

class AppendError {
    constructor(error: string) {

    }

    static onError(Error: string) {
        let d = new Date();
        fs.appendFileSync(__dirname + '/errorCache.text', Error + " On: " + this.Datesetter(d) + "\n");

    };

    static Datesetter(date: Date) {
        return date.getHours() + ":" + date.getMinutes() + " " + date.getUTCDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
    }
}

export default AppendError