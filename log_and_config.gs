/*
 * Logging and Configuration utility functions.
 *
 * Adapted from the 'A script to automate requesting data from an external url that outputs CSV data' script.
 * @author ianmlewis@gmail.com (Ian Lewis)
*/

var CSV_CONFIG = 'csvconfig';

/* =========== Logging ======================= */

/**
 * The output text that should be displayed in the log.
 * @private.
 */
var logArray_;

/**
 * Clears the in app log.
 * @private.
 */
function setupLog_() {
  logArray_ = [];
}

/**
 * Returns the log as a string.
 * @returns {string} The log.
 */
function getLog_() {
  return logArray_.join('\n'); 
}

/**
 * Appends a string as a new line to the log.
 * @param {String} value The value to add to the log.
 */
function log_(value) {
  logArray_.push(value);
  
  var app = UiApp.getActiveApplication();
  var foo = app.getElementById('log');
  foo.setText(getLog_());
}

/**
 * Displays the log in memory to the user.
 */
function displayLog_() {
  var uiLog = UiApp.createApplication().setTitle('Report Status').setWidth(400).setHeight(500);
  var panel = uiLog.createVerticalPanel();
  uiLog.add(panel);

  var txtOutput = uiLog.createTextArea().setId('log').setWidth('400').setHeight('500').setValue(getLog_());
  panel.add(txtOutput);
  
  SpreadsheetApp.getActiveSpreadsheet().show(uiLog); 
}

function getOrCreateSheet_(sheet_name) {
  var activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = activeSpreadsheet.getSheetByName(sheet_name);
  if (!sheet) {
    sheet = activeSpreadsheet.insertSheet(sheet_name, 0);
  }
  return sheet;
}


/**
 * Returns the values from 2 columns from the csvconfig sheet starting at
 * colIndex, as key-value pairs. Key-values are only returned if they do
 * not contain the empty string or have a boolean value of false.
 * If the key is start-date or end-date and the value is an instance of
 * the date object, the value will be converted to a string in yyyy-MM-dd.
 * If the key is start-index or max-results and the type of the value is
 * number, the value will be parsed into a string.
 * @param {number} colIndex The column index to return values from.
 * @return {object} The values starting in colIndex and the following column
       as key-value pairs.
 */
function getConfigsStartingAtCol_(sheet, colIndex) {
  var config = {}, rowIndex, key, value;
  var range = sheet.getRange(1, colIndex, sheet.getLastRow(), 2);
  
  // The first cell of the first column becomes the name of the query.
  config.query = range.getCell(1,1).getValue();
  
  for (rowIndex = 2; rowIndex <= range.getLastRow(); ++rowIndex) {
    key = range.getCell(rowIndex, 1).getValue();
    value = range.getCell(rowIndex, 2).getValue();
    if (value) {
      config[key] = value;
    }
  }

  return config;
}

/**
 * Returns an array of config objects. This reads the csvconfig sheet
 * and tries to extract adjacent column names that end with the same
 * number. For example Names1 : Values1. Then both columns are used
 * to define key-value pairs for the coniguration object. The first
 * column defines the keys, and the adjacent column values define
 * each keys values.
 * @param {Sheet} The csvconfig sheet from which to read configurations.
 * @returns {Array} An array of API query configuration object.
 */
function getConfigs_(sheet) {

    var configs = [], colIndex;
    // There must be at least 2 columns.
    if (sheet.getLastColumn() < 2) {
        return configs;
    }

    var headerRange = sheet.getRange(1, 1, 1, sheet.getLastColumn());
    var firstColValue, firstColNum, secondColValue, secondColNum;

    // Test the name of each column to see if it has an adjacent column that ends
    // in the same number. ie xxxx555 : yyyy555.
    // Since we check 2 columns at a time, we don't need to check the last column,
    // as there is no second column to also check. 
    for (colIndex = 1; colIndex <= headerRange.getNumColumns() - 1; ++colIndex) {
        firstColValue = headerRange.getCell(1, colIndex).getValue();
        firstColNum = getTrailingNumber_(firstColValue);
        
        secondColValue = headerRange.getCell(1, colIndex + 1).getValue();
        secondColNum = getTrailingNumber_(secondColValue);
      
        if (firstColNum && secondColNum && firstColNum === secondColNum) {
            configs.push(getConfigsStartingAtCol_(sheet, colIndex)); 
        }
    }
  
    return configs;  
}

/**
 * Returns the trailing number on a string. For example the
 * input: xxxx555 will return 555. Inputs with no trailing numbers
 * return undefined. Trailing whitespace is not ignored.
 * @param {string} input The input to parse.
 * @resturns {number} The trailing number on the input as a string.
 *     undefined if no number was found.
 */
function getTrailingNumber_(input) {
  // Match at one or more digits at the end of the string.
  var pattern = /(\d+)$/;
  var result = pattern.exec(input);
  if (result) {
    // Return the matched number.
    return result[0];
  }
  
  return undefined;
}

/**
 * Returns 1 greater than the largest trailing number in the header row.
 * @param {Object} sheet The sheet in which to find the last number.
 * @returns {Number} The next largest trailing number.
 */
function getLastNumber_(sheet) {
  var maxNumber = 0;
  
  var lastColIndex = sheet.getLastColumn();

  if (lastColIndex > 0) {
    var range = sheet.getRange(1, 1, 1, lastColIndex);

    for (var colIndex = 1; colIndex < sheet.getLastColumn(); ++colIndex) {
      var value = range.getCell(1, colIndex).getValue();
      var headerNumber = getTrailingNumber_(value);
      if (headerNumber) {
        var number = parseInt(headerNumber, 10);
        maxNumber = number > maxNumber ? number : maxNumber;                                  
      }
    }
  }
  return maxNumber + 1;
}

/**
 * Adds a CSV Report configuration to the spreadsheet.
 */
function createCSVReport() {
  var sheet = getOrCreateSheet_(CSV_CONFIG);
  var headerNumber = getLastNumber_(sheet);
  var config = [
    ["query" + headerNumber, "value" + headerNumber],
    ['url', ''],
    ['http-username', ''],
    ['http-password', ''],
    ['sheet-name', '']];
  
  sheet.getRange(1, sheet.getLastColumn() + 1, config.length, 2).setValues(config);
}
