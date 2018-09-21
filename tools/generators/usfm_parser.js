
var textRegExp = /(\\([a-z0-9]+))\s([^\\]*)(\\([a-z0-9]+)\*+)?/g;
// for inline tags

var unparsed = [];

var hindibookMap = { 'उत्प.': 'GN',
  'निर्ग.': 'EX',
  'लैव्य.': 'LV',
  'गिन': 'NU',
  'व्य.': 'DT',
  'यहो.': 'JS',
  'न्याय.': 'JG',
  'रूत': 'RT',
  '1 शमू.': 'S1',
  '2 शमू.': 'S2',
  '1 राजा': 'K1',
  '2 राजा': 'K2',
  '1 इति.': 'R1',
  '2 इति.': 'R2',
  'एज्रा': 'ER',
  'नहे.': 'NH',
  'एस्ते.': 'ET',
  'अय्यू.': 'JB',
  'भज.': 'PS',
  'नीति.': 'PR',
  'सभो.': 'EC',
  'श्रेष्ठ.': 'SS',
  'यशा.': 'IS',
  'यिर्म': 'JR',
  'विला.': 'LM',
  'यहे.': 'EK',
  'दानि.': 'DN',
  'होशे': 'HS',
  'योए.': 'JL',
  'आमो.': 'AM',
  'Oba': 'OB',
  'योना': 'JH',
  'मीका': 'MC',
  'नहू.': 'NM',
  'हब.': 'HK',
  'सप.': 'ZP',
  'हाग्गै': 'HG',
  'जक.': 'ZC',
  'मला.': 'ML',
  'मत्ती': 'MT',
  'मर.': 'MK',
  'लूका': 'LK',
  'यूह.': 'JN',
  'प्रेरि.': 'AC',
  'रोम.': 'RM',
  '1 कुरि.': 'C1',
  '2 कुरि.': 'C2',
  'गला.': 'GL',
  'इफि.': 'EP',
  'फिलि.': 'PP',
  'कुलु.': 'CL',
  '1 थिस्स.': 'H1',
  '2 थिस्स.': 'H2',
  '1 तीमु.': 'T1',
  '2 तीमु.': 'T2',
  'तीतु.': 'TT',
  'Phm': 'PM',
  'इब्रा': 'HB',
  'याकू.': 'JM',
  '1 पत.': 'P1',
  '2 पत.': 'P2',
  '1 यूह.': 'J1',
  '2 यूह.': 'J2',
  '3 यूह.': 'J3',
  'यहू.': 'JD',
  'प्रका.': 'RV' }




function formatText(text, noteNumber, chapterVerse) {

	textRegExp.lastIndex = 0;

	var notes = '';


	text = text.replace(textRegExp, function() {

		//console.log('handling', arguments);

		var key = arguments[2],
			content = arguments[3];

		switch (key) {
			case 'f':
			case 'ft':
			case 'fqa':
				content = content.trim();
				var firstSpace = content.indexOf(' '),
					noteKey = content.substring(0, firstSpace),
					noteText = content.substring(firstSpace + 1);

				noteText = noteText.replace(/<u>([^<]+)<\/u>/gi,function(m, a) {
					var textRef = a,
						r = null,
						s = '';

					for (var x in hindibookMap) {
							index = textRef.search(x);
							if (index == 0) {
								engtextRef = textRef.replace(x, hindibookMap[x])
						}
					}
					engtextRef = engtextRef.replace(/(\w{2})\.?\s?(\d+)\s?\:\s?(\d+)/gi, "$1$2_$3")
					// console.log(engtextRef)n

					// r = new bibleReference(textRef);

					// if (typeof r.toSection != 'undefined') {
					s =  '<span class="bibleref" data-id="' + engtextRef + '">' + textRef + '</span>';
					// } 
					// else {
					// 	console.log('err', a);
					// }

					// lastReference = r;

					return s;
				});

				notes = '<span class="footnote" id="note-' + noteNumber + '">' +
					'<span class="key">' + noteKey + '</span>' +
					'<a href="#footnote-' + noteNumber + '" class="backref">' + chapterVerse + '</a>' +
					'<span class="text"><span class="ft">' + noteText + '</span>' +
					'</span></span>\n';

				return '<span class="note" id="footnote-' + noteNumber + '">' +
					'<a href="#note-' + noteNumber + '" class="key">' + noteKey + '</a>' +
					'</span>';

				break;


				//return '<span class="note"><span class="key">' + noteKey + '</span><span class="text">' + noteText + '</span></span>';
				//return '<span class="note" id="note-' + noteKey + '"><a class="key" href="footnote-' + noteKey + '">' + noteKey + '</a><span class="text">' + noteText + '</span></span>';

				
			case 'x':
				content = content.trim();
				var firstSpace = content.indexOf(' '),
					noteKey = content.substring(0, firstSpace),
					noteText = content.substring(firstSpace + 1);

				return '<span class="cf"><span class="key">' + noteKey + '</span><span class="text">' + noteText + '</span></span>';

				break;
			case 'wj':
				return '<span class="wj woj">' + content + '</span>';

				break;

			case 'bd':
				return '<strong>' + content + '</strong>';

				break;

			case 'add':
				return '<span class="add">' + content + '</span>';

				break;

			case 'qs':
			case 'it':
				return '</span><div class="qs">' + content + '</div>';

				break;

			case 'nd':
				return '<span class="nog">' + content + '</span>';

				break;

			default:

				if (unparsed.indexOf(key) == -1) {
					// console.log('unparsed', key);
					unparsed.push(key);
				}

				return arguments[0];
		}


	});

	return {
		text: text,
		notes: notes
	};
}

function plainText(text) {

	textRegExp.lastIndex = 0;

	text = text.replace(textRegExp, function() {

		//console.log('handling', arguments);

		var key = arguments[2],
			content = arguments[3];

		switch (key) {
			case 'f':
			case 'ft':
			case 'fqa':
			case 'x':
				return '';
				break;
			case 'wj':
			case 'qs':
				return content;
				break;
			default:
				return arguments[0];
		}
	});

	return text;
}


// for individual lines
var lineRegExp = /(\\([a-z0-9\*]+))?\s?((\d+(\-\d+)?)\s)?(.*)?/;

function parseLine(line) {
	lineRegExp.lastIndex = 0;

	var parts = lineRegExp.exec(line.trim()),
		usfmData = null;

	if (parts != null) {
		if (parts[2] == 'v' && typeof(parts[4]) == 'undefined') {
            parts[4] = parts[6].split("\\f †")
            parts[6] = ''
        }
		usfmData = {
			key: parts[2] || '',
			number: parts[4] || '',
			text: parts[6] || ''
		};
	}

	return usfmData;
}


module.exports = {
	textRegExp: textRegExp,
	lineRegExp: lineRegExp,
	formatText: formatText,
	plainText: plainText,
	parseLine: parseLine
}
