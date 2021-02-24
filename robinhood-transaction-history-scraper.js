function parseHTML() {
    let csv = "Date,Name,Type,Total Shares,Price per share,Total Amount, Status\n";
    const sections = document.querySelectorAll('section');
    for (let i = 0; i < sections.length; i++) {
        const transactions = sections[i].querySelectorAll(':scope > div')
        for (let j = 0; j < transactions.length; j++) {
            const transaction = transactions[j].children[0].children[0];
            if (transaction === undefined) {
                continue;
            }
            const name = transaction.children[0].innerText.split('\n')[0];
            const total = transaction.children[0].children[1]?.textContent.replace("+", "");
            let date = "\"";
            date += transaction.children[0].innerText.split('\n')[1];
            date += "\"";
            let securityType = '';
            let finaltotal = '';
            let priceperstock = '';
            let numberOfShares = '';
            let status = '';
            if (total) {
                if (total.includes('shares')) {
                    // multiple stocks
                    securityType = 'shares';
                    finaltotal = total.split(' shares at ')[0].split('.')[0].replace(',', '');
                    finaltotal += ".";
                    finaltotal += total.split(' shares at ')[0].split('.')[1].substr(0, 2);
                    numberOfShares = total.split(' shares at ')[0].split('.')[1].substr(2, total.split(' shares at ')[0].split('.')[1].length).replace(',', '');
                    priceperstock = total.split(' shares at ')[1].replace(',', '');
                    if (name.includes('Buy')) {
                        status = 'Buy';
                    } else if (name.includes('Sell')) {
                        status = 'Sell';
                    } else {
                        status = '';
                    }
                } else if (total.includes('share')) {
                    // singles stocks
                    securityType = 'shares';
                    finaltotal = total.split(' share at ')[0].split('.')[0].replace(',', '');
                    finaltotal += ".";
                    finaltotal += total.split(' share at ')[0].split('.')[1].substr(0, 2);
                    numberOfShares = total.split(' share at ')[0].split('.')[1].substr(2, total.split(' shares at ')[0].split('.')[1].length).replace(',', '');
                    priceperstock = total.split(' share at ')[1].replace(',', '');
                    if (name.includes('Buy')) {
                        status = 'Buy';
                    } else if (name.includes('Sell')) {
                        status = 'Sell';
                    } else {
                        status = '';
                    }
                } else if (name.includes('Deposit')) {
                    // deposite
                    securityType = 'deposite';
                    finaltotal = total.replace(',', '');
                    priceperstock = '';
                    numberOfShares = '';
                    status = '';
                } else if (name.includes('Dividend')) {
                    // deposite
                    securityType = 'dividend';
                    if (total.includes('Reinvested')) {
                        finaltotal = total.split("Re")[0].replace(',', '');
                        status = 'Reinvested';
                    } else if (total.includes('Pending')) {
                        finaltotal = total.split("Pe")[0].replace(',', '');
                        status = 'Pending';
                    } else {
                        finaltotal = total.replace(',', '');
                        status = '';
                    }
                    priceperstock = '';
                    numberOfShares = '';
                } else if (name.includes('Interest')) {
                    // deposite
                    securityType = 'interest';
                    finaltotal = total.replace(',', '');
                    priceperstock = '';
                    numberOfShares = '';
                    status = '';
                } else if (name.includes('Gold')) {
                    // deposite
                    securityType = 'robinhoodgold';
                    finaltotal = total.replace(',', '');
                    priceperstock = '';
                    numberOfShares = '';
                    status = '';
                } else {
                    // dividend
                    securityType = 'other';
                    finaltotal = '';
                    priceperstock = '';
                    numberOfShares = '';
                    status = total.replace(',', '');
                }
            }
            csv += `${date},${name},${securityType},${priceperstock},${numberOfShares},${finaltotal},${status}\n`
        }
    }
    return csv;
}

function download(content, fileName, contentType) {
    const a = document.createElement("a");
    const file = new Blob([content], {
        type: contentType
    });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}

download(parseHTML(), 'transactions.csv', 'text/plain');
