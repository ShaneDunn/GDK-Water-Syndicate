// https://docs.google.com/document/d/1qdC6s7Jgt1F8xauXyEu_khlTBYh8IExpNQaLMu_NPig/edit?usp=sharing

// https://gist.github.com/mhawksey/1170597
 

function ExcelDateToJSDate(serial) {
   var utc_days  = Math.floor(serial - 25569);
   var utc_value = utc_days * 86400;                                        
   var date_info = new Date(utc_value * 1000);

   var fractional_day = serial - Math.floor(serial) + 0.0000001;

   var total_seconds = Math.floor(86400 * fractional_day);

   var seconds = total_seconds % 60;

   total_seconds -= seconds;

   var hours = Math.floor(total_seconds / (60 * 60));
   var minutes = Math.floor(total_seconds / 60) % 60;

   return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds);
}

function listTables() {
  var tables = FusionTables.Table.list();
  if (tables.items) {
    for (var i = 0; i < tables.items.length; i++) {
      var table = tables.items[i];
      Logger.log('Table with name "%s" and ID "%s" was found. "%s"',
                 table.name, table.tableId, table.columns);
    }
  } else {
    Logger.log('No tables found.');
  }
}

function testQuery() {
  runQuery("1BefImsxG2oyb2q2QH04XnMz-x0Ajxli4Wa7SDzTu");
}

function runQuery(tableId) {
  var sql = "SELECT * FROM " + tableId + " WHERE Status IN ('start', 'stop')";
  var result = FusionTables.Query.sqlGet(sql, {hdrs: false});
  if (result.rows) {
    var spreadsheet = SpreadsheetApp.create('Fusion Table Query Results');
    var sheet = spreadsheet.getActiveSheet();

    // Append the headers.
    sheet.appendRow(result.columns);

    // Append the results.
    sheet.getRange(2, 1, result.rows.length, result.columns.length)
        .setValues(result.rows);

    Logger.log('Query results spreadsheet created: %s',
        spreadsheet.getUrl());
  } else {
    Logger.log('No rows returned.');
  }
}

