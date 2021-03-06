function createDocFromSheet3(){
  var templateDocID = "10OlSE9c8__vLaqPydUnZQbSqNvQmxvogttx-wsWiVsE"; // get template file id - Water Statement
  var FOLDER_NAME = "GDK"; // folder name of where to put completed reports
  var FOLDER_ID = "0B6NHem9C-Di5XzlfVGRzRzVtbU0"; // folder ID of where to put completed reports
  var WATER_DATA = "order_detail"; // name of sheet with water meter readings
  var DOC_PREFIX = " Water Statement - "; // prefix for name of document to be loaded with water advice data
  var DUMMY_PARA = "Remove"; // Text denoting a dummy or unwanted paragraph
  var WS_TABLE = "Watering Record";  // Text as a place mark for the Watering Record table
  var START_ROW = 3; // The row on which the data in the spreadsheet starts
  var START_COL = 1; // The column on which the data in the spreadsheet starts
  
  // get the data for the statements
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var tz = SpreadsheetApp.getActive().getSpreadsheetTimeZone();
  var sheet = ss.getSheetByName(WATER_DATA);
  var data = sheet.getRange(START_ROW, START_COL, sheet.getLastRow()-1, sheet.getLastColumn()).getValues();
  var hdata = ss.getSheetByName("Order Workbench").getRange(2, 1, 1, sheet.getLastColumn()).getValues();
  var sheet = ss.getSheetByName("data");
  var data2 = sheet.getRange(3, 1, 16, 14).getValues();
  var sheet = ss.getSheetByName("charges");
  var data3 = sheet.getRange(4, 1, 16, 24).getValues();
  var var_charge = sheet.getRange(9, 46, 1, 1).getValues();
  var levy = sheet.getRange(9, 74, 1, 1).getValues();
  var tot_fixed = sheet.getRange(9, 39, 1, 1).getValues();
  // var season = sheet.getRange(8, 18, 1, 1).getValues();
  // var water_no = Utilities.formatString('%02d', ss.getSheetByName("System").getRange(2, 8).getValue());
  var season = hdata[0][21]; // get watering season - System!B6 or 'Order Workbench'!V2
  var water_no = Utilities.formatString('%02d', hdata[0][0]); // Get Watering No. - System!H2 or 'Order Workbench'!A2
  
  // create new document
  var adviceNbr = water_no + " " + Utilities.formatDate(new Date(), tz, "dd/MM/yyyy") + " v01"; // get watering number and date
  var doc_name = season + DOC_PREFIX + adviceNbr;
  var doc = DocumentApp.create(doc_name);
  var body = doc.getBody();

  // move file to right folder
  //var file = DocsList.getFileById(doc.getId());
  //var folder = DocsList.getFolder(FOLDER_NAME);
  //file.addToFolder(folder);
  //file.removeFromFolder(DocsList.getRootFolder());
  
  // Get the body of the template document
  var bodyCopy = DocumentApp.openById(templateDocID).getBody();
  body.setMarginTop(bodyCopy.getMarginTop());
  body.setMarginBottom(bodyCopy.getMarginBottom());

  // for each water user fill in the template with the data 
  for (var i in data2){
    // Put in a page break between each user, but only after the first one
    if( i > 0) {
      var pgBrk = body.appendPageBreak();
    }
    var addTable = true;
    // load template and replace tokens
    var newBody = bodyCopy.copy();
    newBody.replaceText("<<User>>", data2[i][2]);
    newBody.replaceText("<<Address>>", data2[i][3]);
    newBody.replaceText("<<watering_no>>", adviceNbr);
    newBody.replaceText("<<Season>>", season[0][0]);
    var temp1 = data2[i][11];
    //var temp2 = Utilities.formatString('%11.1f', temp1);
    if (!data2[i][11]) {
      newBody.replaceText("<<Allocation>>", "");
    } else {
      newBody.replaceText("<<Allocation>>", Utilities.formatString('%11.1f', data2[i][11]).trim());
    }
    if (!data2[i][12]) {
      newBody.replaceText("<<UTD>>", "");
    } else {
      newBody.replaceText("<<UTD>>", Utilities.formatString('%11.1f', data2[i][12]).trim());
    }
    if (!data2[i][13]) {
      newBody.replaceText("<<Remain>>", "");
    } else {
      newBody.replaceText("<<Remain>>", Utilities.formatString('%11.1f', data2[i][13]).trim());
    }
    if (!data3[i][21]) {
      newBody.replaceText("<<Past Due>>", "");
    } else {
      newBody.replaceText("<<Past Due>>", Utilities.formatString('$%.2f', data3[i][21]).trim());
    }
    if (!data3[i][22]) {
      newBody.replaceText("<<Past Due Comment>>", "");
    } else {
      newBody.replaceText("<<Past Due Comment>>", data3[i][22]);
    }
    if (!data3[i][12]) {
      newBody.replaceText("<<Fixed Charge>>", "");
    } else {
      newBody.replaceText("<<Fixed Charge>>", Utilities.formatString('$%.2f', data3[i][12]).trim());
    }
    if (!tot_fixed[0][0]) {
      newBody.replaceText("<<Total Fixed>>", "");
    } else {
      newBody.replaceText("<<Total Fixed>>", formatCurrency('$', tot_fixed[0][0]));
    }
    if (!levy[0][0]) {
      newBody.replaceText("<<Levy>>", "");
    } else {
      newBody.replaceText("<<Levy>>", Utilities.formatString('$%.2f', levy[0][0]).trim());
    }
    if (!data3[i][13]) {
      newBody.replaceText("<<Tot Var Charge>>", "");
    } else {
      newBody.replaceText("<<Tot Var Charge>>", Utilities.formatString('$%.2f', data3[i][13]).trim());
    }
    if (!data2[i][12]) {
      newBody.replaceText("<<Ml>>", "");
    } else {
      newBody.replaceText("<<Ml>>", Utilities.formatString('%11.1f', data2[i][12]).trim());
    }
    if (!var_charge[0][0]) {
      newBody.replaceText("<<Var Charge>>", "");
    } else {
      newBody.replaceText("<<Var Charge>>", Utilities.formatString('$%.2f', var_charge[0][0]).trim());
    }
    
    // append template to new document
    for (var j = 0; j < newBody.getNumChildren(); j++) {
      var element = newBody.getChild(j).copy();
      var type = element.getType(); // need to handle different types para, table etc differently
      //Logger.log("Element type is "+type);
      if (type == DocumentApp.ElementType.PARAGRAPH ) {
        if (element.asParagraph().getText() != DUMMY_PARA) {
          body.appendParagraph(element);
        }
        if (element.asParagraph().getText() == WS_TABLE ) {
          addTableInDocument2(doc, data, tz, data2[i][0]);
          addTable = false;
        }
      } else if (type == DocumentApp.ElementType.TABLE ) {
        if ( addTable ) { body.appendTable(element); }
        else { addTable = true; }
      } else if( type == DocumentApp.ElementType.LIST_ITEM ) {
        body.appendListItem(element);
      } else
        throw new Error("Unknown element type: "+type);
    }
    // remove first blank line / paragraph
    if( i == 0) {
      var para = body.getChild(0).removeFromParent();
    }
  }
  doc.saveAndClose();
  ss.toast("Water Statements have been compiled");
}


