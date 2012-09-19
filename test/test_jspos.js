/**
 * Run with "vows" command-line util, "npm test", or require('test/test_jspos').run()
 */

var vows = require('vows'),
  assert = require('assert'),
  jspos = require('../');

var lexer = new jspos.Lexer();
var tagger = new jspos.POSTagger();

// documented codes
var codes = [
  ["CC","Coord Conjuncn","and,but,or"],
  ["CD","Cardinal number","one,two"],
  ["DT","Determiner","the,some"],
  ["EX","Existential there","there"],
  ["FW","Foreign Word","mon dieu"],
  ["IN","Preposition","of,in,by"],
  ["JJ","Adjective","big"],
  ["JJR","Adj., comparative","bigger"],
  ["JJS","Adj., superlative","biggest"],
  ["LS","List item marker","1,One"],
  ["MD","Modal","can,should"],
  ["NN","Noun, sing. or mass","dog"],
  ["NNP","Proper noun, sing.","Edinburgh"],
  ["NNPS","Proper noun, plural","Smiths"],
  ["NNS","Noun, plural","dogs"],
  ["POS","Possessive ending","'s"],
  ["PDT","Predeterminer","all,both"],
  ["PP$","Possessive pronoun","my,one's"],
  ["PRP","Personal pronoun","I,you,she"],
  ["RB","Adverb","quickly"],
  ["RBR","Adverb, comparative","faster"],
  ["RBS","Adverb, superlative","fastest"],
  ["RP","Particle","up,off"],
  ["SYM","Symbol","+,%,&"],
  ["TO","?to?","to"],
  ["UH","Interjection","oh, oops"],
  ["VB","verb, base form","eat"],
  ["VBD","verb, past tense","ate"],
  ["VBG","verb, gerund","eating"],
  ["VBN","verb, past part","eaten"],
  ["VBP","Verb, present","eat"],
  ["VBZ","Verb, present","eats"],
  ["WDT","Wh-determiner","which,that"],
  ["WP","Wh pronoun","who,what"],
  ["WP$","Possessive-Wh","whose"],
  ["WRB","Wh-adverb","how,where"],
  [",","Comma",","],
  [".","Sent-final punct",".,!,?"],
  [":","Mid-sent punct.",":,;,?"],
  ["$","Dollar sign","$"],
  ["#","Pound sign","#"],
  ['"',"quote",'"'],
  ["(","Left paren","("],
  [")","Right paren",")"]
]

code_tests = {};

codes.forEach(function(c){
  var words = c[2].split(',');
  if (c[2] == ","){
    var tags = tagger.tag(',');
  }else{
    var tags = tagger.tag(words);
  }

  tags.forEach(function(tag){
    code_tests[c[1] + " (" + c[0] + ")"] = function(){
      assert(tag[1] == c[0], "got " + tag[1] + ' on "' + tag[0] + '"');
    }
  });
});


