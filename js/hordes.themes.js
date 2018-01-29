var current_theme           = "dark";
var current_font            = "sans";
var current_map_theme       = 0;
var themeBtnDark            = $("#themeBtnDark");
var themeBtnRed             = $("#themeBtnRed");
var themeBtnOrange          = $("#themeBtnOrange");
var themeBtnYellow          = $("#themeBtnYellow");
var themeBtnGreen           = $("#themeBtnGreen");
var themeBtnBlue            = $("#themeBtnBlue");
var themeBtnLight           = $("#themeBtnLight");
var themeBtnCaseFile        = $("#themeBtnCaseFile");

/***
* saveSettings()
*
*/


themeBtnDark.on("click",function(){
  setTheme('dark');
});
themeBtnRed.on("click",function(){
  setTheme('red')
});
themeBtnOrange.on("click",function(){
  setTheme('orange')
});
themeBtnYellow.on("click",function(){
  setTheme('yellow')
});
themeBtnGreen.on("click",function(){
  setTheme('green')
});
themeBtnBlue.on("click",function(){
  setTheme('blue')
});
themeBtnLight.on("click",function(){
  setTheme('light')
});
themeBtnCaseFile.on("click",function(){
  setTheme('CaseFile')
});

var changeMap=function(cmt){
  hordesMap.remove();
  sessionStorage.setItem('current_map_theme', cmt);
  console.log("saving map theme: "+cmt+"->"+mapTheme[Number(sessionStorage.getItem('current_map_theme'))]);
  current_map_theme = cmt;
  setMap(hordesDataVM.data_store());
  saveSettings();
}

var saveSettings=function(){
  // Get saved data from sessionStorage
  // var current_map_theme = Number(sessionStorage.getItem('current_map_theme'));
  // console.log(sessionStorage.getItem('current_map_theme'));
  execSync('touch '+userHome+'/hordes/hordes_settings.txt');
  execSync("echo '"+current_theme+","+current_font+","+current_map_theme+"' >"+userHome+"/hordes/hordes_settings.txt");
};

/***
* setTheme(t)
*
*/
var setTheme=function(t){
  current_theme = t;
  for(var a=0;a<themes.length;a++){
    $('body').removeClass(themes[a].name);
  }
  current_map_theme = Number(sessionStorage.getItem('current_map_theme'));
  console.log("current map theme: "+sessionStorage.getItem('current_map_theme'));
  //sessionStorage.setItem('current_map_theme', current_map_theme);
  saveSettings();
  for(var a=0;a<themes.length;a++){
    if(themes[a].name===t){
      $('body').addClass(t)
      $('body').css({"color":themes[a].textColor});
      $('body').css({"background-color":themes[a].backgroundColor});
      $('*').css({"border-color":themes[a].borderColor});
      $('.side-viewport').css({"background-color":themes[a].backgroundColor});
      $("#hordesConsole_inner").addClass(t);

    }
  }
};

var themes = [
  {
    "name":"dark",
    "textColor":"#777",
    "borderColor":"#777",
    "backgroundColor":"#191919"
  },
  {
    "name":"red",
    "textColor":"#fff",
    "borderColor":"#f00",
    "backgroundColor":"#000"
  },
  {
    "name":"orange",
    "textColor":"#fff",
    "borderColor":"#f60",
    "backgroundColor":"#000"
  },
  {
    "name":"yellow",
    "textColor":"#fff",
    "borderColor":"#ff0",
    "backgroundColor":"#000"
  },
  {
    "name":"green",
    "textColor":"#0f0",
    "borderColor":"#0f0",
    "backgroundColor":"#000"
  },
  {
    "name":"blue",
    "textColor":"#fff",
    "borderColor":"#00f",
    "backgroundColor":"#000"
  },
  {
    "name":"light",
    "textColor":"#fff",
    "borderColor":"#000",
    "backgroundColor":"#999"
  },
  {
    "name":"CaseFile",
    "textColor":"#fff",
    "borderColor":"#c90",
    "backgroundColor":"rgb(118,113,101)"
  }
];