// http://www.googleappsscript.org/home/create-table-in-google-document-using-apps-script

function addTableInDocument2(docBody, dataTable, tz, user_no) {
  //define header cell style
  var headerStyle = {};
  headerStyle[DocumentApp.Attribute.BACKGROUND_COLOR] = '#d9d9d9';
  headerStyle[DocumentApp.Attribute.BOLD] = true;
  headerStyle[DocumentApp.Attribute.FONT_SIZE] = 10;
  headerStyle[DocumentApp.Attribute.VERTICAL_ALIGNMENT] = DocumentApp.VerticalAlignment.BOTTOM;
  
  //Style for the cells other than header row
  var cellStyle = {};
  cellStyle[DocumentApp.Attribute.BOLD] = false;
  cellStyle[DocumentApp.Attribute.FOREGROUND_COLOR] = '#000000';
  cellStyle[DocumentApp.Attribute.FONT_SIZE] = 10;

  // paragraph style
  var paraStyle = {};
  paraStyle[DocumentApp.Attribute.SPACING_AFTER] = 0;
  paraStyle[DocumentApp.Attribute.LINE_SPACING] = 1;
  
  // Centre the table
  var tstyle = {};
  tstyle[DocumentApp.Attribute.HORIZONTAL_ALIGNMENT] =
     DocumentApp.HorizontalAlignment.CENTER;
  
  //Add a table in document
  var table = docBody.appendTable();
  // Put header row
  var tr = table.appendTableRow();
  var td = tr.appendTableCell('Watering No.');
  td.setAttributes(headerStyle);
  var td = tr.appendTableCell('Start Time');
  td.setAttributes(headerStyle);
  var td = tr.appendTableCell('Finish Time');
  td.setAttributes(headerStyle);
  var td = tr.appendTableCell('Meter Start');
  td.setAttributes(headerStyle);
  var td = tr.appendTableCell('Meter Finish');
  td.setAttributes(headerStyle);
  var td = tr.appendTableCell('Water Used');
  td.setAttributes(headerStyle);
  table.setBorderColor("#cccccc");
  table.setColumnWidth(0, 65); //WIDTH:111
  table.setColumnWidth(1, 135); //WIDTH:70
  table.setColumnWidth(2, 135); //WIDTH:159
  table.setColumnWidth(3, 45); //WIDTH:159
  table.setColumnWidth(4, 45); //WIDTH:159
  table.setColumnWidth(5, 45); //WIDTH:159
  table.setAttributes(tstyle);

  // Load schedule
  for (var i in dataTable){
    // Format dates - check if a date object or a excel/calc decimal date number
    if (dataTable[i][10] instanceof Date) {
      var temp = dataTable[i][10];
    } else {
      var temp = ExcelDateToJSDate(dataTable[i][10]);
    }
    var start_date = Utilities.formatDate(temp, tz, "EEEE dd/MM/yyyy hh:mm a");

    if (dataTable[i][11] instanceof Date) {
      var temp = dataTable[i][11];
    } else {
      var temp = ExcelDateToJSDate(dataTable[i][11]);
    }
    var end_date = Utilities.formatDate(temp, tz, "EEEE dd/MM/yyyy hh:mm a");

    var wused = Number(dataTable[i][16]);
    if (isNaN(wused)) {
        var dmp = false;
    } else {
        dmp = (wused > 0) ? true : false;
    }
    if(dataTable[i][0] == 6 && dataTable[i][2] == user_no && dmp) {
      var dRow = dataTable[i];
      var tr = table.appendTableRow();
      var td = tr.appendTableCell(dRow[1]);
      td.setAttributes(cellStyle);
      //Apply the para style to each paragraph in cell
      var paraInCell = td.getChild(0).asParagraph();
      paraInCell.setAttributes(paraStyle);
      if (dRow[10] instanceof Date) {
        var temp = dRow[10];
      } else {
        var temp = ExcelDateToJSDate(dRow[10]);
      }
      var td = tr.appendTableCell(Utilities.formatDate(temp, tz, "dd/MM/yyyy hh:mm a"));
      td.setAttributes(cellStyle);
      //Apply the para style to each paragraph in cell
      var paraInCell = td.getChild(0).asParagraph();
      paraInCell.setAttributes(paraStyle);
      if (dRow[11] instanceof Date) {
        var temp = dRow[11];
      } else {
        var temp = ExcelDateToJSDate(dRow[11]);
      }
      var td = tr.appendTableCell(Utilities.formatDate(temp, tz, "dd/MM/yyyy hh:mm a"));
      td.setAttributes(cellStyle);
      //Apply the para style to each paragraph in cell
      var paraInCell = td.getChild(0).asParagraph();
      paraInCell.setAttributes(paraStyle);
      Logger.log(dRow[14]);
      Logger.log(Utilities.formatString('%11.1f', dRow[14]));
      var td = tr.appendTableCell(Utilities.formatString('%11.1f', dRow[14]).trim());
      td.setAttributes(cellStyle);
      //Apply the para style to each paragraph in cell
      var paraInCell = td.getChild(0).asParagraph();
      paraInCell.setAttributes(paraStyle);
      var td = tr.appendTableCell(Utilities.formatString('%11.1f', dRow[15]).trim());
      td.setAttributes(cellStyle);
      //Apply the para style to each paragraph in cell
      var paraInCell = td.getChild(0).asParagraph();
      paraInCell.setAttributes(paraStyle);
      var td = tr.appendTableCell(Utilities.formatString('%11.1f', dRow[16]).trim());
      td.setAttributes(cellStyle);
      //Apply the para style to each paragraph in cell
      var paraInCell = td.getChild(0).asParagraph();
      paraInCell.setAttributes(paraStyle);
    }
  }
}

function formatCurrency(symbol, amount) {
  var aDigits = amount.toFixed(2).split(".");
  aDigits[0] = aDigits[0].split("").reverse().join("")
    .replace(/(\d{3})(?=\d)/g,"$1,").split("").reverse().join("");
  return symbol + aDigits.join(".");
}
