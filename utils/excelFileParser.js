const XLSX = require("xlsx");

/**
 * @param {string} filePath Path to the Excel file.
 * @returns {Array} JSON representation of the Excel file's first sheet.
 */
function readExcelFile(filePath) {
  // Read the Excel file
  const workbook = XLSX.readFile(filePath, {
    cellDates: true,
  });

  // Get the name of the first sheet
  const firstSheetName = workbook.SheetNames[0];

  // Convert the first sheet to JSON
  const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheetName], {
    raw: false,
  });

  return jsonData;
}

module.exports = readExcelFile;
