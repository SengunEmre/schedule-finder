
function dateDifference(date1, date2) {
    // Helper function to parse a date in DD/MM/YYYY format
    function parseDate(dateStr) {
        const parts = dateStr.split('/');
        return new Date(parts[2], parts[1] - 1, parts[0]); // YYYY, MM (0-based), DD
    }

    const parsedDate1 = parseDate(date1);
    const parsedDate2 = parseDate(date2);

    // Calculate the difference in milliseconds
    const diffInMs = Math.abs(parsedDate2 - parsedDate1);

    // Convert milliseconds to days
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    return diffInDays;
}



function TurnToCsv () {

    ///
}