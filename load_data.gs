/**
 * == A script to automate data load from existing Flowcom spreadsheet. ==
 *
 * Using the logging and configuration functions from the script:
 * 'A Google Apps Script for importing CSV data into a Google Spreadsheet' by Ian Lewis.
 *  https://gist.github.com/IanLewis/8310540
 * @author ianmlewis@gmail.com (Ian Lewis)
 * @author dunn.shane@gmail.com (Shane Dunn)
 * c Shane Dunn Nov 2016
*/

/* =========== Globals ======================= */
var SPREADSHEET_ID = "1mlpCfUHtG1HY4fNDCiwKI92FWqMiQHKRcrJ2WlywT64"; // "Flocom Data" spreadsheet
var DATA_SHEET = "Data";


/* =========== Support functions ======================= */
/**
 * Check if the string is numeric with a seperating dash ('-')
 * [expecting strings like 70-222 ie. nn-nnn].
 */
function isNumeric(str)
{
  var allowedChars = "0123456789-";     //  For Checking Decimal , allowedChars = "0123456789.";
  var isDigit=true;
  var char;
  for (i = 0; i  < str.length && isDigit == true; i++) {
    char = str.charAt(i);
    if (allowedChars.indexOf(char) == -1)  isDigit = false;
  }
  return isDigit;
}

function isValidDate(d) {
  if ( Object.prototype.toString.call(d) !== "[object Date]" )
    return false;
  return !isNaN(d.getTime());
}

function isValidNumber(n) {
  if(!isNaN(parseFloat(n)) && isFinite(n)){
    return true;
  } else {
    return false;
  }
}

/**
 * Check if the array is has anything in it
 */
Array.prototype.isNull = function (){
    return this.join().replace(/,/g,'').trim().length === 0;
};

/* =========== Main Extration functions ======================= */

function getNCCData(e) {
    setupLog_();
    var now = new Date(), i, config, configName, dsheet, esheet;
    log_('Running on: ' + now);
  
    var configs = getConfigs_(getOrCreateSheet_(CSV_CONFIG));
  
    if (!configs.length) {
        log_('No report configurations found');
    } else {
        log_('Found ' + configs.length + ' report configurations.');
      
      for (i = 0; config = configs[i]; ++i) {
          configName = config.query;
          if (config['sheet-name'] && config['error-name']) {
              if (config.url) {
                  try {
                      log_('Getting NCC Data: ' + configName);
                      dsheet = getOrCreateSheet_(config['sheet-name']);
                      esheet = getOrCreateSheet_(config['error-name']);
                      load_data(dsheet, esheet, config.url);
                  } catch (error) {
                      log_('Error executing ' + configName + ': ' + error.message);
                  }
              } else {
                  log_('No URL found: ' + configName); 
              }
          } else {
              log_('No sheet-name found: ' + configName);
          }
      }
      
      
    }
    log_('Script done');
    
    // Update the user about the status of the queries.
    if( e === undefined ) {
      displayLog_();
    }
}

function parseSheet(schedule_data, meter_data) {
  var parsed = [], parsedRow, rowIndex, colIndex, rowData, sdtCol, edtCol, smtCol, emtCol, mdRow;
  // check for header
  if ( schedule_data[0] == undefined || schedule_data[0].isnull ) {
    return parsed;
  } else {
    sdtCol = 0;
    edtCol = 1;
    smtCol = 2;
    emtCol = 3;
    mdRow  = 1;
    
    for (rowIndex = 1; rowIndex <= schedule_data.length; ++rowIndex) {
      rowData = schedule_data[rowIndex];
      parsedRow = [NaN,NaN,NaN,NaN];
      if ( rowData !== undefined && rowData.join().replace(/,/g,'').trim() !== '' ) {
        // Logger.log('|' + rowData.join().replace(/,/g,'').trim() + '|');
        if (rowData[25] = '') {
          for (colIndex = mdRow; colIndex <= meter_data.length; ++colIndex) {
            if (rowData[23] >= meter_data[colIndex][3]) {
              parsedRow[0] = meter_data[colIndex][3];
              parsedRow[2] = meter_data[colIndex][8];
            }
            if (rowData[24] >= meter_data[colIndex][3]) {
              parsedRow[1] = meter_data[colIndex][3];
              parsedRow[3] = meter_data[colIndex][8];
            }
            if (rowData[24] <= meter_data[colIndex][3]) {
              mdRow = colIndex - 1;
              break;
            }
          }
        }
        parsed.push(parsedRow);
      }
    }
    return parsed;
  }
}

