function createDocFromSheet(){
  var templateDocID = "1qdC6s7Jgt1F8xauXyEu_khlTBYh8IExpNQaLMu_NPig"; // get template file id - Water Allocation Request
  var FOLDER_NAME = "GDK"; // folder name of where to put completed reports
  var FOLDER_ID = "0B6NHem9C-Di5XzlfVGRzRzVtbU0"; // folder name of where to put completed reports
  var WATER_DATA = "Order Workbench"; // name of sheet with water advice data
  var WATER_CHGS = "Charges"; // name of sheet with water charges data
  var DOC_PREFIX = "Water Allocation Request - "; // prefix for name of document to be loaded with water advice data
  var DUMMY_PARA = "Remove"; // Text denoting a dummy or unwanted paragraph
  var HEADER_START_ROW = 2; // The row on which the data in the spreadsheet starts
  var HEADER_START_COL = 22; // The column on which the data in the spreadsheet starts
  var DATA_START_ROW = 4; // The row on which the data in the spreadsheet starts
  var DATA_START_COL = 1; // The column on which the data in the spreadsheet starts
  //var user = Session.getUser().getEmail();
  
  // get the data for the allocation request letters
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var tz = SpreadsheetApp.getActive().getSpreadsheetTimeZone();
  var sheet = ss.getSheetByName(WATER_DATA);
  var header = sheet.getRange(HEADER_START_ROW, HEADER_START_COL, 1, sheet.getLastColumn()).getValues();
  var data = sheet.getRange(DATA_START_ROW, DATA_START_COL, sheet.getLastRow()-1, sheet.getLastColumn()).getValues();
  var sheet = ss.getSheetByName(WATER_CHGS);
  var data1 = sheet.getRange(DATA_START_ROW, DATA_START_COL, sheet.getLastRow()-1, sheet.getLastColumn()).getValues();

  // Load static variables for letter
  var season = header[0][0]; // get watering season
  var adviceNbr = header[0][1]+" - "+Utilities.formatDate(new Date(), tz, "yyyy/MM/dd"); // get watering number and date
  var req_date = Utilities.formatDate(header[0][2], tz, "dd/MM/yyyy");
  var due_date = Utilities.formatDate(header[0][3], tz, "dd/MM/yyyy");
  var order_date = Utilities.formatDate(header[0][4], tz, "dd/MM/yyyy");
  var start_date = Utilities.formatDate(header[0][5], tz, "dd/MM/yyyy hh:mm a");
  var note = header[0][6];
  if( note == "" ) note = DUMMY_PARA;
  
  // get template document and make a copy.
  var folder = DriveApp.getFolderById(FOLDER_ID);
  var file = DriveApp.getFileById(templateDocID).makeCopy(DOC_PREFIX+adviceNbr, folder);
  var docID = file.getId();
  var doc = DocumentApp.openById(docID);
  var body = doc.getBody();
  var bodyCopy = doc.getBody().copy();
  body = body.clear();
  // A4 in points = 595pt x 842pt
  // 1 cm = 28.346456693 points

  // for each water user's entry fill in the template with the data 
  for (var i in data){
    var row = data[i];
    var row1 = data1[i];
    if (row[0]) {
      if( i > 0) {
        var pgBrk = body.appendPageBreak();
      }
      var newBody = bodyCopy.copy();
      newBody.replaceText("<<Season>>", season);
      newBody.replaceText("<<User>>", row[1]);
      newBody.replaceText("<<Date>>", req_date);
      newBody.replaceText("<<Order_Date>>", due_date);
      newBody.replaceText("<<Note>>", note);
      if (row[13]) {
        newBody.replaceText("<<qty_used>>", Utilities.formatString('%11.1f', row[12]));
        newBody.replaceText("<<qty_remain>>", Utilities.formatString('%11.1f', row[13]));
      } else {
        newBody.replaceText("<<qty_used>>", " ");
        newBody.replaceText("<<qty_remain>>", " ");
      }
      newBody.replaceText("<<Water_Order_Date>>", order_date);
      newBody.replaceText("<<Order_Start>>", start_date);
      if (row1[12]) {
        newBody.replaceText("<<fx_chrg>>", Utilities.formatString('$%.2f', row1[12]));
        newBody.replaceText("<<wtr_chrg>>", Utilities.formatString('$%.2f', row1[13]));
      } else {
        newBody.replaceText("<<fx_chrg>>", " ");
        newBody.replaceText("<<wtr_chrg>>", " ");
      }
      var pnote = row[27];
      if( pnote == "" ) pnote = DUMMY_PARA;
      newBody.replaceText("<<Note_Personal>>", pnote);
      

      for (var j = 0; j < newBody.getNumChildren(); j++) {
        var element = newBody.getChild(j).copy();
        var type = element.getType(); // need to handle different types para, table etc differently
        //Logger.log("Element type is "+type);
        if (type == DocumentApp.ElementType.PARAGRAPH ) {
          if (element.asParagraph().getText() != DUMMY_PARA) {
            body.appendParagraph(element);
          }
        } else if (type == DocumentApp.ElementType.TABLE ) {
          body.appendTable(element);
        } else if( type == DocumentApp.ElementType.LIST_ITEM ) {
          body.appendListItem(element);
        } else
          throw new Error("Unknown element type: "+type);
      }
      if( i == 0) {
        var para = body.getChild(0).removeFromParent();
      }
    }
  }
  doc.saveAndClose();
  ss.toast("Water Allocation Requests have been compiled");
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