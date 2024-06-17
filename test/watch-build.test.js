const fs = require("fs");
const path = require("path");
const { fork } = require("child_process");


const targetPath = (key) => {
    return path.join(__dirname, `./target.${key}.txt`);
};
const writeTarget = (key, data = "") => {
    fs.writeFileSync(targetPath(key), data);
};
process.on("exit", () => {
    fs.rmSync(targetPath("dynamic"));
    fs.rmSync(targetPath("static"));
});
writeTarget("dynamic", "A");
writeTarget("static", "A");


const { Watch } = require("../lib/api");

let i = 0;
new Watch("./test/", {
    filenamePattern: /\.txt$/i,
    interval: 200
})
.on("build", (paths) => {
    switch(++i) {
    case 1:
        test(paths.length, 2);
        test(path.basename(paths[0]), "target.dynamic.txt");
        test(path.basename(paths[1]), "target.static.txt");

        setTimeout(() => writeTarget("dynamic", "B"), 100);
        break;
    case 2:
        test(paths.length, 1);
        test(path.basename(paths[0]), "target.dynamic.txt");
        fork(
            path.join(__dirname, "../lib/cli.js"),
            [ "./", "./cli.build.js", "-P", "\\.txt$" ],
            {
                cwd: __dirname
            }
        )
        .on("message", (paths) => {
            test(paths.length, 2);
            test(path.basename(paths[0]), "target.dynamic.txt");
            test(path.basename(paths[1]), "target.static.txt");
            process.exit();
        });
        break;
    }
});