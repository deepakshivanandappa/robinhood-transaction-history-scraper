function parseHTML() {
	let csv = "Date,Name,Stock Name, Symbol, Sector,Order Type, Type,RegFee,Price/Stock,Total Stock,Total Amount, Status\n";
	let sections = document.querySelectorAll('section');
	for (let i = 0; i < sections.length; i++) {
		let transactions = sections[i].querySelectorAll('.css-1gb8ekd')
		for (let j = 0; j < transactions.length; j++) {
			let transaction = transactions[j].children[0];
			if (transaction === undefined) {
				continue;
			}
			let details = transaction.innerText.split('\n');
			let name = details[0];
			let date = new Date(Date.parse(details[1])).toISOString().split("T")[0]
			let securityType = '';
			let finaltotal = '';
			let priceperstock = '';
			let numberOfShares = '';
			let status = '';

			if (name.includes('coin')) {
				securityType = 'Crypto';
			} else if (name.includes('Buy')) {
				securityType = 'stocks';
			} else if (name.includes('Sell')) {
				securityType = 'stocks';
			} else if (name.includes('Interest')) {
				securityType = 'interest';
			} else if (name.includes('Dividend')) {
				securityType = 'dividend';
			} else {
				securityType = 'other';
			}

			if (details.length === 3) {
				if (name.includes('Interest') || name.includes('Dividend')) {
					finaltotal = details[2].replace("+", "").replace(",", "")
				} else if (name.includes('Withdrawal')) {
					finaltotal = details[2].replace("+", "").replace(",", "")
				} else if (name.includes('Deposit')) {
					finaltotal = details[2].replace("+", "").replace(",", "")
				} else if (!name.includes('$')) {
					status = details[2]
				}

			} else {
				if (name.includes('Buy')) {
					status = 'Buy';
				} else if (name.includes('Sell')) {
					status = 'Sell';
				}

				if (details[3].includes(' shares at ')) {
					finaltotal = details[2].replace(",", "")
					numberOfShares = details[3].split(' shares at ')[0].replace(",", "")
					priceperstock = details[3].split(' shares at ')[1].replace(",", "")
				}

				if (details[3].includes(' Bitcoin at ')) {
					finaltotal = details[2].replace(",", "")
					numberOfShares = details[3].split(' Bitcoin at ')[0].replace(",", "")
					priceperstock = details[3].split(' Bitcoin at ')[1].replace(",", "")
				}

				if (details[3].includes(' Dogecoin at ')) {
					finaltotal = details[2].replace(",", "")
					numberOfShares = details[3].split(' Dogecoin at ')[0].replace(",", "")
					priceperstock = details[3].split(' Dogecoin at ')[1].replace(",", "")
				}

				if (name.includes('Dividend')) {
					finaltotal = details[2].replace("+", "").replace(",", "")
					status = details[3]
				}
			}

			csv += `${date},${name},,,,,${securityType},,${priceperstock},${numberOfShares},${finaltotal},${status}\n`
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
