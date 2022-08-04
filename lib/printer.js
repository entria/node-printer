const printer_helper = require('./printer-binding.js');

/**
 * correct(complete) printer info
 *
 * @param {object} printer the printer object would be corrected
 *
 * @return {null} null
 */
function correctPrinterinfo(printer) {
  if (printer.status || !printer.options || !printer.options['printer-state']) {
    return null;
  }

  const statusMap = new Map([
    ['3', 'IDLE'],
    ['4', 'PRINTING'],
    ['5', 'STOPPED'],
  ]);
  const status = String(printer.options['printer-state']);

  printer.status = statusMap.get(status) || status;

  for (const key in printer.options) {
    if (/time$/.test(key) && printer.options[key] && !(printer.options[key] instanceof Date)) {
      printer.options[key] = new Date(printer.options[key] * 1000);
    }
  }

  return null;
}

/**
 * get default printer name
 *
 * @return {string} default printer name
 */
function getDefaultPrinterName() {
  const printerName = printer_helper.getDefaultPrinterName();

  if (printerName) {
    return printerName;
  }

  // seems correct posix behaviour
  const printers = getPrinters();

  if (printers && printers.length) {
    let i = printers.length;

    for (i in printers) {
      const printer = printers[i];

      if (printer.isDefault === true) {
        return printer.name;
      }
    }
  }

  // printer not found, return nothing(null)
  return null;
}

/**
 * get printer information by printer name
 *
 * @param {string} printerName wawnted printer name
 *
 * @return {object} printer object contains printer information
 */
function getPrinter(printerName) {
  if (!printerName) {
    printerName = getDefaultPrinterName();
  }

  const printer = printer_helper.getPrinter(printerName);

  correctPrinterinfo(printer);

  return printer;
}

/**
 * get printer driver information
 *
 * @param {string} printerName the wanted printer name
 *
 * @return {object} expected printer driver information
 */
function getPrinterDriverOptions(printerName) {
  if (!printerName) {
    printerName = getDefaultPrinterName();
  }

  return printer_helper.getPrinterDriverOptions(printerName);
}

/**
 * get the supported paper size(s)
 *
 * @param {string} printerName the wanted printer name
 *
 * @return {object} supported paper size(s) object
 */
function getSelectedPaperSize(printerName) {
  const driver_options = getPrinterDriverOptions(printerName);
  let selectedSize = '';

  if (driver_options && driver_options.PageSize) {
    Object.keys(driver_options.PageSize).forEach(function loop(key) {
      if (driver_options.PageSize[key]) {
        selectedSize = key;
      }
    });
  }
  return selectedSize;
}

/**
 * get print job information
 *
 * @param {string} printerName the wanted printer name
 * @param {string} jobId print job ID
 *
 * @return {object} object contain print information
 */
function getJob(printerName, jobId) {
  return printer_helper.getJob(printerName, jobId);
}

/**
 * set print job
 *
 * @param {string} printerName the wanted printer name
 * @param {string} jobId job ID
 * @param {string} command command string
 *
 * @return {*} depends on the inner process logic in printer
 */
function setJob(printerName, jobId, command) {
  return printer_helper.setJob(printerName, jobId, command);
}

/**
 * get printer list
 *
 * @return {array} printer object array
 */
function getPrinters() {
  const printers = printer_helper.getPrinters();

  if (printers && printers.length) {
    for (const i in printers) {
      correctPrinterinfo(printers[i]);
    }
  }

  return printers;
}