exports.jspos = vows.describe('jspos').addBatch({
    "The jspos library should be able to": {
        "create a Lexer instance" : function(){
          assert(lexer);
        },

        "create a POSTagger instance" : function(){
          assert(tagger);
        },

        "parse natural language with 2 sentences" : function(){
          var shortTestString = "This is some sample text. This text can contain multiple sentences.";
          var tags = tagger.tag(lexer.lex(shortTestString));
          var test_tags = [["This","DT"],["is","VBZ"],["some","DT"],["sample","NN"],["text","NN"],[".","."],["This","DT"],["text","NN"],["can","MD"],["contain","VB"],["multiple","JJ"],["sentences","NNS"],[".","."]];
          assert.equal(JSON.stringify(tags), JSON.stringify(test_tags));
        },

        "parse natural language with many sentences" : function(){
          var testString = "They are the most wired vehicles on the road, with dashboard computers, sophisticated radios, navigation systems and cellphones. While such gadgets are widely seen as distractions to be avoided behind the wheel, there are hundreds of thousands of drivers ? police officers and paramedics ? who are required to use them, sometimes at high speeds, while weaving through traffic, sirens blaring.  The drivers say the technology is a huge boon for their jobs, saving valuable seconds and providing instant access to essential information. But it also presents a clear risk ? even the potential to take a life while they are trying to save one.  Philip Macaluso, a New York paramedic, recalled a moment recently when he was rushing to the hospital while keying information into his dashboard computer. At the last second, he looked up from the control panel and slammed on his brakes to avoid a woman who stepped into the street.  There is a potential for disaster here, Mr. Macaluso said. Data does not exist about crashes caused by police officers or medics distracted by their devices. But there are tragic anecdotes.  In April 2008, an emergency medical technician in West Nyack, N.Y., looked at his GPS screen, swerved and hit a parked flatbed truck. The crash sheared off the side of the ambulance and left his partner, who was in the passenger seat, paralyzed.  In June 2007, a sheriff's deputy in St. Clair County, Ill., was driving 35 miles per hour when a dispatcher radioed with an assignment. He entered the address into the mapping system and then looked up, too late to avoid hitting a sedan stopped in traffic. Its driver was seriously injured.  Ambulances and police cars are becoming increasingly wired. Some 75 percent of police cruisers have on-board computers, a figure that has doubled over the last decade, says David Krebs, an industry analyst with the VDC Research Group. He estimates about 30 percent of ambulances have such technology.  The use of such technology by so-called first responders comes as regulators, legislators and safety advocates seek to limit the use of gadgets by most drivers. Police officers, medics and others who study the field say they are searching to find the right balance between technology's risks and benefits.  The computers allow police, for example, to check license plate data, find information about a suspect and exchange messages with dispatchers. Ambulances receive directions to accident scenes and can use the computers to send information about the patient before they arrive at hospitals.  The technology is enormously beneficial, said Jeffrey Lindsey, a retired fire chief in Florida who now is an executive at the Health and Safety Institute, which provides continuing education for emergency services workers.  But he said first responders generally did not have enough training to deal with diversions that could be almost exponential compared with those faced by most drivers.  The New York Fire Department, which coordinates the city's largest ambulance system, said drivers were not supposed to use on-board computers in traffic. That is the role of the driver's partner, and if the partner is in the back tending to a patient, the driver is supposed to use devices before speeding off.  There's no need for our drivers to get distracted, because the system has evolved to keep safety paramount, said Jerry Gombo, assistant chief for emergency service operations at the Fire Department. Drivers do get into accidents, he said, but he couldn't remember a single one caused by distraction from using a computer.  He also estimates the technology saves 20 to 30 seconds per call. There's no doubt we're having quicker response time, Mr. Gombo added.  But in interviews, medics and E.M.T.'s in New York and elsewhere say that although they are aware of the rules, they do use their on-board computers while driving because they can't wait for certain information.  States that ban drivers from texting or using hand-held phones tend to exempt first responders. And in many places where even they are forbidden to use cellphones behind the wheel, the edict is often ignored.";
          var tags = tagger.tag(lexer.lex(testString));
          var test_tags = [["They","PRP"],["are","VBP"],["the","DT"],["most","RBS"],["wired","VBN"],["vehicles","NNS"],["on","IN"],["the","DT"],["road","NN"],[",",","],["with","IN"],["dashboard","NN"],["computers","NNS"],[",",","],["sophisticated","JJ"],["radios","NNS"],[",",","],["navigation","NN"],["systems","NNS"],["and","CC"],["cellphones","NNS"],[".","."],["While","IN"],["such","JJ"],["gadgets","NNS"],["are","VBP"],["widely","RB"],["seen","VBN"],["as","IN"],["distractions","NNS"],["to","TO"],["be","VB"],["avoided","VBN"],["behind","IN"],["the","DT"],["wheel","NN"],[",",","],["there","EX"],["are","VBP"],["hundreds","NNS"],["of","IN"],["thousands","NN"],["of","IN"],["drivers","NNS"],["?","."],["police","NN"],["officers","NNS"],["and","CC"],["paramedics","NNS"],["?","."],["who","WP"],["are","VBP"],["required","VBN"],["to","TO"],["use","NN"],["them","PRP"],[",",","],["sometimes","RB"],["at","IN"],["high","JJ"],["speeds","NNS"],[",",","],["while","IN"],["weaving","VBG"],["through","IN"],["traffic","NN"],[",",","],["sirens","NNS"],["blaring","VBG"],[".","."],["The","DT"],["drivers","NNS"],["say","VBP"],["the","DT"],["technology","NN"],["is","VBZ"],["a","DT"],["huge","JJ"],["boon","NN"],["for","IN"],["their","PRP$"],["jobs","NNS"],[",",","],["saving","VBG"],["valuable","JJ"],["seconds","NNS"],["and","CC"],["providing","VBG"],["instant","NN"],["access","NN"],["to","TO"],["essential","JJ"],["information","NN"],[".","."],["But","CC"],["it","PRP"],["also","RB"],["presents","VBZ"],["a","DT"],["clear","JJ"],["risk","NN"],["?","."],["even","RB"],["the","DT"],["potential","JJ"],["to","TO"],["take","VB"],["a","DT"],["life","NN"],["while","IN"],["they","PRP"],["are","VBP"],["trying","VBG"],["to","TO"],["save","VB"],["one","NN"],[".","."],["Philip","NNP"],["Macaluso","NN"],[",",","],["a","DT"],["New","NNP"],["York","NNP"],["paramedic","NN"],[",",","],["recalled","VBD"],["a","DT"],["moment","NN"],["recently","RB"],["when","WRB"],["he","PRP"],["was","VBD"],["rushing","VBG"],["to","TO"],["the","DT"],["hospital","NN"],["while","IN"],["keying","VBG"],["information","NN"],["into","IN"],["his","PRP$"],["dashboard","NN"],["computer","NN"],[".","."],["At","IN"],["the","DT"],["last","JJ"],["second","NN"],[",",","],["he","PRP"],["looked","VBD"],["up","IN"],["from","IN"],["the","DT"],["control","NN"],["panel","NN"],["and","CC"],["slammed","VBD"],["on","IN"],["his","PRP$"],["brakes","NNS"],["to","TO"],["avoid","VB"],["a","DT"],["woman","NN"],["who","WP"],["stepped","VBD"],["into","IN"],["the","DT"],["street","NN"],[".","."],["There","EX"],["is","VBZ"],["a","DT"],["potential","JJ"],["for","IN"],["disaster","NN"],["here","RB"],[",",","],["Mr","NNP"],[".","."],["Macaluso","NN"],["said","VBD"],[".","."],["Data","NNP"],["does","VBZ"],["not","RB"],["exist","VB"],["about","IN"],["crashes","NNS"],["caused","VBN"],["by","IN"],["police","NN"],["officers","NNS"],["or","CC"],["medics","NNS"],["distracted","VBN"],["by","IN"],["their","PRP$"],["devices","NNS"],[".","."],["But","CC"],["there","EX"],["are","VBP"],["tragic","JJ"],["anecdotes","NNS"],[".","."],["In","IN"],["April","NNP"],["2008","CD"],[",",","],["an","DT"],["emergency","NN"],["medical","JJ"],["technician","NN"],["in","IN"],["West","NNP"],["Nyack","NNP"],[",",","],["N","NN"],[".","."],["Y","NNP"],[".","."],[",",","],["looked","VBD"],["at","IN"],["his","PRP$"],["GPS","NN"],["screen","NN"],[",",","],["swerved","VBD"],["and","CC"],["hit","VBD"],["a","DT"],["parked","VBN"],["flatbed","VBN"],["truck","NN"],[".","."],["The","DT"],["crash","NN"],["sheared","JJ"],["off","IN"],["the","DT"],["side","NN"],["of","IN"],["the","DT"],["ambulance","NN"],["and","CC"],["left","VBN"],["his","PRP$"],["partner","NN"],[",",","],["who","WP"],["was","VBD"],["in","IN"],["the","DT"],["passenger","NN"],["seat","NN"],[",",","],["paralyzed","VBN"],[".","."],["In","IN"],["June","NNP"],["2007","CD"],[",",","],["a","DT"],["sheriff's","NN"],["deputy","NN"],["in","IN"],["St","NNP"],[".","."],["Clair","NNP"],["County","NNP"],[",",","],["Ill","NNP"],[".","."],[",",","],["was","VBD"],["driving","VBG"],["35","CD"],["miles","NNS"],["per","IN"],["hour","NN"],["when","WRB"],["a","DT"],["dispatcher","NN"],["radioed","JJ"],["with","IN"],["an","DT"],["assignment","NN"],[".","."],["He","PRP"],["entered","VBD"],["the","DT"],["address","NN"],["into","IN"],["the","DT"],["mapping","VBG"],["system","NN"],["and","CC"],["then","RB"],["looked","VBD"],["up","IN"],[",",","],["too","RB"],["late","JJ"],["to","TO"],["avoid","VB"],["hitting","VBG"],["a","DT"],["sedan","NN"],["stopped","VBD"],["in","IN"],["traffic","NN"],[".","."],["Its","PRP$"],["driver","NN"],["was","VBD"],["seriously","RB"],["injured","VBN"],[".","."],["Ambulances","NNS"],["and","CC"],["police","NN"],["cars","NNS"],["are","VBP"],["becoming","VBG"],["increasingly","RB"],["wired","VBN"],[".","."],["Some","DT"],["75","CD"],["percent","NN"],["of","IN"],["police","NN"],["cruisers","NNS"],["have","VBP"],["on-board","JJ"],["computers","NNS"],[",",","],["a","DT"],["figure","NN"],["that","IN"],["has","VBZ"],["doubled","VBD"],["over","IN"],["the","DT"],["last","JJ"],["decade","NN"],[",",","],["says","VBZ"],["David","NNP"],["Krebs","NNP"],[",",","],["an","DT"],["industry","NN"],["analyst","NN"],["with","IN"],["the","DT"],["VDC","NN"],["Research","NNP"],["Group","NNP"],[".","."],["He","PRP"],["estimates","NNS"],["about","IN"],["30","CD"],["percent","NN"],["of","IN"],["ambulances","NNS"],["have","VBP"],["such","JJ"],["technology","NN"],[".","."],["The","DT"],["use","NN"],["of","IN"],["such","JJ"],["technology","NN"],["by","IN"],["so-called","JJ"],["first","NN"],["responders","NN"],["comes","VBZ"],["as","IN"],["regulators","NNS"],[",",","],["legislators","NNS"],["and","CC"],["safety","NN"],["advocates","NNS"],["seek","VB"],["to","TO"],["limit","NN"],["the","DT"],["use","NN"],["of","IN"],["gadgets","NNS"],["by","IN"],["most","RBS"],["drivers","NNS"],[".","."],["Police","NNP"],["officers","NNS"],[",",","],["medics","NNS"],["and","CC"],["others","NNS"],["who","WP"],["study","NN"],["the","DT"],["field","NN"],["say","VBP"],["they","PRP"],["are","VBP"],["searching","VBG"],["to","TO"],["find","VB"],["the","DT"],["right","NN"],["balance","NN"],["between","IN"],["technology's","NNS"],["risks","NNS"],["and","CC"],["benefits","NNS"],[".","."],["The","DT"],["computers","NNS"],["allow","VB"],["police","NN"],[",",","],["for","IN"],["example","NN"],[",",","],["to","TO"],["check","NN"],["license","NN"],["plate","NN"],["data","NNS"],[",",","],["find","VB"],["information","NN"],["about","IN"],["a","DT"],["suspect","NN"],["and","CC"],["exchange","NN"],["messages","NNS"],["with","IN"],["dispatchers","NNS"],[".","."],["Ambulances","NNS"],["receive","VB"],["directions","NNS"],["to","TO"],["accident","NN"],["scenes","NNS"],["and","CC"],["can","MD"],["use","NN"],["the","DT"],["computers","NNS"],["to","TO"],["send","VB"],["information","NN"],["about","IN"],["the","DT"],["patient","NN"],["before","IN"],["they","PRP"],["arrive","VB"],["at","IN"],["hospitals","NNS"],[".","."],["The","DT"],["technology","NN"],["is","VBZ"],["enormously","RB"],["beneficial","JJ"],[",",","],["said","VBD"],["Jeffrey","NNP"],["Lindsey","NNP"],[",",","],["a","DT"],["retired","VBN"],["fire","NN"],["chief","JJ"],["in","IN"],["Florida","NNP"],["who","WP"],["now","RB"],["is","VBZ"],["an","DT"],["executive","NN"],["at","IN"],["the","DT"],["Health","NNP"],["and","CC"],["Safety","NNP"],["Institute","NNP"],[",",","],["which","WDT"],["provides","VBZ"],["continuing","VBG"],["education","NN"],["for","IN"],["emergency","NN"],["services","NNS"],["workers","NNS"],[".","."],["But","CC"],["he","PRP"],["said","VBD"],["first","NN"],["responders","NN"],["generally","RB"],["did","VBD"],["not","RB"],["have","VBP"],["enough","RB"],["training","VBG"],["to","TO"],["deal","NN"],["with","IN"],["diversions","NNS"],["that","IN"],["could","MD"],["be","VB"],["almost","RB"],["exponential","JJ"],["compared","VBN"],["with","IN"],["those","DT"],["faced","VBN"],["by","IN"],["most","RBS"],["drivers","NNS"],[".","."],["The","DT"],["New","NNP"],["York","NNP"],["Fire","NNP"],["Department","NNP"],[",",","],["which","WDT"],["coordinates","NNS"],["the","DT"],["city's","NNS"],["largest","JJS"],["ambulance","NN"],["system","NN"],[",",","],["said","VBD"],["drivers","NNS"],["were","VBD"],["not","RB"],["supposed","VBN"],["to","TO"],["use","NN"],["on-board","JJ"],["computers","NNS"],["in","IN"],["traffic","NN"],[".","."],["That","DT"],["is","VBZ"],["the","DT"],["role","NN"],["of","IN"],["the","DT"],["driver's","NNS"],["partner","NN"],[",",","],["and","CC"],["if","IN"],["the","DT"],["partner","NN"],["is","VBZ"],["in","IN"],["the","DT"],["back","RB"],["tending","VBG"],["to","TO"],["a","DT"],["patient","NN"],[",",","],["the","DT"],["driver","NN"],["is","VBZ"],["supposed","VBN"],["to","TO"],["use","NN"],["devices","NNS"],["before","IN"],["speeding","VBG"],["off","IN"],[".","."],["There's","NNS"],["no","DT"],["need","VBN"],["for","IN"],["our","PRP$"],["drivers","NNS"],["to","TO"],["get","VB"],["distracted","VBN"],[",",","],["because","IN"],["the","DT"],["system","NN"],["has","VBZ"],["evolved","VBN"],["to","TO"],["keep","VB"],["safety","NN"],["paramount","JJ"],[",",","],["said","VBD"],["Jerry","NNP"],["Gombo","NN"],[",",","],["assistant","NN"],["chief","JJ"],["for","IN"],["emergency","NN"],["service","NN"],["operations","NNS"],["at","IN"],["the","DT"],["Fire","NNP"],["Department","NNP"],[".","."],["Drivers","NNS"],["do","VBP"],["get","VB"],["into","IN"],["accidents","NNS"],[",",","],["he","PRP"],["said","VBD"],[",",","],["but","CC"],["he","PRP"],["couldn't","NN"],["remember","VB"],["a","DT"],["single","JJ"],["one","NN"],["caused","VBN"],["by","IN"],["distraction","NN"],["from","IN"],["using","VBG"],["a","DT"],["computer","NN"],[".","."],["He","PRP"],["also","RB"],["estimates","NNS"],["the","DT"],["technology","NN"],["saves","VBZ"],["20","CD"],["to","TO"],["30","CD"],["seconds","NNS"],["per","IN"],["call","VB"],[".","."],["There's","NNS"],["no","DT"],["doubt","NN"],["we're","NN"],["having","VBG"],["quicker","JJR"],["response","NN"],["time","NN"],[",",","],["Mr","NNP"],[".","."],["Gombo","NN"],["added","VBD"],[".","."],["But","CC"],["in","IN"],["interviews","NNS"],[",",","],["medics","NNS"],["and","CC"],["E","NN"],[".","."],["M","NNP"],[".","."],["T","NN"],[".","."],["'s","NNS"],["in","IN"],["New","NNP"],["York","NNP"],["and","CC"],["elsewhere","RB"],["say","VBP"],["that","IN"],["although","IN"],["they","PRP"],["are","VBP"],["aware","JJ"],["of","IN"],["the","DT"],["rules","NNS"],[",",","],["they","PRP"],["do","VBP"],["use","NN"],["their","PRP$"],["on-board","JJ"],["computers","NNS"],["while","IN"],["driving","VBG"],["because","IN"],["they","PRP"],["can't","NN"],["wait","VB"],["for","IN"],["certain","JJ"],["information","NN"],[".","."],["States","NNPS"],["that","IN"],["ban","NN"],["drivers","NNS"],["from","IN"],["texting","VBG"],["or","CC"],["using","VBG"],["hand-held","JJ"],["phones","NNS"],["tend","VBP"],["to","TO"],["exempt","JJ"],["first","NN"],["responders","NN"],[".","."],["And","CC"],["in","IN"],["many","JJ"],["places","NNS"],["where","WRB"],["even","RB"],["they","PRP"],["are","VBP"],["forbidden","VBN"],["to","TO"],["use","NN"],["cellphones","NNS"],["behind","IN"],["the","DT"],["wheel","NN"],[",",","],["the","DT"],["edict","NN"],["is","VBZ"],["often","RB"],["ignored","VBN"],[".","."]];
          assert.equal(JSON.stringify(tags), JSON.stringify(test_tags));
        },

        "pretty-print it's results in a human-readable form" : function(){
          var prettyTestWords = lexer.lex("This is a test: e.g. some sort of thing.");
          var prettyTestRes = tagger.tag(prettyTestWords);
          var test_text = "This(DT) is(VBZ) a(DT) test:(NN) e(NN) .(.) g(NN) .(.) some(DT) sort(NN) of(IN) thing(VBG) .(.) ";
          assert.equal(tagger.prettyPrint(prettyTestRes), test_text);
        },

        "conform to documented codes" : code_tests
    }
});

