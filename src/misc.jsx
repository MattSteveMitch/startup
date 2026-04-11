class ScoreRow {
    constructor(username, score) {
        this.username = username;
        this.score = score;
    }
}

function compareScoreRows(row1, row2) {
    return row2.score < row1.score || -(row1.score < row2.score);
}

function compareScoreRowsRev(row1, row2) {
    return row2.score > row1.score || -(row1.score > row2.score);
}

export function getScores(record_name) {
    let record;
    let record_str = localStorage.getItem(record_name);
    
    if (!record_str) {
        record = [];
    }
    else {
        record = JSON.parse(record_str);
    }

    return record;
}

export function addScore(record_name, score, sortDescending=false) {
    /*
    let record;
    let record_str = localStorage.getItem(record_name);
    let compareFun;
    if (sortDescending) {
        compareFun = compareScoreRowsRev;
    }
    else {
        compareFun = compareScoreRows;
    }
    
    if (!record_str) {
        record = [];
    }
    else {
        record = JSON.parse(record_str);
    }

    var old_best = record[0];

    if (score !== null) {
        const newRow = new ScoreRow(localStorage.getItem("username"), score);
        record.push(newRow);
        record = record.sort(compareFun);
        record.splice(10);
        localStorage.setItem(record_name, JSON.stringify(record));
    }


    return old_best;
    */
}

export function Logout_or_Home() {
    if (!localStorage.getItem("username")) {
        return "Home";
    }
    else {
        return "Log out";
    }
}

export function nullish(val) {
    return (val === null || val === undefined);
}
