#!/usr/bin/env node


const fs = require("fs");
const path = require("path");

const { Watch } = require("./api");


class Args {
	static #retrieveKeyIndex(name, shorthand) {
    	return Math.max(
            process.argv.slice(2).indexOf(`--${name.toLowerCase()}`),
            shorthand ? process.argv.slice(2).indexOf(`-${shorthand.toUpperCase()}`) : -1
        );
	}

	static parsePositional(index = 0) {
		const positional = process.argv.slice(2)[index];

    	return !/^\-/.test(positional) ? positional : null;
	}
    
	static parseFlag(key, shorthand) {
    	return (Args.#retrieveKeyIndex(key, shorthand) >= 0);
	}

    static parseOption(key, shorthand) {
    	const index = Args.#retrieveKeyIndex(key, shorthand) + 1;
    	return (index && index < process.argv.slice(2).length)
        ? {
    		string: process.argv.slice(2)[index],
    		number: +process.argv.slice(2)[index]
    	}
        : {};
	}
}


if(Args.parsePositional(0) === "help") {
    console.log(fs.readFileSync(path.join(__dirname, "cli.help.txt")).toString());
    process.exit(0);
}


if(!Args.parsePositional(0)) throw new SyntaxError("Missing target directory path (arg 0)");
if(!Args.parsePositional(1)) throw new SyntaxError("Missing build module path (arg 1)");


new Watch(Args.parsePositional(0), {
	filenamePattern: new RegExp(Args.parseOption("pattern", "P").string),
	interval: Args.parseOption("interval", "I").number,
	runOnce: Args.parseFlag("once", "O")
})
.on("build", (paths) => {
	require(path.resolve(Args.parsePositional(1)))(paths);
});