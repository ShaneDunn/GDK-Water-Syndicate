function createDocFromSheet2(){
  var templateDocID = "13Wsgk7jmjXtjfyNorlX_OlBJLZoy3u8PuRarozETwOo"; // get template file id - Water Delivery Advice
  var FOLDER_NAME = "GDK"; // folder name of where to put completed reports
  var FOLDER_ID = "0B6NHem9C-Di5XzlfVGRzRzVtbU0"; // folder ID of where to put completed reports  // https://drive.google.com/drive/folders/0B6NHem9C-Di5XzlfVGRzRzVtbU0?usp=sharing
  var WATER_DATA = "Order Workbench"; // name of sheet with water advice data
  var DOC_PREFIX = "Water Delivery Advice - "; // prefix for name of document to be loaded with water advice data
  var DUMMY_PARA = "Remove"; // Text denoting a dummy or unwanted paragraph
  var WS_TABLE = "Watering Schedule";  // Text as a place mark for the Water Scheduling table
  var START_ROW = 2; // The row on which the data in the spreadsheet starts
  var START_COL = 22; // The column on which the data in the spreadsheet starts

  // get the data for the delivery advice letters
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var tz = SpreadsheetApp.getActive().getSpreadsheetTimeZone();
  var sheet = ss.getSheetByName(WATER_DATA);
  var data = sheet.getRange(START_ROW, START_COL, sheet.getLastRow()-1, sheet.getLastColumn()).getValues();

  // create new document
  var season = data[0][0]; // get watering season
  var adviceNbr = data[0][1] + " - " + Utilities.formatDate(new Date(), tz, "yyyy/MM/dd"); // get watering number and date
  var doc = DocumentApp.create(DOC_PREFIX+adviceNbr);
  var body = doc.getBody();

  // move file to right folder
  //var file = DocsList.getFileById(doc.getId());
  //var folder = DocsList.getFolder(FOLDER_NAME);
  //file.addToFolder(folder);
  //file.removeFromFolder(DocsList.getRootFolder());
  var folder = DriveApp.getFolderById(FOLDER_ID);
  var file = DriveApp.getFileById(templateDocID).makeCopy(DOC_PREFIX+adviceNbr, folder);
  var docID = file.getId();
  var doc = DocumentApp.openById(docID);
  var body = doc.getBody();
  var bodyCopy = doc.getBody().copy();
  body = body.clear();

  // Get the body of the template document
  //var bodyCopy = DocumentApp.openById(templateDocID).getBody();
  //body.setMarginTop(bodyCopy.getMarginTop());
  //body.setMarginBottom(bodyCopy.getMarginBottom());

  // for each water user's entry fill in the template with the data
  for (var i in data){
    if (data[i][7]) {
      // Put in a page break between each user, but only after the first one
      if( i > 0) {
        var pgBrk = body.appendPageBreak();
      }
      // Format dates - check if a date object or a excel/calc decimal date number
      if (data[i][15] instanceof Date) {
        var temp = data[i][15];
      } else {
        var temp = ExcelDateToJSDate(data[i][15]);
      }
      var start_date = Utilities.formatDate(temp, tz, "EEEE dd/MM/yyyy hh:mm a");

      if (data[i][16] instanceof Date) {
        var temp = data[i][16];
      } else {
        var temp = ExcelDateToJSDate(data[i][16]);
      }
      var end_date = Utilities.formatDate(temp, tz, "EEEE dd/MM/yyyy hh:mm a");
      var addTable = true;
      // load template and replace tokens
      var newBody = bodyCopy.copy();
      newBody.replaceText("<<Season>>", data[0][0]);
      newBody.replaceText("<<User>>", data[i][8]);
      newBody.replaceText("<<Address>>", data[i][27]);
      newBody.replaceText("<<watering_no>>", data[0][1]);
      newBody.replaceText("<<sDate>> <<sTime>> <<sPeriod>>",start_date + " [" + data[i][17]+"]");
      newBody.replaceText("<<eDate>> <<eTime>> <<ePeriod>>",end_date + " [" + data[i][18]+"]");
      newBody.replaceText("<<Hrs>>", data[i][24]);
      newBody.replaceText("<<Delivery Rate>>", data[i][23]);
      if (!data[i][19]) {
        newBody.replaceText("<<UTD>>", "");
      } else {
        newBody.replaceText("<<UTD>>", Utilities.formatString('%11.1f', data[i][19]));
      }
      newBody.replaceText("<<eUsage>>", Utilities.formatString('%11.1f', data[i][21]));
      newBody.replaceText("<<Remain>>", Utilities.formatString('%11.1f', data[i][20]));
      newBody.replaceText("<<eRemain>>", Utilities.formatString('%11.1f', data[i][22]));
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
            addTableInDocument(doc, data, tz);
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
  }
  doc.saveAndClose();
  ss.toast("Water Delivery Advices have been compiled");
}

// http://www.googleappsscript.org/home/create-table-in-google-document-using-apps-script

function addTableInDocument(docBody, dataTable, tz) {
  //define header cell style
  var headerStyle = {};
  headerStyle[DocumentApp.Attribute.BACKGROUND_COLOR] = '#d9d9d9';
  headerStyle[DocumentApp.Attribute.BOLD] = true;
  headerStyle[DocumentApp.Attribute.FONT_SIZE] = 10;
  
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
  var td = tr.appendTableCell('User');
  td.setAttributes(headerStyle);
  var td = tr.appendTableCell('Hrs / Rate');
  td.setAttributes(headerStyle);
  var td = tr.appendTableCell('Start');
  td.setAttributes(headerStyle);
  var td = tr.appendTableCell('Finish');
  td.setAttributes(headerStyle);
  table.setBorderColor("#cccccc");
  table.setColumnWidth(0, 65); //WIDTH:111
  table.setColumnWidth(1, 65); //WIDTH:70
  table.setColumnWidth(2, 160); //WIDTH:159
  table.setColumnWidth(3, 160); //WIDTH:159
  table.setAttributes(tstyle);

  // Load schedule
  for (var i in dataTable){
    if (dataTable[i][7]) {
    var dRow = dataTable[i];
    var tr = table.appendTableRow();
    var td = tr.appendTableCell(dRow[8]);
    td.setAttributes(cellStyle);
    //Apply the para style to each paragraph in cell
    var paraInCell = td.getChild(0).asParagraph();
    paraInCell.setAttributes(paraStyle);
    var td = tr.appendTableCell(dRow[24] + ' / ' + dRow[23]);
    td.setAttributes(cellStyle);
    //Apply the para style to each paragraph in cell
    var paraInCell = td.getChild(0).asParagraph();
    paraInCell.setAttributes(paraStyle);
    var td = tr.appendTableCell(Utilities.formatDate(ExcelDateToJSDate(dRow[15]), tz, "EEEE dd/MM/yyyy hh:mm a"));
    td.setAttributes(cellStyle);
    //Apply the para style to each paragraph in cell
    var paraInCell = td.getChild(0).asParagraph();
    paraInCell.setAttributes(paraStyle);
    var td = tr.appendTableCell(Utilities.formatDate(ExcelDateToJSDate(dRow[16]), tz, "EEEE dd/MM/yyyy hh:mm a"));
    td.setAttributes(cellStyle);
    //Apply the para style to each paragraph in cell
    var paraInCell = td.getChild(0).asParagraph();
    paraInCell.setAttributes(paraStyle);
  }
  }
}

/*
[0] Season
[1] Watering No.
[2] Request Date
[3] Due Date
[4] Order Date
[5] Start Date
[6] Note
[7] Water User
[8] Name
[9] Hrs Requested
[10] Status
[11] Projected Usage at Std Rate
[12] Requested Rate
[13] Projected Usage
[14] Delivery Order
[15] Start Date/Time
[16] End Date/Time
[17] Period From
[18] Period To
[19] Used To Date
[20] Remaining
[21] Expected Usage
[22] Expected Remainder
[23] Rate
[24] Hours + 'Hr'
[25] Hours
[26] Active
[27] Address
*/
