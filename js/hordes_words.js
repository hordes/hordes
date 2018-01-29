var str = '';
var wordCounts = { };
var words = str.split(/\b/);

for(var i = 0; i < words.length; i++)
    wordCounts["_" + words[i]] = (wordCounts["_" + words[i]] || 0) + 1;

console.log(wordCounts);
