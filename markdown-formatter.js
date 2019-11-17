/**
 * Javascript Markdown Formatter.
 */
MarkdownFormatter = (function() {
    
    let SPECIAL_CHAR_REGEX = new RegExp("[^|a-z\\\\s\\d]", 'gi');
    let regexArray = [],patterns = [], styles = [], patternTypes = [], styleTypes = [];
	// formatter pattern configs
	let MD_FORMATTER_CONFIG = [
        {
            type: 'numbered',
            styles:{
                start: "<ol>",
                end: "</ol>"},
            pattern: ["\\d.", '\\r|\\n'],
            patternType: 'start-end',
            groups: 1,
        },  
        {
            type: 'bullet',
            styles:{
                start: "<ul>",
                end: "</ul>"},
            pattern: ['-', '\\r|\\n'],
            patternType: 'start-end',
            groups: 1,
        },  
		{
			type: 'bold',
            styles:{
            start: "<b>",
            end: "</b>"},
			pattern: ['**'],
			patternType: 'symmetric',
			groups: 1,
		},
		{
			type: 'italic',
            styles:{
                start: "<i>",
                end: "</i>"},
			pattern: ['_'],
			patternType: 'symmetric',
			groups: 1,
		},
		{
			type: 'hyperlink',
            styles: {
                html:"<a href='{1}'>{0}</a>"
            },
			pattern: ['[]()'],
			patternType: 'asymmetric',
			groups: 2,
		},
    ];
    
    //combines default config and user config. Overwrites the default config if same type is passed.
    function setCustomMarkdownRegex(userConfig){
        regexArray = userConfig;
        // prefer user configs
        for(var i = 0; i < MD_FORMATTER_CONFIG.length; i++){
            for(var j =0; j < regexArray.length; j++){
                if(MD_FORMATTER_CONFIG[i].type == regexArray[j].type){
                    MD_FORMATTER_CONFIG[i] = regexArray[j];
                    regexArray.splice(j, 1);
                    continue;					
                }
            }
        }
        regexArray = MD_FORMATTER_CONFIG.concat(regexArray);
    }

    //initilizes the necessary variables.
	function constructor() {
		regexArray = MD_FORMATTER_CONFIG.concat(regexArray);        

		for (var i = 0; i < regexArray.length; i++) {
			let pattern = regexArray[i].pattern;
			let patternType = regexArray[i].patternType;
			let groups = regexArray[i].groups;

            if(patternType === "custom"){                
                pattern = pattern[0];
            }
            if(patternType === "start-end"){ 
                pattern = pattern[0].replace(SPECIAL_CHAR_REGEX, "\\$&") + '[\\s]+((.*?)[' + pattern[1].replace(SPECIAL_CHAR_REGEX, "\\$&")+ "](?="+pattern[1].replace(SPECIAL_CHAR_REGEX, '\\$&')+"[\\s]+)|(.*?)$)";
            }else if(patternType == "symmetric"){
                pattern = pattern[0].replace(SPECIAL_CHAR_REGEX, "\\$&") + '(.*?)' + pattern[0].replace(SPECIAL_CHAR_REGEX, "\\$&");    
            }else if(patternType == "asymmetric"){                
                pattern = pattern[0].replace(SPECIAL_CHAR_REGEX, "\\$&");    
                let regexForm = '';
                let p = regexArray[i].pattern[0];
                for (let j = 0; j < p.length; j++) {
                    regexForm = regexForm + "\\" + p[j];
                }
                // create all group regex
				let part = regexForm.length / groups;
				let regex = "";
				for (let j = 0; j < groups; j++) {
					let group = regexForm.substring(part * j, part * (j + 1));
					let firstHalf = group.substring(0, group.length / 2);
					let secondHalf = group.substring(group.length / 2, group.length);
					let middle = (j < groups / 2) ? group.substring(0, group.length / 2) : group.substring(group.length / 2, group.length);
					regex = regex + firstHalf + '([^' + middle + ']+)' + secondHalf;
				}  
				pattern = regex;
			}
            patterns[i] = new RegExp(pattern, 'gim');
			styles[i] = regexArray[i].styles;
			styleTypes[i] = regexArray[i].type;
			patternTypes[i] = patternType;
		}
	}

	function render(text) {
        constructor();
        //parses the text for all the style types.
		for (var i = 0; i <= styleTypes.length - 1; i++) {		
			text = parseText(text, styleTypes[i], styles[i], patterns[i], patternTypes[i]);
		}
		return text;
	}

	function parseText(text, type, styles, pattern, patternType){
        let first="true", parsed;
		while ((parsed = pattern.exec(text)) !== null) {
			if(parsed[1] === undefined){
				continue;
            } 

            if(patternType === "start-end"){ 
                if(first){
                    text = text.replace(parsed[0], styles.start+ "<li>" + parsed[1] + "</li>" + styles.end);
                    first=false;
                } else {
                    let indexOL = text.lastIndexOf(styles.end);
                    text = text.replace(text.substring(indexOL, indexOL + styles.end.length),"");
                    text = text.replace(parsed[0], "<li>" + parsed[1] + "</li>" + styles.end);
                }
            }else if(patternType == "symmetric"){
                text = text.replace(parsed[0], styles.start + parsed[1] + styles.end);
            }else if(patternType == "asymmetric"){ 
                styles.html = styles.html.replace("{0}",parsed[1]);
                styles.html = styles.html.replace("{1}",parsed[2]);
                text = text.replace(parsed[0], styles.html);
            }

		}
		return text;
    }

    return {
        render: render,
        setCustomMarkdownRegex : setCustomMarkdownRegex
    };

}());


