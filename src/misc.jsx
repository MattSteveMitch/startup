class ScoreRow {
    constructor(username, score) {
        this.username = username;
        this.score = score;
    }
}

function compareScoreRows(row1, row2) {
    return row2.score < row1.score || -(row1.score < row2.score);
}

export function addScore(record_name, score) {
    let record;
    let record_str = localStorage.getItem(record_name);
    
    if (!record_str) {
        record = [];
        console.log("empty");
    }
    else {
        record = JSON.parse(record_str);
        console.log(record);
    }

    record.push(new ScoreRow(localStorage.getItem("username"), score));
    record = record.sort(compareScoreRows);
    record.splice(10);

    localStorage.setItem(record_name, 
        JSON.stringify(record));
}