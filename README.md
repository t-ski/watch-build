# Watch Build

Generic file watch interface for custom incremental builds.

``` cli
npm i t-ski/watch-build
```

### API

``` js
const { Watch } = require("@t-ski/watch-build");

new Watch("./test/", {
  filenamePattern: /.*/i,
  interval: 1000,
  once: false
})
.on("build", (paths) => {
  // TODO: Handle changed files passed as argument
}
```

### CLI

``` cli
npx watch <path:taget> <path:module> [--<arg:key>|-<arg:shorthand> *?]*
```

| | |
| -: | :- |
| **Positional** | **Description** |
| `<path:taget>` `0` | Path to watch file target directory. | 
| `<path:module>` `1`<br> &emsp; | Path to build module with a default function export:<br> `module.exports = (paths) => {}` | 
| **Flag**| **Description** |
| `--once` `-O` | Build once, i.e. without future file change watch. | 
| **Option** | **Description** |
| `--interval` `-I` | Time between watch iterations in ms (default: 1000). | 
| `--pattern` `-P` | Filename pattern filter (string) regex (default: ".*"). | 

##

<sub>&copy; Thassilo Martin Schiepanski</sub>