/**
 * print direct
 * print raw data. This function is intend to be asynchronous

 parameters:
 parameters - Object, parameters objects with the following structure:
 data - String, mandatory, data to printer
 printer - String, optional, name of the printer, if missing, will try to print to default printer
 docname - String, optional, name of document showed in printer status
 type - String, optional, only for wind32, data type, one of the RAW, TEXT
 options - JS object with CUPS options, optional
 success - Function, optional, callback function
 error - Function, optional, callback function if exists any error

 or

 data - String, mandatory, data to printer
 printer - String, optional, name of the printer, if missing, will try to print to default printer
 docname - String, optional, name of document showed in printer status
 type - String, optional, data type, one of the RAW, TEXT
 options - JS object with CUPS options, optional
 success - Function, optional, callback function with first argument job_id
 error - Function, optional, callback function if exists any error
 *
 * @param {object | array} parameters print parameters, depends on the specified printer
 * @return {null} null
 */
function printDirect(parameters) {
  let data = parameters,
    printer,
    docname,
    type,
    options,
    success,
    error;

  if (arguments.length === 1) {
    // TODO: check parameters type
    // if (typeof parameters )
    data = parameters.data;
    printer = parameters.printer;
    docname = parameters.docname;
    type = parameters.type;
    options = parameters.options || {};
    success = parameters.success;
    error = parameters.error;
  } else {
    printer = arguments[1];
    type = arguments[2];
    docname = arguments[3];
    options = arguments[4];
    success = arguments[5];
    error = arguments[6];
  }

  if (!type) {
    type = 'RAW';
  }

  // Set default printer name
  if (!printer) {
    printer = getDefaultPrinterName();
  }

  type = type.toUpperCase();

  if (!docname) {
    docname = 'node print job';
  }

  if (!options) {
    options = {};
  }

  // TODO: check parameters type
  if (printer_helper.printDirect) {
    // call C++ binding
    try {
      const res = printer_helper.printDirect(data, printer, docname, type, options);
      if (res) {
        success(res);
      } else {
        error(Error('Something wrong in printDirect'));
      }
    } catch (e) {
      error(e);
    }
  } else {
    error('Not supported');
  }

  return null;
}

/**
 * print file
 * parameters:
   parameters - Object, parameters objects with the following structure:
      filename - String, mandatory, data to printer
      docname - String, optional, name of document showed in printer status
      printer - String, optional, mane of the printer, if missed, will try to retrieve the default printer name
      success - Function, optional, callback function
      error - Function, optional, callback function if exists any error
 *
 * @param {object | array} parameters print parameters, depends on the specified printer
 * @return {null} null
 */
function printFile(parameters) {
  let filename, docname, printer, options, success, error; // eslint-disable-line

  if (arguments.length !== 1 || typeof parameters !== 'object') {
    throw new Error('must provide arguments object');
  }

  filename = parameters.filename; // eslint-disable-line
  docname = parameters.docname;
  printer = parameters.printer;
  options = parameters.options || {}; // eslint-disable-line
  success = parameters.success;
  error = parameters.error;

  if (!success) {
    success = function successFunc() {};
  }

  if (!error) {
    error = function errorFunc(err) {
      throw err;
    };
  }

  if (!filename) {
    const err = new Error('must provide at least a filename');

    return error(err);
  }

  // try to define default printer name
  if (!printer) {
    printer = getDefaultPrinterName();
  }

  if (!printer) {
    return error(new Error('Printer parameter of default printer is not defined'));
  }

  // set filename if docname is missing
  if (!docname) {
    docname = filename;
  }

  // TODO: check parameters type
  if (printer_helper.printFile) {
    // call C++ binding
    try {
      // TODO: proper success/error callbacks from the extension
      const res = printer_helper.printFile(filename, docname, printer, options);

      if (!isNaN(parseInt(res))) {
        success(res);
      } else {
        error(Error(res));
      }
    } catch (e) {
      error(e);
    }
  } else {
    error('Not supported');
  }
}

module.exports = {
  getPrinters,
  printDirect,
  printFile,
  getPrinter,
  getSelectedPaperSize,
  getPrinterDriverOptions,
  getDefaultPrinterName,
  getJob,
  setJob,
  getSupportedPrintFormats: printer_helper.getSupportedPrintFormats,
  getSupportedJobCommands: printer_helper.getSupportedJobCommands,
};
