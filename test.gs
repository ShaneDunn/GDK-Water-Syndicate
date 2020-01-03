/*
Looby: Friday 27/12/2019  07:00 am
Tatt: Saturday 28/12/2019  07:00 am
Watts: Sunday 29/12/2019  07:00 am
Beer: Monday 30/12/2019  07:00 am
Petts: Tuesday 31/12/2019  07:00 am
Seabrook: Tuesday 31/12/2019  07:00 pm
Pagett: Wednesday 01/01/2020  07:00 pm
Winnel: Thursday 02/01/2020  07:00 am
Thompson: Friday 03/01/2020  07:00 am
Young: Saturday 04/01/2020  07:00 am
Bourke: Sunday 05/01/2020  07:00 am
Dunn: Monday 06/01/2020  07:00 am




0429 146 435,
0400 628 243,
0413 902 938,
0418 618 998	
0408 837 261	"02 6953 37??
0408 402 536"
0429 399 969	
0427 439 515	
0428 649 481	
0417 681 325	
0427 532 400	
0402 609 426	0435 902 338
	0419 024 078
0429 917 419	




0429 146 435,
0400 628 243,
0413 902 938,
0418 618 998,
0408 837 261,
0429 399 969,
0427 439 515,
0417 681 325,
0427 532 400,
0402 609 426,
0435 902 338,
0419 024 078,
0429 917 419

0409 905 163  

+61 409 905 163




Water Allocation Request
<<Season>>
<<Date>>
<<User>>
<<Order_Date>>
<<Water_Order_Date>>
<<Order_Start>>
<<Note>>
<<Note_Personal>>
<<qty_used>>
<<qty_remain>>
<<fx_chrg>>
<<wtr_chrg>>
<<Date>>
<<User>>

Water Delivery Advice
<<Season>>
<<watering_no>>
<<User>>
<<Address>>
<<sDate>>
<<sTime>>
<<sPeriod>>
<<eDate>>
<<eTime>>
<<ePeriod>>
<<Hrs>>
<<Delivery Rate>>
<<UTD>>
<<eUsage>>
<<Remain>>
<<eRemain>>

User
Hrs / Rate
Start
Finish
<<1>>
<<2>>
<<3>>
<<4>>
<<5>>
<<6>>
<<7>>
<<8>>
<<9>>
<<10>>
<<11>>
<<12>>
<<13>>
<<14>>
<<15>>


Water Statement
<<Season>>
<<watering_no>>
<<User>>
<<Address>>
<<Allocation>>
<<UTD>>
<<Remain>>

Watering No.
Start Time
Finish Time
Meter Start
Meter Finish
Water Used
<<1>>
00/00/0000 00:00AM
00/00/0000 00:00PM
000
000
000
<<2>>
00/00/0000 00:00AM
00/00/0000 00:00PM
000
000
000
<<3>>
00/00/0000 00:00AM
00/00/0000 00:00PM
000
000
000
<<4>>
00/00/0000 00:00AM
00/00/0000 00:00PM
000
000
000
<<5>>
00/00/0000 00:00AM
00/00/0000 00:00PM
000
000
000
<<6>>
00/00/0000 00:00AM
00/00/0000 00:00PM
000
000
000
<<7>>
00/00/0000 00:00AM
00/00/0000 00:00PM
000
000
000
<<8>>
00/00/0000 00:00AM
00/00/0000 00:00PM
000
000
000
<<9>>
00/00/0000 00:00AM
00/00/0000 00:00PM
000
000
000
<<Past Due>>
<<Past Due Comment>>
<<Fixed Charge>>
<<Total Fixed>>
<<Levy>>
<<Tot Var Charge>>
<<Ml>>
<<Var Charge>>



My current code:

var TEMPLATE_ID = ''
var PDF_FILE_NAME = ''

function checkEntries(){
  var ss = SpreadsheetApp.getActiveSheet(),
      sheet = ss.getSheets()[0],
      project = ss.getRange('C3').getValue(),
      month = ss.getRange('C5').getValue(),
      year = ss.getRange('C7').getValue();

  if(project === 'all' && month === 'all' && year === 'all'){
    SpreadsheetApp.getUi().alert('The report is always specific to a project in a specific year and month')
    return;
  }
}

function createPdf() {
  var copyFile = DriveApp.getFileById(TEMPLATE_ID).makeCopy(),
      copyId = copyFile.getId(),
      copyDoc = DocumentApp.openById(copyId),
      copyBody = copyDoc.getActiveSection();

  var ss = SpreadsheetApp.getActiveSheet(),
      sheet = ss.getSheets()[0],
      project = ss.getRange('C3').getValue(),
      total_cost = ss.getRange('C14').getValue(),
      month = ss.getRange('C7').getValue(),
      year = ss.getRange('C9').getValue();

  var replace_values = [];
  replace_values.push(total_cost, year, month)

  for (var i = 0; i < replace_values.length; i++) {
    copyBody.replaceText('%' + replace_values[i] + '%', 
                         replace_values[i])          
  }
  copyDoc.saveAndClose()

  var newFile = DriveApp.createFile(copyFile.getAs('application/pdf'))  
  if (PDF_FILE_NAME !== '') {
    newFile.setName(PDF_FILE_NAME)
  } 

  copyFile.setTrashed(true)

  SpreadsheetApp.getUi().alert('report generated successfully')
} 



How about this modification? I think that there are several answers for your situation. So please think of this as one of them.

Modification points :
You can use copyDoc like copyDoc.replaceText('%' + replace_values[i] + '%', replace_values[i]).
After var ss = SpreadsheetApp.getActiveSheet(), is run, an error occurs at sheet = ss.getSheets()[0],.
If you want to use the sheet with the index of "0", ss of var ss = SpreadsheetApp.getActiveSpreadsheet(), can be used as it.
In this modification, I thought that you might want to also use other index. So I used sheet = ss.getSheets()[0];.
project of project = ss.getRange('C3').getValue(), is not used in createPdf().
var replace_values = []; replace_values.push(total_cost, year, month) is the same to  var replace_values = [total_cost, year, month];.
You can also use the destructuring assignment like [total_cost, month, year] = [sheet.getRange('C14').getValue(), sheet.getRange('C7').getValue(), sheet.getRange('C9').getValue()]; instead of total_cost = sheet.getRange('C14').getValue(),month = sheet.getRange('C7').getValue(),year = sheet.getRange('C9').getValue();
When these are reflected to the modified script, please modify as follows.

From :
var copyFile = DriveApp.getFileById(TEMPLATE_ID).makeCopy(),
    copyId = copyFile.getId(),
    copyDoc = DocumentApp.openById(copyId),
    copyBody = copyDoc.getActiveSection();
var ss = SpreadsheetApp.getActiveSheet(),
    sheet = ss.getSheets()[0],
    project = ss.getRange('C3').getValue(),
    total_cost = ss.getRange('C14').getValue(),
    month = ss.getRange('C7').getValue(),
    year = ss.getRange('C9').getValue();
var replace_values = [];
replace_values.push(total_cost, year, month)
for (var i = 0; i < replace_values.length; i++) {
  copyBody.replaceText('%' + replace_values[i] + '%', replace_values[i])
}
To :
var copyFile = DriveApp.getFileById(TEMPLATE_ID).makeCopy(),
    copyId = copyFile.getId(),
    copyDoc = DocumentApp.openById(copyId);
var ss = SpreadsheetApp.getActiveSpreadsheet(), // Modified
    sheet = ss.getSheets()[0],
    total_cost = sheet.getRange('C14').getValue(), // Modified
    month = sheet.getRange('C7').getValue(), // Modified
    year = sheet.getRange('C9').getValue(); // Modified
var replace_values = [total_cost, year, month]; // Modified
for (var i = 0; i < replace_values.length; i++) {
  copyDoc.replaceText('%' + replace_values[i] + '%', replace_values[i]); // Modified
}

________________________________________________________________________________________--


function createDoc () {

    var job = Browser.inputBox('Enter Job Number', 'Job Number',       Browser.Buttons.OK);
    var dtStr = Utilities.formatDate(new Date(), "GMT", "MMddyy")
    // create temp file before edited with spreadsheet data
    var tmpName = "tmpname"
    var folder = DriveApp.getFolderById('1C_k3MvoT33WhSXVNMmFQNFhqaW8')
    // var tmpl = DriveApp.getFileById('225xZAECq0rkdJnsr4k9VjL91B7vgJh8Y- t9YrsbCEgc').makeCopy(tmpName).getId();
    var blob = DriveApp.getFileById('yourId').makeCopy(tmpName)
    var tmpl = blob.getId();
    // get document and make PDF in folder  
    var doc = DriveApp.getFileById(tmpl).getAs("application/pdf");
    var pdf = doc.setName(job +"-"+dtStr+".pdf");

    folder.createFile(pdf)
    folder.removeFile(blob);
}



This is an example to append a table to a Google Doc that can get you started, the cell variable you can change it to the range of data of your Spreadsheet:

function appendTable(){
  var document = DocumentApp.openById('docId');
  var body = document.getBody();
  var cells = [
      ['Row 1, Cell 1', 'Row 1, Cell 2'],
      ['Row 2, Cell 1', 'Row 2, Cell 2']
  ];
  body.appendTable(cells);
  document.saveAndClose();
}

------------------------------------------------------------------------------------------------------------------



function checkSheet() {
var sheetName = "Sheet1";
var folderID = "FOLDER_ID"; // Folder id to save in a folder.
var pdfName = "Invoice "+Date();

var sourceSpreadsheet = SpreadsheetApp.getActive();
var sourceSheet = sourceSpreadsheet.getSheetByName(sheetName);
var folder = DriveApp.getFolderById(folderID);

//Copy whole spreadsheet
var destSpreadsheet = SpreadsheetApp.open(DriveApp.getFileById(sourceSpreadsheet.getId()).makeCopy("tmp_convert_to_pdf", folder))

//delete redundant sheets
var sheets = destSpreadsheet.getSheets();
for (i = 0; i < sheets.length; i++) {
if (sheets[i].getSheetName() != sheetName){
destSpreadsheet.deleteSheet(sheets[i]);
}
}

var destSheet = destSpreadsheet.getSheets()[0];
//repace cell values with text (to avoid broken references) 
var sourceRange = sourceSheet.getRange(1,1,sourceSheet.getMaxRows(),sourceSheet.getMaxColumns());
var sourcevalues = sourceRange.getValues();
var destRange = destSheet.getRange(1, 1, destSheet.getMaxRows(), destSheet.getMaxColumns());
destRange.setValues(sourcevalues);

//save to pdf
var theBlob = destSpreadsheet.getBlob().getAs('application/pdf').setName(pdfName);
var newFile = folder.createFile(theBlob);

//Delete the temporary sheet
DriveApp.getFileById(destSpreadsheet.getId()).setTrashed(true);
}


https://gist.github.com/ixhd/3660885

https://drive.google.com/a/google.com/previewtemplate?id=0AhQ4K4pgicTxdHlFajM1MG1IbkI3X2FNMG92NnNzbFE&mode=public&ddrp=1#


Thanks it almost worked for me. A "pdfish" file was created, a pdf logo showed but the filename had no pdf suffix and could not be opened. I changed two lines: i deleted .setName etc. from the line: var theBlob = destSpreadsheet.getBlob().getAs('application/pdf').setName(pdfName); and replaced "tmp_convert_to_pdf" in line var destSpreadsheet = SpreadsheetApp.open(DriveApp.getFileById(sourceSpreadsheet.getId()).makeCopy("tmp_convert_to_pdf", folder)) by pdfName. And now it works fine.

-------------------------------------------------------------------------------------------

https://ctrlq.org/code/19869-email-google-spreadsheets-pdf


function emailSpreadsheetAsPDF() {

  // Send the PDF of the spreadsheet to this email address
  var email = "Your Email Id"; 

  // Get the currently active spreadsheet URL (link)
  // Or use SpreadsheetApp.openByUrl("<<SPREADSHEET URL>>");
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("<Your Sheet name>")

  // Subject of email message
  var subject = "PDF generated from sheet " + sheet.getName(); 

  // Email Body can  be HTML too with your logo image - see ctrlq.org/html-mail
  var body = "Install the <a href='http://www.labnol.org/email-sheet'>Email Spreadsheet add-on</a> for one-click conversion.";

  // Base URL
  var url = "https://docs.google.com/spreadsheets/d/SS_ID/export?".replace("SS_ID", ss.getId());

  // Specify PDF export parameters
  //From: https://code.google.com/p/google-apps-script-issues/issues/detail?id=3579
  //

  var url_ext = 'exportFormat=pdf&format=pdf'        // export as pdf / csv / xls / xlsx
  + '&size=letter'                       // paper size legal / letter / A4
  + '&portrait=false'                    // orientation, false for landscape
  + '&fitw=true&source=labnol'           // fit to page width, false for actual size
  + '&sheetnames=false&printtitle=false' // hide optional headers and footers
  + '&pagenumbers=false&gridlines=false' // hide page numbers and gridlines
  + '&fzr=false'                         // do not repeat row headers (frozen rows) on each page
  + '&gid=';                             // the sheet's Id

  var token = ScriptApp.getOAuthToken();


  //make an empty array to hold your fetched blobs  
  var blobs;


    // Convert your specific sheet to blob
    var response = UrlFetchApp.fetch(url + url_ext + sheet.getSheetId(), {
      headers: {
        'Authorization': 'Bearer ' +  token
      }
    });

    //convert the response to a blob and store in our array
    blobs = response.getBlob().setName(sheet.getName() + '.pdf');


  // Define the scope
  Logger.log("Storage Space used: " + DriveApp.getStorageUsed());

  // If allowed to send emails, send the email with the PDF attachment
  if (MailApp.getRemainingDailyQuota() > 0) 
    GmailApp.sendEmail(email, subject, body, {
      htmlBody: body,
      attachments:[blobs]     
    });  
}
Edit: To combine specific sheets and convert it into and pdf.

Firstly you will have to obtain the sheet object of all the sheets you want to merge into the pdf

var sheet2 = ss.getSheetByName("<Your Sheet name>")
var sheet3 = ss.getSheetByName("<Your Sheet name>")
Then pass the sheetId of each of the sheet to the URL query delimited by %EE%B8%80, Like so

   url += url_ext + sheet.getSheetId()+ "%EE%B8%80"+sheet2.getSheetId()+ "%EE%B8%80"+sheet3.getSheetId()
   var response = UrlFetchApp.fetch(url, {
      headers: {
        'Authorization': 'Bearer ' +  token
      }
    });



------------------------------------------------------------------------------------------
 createPDF.gs

// dev: andrewroberts.net

// Replace this with ID of your template document.
var TEMPLATE_ID = ''

// var TEMPLATE_ID = '1wtGEp27HNEVwImeh2as7bRNw-tO4HkwPGcAsTrSNTPc' // Demo template
// Demo script - http://bit.ly/createPDF
 
// You can specify a name for the new PDF file here, or leave empty to use the 
// name of the template.
var PDF_FILE_NAME = ''

//*
// Eventhandler for spreadsheet opening - add a menu.
//**

function onOpen() {

  SpreadsheetApp
    .getUi()
    .createMenu('Create PDF')
    .addItem('Create PDF', 'createPdf')
    .addToUi()

} // onOpen()

/**  
 * Take the fields from the active row in the active sheet
 * and, using a Google Doc template, create a PDF doc with these
 * fields replacing the keys in the template. The keys are identified
 * by having a % either side, e.g. %Name%.
 *
 * @return {Object} the completed PDF file
 //

function createPdf() {

  if (TEMPLATE_ID === '') {
    
    SpreadsheetApp.getUi().alert('TEMPLATE_ID needs to be defined in code.gs')
    return
  }

  // Set up the docs and the spreadsheet access
  
  var copyFile = DriveApp.getFileById(TEMPLATE_ID).makeCopy(),
      copyId = copyFile.getId(),
      copyDoc = DocumentApp.openById(copyId),
      copyBody = copyDoc.getActiveSection(),
      activeSheet = SpreadsheetApp.getActiveSheet(),
      numberOfColumns = activeSheet.getLastColumn(),
      activeRowIndex = activeSheet.getActiveRange().getRowIndex(),
      activeRow = activeSheet.getRange(activeRowIndex, 1, 1, numberOfColumns).getValues(),
      headerRow = activeSheet.getRange(1, 1, 1, numberOfColumns).getValues(),
      columnIndex = 0
 
  // Replace the keys with the spreadsheet values
 
  for (;columnIndex < headerRow[0].length; columnIndex++) {
    
    copyBody.replaceText('%' + headerRow[0][columnIndex] + '%', 
                         activeRow[0][columnIndex])                         
  }
  
  // Create the PDF file, rename it if required and delete the doc copy
    
  copyDoc.saveAndClose()

  var newFile = DriveApp.createFile(copyFile.getAs('application/pdf'))  

  if (PDF_FILE_NAME !== '') {
  
    newFile.setName(PDF_FILE_NAME)
  } 
  
  copyFile.setTrashed(true)
  
  SpreadsheetApp.getUi().alert('New PDF file created in the root of your Google Drive')
  
} // createPdf()


----------------------------------------------------------------------

/*

PDF Creator - Email all responses
=================================

When you click "Create PDF > Create a PDF for each row" this script 
constructs a PDF for each row in the attached GSheet. The value in the 
"File Name" column is used to name the file and - if there is a 
value - it is emailed to the recipient in the "Email" column.

Demo sheet with script attached: https://goo.gl/sf02mK

//**

// Config
// ------


// 1. Create a GDoc template and put the ID here

var TEMPLATE_ID = '---- UPDATE ME -----'

// var TEMPLATE_ID = '11xbBQKz3wDsp1eP9-1pBFeA4vNk8wApjzxj0Kn2RU_c' // Demo template

// 2. You can specify a name for the new PDF file here, or leave empty to use the 
// name of the template or specify the file name in the sheet

var PDF_FILE_NAME = ''

// 3. If an email address is specified you can email the PDF

var EMAIL_SUBJECT = 'The email subject ---- UPDATE ME -----'
var EMAIL_BODY = 'The email body ------ UPDATE ME ---------'

// 4. If a folder ID is specified here this is where the PDFs will be located

var RESULTS_FOLDER_ID = ''

// Constants
// ---------

// You can pull out specific columns values 
var FILE_NAME_COLUMN_NAME = 'File Name'
var EMAIL_COLUMN_NAME = 'Email'

// The format used for any dates 
var DATE_FORMAT = 'yyyy/MM/dd';

/**
 * Eventhandler for spreadsheet opening - add a menu.
 //**

function onOpen() {

  SpreadsheetApp
    .getUi()
    .createMenu('[ Create PDFs ]')
    .addItem('Create a PDF for each row', 'createPdfs')
    .addToUi()

} // onOpen()

/**  
 * Take the fields from each row in the active sheet
 * and, using a Google Doc template, create a PDF doc with these
 * fields replacing the keys in the template. The keys are identified
 * by having a % either side, e.g. %Name%.
 //**

function createPdfs() {

  var ui = SpreadsheetApp.getUi()

  if (TEMPLATE_ID === '') {    
    ui.alert('TEMPLATE_ID needs to be defined in code.gs')
    return
  }

  // Set up the docs and the spreadsheet access

  var templateFile = DriveApp.getFileById(TEMPLATE_ID)
  var activeSheet = SpreadsheetApp.getActiveSheet()
  var allRows = activeSheet.getDataRange().getValues()
  var headerRow = allRows.shift()

  // Create a PDF for each row

  allRows.forEach(function(row) {
  
    createPdf(templateFile, headerRow, row)
    
    // Private Function
    // ----------------
  
    /**
     * Create a PDF
     *
     * @param {File} templateFile
     * @param {Array} headerRow
     * @param {Array} activeRow
     //**
  
    function createPdf(templateFile, headerRow, activeRow) {
      
      var headerValue
      var activeCell
      var ID = null
      var recipient = null
      var copyFile
      var numberOfColumns = headerRow.length
      var copyFile = templateFile.makeCopy()      
      var copyId = copyFile.getId()
      var copyDoc = DocumentApp.openById(copyId)
      var copyBody = copyDoc.getActiveSection()
           
      // Replace the keys with the spreadsheet values and look for a couple
      // of specific values
     
      for (var columnIndex = 0; columnIndex < numberOfColumns; columnIndex++) {
        
        headerValue = headerRow[columnIndex]
        activeCell = activeRow[columnIndex]
        activeCell = formatCell(activeCell);
                
        copyBody.replaceText('<<' + headerValue + '>>', activeCell)
        
        if (headerValue === FILE_NAME_COLUMN_NAME) {
        
          ID = activeCell
          
        } else if (headerValue === EMAIL_COLUMN_NAME) {
        
          recipient = activeCell
        }
      }
      
      // Create the PDF file
        
      copyDoc.saveAndClose()
      var newFile = DriveApp.createFile(copyFile.getAs('application/pdf'))  
      copyFile.setTrashed(true)
    
      // Rename the new PDF file
    
      if (PDF_FILE_NAME !== '') {
      
        newFile.setName(PDF_FILE_NAME)
        
      } else if (ID !== null){
    
        newFile.setName(ID)
      }
      
      // Put the new PDF file into the results folder
      
      if (RESULTS_FOLDER_ID !== '') {
      
        DriveApp.getFolderById(RESULTS_FOLDER_ID).addFile(newFile)
        DriveApp.removeFile(newFile)
      }

      // Email the new PDF

      if (recipient !== null) {
      
        MailApp.sendEmail(
          recipient, 
          EMAIL_SUBJECT, 
          EMAIL_BODY,
          {attachments: [newFile]})
      }
    
    } // createPdfs.createPdf()

  })

  ui.alert('New PDF files created')

  return
  
  // Private Functions
  // -----------------
  
  /**
  * Format the cell's value
  *
  * @param {Object} value
  *
  * @return {Object} value
  //**
  
  function formatCell(value) {
    
    var newValue = value;
    
    if (newValue instanceof Date) {
      
      newValue = Utilities.formatDate(
        value, 
        Session.getScriptTimeZone(), 
        DATE_FORMAT);
        
    } else if (typeof value === 'number') {
    
      newValue = Math.round(value * 100) / 100
    }
    
    return newValue;
        
  } // createPdf.formatCell()
  
} // createPdfs()


----------------------------------------------------------------------------------------

https://github.com/hadaf/SheetsToDocsMerge

merge.gs

/*  This is the main method that should be invoked. 
 *  Copy and paste the ID of your template Doc in the first line of this method.
 *
 *  Make sure the first row of the data Sheet is column headers.
 *
 *  Reference the column headers in the template by enclosing the header in square brackets.
 *  Example: "This is [header1] that corresponds to a value of [header2]."
 //**
function doMerge() {
  var selectedTemplateId = "1foobarfoobarfoobarfoobarfoobarfoobar";//Copy and paste the ID of the template document here (you can find this in the document's URL)
  
  var templateFile = DriveApp.getFileById(selectedTemplateId);
  var mergedFile = templateFile.makeCopy();//make a copy of the template file to use for the merged File. Note: It is necessary to make a copy upfront, and do the rest of the content manipulation inside this single copied file, otherwise, if the destination file and the template file are separate, a Google bug will prevent copying of images from the template to the destination. See the description of the bug here: https://code.google.com/p/google-apps-script-issues/issues/detail?id=1612#c14
  mergedFile.setName("filled_"+templateFile.getName());//give a custom name to the new file (otherwise it is called "copy of ...")
  var mergedDoc = DocumentApp.openById(mergedFile.getId());
  var bodyElement = mergedDoc.getBody();//the body of the merged document, which is at this point the same as the template doc.
  var bodyCopy = bodyElement.copy();//make a copy of the body
  
  bodyElement.clear();//clear the body of the mergedDoc so that we can write the new data in it.
  
  var sheet = SpreadsheetApp.getActiveSheet();//current sheet

  var rows = sheet.getDataRange();
  var numRows = rows.getNumRows();
  var values = rows.getValues();
  var fieldNames = values[0];//First row of the sheet must be the the field names

  for (var i = 1; i < numRows; i++) {//data values start from the second row of the sheet 
    var row = values[i];
    var body = bodyCopy.copy();
    
    for (var f = 0; f < fieldNames.length; f++) {
      body.replaceText("\\[" + fieldNames[f] + "\\]", row[f]);//replace [fieldName] with the respective data value
    }
    
    var numChildren = body.getNumChildren();//number of the contents in the template doc
   
    for (var c = 0; c < numChildren; c++) {//Go over all the content of the template doc, and replicate it for each row of the data.
      var child = body.getChild(c);
      child = child.copy();
      if (child.getType() == DocumentApp.ElementType.HORIZONTALRULE) {
        mergedDoc.appendHorizontalRule(child);
      } else if (child.getType() == DocumentApp.ElementType.INLINEIMAGE) {
        mergedDoc.appendImage(child.getBlob());
      } else if (child.getType() == DocumentApp.ElementType.PARAGRAPH) {
        mergedDoc.appendParagraph(child);
      } else if (child.getType() == DocumentApp.ElementType.LISTITEM) {
        mergedDoc.appendListItem(child);
      } else if (child.getType() == DocumentApp.ElementType.TABLE) {
        mergedDoc.appendTable(child);
      } else {
        Logger.log("Unknown element type: " + child);
      }
   }
    
   mergedDoc.appendPageBreak();//Appending page break. Each row will be merged into a new page.

  }
}



/**
 * Adds a custom menu to the active spreadsheet, containing a single menu item
 * for invoking the doMerge() function specified above.
 * The onOpen() function, when defined, is automatically invoked whenever the
 * spreadsheet is opened.
 * For more information on using the Spreadsheet API, see
 * https://developers.google.com/apps-script/service_spreadsheet
 //**
function onOpen() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var entries = [{
    name : "Fill template",
    functionName : "doMerge"
  }];
  spreadsheet.addMenu("Merge", entries);
};


-----------------------------------------------------------------
Version 2
var selectedTemplateId = null;
var selectedSpreadsheetId = null;
var spreadsheetDocPicker = null;
var templateDocPicker = null;

function mailMerge(app) {
  var app = UiApp.createApplication().setTitle("Mail Merge");
  templateDocPicker = createFilePicker(app, "Choose template", 
         UiApp.FileType.DOCUMENTS, "templateSelectionHandler"); 
  templateDocPicker.showDocsPicker();
  return app;
};

function createFilePicker(app, title, fileType, selectionHandlerName) {
  Logger.log("Creating file picker for " + fileType);
  var docPicker = app.createDocsListDialog();
  docPicker.setDialogTitle(title);
  docPicker.setInitialView(fileType);
  var selectionHandler = app.createServerHandler(selectionHandlerName);
  docPicker.addSelectionHandler(selectionHandler);
  return docPicker;
}

function templateSelectionHandler(e) {
  var app = UiApp.getActiveApplication();
  selectedTemplateId = e.parameter.items[0].id;
  UserProperties.setProperty("templateId", e.parameter.items[0].id);
  Logger.log("Selected template: " + selectedTemplateId);
  var spreadsheetDocPicker = createFilePicker(app, "Choose spreadsheet", 
        UiApp.FileType.SPREADSHEETS, "spreadsheetSelectionHandler");
  spreadsheetDocPicker.showDocsPicker();
  return app;
}

function spreadsheetSelectionHandler(e) {
  var app = UiApp.getActiveApplication();
  UserProperties.setProperty("spreadsheetId", e.parameter.items[0].id);
  selectedSpreadsheetId = e.parameter.items[0].id;
  Logger.log("Selected spreadsheet: " + selectedSpreadsheetId);
  doMerge();
  return app;
}

function doMerge() {
  var selectedSpreadsheetId = UserProperties.getProperty("spreadsheetId");
  var selectedTemplateId = UserProperties.getProperty("templateId");
  Logger.log("Selected spreadsheet: " + selectedSpreadsheetId);
  var sheet = SpreadsheetApp.openById(selectedSpreadsheetId);
  Logger.log("Spreadsheet opened");
  Logger.log("Opening template: " + selectedTemplateId);
  var template = DocumentApp.openById(selectedTemplateId);
  Logger.log("Template opened");
  var templateFile = DocsList.getFileById(selectedTemplateId);
  var templateDoc = DocumentApp.openById(templateFile.getId());
  //var mergedFile = templateFile.makeCopy();
  var mergedDoc = DocumentApp.create("Result of mail merge");
  var bodyCopy = templateDoc.getActiveSection().copy();
  Logger.log("Copy made");
  var rows = sheet.getDataRange();
  var numRows = rows.getNumRows();
  var values = rows.getValues();
  var fieldNames = values[0];

  for (var i = 1; i < numRows; i++) {
    var row = values[i];
    Logger.log("Processing row " + i + " " + row);
    var body = bodyCopy.copy();
    for (var f = 0; f < fieldNames.length; f++) {
      Logger.log("Processing field " + f + " " + fieldNames[f]);
      Logger.log("Replacing [" + fieldNames[f] + "] with " + row[f]);
      body.replaceText("\\[" + fieldNames[f] + "\\]", row[f]);
    }
    var numChildren = body.getNumChildren();
    for (var c = 0; c < numChildren; c++) {
      var child = body.getChild(c);
      child = child.copy();
      if (child.getType() == DocumentApp.ElementType.HORIZONTALRULE) {
        mergedDoc.appendHorizontalRule(child);
      } else if (child.getType() == DocumentApp.ElementType.INLINEIMAGE) {
        mergedDoc.appendImage(child);
      } else if (child.getType() == DocumentApp.ElementType.PARAGRAPH) {
        mergedDoc.appendParagraph(child);
      } else if (child.getType() == DocumentApp.ElementType.LISTITEM) {
        mergedDoc.appendListItem(child);
      } else if (child.getType() == DocumentApp.ElementType.TABLE) {
        mergedDoc.appendTable(child);
      } else {
        Logger.log("Unknown element type: " + child);
      }
   }
   Logger.log("Appending page break");
   mergedDoc.appendPageBreak();
   Logger.log("Result is now " + mergedDoc.getActiveSection().getText());
  }
}

function testMerge() {
  UserProperties.setProperty("templateId", 
    "1pAXWE0uklZ8z-O_Tejuv3pWSTiSv583ptUTGPt2Knm8");
  UserProperties.setProperty("spreadsheetId", 
    "0Avea1NXBTibYdFo5QkZzWWlMYUhkclNSaFpRWUZOTUE");
  doMerge();
}


function doGet() {
  return mailMerge();
}

---------------------------------
https://developers.google.com/apps-script/articles/mail_merge


Google's own post explains how to set up the feed data in one sheet and the template in another, rather than a Google Spreadsheet + Google Doc: https://developers.google.com/apps-script/articles/mail_merge

However, the end result is for the MailApp to send an email, rather than the desired "cloned" document. I would suggest combining the tutorial and @Vidar's answer, something along the lines of replacing:

MailApp.sendEmail(rowData.emailAddress, emailSubject, emailText);
with

var mergedDoc, bodyContent,
    // you'd have to make the DocumentTitle column for the following
    newTitle = rowData.DocumentTitle /* or set to a static title, etc //**;

// make a copy of the template document -- see http://stackoverflow.com/a/13243070/1037948
// or start a new one if you aren't using the template, but rather text from a template field
if( usingTemplateFile ) {
    mergedDoc = templateDoc.makeCopy(newTitle)
    bodyContent = mergedDoc.getBody();
} else {
    mergedDoc = DocumentApp.create(newTitle);
    bodyContent = mergedDoc.getBody();
    bodyContent.setText(templateFieldContents);
}

// tweak the fillInTemplateFromObject to accept a document Body and use .replaceText() instead of .match as in mailmerge example
// .replaceText see https://developers.google.com/apps-script/reference/document/body#replaceText(String,String)
fillInTemplateFromObject(bodyContent, rowData);

// no append needed?
Random AppScripts References:

https://developers.google.com/apps-script/reference/document/body#replaceText(String,String)
https://developers.google.com/apps-script/reference/document/body#copy()
https://developers.google.com/apps-script/reference/document/body#setText(String)





http://www.andrewroberts.net/2016/01/google-apps-script-to-create-and-email-a-pdf/


function getRowsData(sheet, range, columnHeadersRowIndex) {
  columnHeadersRowIndex = columnHeadersRowIndex || range.getRowIndex() - 1;
  var numColumns = range.getEndColumn() - range.getColumn() + 1;
  var headersRange = sheet.getRange(columnHeadersRowIndex, range.getColumn(), 1, numColumns);
  var headers = headersRange.getValues()[0];
  return getObjects(range.getValues(), normalizeHeaders(headers));
}


function getObjects(data, keys) {
  var objects = [];
  for (var i = 0; i < data.length; ++i) {
    var object = {};
    var hasData = false;
    for (var j = 0; j < data[i].length; ++j) {
      var cellData = data[i][j];
      if (isCellEmpty(cellData)) {
        continue;
      }
      object[keys[j]] = cellData;
      hasData = true;
    }
    if (hasData) {
      objects.push(object);
    }
  }
  return objects;
}


function normalizeHeaders(headers) {
  var keys = [];
  for (var i = 0; i < headers.length; ++i) {
    var key = normalizeHeader(headers[i]);
    if (key.length > 0) {
      keys.push(key);
    }
  }
  return keys;
}

function normalizeHeader(header) {
  var key = '';
  var upperCase = false;
  for (var i = 0; i < header.length; ++i) {
    var letter = header[i];
    if (letter == ' ' && key.length > 0) {
      upperCase = true;
      continue;
    }
    if (!isAlnum(letter)) {
      continue;
    }
    if (key.length == 0 && isDigit(letter)) {
      continue; // first character must be a letter
    }
    if (upperCase) {
      upperCase = false;
      key += letter.toUpperCase();
    } else {
      key += letter.toLowerCase();
    }
  }
  return key;
}


function isCellEmpty(cellData) {
  return typeof(cellData) == 'string' && cellData == '';
}


function isAlnum(char) {
  return char >= 'A' && char <= 'Z' ||
    char >= 'a' && char <= 'z' ||
    isDigit(char);
}


function isDigit(char) {
  return char >= '0' && char <= '9';
}


function sendEmails() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var dataSheet = ss.getSheets()[0];
  var dataRange = dataSheet.getRange(2, 1, dataSheet.getMaxRows() - 1, 4);

  var templateSheet = ss.getSheets()[1];
  var emailTemplate = templateSheet.getRange('A1').getValue();


  var objects = getRowsData(dataSheet, dataRange);

  // For every row object, create a personalized email from a template and send
  // it to the appropriate person.
  for (var i = 0; i < objects.length; ++i) {
    // Get a row object
    var rowData = objects[i];


    var emailText = fillInTemplateFromObject(emailTemplate, rowData);
    var emailSubject = 'Mail Merge Test';
    var file = DriveApp.getFilesByName('2019_MA_BenefitsGuide.pdf')
    MailApp.sendEmail(rowData.emailAddress, emailSubject, emailText );


  }
}

function fillInTemplateFromObject(template, data) {
  var email = template;
  // Search for all the variables to be replaced, for instance ${"Column name"}
  var templateVars = template.match(/\$\{\"[^\"]+\"\}/g);

  // Replace variables from the template with the actual values from the data object.

  for (var i = 0; i < templateVars.length; ++i) {

    var variableData = data[normalizeHeader(templateVars[i])];
    email = email.replace(templateVars[i], variableData || '');
  }

  return email;
}



//*
  for (var i = 0; i < data.length; ++i) {
    var row = data[i];
    var emailAddress = row[0];  // First column
    var message = row[1];       // Second column
    var emailSent = row[2];     // Third column
    if (emailSent != EMAIL_SENT) {  // Prevents sending duplicates
      var subject = "Sending emails from a Spreadsheet";
      var file = DriveApp.getFilesByName('test123.pdf')
      MailApp.sendEmail(emailAddress, subject, message, {
     attachments: [file.getAs(MimeType.PDF)],
     name: 'Automatic Emailer Script'
      MailApp.sendEmail(rowData.emailAddress, emailSubject, emailText);
 });

///**




// Send an email with a file from Google Drive attached as a PDF.
 var file = DriveApp.getFileById('1234567890abcdefghijklmnopqrstuvwxyz');
 GmailApp.sendEmail('mike@example.com', 'Attachment example', 'Please see the attached file.', {
     attachments: [file.getAs(MimeType.PDF)],
     name: 'Automatic Emailer Script'
 });


// This constant is written in column C for rows for which an email
// has been sent successfully.
var EMAIL_SENT = "EMAIL_SENT";

function sendEmails2() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var startRow = 2;  // First row of data to process
  var numRows = 1;   // Number of rows to process
  // Fetch the range of cells A2:B3
  var dataRange = sheet.getRange(startRow, 1, numRows, 2)
  // Fetch values for each row in the Range.
  var data = dataRange.getValues();
  for (var i = 0; i < data.length; ++i) {
    var row = data[i];
    var emailAddress = row[0];  // First column
    var message = row[1];       // Second column
    var emailSent = row[2];     // Third column
    if (emailSent != EMAIL_SENT) {  // Prevents sending duplicates
      var subject = "Sending emails from a Spreadsheet";
      var file = DriveApp.getFilesByName('test123.pdf')
      if (file.hasNext()) {
        MailApp.sendEmail(emailAddress,
                          subject,
                          message,
                          { attachments: [file.getAs(MimeType.PDF)],
                            name: 'Automatic Emailer Script'
                          }
                         );
      }
      sheet.getRange(startRow + i, 3).setValue(EMAIL_SENT);
      // Make sure the cell is updated right away in case the script is interrupted
      SpreadsheetApp.flush();
    }
  }
}



function doMerge() {
  var selectedSpreadsheetId = UserProperties.getProperty("spreadsheetId");
  var selectedTemplateId = UserProperties.getProperty("templateId");
  Logger.log("Selected spreadsheet: " + selectedSpreadsheetId);
  var sheet = SpreadsheetApp.openById(selectedSpreadsheetId);
  Logger.log("Spreadsheet opened");
  Logger.log("Opening template: " + selectedTemplateId);
  var template = DocumentApp.openById(selectedTemplateId);
  Logger.log("Template opened");
  var templateFile = DocsList.getFileById(selectedTemplateId);
  var templateDoc = DocumentApp.openById(templateFile.getId());
  //var mergedFile = templateFile.makeCopy();
  var mergedDoc = DocumentApp.create("Result of mail merge");
  var bodyCopy = templateDoc.getActiveSection().copy();
  Logger.log("Copy made");
  var rows = sheet.getDataRange();
  var numRows = rows.getNumRows();
  var values = rows.getValues();
  var fieldNames = values[0];

  for (var i = 1; i < numRows; i++) {
    var row = values[i];
    Logger.log("Processing row " + i + " " + row);
    var body = bodyCopy.copy();
    for (var f = 0; f < fieldNames.length; f++) {
      Logger.log("Processing field " + f + " " + fieldNames[f]);
      Logger.log("Replacing [" + fieldNames[f] + "] with " + row[f]);
      body.replaceText("\\[" + fieldNames[f] + "\\]", row[f]);
    }
    var numChildren = body.getNumChildren();
    for (var c = 0; c < numChildren; c++) {
      var child = body.getChild(c);
      child = child.copy();
      if (child.getType() == DocumentApp.ElementType.HORIZONTALRULE) {
        mergedDoc.appendHorizontalRule(child);
      } else if (child.getType() == DocumentApp.ElementType.INLINEIMAGE) {
        mergedDoc.appendImage(child);
      } else if (child.getType() == DocumentApp.ElementType.PARAGRAPH) {
        mergedDoc.appendParagraph(child);
      } else if (child.getType() == DocumentApp.ElementType.LISTITEM) {
        mergedDoc.appendListItem(child);
      } else if (child.getType() == DocumentApp.ElementType.TABLE) {
        mergedDoc.appendTable(child);
      } else {
        Logger.log("Unknown element type: " + child);
      }
   }
   Logger.log("Appending page break");
   mergedDoc.appendPageBreak();
   Logger.log("Result is now " + mergedDoc.getActiveSection().getText());
  }
}

merge.gs

/*  This is the main method that should be invoked. 
 *  Copy and paste the ID of your template Doc in the first line of this method.
 *
 *  Make sure the first row of the data Sheet is column headers.
 *
 *  Reference the column headers in the template by enclosing the header in square brackets.
 *  Example: "This is [header1] that corresponds to a value of [header2]."
 **
function doMerge() {
  var selectedTemplateId = "1foobarfoobarfoobarfoobarfoobarfoobar";//Copy and paste the ID of the template document here (you can find this in the document's URL)
  
  var templateFile = DriveApp.getFileById(selectedTemplateId);
  var mergedFile = templateFile.makeCopy();//make a copy of the template file to use for the merged File. Note: It is necessary to make a copy upfront, and do the rest of the content manipulation inside this single copied file, otherwise, if the destination file and the template file are separate, a Google bug will prevent copying of images from the template to the destination. See the description of the bug here: https://code.google.com/p/google-apps-script-issues/issues/detail?id=1612#c14
  mergedFile.setName("filled_"+templateFile.getName());//give a custom name to the new file (otherwise it is called "copy of ...")
  var mergedDoc = DocumentApp.openById(mergedFile.getId());
  var bodyElement = mergedDoc.getBody();//the body of the merged document, which is at this point the same as the template doc.
  var bodyCopy = bodyElement.copy();//make a copy of the body
  
  bodyElement.clear();//clear the body of the mergedDoc so that we can write the new data in it.
  
  var sheet = SpreadsheetApp.getActiveSheet();//current sheet

  var rows = sheet.getDataRange();
  var numRows = rows.getNumRows();
  var values = rows.getValues();
  var fieldNames = values[0];//First row of the sheet must be the the field names

  for (var i = 1; i < numRows; i++) {//data values start from the second row of the sheet 
    var row = values[i];
    var body = bodyCopy.copy();
    
    for (var f = 0; f < fieldNames.length; f++) {
      body.replaceText("\\[" + fieldNames[f] + "\\]", row[f]);//replace [fieldName] with the respective data value
    }
    
    var numChildren = body.getNumChildren();//number of the contents in the template doc
   
    for (var c = 0; c < numChildren; c++) {//Go over all the content of the template doc, and replicate it for each row of the data.
      var child = body.getChild(c);
      child = child.copy();
      if (child.getType() == DocumentApp.ElementType.HORIZONTALRULE) {
        mergedDoc.appendHorizontalRule(child);
      } else if (child.getType() == DocumentApp.ElementType.INLINEIMAGE) {
        mergedDoc.appendImage(child.getBlob());
      } else if (child.getType() == DocumentApp.ElementType.PARAGRAPH) {
        mergedDoc.appendParagraph(child);
      } else if (child.getType() == DocumentApp.ElementType.LISTITEM) {
        mergedDoc.appendListItem(child);
      } else if (child.getType() == DocumentApp.ElementType.TABLE) {
        mergedDoc.appendTable(child);
      } else {
        Logger.log("Unknown element type: " + child);
      }
   }
    
   mergedDoc.appendPageBreak();//Appending page break. Each row will be merged into a new page.

  }
}



*/

