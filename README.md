Node Printer Prebuild
============
Native bind printers on POSIX and Windows OS from Node.js, electron and node-webkit.

[![npm version](https://badge.fury.io/js/@grandchef%2Fnode-printer.svg)](https://www.npmjs.com/package/@grandchef/node-printer) [![Prebuild Binaries and Publish](https://github.com/grandchef/node-printer/actions/workflows/prebuild-main.yml/badge.svg)](https://github.com/grandchef/node-printer/actions/workflows/prebuild-main.yml)

### API

| method | brief |
| --- | --- |
| `getPrinters()` | enumerate all installed printers with current jobs and statuses |
| `getPrinter(printerName)` | get a specific/default printer info with current jobs and statuses |
| `getPrinterDriverOptions(printerName)` | ([POSIX](http://en.wikipedia.org/wiki/POSIX) only) to get a specific/default printer driver options such as supported paper size and other info |
| `getSelectedPaperSize(printerName)` | ([POSIX](http://en.wikipedia.org/wiki/POSIX) only) to get a specific/default printer default paper size from its driver options |
| `getDefaultPrinterName()` | return the default printer name; |
| `printDirect(options)` | to send a job to a specific/default printer, now supports [CUPS options](http://www.cups.org/documentation.php/options.html) passed in the form of a JS object (see `cancelJob.js` example). To print a PDF from windows it is possible by using [node-pdfium module](https://github.com/grandchef/node-pdfium) to convert a PDF format into EMF and after to send to printer as EMF |
| `printFile(options)` | ([POSIX](http://en.wikipedia.org/wiki/POSIX) only) to print a file |
| `getSupportedPrintFormats()` | to get all possible print formats for printDirect method which depends on OS. `RAW` and `TEXT` are supported from all OS-es; |
| `getJob(printerName, jobId)` | to get a specific job info including job status; |
| `setJob(printerName, jobId, command)` | to send a command to a job (e.g. `'CANCEL'` to cancel the job); |
| `getSupportedJobCommands()` | to get supported job commands for setJob() depends on OS. `'CANCEL'` command is supported from all OS-es. |


### How to install:
# Node Printer

> Native bind printers for electron on Windows OS, support both **`win32_x64`** and **`win32_ia32`**
>
> Optimized node-pre-gyp configuration and project directory to make rebuild simple before build electron application

## Rebuild Native Code

> this module is specially for electron application on Windows OS, compatible for **`x64`** and **`ia32`**
>
> if you develop on a **`ia32`** machine, just skip this chapter(maybe the whole readme)
>
> if you need this module, suggest to publish it to **`NPM`** or some other private registry
>
> after rebuild work, suggest set **`npmRebuild`** as **`false`** in **electron build configuration**

### Step 0 —— prework

- **`node-pre-gyp`**
- **`python`**
- **`windows-build-tools`**
- _something necessary about build electron application_

### Step 1 —— installation

```bash
npm i @woovi/node-printer
```

### Step 2 —— rebuild by electron-builder to match node ABI

> electron-builder is needed

```bash
npx electron-builder install-app-deps
```

### Step 3 —— build native code for x64

> need to change dir into `node_modules/@namespace/node-printer` first

```bash
node-pre-gyp configure --target=`${electron_version}` --arch=x64 --dist-url=https://electronjs.org/headers --module_name=node_printer
node-pre-gyp build package --runtime=electron --target=`${electron_version}` --target_arch=x64 --build-from-source
```

### Step 4 —— build native code for ia32

> still in the dir `node_modules/@namespace/node-printer`

```bash
node-pre-gyp rebuild --target_arch=ia32
node-pre-gyp build package --runtime=electron --target=`${electron_version}` --target_arch=ia32 --build-from-source
```

## Support
- If you have a problem, find/create a new [Github issue](https://github.com/grandchef/node-printer/issues)

## Refer

- [examples](https://github.com/grandchef/node-printer/tree/main/examples)
- [thiagoelg/node-printer](https://github.com/thiagoelg/node-printer)
- [thiagoelg/node-printer](https://github.com/thiagoelg/node-printer)
- [mapbox/node-sqlite3](https://github.com/mapbox/node-sqlite3)

## License

- [The MIT License (MIT)](http://opensource.org/licenses/MIT)
