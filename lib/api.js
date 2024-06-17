const EventEmitter = require("events");
const fs = require("fs");
const path = require("path");


module.exports.Watch = class extends EventEmitter {
    #targetDirPath;
    #optionsWithDefaults;

    constructor(targetPath, options) {
        super();
        
        const absTargetPath = path.resolve(targetPath);
        this.#targetDirPath = fs.statSync(absTargetPath).isFile()
        ? fs.dirname(absTargetPath)
        : absTargetPath;
        
        this.#optionsWithDefaults = {
            filenamePattern: options.filenamePattern ?? /.*/,
            interval: options.interval ?? 1000,
            runOnce: options.runOnce ?? false,
        };
                
        setImmediate(() => this.#scan());
    }

    #scan(timeTolerance = Infinity) {
        const modifiedFiles = fs.readdirSync(this.#targetDirPath, {
            recursive: true,
            withFileTypes: true,
        })
        .filter((dirent) => dirent.isFile())
        .filter((dirent) => this.#optionsWithDefaults.filenamePattern.test(dirent.name))
        .filter((dirent) => (Date.now() - fs.statSync(path.join(dirent.path, dirent.name)).mtimeMs) < timeTolerance)
        .map((dirent) => path.join(dirent.path, dirent.name));
        
        modifiedFiles.length
        && this.emit("build", modifiedFiles)

        !this.#optionsWithDefaults.runOnce
        && setTimeout(() => this.#scan(this.#optionsWithDefaults.interval), this.#optionsWithDefaults.interval);
    }
}