function load_data () {
  // Season	"Watering No."	User	Name	"Planned Hours"	Status	"Projected Usage at Std Rate"	"Requested Rate"	"Projected Usage"	Order	Start Date Time	End Date Time	"Manual Flow Rate Start"	"Manual Flow Rate End"	"Manual Meter Start"	"Manual Meter End"	"Used (Calc)"	"Meter Start"	"Meter End"	"Used (Query Sum)"	"Used (Calc)"	"Check Diff"
  // "Reading Date/Time"	"Status"	"Flow Rate (Ml/day)"	"Actual Date/Time"	"Last Total"	"Ml/min"	"Interval (min)"	"Flow (Ml)"	"Adjusted Total"	"Cumulative Total"
  // "Adj. Dayligh Saving Start Date Time"	"Adj. Dayligh Saving End Date Time"	"Meter Start"	"Meter End"
  var parsed = [], parsedRow, rowIndex, colIndex, rowData, sdtCol, edtCol, smtCol, emtCol;

  var lData = [];
  var eData = [];
  var parsedData = [];
  var mdRow = 1;
  var meter_ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var meter_data_ss = meter_ss.getSheetByName(DATA_SHEET);
  var sched_ss = SpreadsheetApp.getActiveSpreadsheet();
  var msched_data_ss = sched_ss.getSheetByName('order_master');
  var dsched_data_ss = sched_ss.getSheetByName('order_detail');
  
  //Logger.log('|' + meter_data_ss.getLastRow() + '|' + meter_data_ss.getLastColumn());
  var meter_data = meter_data_ss.getSheetValues(1, 1, meter_data_ss.getLastRow(), meter_data_ss.getLastColumn());
  var msched_data = msched_data_ss.getSheetValues(1, 1, msched_data_ss.getLastRow(), msched_data_ss.getLastColumn());
  var dsched_data = dsched_data_ss.getSheetValues(1, 1, dsched_data_ss.getLastRow(), dsched_data_ss.getLastColumn());

  for (rowIndex = 1; rowIndex <= dsched_data.length; ++rowIndex) {
    rowData = dsched_data[rowIndex];
    parsedRow = [rowIndex,mdRow,NaN,NaN,NaN,NaN];
    if ( rowData !== undefined && rowData.join().replace(/,/g,'').trim() !== '' ) {
      //Logger.log('>' + rowData.join().replace(/,/g,'').trim() + '<');
      //Logger.log((rowData[25] == ''));
      var test_log = (rowData[25] == '');
      Logger.log('23: ' + rowData[23] + '|24: ' + rowData[24] + '|25: ' + rowData[25] + '|test: ' + test_log);
      if (rowData[25] == '') {
        for (colIndex = mdRow; colIndex <= meter_data.length; ++colIndex) {
          Logger.log('xx 23: ' + rowData[23] + '|24: ' + rowData[24] + '|md: ' + mdRow + '|col: ' + colIndex + '|data: ' + meter_data[colIndex]);
          if (meter_data[colIndex] == undefined) {
            break;
          }
          if (rowData[23] >= meter_data[colIndex][3]) {
            //Logger.log(meter_data[colIndex][3]);
            //Logger.log(meter_data[colIndex][8]);
            parsedRow[0] = meter_data[colIndex][3];
            parsedRow[2] = meter_data[colIndex][8];
          }
          if (rowData[24] >= meter_data[colIndex][3]) {
            //Logger.log(meter_data[colIndex][3]);
            //Logger.log(meter_data[colIndex][8]);
            parsedRow[1] = meter_data[colIndex][3];
            parsedRow[3] = meter_data[colIndex][8];
          }
          if (rowData[24] <= meter_data[colIndex][3]) {
            //Logger.log(meter_data[colIndex][3]);
            //Logger.log(meter_data[colIndex][8]);
            mdRow = colIndex - 1;
            if (mdRow < 0) { mdRow = 1; }
            break;
          }
        }
      }
      if (rowData[25] == '') {
        Logger.log(parsedRow);
        parsed.push(parsedRow);
      }
    }
  }
  var new_ss = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('meter_readings');
    new_ss.getRange(
    2,              /* first row    */
    1,              /* first column */
    parsed.length,   /* rows    */
    parsed[0].length /* columns */).setValues(parsed);

}