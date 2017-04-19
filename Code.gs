/* =========== Setup Menu ======================= */
/**
 * Create a Menu when the script loads. Adds a new csvconfig sheet if
 * one doesn't exist.
 */
function onOpen(e) {
  var ui = SpreadsheetApp.getUi();
  // Or DocumentApp or FormApp.
  ui.createMenu('GDK Menu')
    .addItem('UpLoad Meter Data to Drive', 'openDialog')
    .addItem('Load Meter Data to Spreadsheet', 'doclistUI')
    .addItem('Load Meter Data to Spreadsheet - static', 'importGDKCSV')
    .addItem('Update Fusion Table', 'sync')
    .addItem('Create Report', 'createCSVReport')
    .addSeparator()
    .addSubMenu(ui.createMenu('Print')
      .addItem('Water Statement', 'createDocFromSheet3')
      .addItem('Water Advice', 'createDocFromSheet2')
      .addItem('Water Request', 'createDocFromSheet')
    )
    .addToUi();
  
  getOrCreateSheet_(CSV_CONFIG);
}

function test () {
  var WATER_DATA = "Order Workbench"; // name of sheet with water advice data
  var START_ROW = 2; // The row on which the data in the spreadsheet starts
  var START_COL = 22; // The column on which the data in the spreadsheet starts
  
  // get the data for the allocation request letters
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var tz = SpreadsheetApp.getActive().getSpreadsheetTimeZone();
  var sheet = ss.getSheetByName(WATER_DATA);
  var data = sheet.getRange(START_ROW, START_COL, sheet.getLastRow()-1, sheet.getLastColumn()).getValues();

  // Load static variables for letter
  var formattedDate = Utilities.formatDate(new Date(), "GMT", "yyyy-MM-dd'T'HH:mm:ss'Z'");
  Logger.log(formattedDate);
  formattedDate = Utilities.formatDate(data[0][2], tz, "dd/MM/yyyy");
  Logger.log(formattedDate);
  formattedDate = Utilities.formatDate(data[0][3], tz, "dd/MM/yyyy");
  Logger.log(formattedDate);
  formattedDate = Utilities.formatDate(data[0][4], tz, "dd/MM/yyyy");
  Logger.log(formattedDate);
  formattedDate = Utilities.formatDate(data[0][5], tz, "dd/MM/yyyy hh:mm a");
  Logger.log(formattedDate);
  formattedDate = Utilities.formatDate(new Date(), "GMT", "dd/MM/yyyy hh:mm a");
  Logger.log(formattedDate);
  var row = data[3];
  Logger.log(row[19]);
  var aFstring = Utilities.formatString('%11.1f', row[19]);
  Logger.log(aFstring);
  var newBody = "xxxxxx <<qty_used>> xxxxxxx";
  newBody.replaceText("<<qty_used>>", Utilities.formatString('%11.1f', row[19]));
  Logger.log(newBody);
  
  
}