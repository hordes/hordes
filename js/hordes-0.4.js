/* #############################################################

██╗  ██╗ ██████╗ ██████╗ ██████╗ ███████╗███████╗
██║  ██║██╔═══██╗██╔══██╗██╔══██╗██╔════╝██╔════╝
███████║██║   ██║██████╔╝██║  ██║█████╗  ███████╗
██╔══██║██║   ██║██╔══██╗██║  ██║██╔══╝  ╚════██║
██║  ██║╚██████╔╝██║  ██║██████╔╝███████╗███████║
╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚═════╝ ╚══════╝╚══════╝ v0.4

##############################################################*/
const {dialog}              = require('electron').remote;
var userHome                = require('user-home');
var CENTRAL_SERVICES        = "";
var HORDE                   = [];
var HORDE_TOPS              = [];
var current_strory_url      = "";
var config                  = [];
var mapboxAcct;
var mapboxToken;
var mapboxId;
var current_map_theme       = 4;
var mapTheme = [];

//const {app}                 = require('electron');
var exec                    = require('child_process').exec;
var execFile                = require('child_process').execFile;
var execSync                = require('child_process').execSync;
var spawn                   = require('child_process').spawn;
var path                    = require('path');

var hordesDataVM;
var hordesMap;

var appIsBound              = false;
var tmpData                 = [];
var tmpSrcs                 = [];
var tmpStories              = [];
var storyDetail             = $("#storyDetail");
var detailItem              = $(".detail-item");
var closeStoryDetailBtn     = $("#closeStoryDetailBtn");
var hordesConsole           = $("#hordesConsole");
var hordesConsoleHeader     = $("#hordesConsoleHeader");
var hordesConsoleBody       = $("#hordesConsoleBody");
var hideConsoleBtn          = $("#hideConsoleBtn");
var saveHordeBtn            = $("#saveHordeBtn");
var printHordeBtn           = $("#printHordeBtn");
var hordeBtn                = $("#hordeBtn");
var rateBtn                 = $("#rateBtn");
var weatherBtn              = $("#weatherBtn");
var refreshBtn              = $(".refresh-btn");
var notebookBtn             = $(".notebook-btn");
var storyItem               = $(".story-item");
var divider                 = "<hr class='dotted'/>";
var keywordList             = [];
var TIMELINE                = [];
var HORDE_ALERTS            = [];
var hordeMonitor;
var hordeMonitorTimeout     = 30;
var hordeMonitorCount       = 0;
var hordeComplete           = false;
var hordeLoaded             = 0;
var hordeTotal              = 0;
var sourcesLoaded           = 0;
var today                   = moment().format('dddd');
var localTimeSeconds        = moment().format('LT');
var year                    = moment().format('Y');
var isPlaying               = false;
var audio                   = document.getElementById('hordesAudio');
var ctx                     = new (window.AudioContext || window.webkitAudioContext)();
var analyser                = ctx.createAnalyser();
var audioSrc                = ctx.createMediaElementSource(audio);
var _CUR_NEWS_SRC_          = 0;
var wordCounts              = { };
var node_themes =[
  {
    "news":{
      "color":"rgba(255,100,100,0.5)",
      "fillColor":"rgba(255,100,100,1)",
      "fillOpacity":1
    },
    "science":{
      "color":"rgba(255,180,100,0.5)",
      "fillColor":"rgba(255,180,100,1)",
      "fillOpacity":1
    },
    "arts":{
      "color":"rgba(100,255,180,0.5)",
      "fillColor":"rgba(100,255,180,1)",
      "fillOpacity":1
    },
    "community":{
      "color":"rgba(180,100,255,0.5)",
      "fillColor":"rgba(180,100,255,1)",
      "fillOpacity":1
    },
    "tech":{
      "color":"rgba(100,100,255,0.5)",
      "fillColor":"rgba(100,100,255,1)",
      "fillOpacity":1
    },
    "blog":{
      "color":"rgba(255,100,255,0.5)",
      "fillColor":"rgba(255,100,255,1)",
      "fillOpacity":1
    },
    "tv":{
      "color":"rgba(145,100,105,0.5)",
      "fillColor":"rgba(145,100,105,1)",
      "fillOpacity":1
    },
    "403":{
      "color":"rgba(255,255,255,0.5)",
      "fillColor":"rgba(0,0,0,1)",
      "fillOpacity":1
    }
  }
];

/***
* HordesDataViewModel()
* knockoutjs view model
*/
var HordesDataViewModel = function(tmpData,tmpStories){
  var self = this;
  self.current_agency       = ko.observable(tmpData[_CUR_NEWS_SRC_].agency);
  self.current_name         = ko.observable(tmpData[_CUR_NEWS_SRC_].name);
  self.current_slogan       = ko.observable(tmpData[_CUR_NEWS_SRC_].slogan);
  self.current_website      = ko.observable(tmpData[_CUR_NEWS_SRC_].website);
  self.current_icon         = ko.observable(tmpData[_CUR_NEWS_SRC_].icon);
  self.current_rating       = ko.observable(tmpData[_CUR_NEWS_SRC_].rating);
  self.current_owner        = ko.observable(tmpData[_CUR_NEWS_SRC_].owner);
  self.current_headline     = ko.observable("");
  self.current_description  = ko.observable("");
  self.current_summary      = ko.observable("");
  self.current_url          = ko.observable("https://story-source.com/story-item.html");
  self.current_image        = ko.observable("");
  self.current_author       = ko.observable("");
  self.current_media        = ko.observable("");
  self.current_pubdate      = ko.observable("");
  self.agency_url           = ko.observable(tmpData[_CUR_NEWS_SRC_].feeds[0].url);
  self.agency_lat           = ko.observable(tmpData[_CUR_NEWS_SRC_].latitude);
  self.agency_lon           = ko.observable(tmpData[_CUR_NEWS_SRC_].longitude);
  self.data_store           = ko.observableArray(tmpData);
  self.current_stories      = ko.observableArray(tmpStories);
  self.timelineEvents       = ko.observableArray(TIMELINE);
  self.hordeAlerts          = ko.observableArray(HORDE_ALERTS);

  var atu                   = tmpData[0].airtime["url"];
  self.agency_air_date      = ko.observable( atu.replace("_YYYY_MMDD_",moment().format("YYYY[-]MMDD")) );

  // console.log(self.data_store());
  // console.log(self.current_stories());

  setMap(self.data_store());//self.agency_lat(),self.agency_lon(),self.current_agency(),self.current_slogan());

  self.playAudio=function(){
    audioEngine(this.agency_air_date())
  };

  self.rssLink = function(){
      openLink(self.agency_url())
  };

  self.openWebsite=function(){
    //var sourceWebsiteWin = window.open(self.current_website(),"sourceWebsiteWin","toolbars");
    openLink(self.current_website())
  };

  self.storyItemClick = function(){
    //hordesLog(this);
    self.current_agency(this.srcName);
    self.current_headline(this.title);
    // self.current_description(summarizeString(this.description,1000));
    self.current_description(this.description);
    self.current_summary(this.summary);
    self.current_url(this.link);
    self.current_image(this.image);
    self.current_author(this.author);
    self.current_media(this.media);
    self.current_pubdate(this.pubdate);
    current_strory_url = self.current_url()
    //console.log("link: "+self.current_url());
    showStoryDetail();
  };

  self.updateStories = function(nodeObj){
    self.current_stories().push(nodeObj);
  };
};

/***
* grabMetaUrl()
*
*/
var grabMetaUrl=function(){
   //var media = $item.find('media\\:content, content').attr('url'):
}

/***
* harvestMeta()
*
*/
var harvestMeta=function(){
  //metaCollection = document.getElementsByTagName('meta');
  for (i=0;i<metaCollection.length;i++) {
    nameAttribute = metaCollection[i].name.search(/keywords/);
    if (nameAttribute!= -1) {
      alert(metaCollection[i].content);
    }
  }
}

/***
* hordeQuakes()
*
*/
var hordeQuakes = function(){
  var sensors = [
    {
      "name":"USGS",
      "src":"http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.atom"
    }
  ];
}

/***
* clock()
*
*/
var clock = function(){
  today = moment().format('dddd');
  localTime = moment().format('LT');
  localTimeSeconds = moment().format('LTS');
};

var openStory = function(u){
  openLink(current_strory_url)
}

/***
* updateClockUI()
*
*/
var updateClockUI = function(){
  $("#clock").html(today+" "+localTimeSeconds);
};

/***
* closeAudio()
*
*/
var closeAudio = function(){
  isPlaying=true;
  audioEngine();
  $("#hordesAudioContainer").hide("slow");
};

/***
* audioEngine(url)
*
*/
var audioEngine = function(url){
  if(isPlaying===true){
    isPlaying=false;
    audio.pause();
    //$("#hordesAudioContainer").hide("slow");
  }else{
    isPlaying=true;
    audio.src = url;//<-- catch errors?
    audio.play();
    $("#hordesAudioContainer").show("slow");
  }
  // var frequencyData = new Uint8Array(analyser.frequencyBinCount);
  // function renderFrame() {
  //    requestAnimationFrame(renderFrame);
  //    analyser.getByteFrequencyData(frequencyData);
  //    drawFreq(frequencyData,1)
  // }
  // if(useVisualizationBar===true){
  //   visualizationBar.show();
  //   renderFrame();
  // }
};

/***
* summarizeString()
* allow only max string length characters
*/
var summarizeString = function(str,max_str_length){
  if(str.length>max_str_length){
    str = str.substring(0,max_str_length)+"...";
  }
  return str;
};


/***
* hordeDetail()
* show detail on horde item click
*/
var hordeDetail = function(n){
  $('.horde-detail .description').html(n);
  $('.horde-detail').show('slow');
  $('.horde-detail .close').on('click',function(){
    $('.horde-detail').hide('slow');
  });
};

/***
* horde()
* get all stories from all sources
*/
var horde = function(){
  hordesLog('<div class="hording">');
  hordesLog("hording all agencies. please wait...");
  HORDE=[];
  //cycle nodes
  hordeLoaded=0;
  hordeTotal=hordesDataVM.data_store().length;
  HORDE_TOPS=[];
  initHordeMonitor();
  for(var a = 0;a<hordesDataVM.data_store().length;a++){
    //cycle node news sources
    for(var b = 0;b<hordesDataVM.data_store()[a].feeds.length;b++){
      var fname = hordesDataVM.data_store()[a].name;
      var furl = hordesDataVM.data_store()[a].feeds[b].url;
      hordesLog("fetching "+fname+"<br/>"+furl);
      var jqxhr = $.ajax({
        method: "POST",
        url:  CENTRAL_SERVICES+'/getNews.php',
        dataType: "json",
        data: { src: furl,agency:a}
      })
        .done(function(x) {
          //console.log(x.url)

          if(hordeLoaded>=hordesDataVM.data_store().length-1){
            hordeComplete=true;
          }
          //console.log("parsing "+hordesDataVM.data_store()[x.agency].name)
          parseHorde(x)
        })
        .fail(function(error) {
          hordesLog(error)

        })
        .always(function() {

        });
      jqxhr.always(function() {
        hordeLoaded++;
      });
      //return true;
    }
  }
hordesLog('</div>');

};

/***
* parseHorde()
* format horded sources
*/
var parseHorde=function(x){
  // HORDE.push(x)
  //////////////////////////////////
  xmlDoc = $.parseXML( x.feed );
  $xml = $( xmlDoc );
  $items = $xml.find( "item" );
  $t = $xml.find( "title" );
  $srcURL = x.url;
  if($items.length<=0){
    hordesLog("<div class='horde-item-error'>"+$t[0].textContent+"<br/>"+$srcURL+"<br/>Improperly formatted feed. Please contact agency to report.\n\rSpecifically there are no items returned for the feed.\n\r Alternatively, remove this agency from the hordes_sources.json configuration file.</div>")
  }else{
    var itemString="";
    var HORDE_OBJ;

    //hordesLog("^^^<br/>"+$t[0].textContent+"<br/>"+$srcURL+"<br/>")
    function strip_base(str){
      str=str.replace(/'/g,'*');
      str=str.replace(/"/g,'**');
      str=str.replace(/&quot;/g,'**');
      str=str.replace(/‘/g,'*');
      str=str.replace(/’/g,'*');
      str=str.replace(/“/g,'**');
      str=str.replace(/”/g,'**');
      str=str.replace(/>/g,' ');

      return str;
    }

    for (var i = 0; i < $items.length; i++) {
      var item_link,item_title,item_description,item_image,item_author,item_country;

      // hordeTotal=hordesDataVM.data_store().length;
      // for(var a = 0;a<hordesDataVM.data_store().length;a++){
      //   console.log(hordesDataVM.data_store()[a].feeds[0].url)
      //   console.log($items[i].getElementsByTagName("link")[0].textContent)
      //   // if($items[i].getElementsByTagName("link")[0].textContent == hordesDataVM.data_store()[a].feeds[0].url){
      //   //   item_country = hordesDataVM.data_store()[a].country;
      //   //   break;
      //   // }
      // }

      
      //console.log(item_country)
      
      //title
      if($items[i].getElementsByTagName("title")[0]){
        item_title = $items[i].getElementsByTagName("title")[0].textContent;
      }else{
        item_title = "-- no-title --"
      }
      
      //description
      if($items[i].getElementsByTagName("description")[0]){
        item_description = $items[i].getElementsByTagName("description")[0].textContent;
      }else{
        item_description = "-- no-description --"
      }
      
      //link
      if($items[i].getElementsByTagName("link")[0]){
        item_link = $items[i].getElementsByTagName("link")[0].textContent;
      }else{
        item_link = "-- no-link --"
      }
      
      //image
      if($items[i].getElementsByTagName("image")[0]){
        item_image = $items[i].getElementsByTagName("image")[0].textContent;
      }else{
        item_image = "-- no-image --"
      }
      
      //author
      if($items[i].getElementsByTagName("author")[0]){
        item_author = $items[i].getElementsByTagName("author")[0].textContent;
      }else{
        item_author = "-- no-author --"
      }
      
      //media
      if($items[i].getElementsByTagName("media")[0]){
        item_media = $items[i].getElementsByTagName("media")[0].innerHTML;
      }else{
        item_media = "-- no-media --"
      }

      //pubdate
      if($items[i].getElementsByTagName("pubDate")[0]){
        item_pubdate = $items[i].getElementsByTagName("pubDate")[0].innerHTML;
      }else{
        item_pubdate = "-- no-pubdate --"
      }
      item_title = strip_base(item_title);
      //item_description = encodeURI(item_description);//stripHTML(item_description);

      var kws = searchKeywords($items[i].getElementsByTagName("title")[0].textContent);
      
      if(kws!=false){
        itemString += "<a href='#' class='horde-link'><span class='containsKeyword'>"+$items[i].getElementsByTagName("title")[0].textContent+"</span></a>,";
      }else{
        itemString += "<a href='#' class='horde-link'>"+$items[i].getElementsByTagName("title")[0].textContent+"</a>,";
      }


      //find agency
      var agencyName="";
      for(var a = 0;a<hordesDataVM.data_store().length;a++){
        if(a==x.agency){
          agencyName = hordesDataVM.data_store()[a].name;
          agencyLat = hordesDataVM.data_store()[a].latitude;
          agencyLon = hordesDataVM.data_store()[a].longitude;
          agencyIcon = hordesDataVM.data_store()[a].icon;
          break;
        }
      }

      HORDE_OBJ = {
        "agencyName":agencyName,
        "agencyLat":agencyLat,
        "agencyLon":agencyLon,
        "agencyIcon":agencyIcon,
        // "srcUrl":$srcURL.url.toString(),
        "title":item_title.toString(),
        "pubdate":item_pubdate.toString(),
        "author":item_author.toString(),
        "hasKeyword":kws,
        "link":item_link.toString(),
        "image":item_image.toString(),
        "media":item_media.toString(),
        "description":item_description.toString()
      }
      HORDE.push(HORDE_OBJ);
      //grab 1st story per source
      if(i===0){
        HORDE_TOPS.push(HORDE_OBJ)
      }

    }
    //}
    //var flag = '<span class="absolute-right flag-icon flag-icon-'+item_country.toLowerCase()+'"></span>';

    var hordeItem = "<div class='horde-item__wrapper'>"+
                      "<div class='horde-item' data-description='"+item_description.toString()+"'>"+
                      $t[0].textContent+
                      "<br/>"+
                      $srcURL+
                      "<br/>"+
                      itemString+
                      ">>>"+
                      "</div>"+
                    "</div>";

    hordesLog(hordeItem);
    $('.horde-link').on('click',function(){

      hordeDetail($(this).data('description'));
    });

  }
  // hordeItemCloud();
  //////////////////////////////////

}

/***
* hordeTops()
* parse the first stories of each source.
*/
var hordeTops=function(mode){
  if(!mode){
    mode = 'log'
  }
  var hordeTopsJSON;
  var hordeItemProps;
  var html = '';
  for(var a=0;a<HORDE_TOPS.length-1;a++){
    if(mode=='log'){
      console.log(HORDE_TOPS[a])
    }else if (mode=="json"){
      //$.each(HORDE_TOPS[a], function(i, product) { // Each product
      var abd = a;
      html+='<div class="horde-item">['+abd+']'
            $.each(HORDE_TOPS[a], function(propName, propVal) { // Each property
                  if(abd<10){
                     abd = "0"+a;
                   }
                  html += String(propName) + ':<br/>' + (String(propVal)) + '<br/>';
            });
      html+='</div>';
      //});
      //hordesLog(html);
    }
  }
  hordeItemCloud(html)
  //console.log(title)
  // console.log(HORDE_TOPS);
}

/***
* hordeItemCloud()
* word cloud type UI for articles with goal of being able to drag and click to read articles. 
*/
var hordeItemCloud = function(html){
  hordesConsoleBody.html(html);
  var scale = Math.random()*99999;
  d3.selectAll(".horde-item").transition()
    .duration(750)
    .delay(function(d, i) { return i * 10; })
    .attr("height", function(d) { return Math.sqrt(d * scale); });
  // $.each($(".horde-item"), function(i, item) {
  //   //$(".horde-item")[i].css({"transform":"scale("+(i*0.01)+")"});
  // });

}

/***
* monitorHorde()
* graphic UI of hording progress
*/
var monitorHorde = function(){
  $("#hordeBar").show("slow")
  var hordePercent = Math.round((hordeLoaded/hordeTotal)*100);
  $("#horded").html(hordeLoaded+"/"+hordeTotal+"::"+hordePercent+"%");
  $("#hordeBarInner").css({"width":hordePercent+"%"});
  if(hordeComplete===true || hordeMonitorCount>=hordeMonitorTimeout){
    clearInterval(hordeMonitor)
    hordeComplete=true;
    //hordeTops("json");
    $("#hordeBar").hide("slow");
    //$("#horded").html("");
    if(hordeLoaded!=hordeTotal){
      $("#horded").append(" COMPETE with "+(hordeTotal-hordeLoaded)+" errors!");
    }else{
      $("#horded").append(" COMPETE!");
    }

  }else{
    hordeMonitorCount++;
  }
};

/***
* initHordeMonitor()
* reset and start horde monitor
*/
var initHordeMonitor=function(){
  hordeComplete=false;
  hordeLoaded=0;
  hordeMonitorCount=0;
  hordeMonitor = setInterval(monitorHorde,1000);
};

/***
* searchKeywords()
* search keyword list for match
*/
var searchKeywords=function(str){
  var keywordIs=false;

  for(var a=0;a<keywordList.length;a++){
    var kw = keywordList[a].toLowerCase();
    var sl = str.toLowerCase();
    if (sl.indexOf(kw)!= -1) {
      keywordIs = kw;
      break;
    }
  }
  return keywordIs;
};

/***
* fetchStories()
* get stories for active source
*/
var fetchStories = function(srcObj){
    $(".side-panel__loading").show();
    tmpStories = [];
    if(appIsBound) hordesDataVM.current_stories([])
    // console.log("FETCHING STORIES...");
    // console.log(srcObj);
    var src_url = encodeURI(srcObj.url);
    // var fname = hordesDataVM.data_store()[a].name;
    // var furl = hordesDataVM.data_store()[a].feeds[b].url;

    var jqxhr = $.ajax({
      method: "POST",
      url:  CENTRAL_SERVICES+'/getNews.php',
      data: { src: src_url}
    })
      .done(function(x) {
        sourcesLoaded++;
        xmlDoc = $.parseXML( x );

        // if(jQuery.type(xmlDoc)=="object"){
        //
        // }
        $xml = $( xmlDoc );
        console.log($xml);
        $items = $xml.find( "item" );
        if($items.length<=0){
          $items = $xml.find( "entry" );
        }
        //__--__--__--__--__--__--__--__--__--__--__--__--_
        // ENFORCE <ITEM> NODE TO AVOID FORMAT DIFFS
        //--__--__--__--__--__--__--__--__--__--__--__--__-
        if($items.length<=0){
          //hordesLog(x)
          hordesLog("Improperly formatted feed. Please contact agency to report.\n\rSpecifically there are no items returned for the feed.\n\r Alternatively, remove this agency from hordes configuration file.")
        }else{
          function strip_base(str){
            str=str.replace(/'/g,'*');
            str=str.replace(/"/g,'**');
            str=str.replace(/&quot;/g,'**');
            str=str.replace(/’/g,'*');
            str=str.replace(/‘/g,'*');
            str=str.replace(/’/g,'*');
            str=str.replace(/’/g,'*');
            str=str.replace(/“/g,'**');
            str=str.replace(/”/g,'**');
            str=str.replace(/>/g,' ');
            return str;
          }
          var nodeObj;
          // console.log($items);
          for (var i = 0; i < $items.length; i++) {
            var item_link,item_title,item_description,item_image,item_author;

            if($items[i].getElementsByTagName("title")[0]){
              item_title = $items[i].getElementsByTagName("title")[0].textContent;
            }else{
              item_title = "-- no-title --"
            }

            if($items[i].getElementsByTagName("description")[0]){
              item_description = $items[i].getElementsByTagName("description")[0].textContent;
            }else{
              item_description = "-- no-description --"
            }

            if($items[i].getElementsByTagName("summary")[0]){
              item_summary = $items[i].getElementsByTagName("summary")[0].textContent;
            }else{
              item_summary = "-- no-summary --"
            }

            if($items[i].getElementsByTagName("link")[0]){
              item_link = $items[i].getElementsByTagName("link")[0].textContent;
            }else{
              item_link = "-- no-link --"
            }

            if($items[i].getElementsByTagName("image")[0]){
              item_image = $items[i].getElementsByTagName("image")[0].textContent;
            }else{
              item_image = "-- no-image --"
            }

            if($items[i].getElementsByTagName("author")[0]){
              item_author = $items[i].getElementsByTagName("author")[0].textContent;
            }else{
              item_author = "-- no-author --"
            }

            if($items[i].getElementsByTagName("media")[0]){
              item_media = $items[i].getElementsByTagName("media")[0].innerHTML;
            }else{
              item_media = "-- no-media --"
            }

            if($items[i].getElementsByTagName("pubDate")[0]){
              item_pubdate = $items[i].getElementsByTagName("pubDate")[0].innerHTML;
            }else{
              item_pubdate = "-- no-pubdate --"
            }


            //console.log("image: "+item_image);
            // if(!item_title) item_title="-- no-title --";
            // if(!item_link) item_link="-- no-link --";
            // if(!item_description) item_description="-- no-description --";

            item_title = strip_base(item_title);
            item_description = item_description;//stripHTML(item_description);
            nodeObj = {
              "srcName":srcObj.name.toString(),
              "srcUrl":srcObj.url.toString(),
              "title":item_title.toString(),
              "author":item_author.toString(),
              "link":item_link.toString(),
              "description":item_description.toString(),
              "summary":item_summary.toString(),
              "image":item_image.toString(),
              "media":item_media.toString(),
              "pubdate":item_pubdate.toString()
            }
            tmpStories.push(nodeObj);
          }
        }
        if(!appIsBound){
          appIsBound = true;
          hordesDataVM = new HordesDataViewModel(tmpData,tmpStories);
          ko.applyBindings(hordesDataVM);
        }else{
          //console.log(tmpStories)
          hordesDataVM.current_stories(tmpStories)
        }
        $(".side-panel__loading").hide();
      })
      .fail(function(error) {
        hordesLog(error)
      })
      .always(function() {});
    jqxhr.always(function() {});
    return true;
};

/***
* showStoryDetail()
* show the selected story
*/
var showStoryDetail = function(){
  if(hordesDataVM.current_image()!="" && hordesDataVM.current_image()!="-- no-image --"){
    $("#storyItemImage").show()
  }else{
    $("#storyItemImage").hide()
  }
  storyDetail.show("slow");
  detailItem.show("slow");
};

/***
* hideStoryDetail()
* hide the story detail UI
*/
var hideStoryDetail = function(){
  detailItem.hide("slow");
  storyDetail.hide("slow");
};

/***
* refreshFeed()
* reload active sources stories
*/
var refreshFeed = function(){
  var nodeName = hordesDataVM.data_store()[_CUR_NEWS_SRC_].name;
  hordesDataVM.current_agency(hordesDataVM.data_store()[_CUR_NEWS_SRC_].agency);
  hordesDataVM.current_name  (hordesDataVM.data_store()[_CUR_NEWS_SRC_].name);
  hordesDataVM.current_slogan(hordesDataVM.data_store()[_CUR_NEWS_SRC_].slogan);
  hordesDataVM.current_website(hordesDataVM.data_store()[_CUR_NEWS_SRC_].website);
  hordesDataVM.current_rating(hordesDataVM.data_store()[_CUR_NEWS_SRC_].rating);
  hordesDataVM.current_owner(hordesDataVM.data_store()[_CUR_NEWS_SRC_].owner);

  hordesDataVM.current_headline("Story Headline");
  hordesDataVM.current_description("Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.");
  hordesDataVM.current_url("https://story-source.com/story-item.html");
  hordesDataVM.agency_url(hordesDataVM.data_store()[_CUR_NEWS_SRC_].feeds[0].url);
  hordesDataVM.agency_lat(hordesDataVM.data_store()[_CUR_NEWS_SRC_].latitude);
  hordesDataVM.agency_lon(hordesDataVM.data_store()[_CUR_NEWS_SRC_].longitude);
  hordesDataVM.current_icon(hordesDataVM.data_store()[_CUR_NEWS_SRC_].icon);

  if(hordesDataVM.data_store()[_CUR_NEWS_SRC_].airtime){
    $(".audio-btn").show();
    var atu = hordesDataVM.data_store()[_CUR_NEWS_SRC_].airtime["url"];
    var atd = hordesDataVM.data_store()[_CUR_NEWS_SRC_].airtime["localTimeSeconds"];
    if(atd!="247"){
        hordesDataVM.agency_air_date(atu.replace("_YYYY_MMDD_",moment().format("YYYY[-]MMDD")) );
    }else{
      hordesDataVM.agency_air_date(atu);
    }
  }else{
    $(".audio-btn").hide();
  }
  fetchStories(hordesDataVM.data_store()[_CUR_NEWS_SRC_].feeds[0])
};

/***
* getHordesSources()
* load hordes sources
*/
var getHordesSources = function(){
  // $.getJSON( "./hordes_sources.json", function( data,success ) {
  //var HOMEDIR = app.getPath("Home");///Users/Q
  $.getJSON( userHome+"/hordes/hordes_sources.json", function( data,success ) {
    tmpData = data;
    initKO(data);
  });
};

/***
* loadNode()
* load active sources stories. this should be combined with refreshFeed()
*/
var loadNode = function(e){
    // HIDE & STOP AUDIO
    // isPlaying=true;
    // audioEngine();

    hordesMap.closePopup();
    var nodeName = $(e).data("name");
    for(var a=0;a<hordesDataVM.data_store().length;a++){
      if(hordesDataVM.data_store()[a].name===nodeName){
        _CUR_NEWS_SRC_ = a;
        hordesDataVM.current_agency(hordesDataVM.data_store()[_CUR_NEWS_SRC_].agency);
        hordesDataVM.current_name  (hordesDataVM.data_store()[_CUR_NEWS_SRC_].name);
        hordesDataVM.current_slogan(hordesDataVM.data_store()[_CUR_NEWS_SRC_].slogan);
        hordesDataVM.current_website(hordesDataVM.data_store()[_CUR_NEWS_SRC_].website);
        hordesDataVM.current_rating(hordesDataVM.data_store()[_CUR_NEWS_SRC_].rating);
        hordesDataVM.current_owner(hordesDataVM.data_store()[_CUR_NEWS_SRC_].owner);

        hordesDataVM.current_headline("Story Headline");
        hordesDataVM.current_description("Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.");
        hordesDataVM.current_url("https://story-source.com/story-item.html");
        hordesDataVM.agency_url(hordesDataVM.data_store()[_CUR_NEWS_SRC_].feeds[0].url);
        hordesDataVM.agency_lat(hordesDataVM.data_store()[_CUR_NEWS_SRC_].latitude);
        hordesDataVM.agency_lon(hordesDataVM.data_store()[_CUR_NEWS_SRC_].longitude);
        hordesDataVM.current_icon(hordesDataVM.data_store()[_CUR_NEWS_SRC_].icon);

        if(hordesDataVM.data_store()[_CUR_NEWS_SRC_].airtime){
          $(".audio-btn").show();
          var atu = hordesDataVM.data_store()[_CUR_NEWS_SRC_].airtime["url"];
          var atd = hordesDataVM.data_store()[_CUR_NEWS_SRC_].airtime["localTimeSeconds"];
          if(atd!="247"){
              hordesDataVM.agency_air_date(atu.replace("_YYYY_MMDD_",moment().format("YYYY[-]MMDD")) );
          }else{
            hordesDataVM.agency_air_date(atu);
          }
        }else{
          $(".audio-btn").hide();
        }
        fetchStories(hordesDataVM.data_store()[_CUR_NEWS_SRC_].feeds[0])
        break;
      }
    }
    drawAgencyRelations(searchAgencySiblings())

};

/***
* drawAgencyRelations()
* draw line from current lat/lon to sibling lat/lon
*/
var drawAgencyRelations=function(current_siblings){
  if(current_siblings[1].agency){
    if(current_siblings[1].agency.length>-1){
      hordesLog("clear");
      for(var a=0;a<current_siblings.length;a++){
        if(current_siblings[a].agency!=hordesDataVM.current_agency()){
          hordesLog(current_siblings[a].agency);
        }
      }
      hordesLog("Sibling Agencies Found");
    }
  }else{
    hordesLog("clear")
    hordesLog("No Sibling Agencies Found");
  }

};

/***
* searchAgencySiblings()
* check if the owner of current source matches other sources owners
*/
var searchAgencySiblings=function(){
  var result;
  var current_siblings = [];
  for(var a=0;a<hordesDataVM.data_store().length;a++){
    if(hordesDataVM.data_store()[a].owner==hordesDataVM.current_owner() && hordesDataVM.current_owner()!=""){
      var sibling_obj = {
        "agency":hordesDataVM.data_store()[a].agency,
        "owner":hordesDataVM.data_store()[a].owner,
        "lat":hordesDataVM.data_store()[a].latitude,
        "lon":hordesDataVM.data_store()[a].longitude
      }
      current_siblings.push(sibling_obj);
    }
  }
  if(current_siblings.length>1){
    result = current_siblings;
  }else{
    result = "no siblings were found";
  }
  return result;
};

/***
* searchTvArchives(q)
* search archive.org tv archives
*/
var searchTvArchives=function(q){
  var query = "https://archive.org/details/tv?q="+q;
  //if not archive.org API call hordes.info as bridge
  //if result
    //store result in obj
  //else if error
    //show error
  //else
    //show no result
};

/***
* saveNotes()
* save current notes to file
*/
var saveNotes = function(){
  var now = new Date();
  execSync("touch "+userHome+"/hordes/notes/"+now+".txt");
};

/***
* plotNodes(nodes)
* place markers on map and bind popups per source
*/
var plotNodes = function(nodes){
  for(var a=0;a<nodes.length;a++){
    //console.log(nodes[a]);
    var lat           = nodes[a].latitude;
    var lon           = nodes[a].longitude;
    var name          = nodes[a].name;
    var slogan        = nodes[a].slogan;
    var type          = nodes[a].type;
    var description   = nodes[a].description;
    var owner         = nodes[a].owner;
    var icon          = nodes[a].icon;
    var rating        = nodes[a].rating;
    // self.current_rating       = ko.observable(tmpData[_CUR_NEWS_SRC_].rating);
    var borderTheme   = node_themes[0][type].color;
    var fillTheme     = node_themes[0][type].fillColor;
    var opacityTheme  = node_themes[0][type].fillOpacity;
    var circle_radius = 5;
    var sourceIcon = L.icon({
      iconUrl: icon,

      iconSize:     [30, 30], // size of the icon
      // shadowSize:   [50, 64], // size of the shadow
      iconAnchor:   [22, 22], // point of the icon which will correspond to marker's location
      // shadowAnchor: [4, 62],  // the same for the shadow
      popupAnchor:  [-3, -3] // point from which the popup should open relative to the iconAnchor
    });

    var circle = L.circleMarker([lat, lon], {
        radius: circle_radius,
        color: borderTheme,
        fillColor: fillTheme,
        fillOpacity: opacityTheme
    });
    // var circle = L.marker([lat, lon], {icon: sourceIcon});
    hordesMap.addLayer(circle);

    circle.bindPopup("\
      <b class='text-yellow'>"+name+"</b> <span class='glyphicon glyphicon-star text-yellow'></span><b class='text-yellow'>"+rating+"</b><br/>\
      <span class='text-cream'>"+slogan+"</span><br/>\
      <span class='text-grey__light'>"+description+"</span><br/>\
      <span class='text-grey__light owner'>"+owner+"</span><br/>\
      <span class='text-grey__light lat'>"+lat+"</span>,<span class='text-grey__light lon'>"+lon+"</span><br/>\
      <br/>\
      <span class='pointer btn-dotted__yellow text-yellow' onclick='loadNode(this)' data-name='"+name+"'>load data</span>\
      <br/>\
    ");
    circle.on('click', function (e) {
        this.openPopup();
    });
    circle.on('mouseover', function (e) {
        //this.openPopup();


        // relationalArc = L.Polyline.Arc([e.latlng.lat, e.latlng.lng], [67.50000, 64.03333], {
        //    color: 'red',
        //    width:1,
        // }).addTo(hordesMap);
        this.setRadius(10);
    });
    circle.on('mouseout', function (e) {
        //hordesMap.removeLayer(relationalArc)
        // this.closePopup();
        this.setRadius(circle_radius);
    });

  }
var relationalArc;
  /***
  * arc common owners
  *
  */
  //cycle through nodes on map
    //check owner


  // $.each($('owner'),function(){
  //   var polyline = L.polyline(latlngs, {color: 'red'}).addTo(map);
  // });
};



/***
* showSysMessage()
* message dialogue
*/
var showSysMessage = function(){
    dialog.showMessageBox({
      type:'info',
      buttons:['Ok'],
      defaultId:0,
      title:'hordes',
      message:'O',
      detail:'hai',
      icon:'',
      cancelId:0,
      noLink:true
    });
};

/***
* openLink()
* open url in default browser
*/
var openLink = function(url){
  execSync('open '+url);
};

/***
* showSysError()
* error dialogue
*/
var showSysError = function(){
  var title="";
  var content=_APP_DIALOGS_[0];
  dialog.showErrorBox(title, content)
};

/***
* showSysAlert()
* alert dialogue
*/
var showSysAlert = function(){
  var title="";
  var content=_APP_DIALOGS_[0];
  dialog.showErrorBox(title, content);
};


/***
* geolocate()
*
*/
var geolocate=function(data_store){//lat,lon,srcName,srcSlogan){

};

/***
* setMap()
* draw map
*/
var setMap=function(data_store){//lat,lon,srcName,srcSlogan){

  hordesMap                 = L.map('mapFrame').setView([0, 0], 2);
  hordesMap.options.maxZoom = 18;
  hordesMap.options.minZoom = 2;

  hordesMap.on('zoomend', function() {

  });

  //add tiles
  L.tileLayer(mapboxAcct+"/"+mapTheme[current_map_theme].key+'/tiles/256/{z}/{x}/{y}?access_token='+mapboxToken, {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 18,
      id: mapboxId,
      accessToken: mapboxToken
  }).addTo(hordesMap);

  // L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  //   maxZoom: 18, 
  //   attribution: '[insert correct attribution here!]' }).addTo(hordesMap);
  
  // var clouds = L.OWM.clouds({showLegend: false, opacity: 0.5});
  // var overlayMaps = { "Clouds": clouds};
  // var layerControl = L.control.layers(overlayMaps).addTo(map);

  // console.log(data_store)
  plotNodes(data_store);
  // var greenIcon = L.icon({
  //     iconUrl: './assets/leaf-green.png',
  //     shadowUrl: './assets/leaf-shadow.png',
  //
  //     iconSize:     [38, 95], // size of the icon
  //     shadowSize:   [50, 64], // size of the shadow
  //     iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
  //     shadowAnchor: [4, 62],  // the same for the shadow
  //     popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
  // });

  // var marker = L.marker([lat, lon]).addTo(hordesMap);
  // L.marker([lat, lon]).addTo(hordesMap)
  // 		.bindPopup("<b class='text-yellow'>"+srcName+"</b><br/>"+srcSlogan+"").openPopup();

  //add circles per news sources
  // var circle = L.circle([lat, lon], 30, {
  //     color: 'rgba(100,180,100,0.5)',
  //     fillColor: 'rgba(0,100,0,0.5)',
  //     fillOpacity: 0.5
  // }).addTo(hordesMap).bindPopup("<b class='text-yellow'>"+srcName+"</b><br/>"+srcSlogan+"");

  // var polygon = L.polygon([
  //     [51.509, -0.08],
  //     [51.503, -0.06],
  //     [51.51, -0.047]
  // ]).addTo(hordesMap);
  new L.Control.GeoSearch({
      provider: new L.GeoSearch.Provider.OpenStreetMap(),
      showMarker: false,
      retainZoomLevel: false
  }).addTo(hordesMap);

};

/***
* getPageText()
* grab just the text from a story. why use python?
*/
var getPageText = function(){
  hordesDataVM.current_description("getting "+current_strory_url+"...")
  var _LISTENER_SCRIPT_ = "./py/hordes.getPageText.py"
  var child = spawn('python', [_LISTENER_SCRIPT_,current_strory_url]);
  var dataString="";
  child.stdout.on('data', function (data) {
    dataString = String(data);
  });
  //
  child.stdout.on('error', function (error) {
    hordesLog("Error: " + error);
  });
  //
  child.on('exit', function (exitCode) {
    if(dataString.length<10){
      hordesDataVM.current_description("There was an issue grabbing the text on this page. This is probably due to a redirect. Working on it :-/")
    }else{
      hordesDataVM.current_description(dataString)
      hordesLog(dataString)
    }
  });
}

/***
* showNotebook()
* show notebook UI
*/
var showNotebook=function(){
  $("#notebook").show("slow");
};

/***
* hideNotebook()
* hide notebook UI
*/
var hideNotebook=function(){
  $("#notebook").hide("slow");
};

/***
* toggleNotebook()
* toggle notebook UI
*/
var toggleNotebook=function(){
  $("#notebook").toggle("slow");
};

/***
* countWords()
* count the words in a string
*/
var countWords = function(str){
  wordCounts = { };
  var words = str.split(/\b/);

  for(var i = 0; i < words.length; i++){
    wordCounts["_" + words[i]] = (wordCounts["_" + words[i]] || 0) + 1;
  }

  return wordCounts;
};

/***
* topTenWords()
* find the top ten words. this will obv need exclusions in the logic.
*/
var topTenWords = function(){

};

/***
* initKO()
* initialize knockoutjs
*/
var initKO=function(data_store){
  //initialize story data
  fetchStories(data_store[_CUR_NEWS_SRC_].feeds[0]);
  if(!appIsBound){
    appIsBound = true;
    hordesDataVM = new HordesDataViewModel(tmpData,tmpStories);
    ko.applyBindings(hordesDataVM);
  }else{
    //console.log(tmpStories)
    hordesDataVM.current_stories(tmpStories)
  }
  doSizing();
  initEvents();
  //$(".side-viewport").hide()
  hordesConsole.removeClass('open');
  // var consoleWidth = $(window).width()-333;
  // console.log(consoleWidth)
  // $("#hordesConsole").css({'width':consoleWidth+'px'});
  $("#splash").addClass("closed");
  //horde();
  //$("#splash").hide("slow");
};

/***
* resizeMap()
* make map fill area.
*/
var resizeMap = function(){
  var dragHeight = $("drag-region").height();
  var mh = $(window).height()-(dragHeight);
  $("#mapFrame").css({"height":mh})
};

/***
* resizeSidebar()
* make sidebar fill area
*/
var resizeSidebar = function(){
  var dragHeight = $("drag-region").height();
  // var headerHeight = $('.side-panel__header--info_foot_bs').height()+40;
  var mh = $(window).height()-((dragHeight)+100);
  $("#sidePanelBody").css({"height":mh})
};

var resizeConsole = function(){
  var consoleWidth = $(window).width();
  $("#hordesConsole").css({'width':consoleWidth+'px'});
};

/***
* loadSettings()
* load saved settings
*/
var loadSettings=function(){
  //var $div = $('<div>');
  //console.log("Loading Settings...");
  $(this).load(userHome+'/hordes/hordes_settings.txt', function(d){
      // now $(this) contains #somediv
      var data = d;
      var settings = data.split(',');
      var settings_theme = settings[0];
      var settings_font = settings[1];
      var settings_map = settings[2];
      current_map_theme = Number(settings_map);
      // Save data to sessionStorage
      sessionStorage.setItem('current_map_theme', current_map_theme);


      //mapTheme[current_map_theme]
      setTheme(settings_theme)
      getHordesSources();
      //console.log(d);
  });
  // $.get(userHome+'/hordes/hordes_settings.txt',function(data,success){
  //   console.log(data);
  //   var settings = data.split(',');
  //   var settings_theme = settings[0];
  //   var settings_font = settings[1];
  //   setTheme(settings_theme)
  // },'txt');
  //execSync('touch '+userHome+'/hordes/hordes_settings.txt');
  //execSync("echo '"+current_theme+","+current_font+"' >"+userHome+"/hordes/hordes_settings.txt");
};

/***
* doSizing()
* size UI to fill areas
*/
var doSizing=function(){
  resizeMap();
  resizeSidebar();
  // resizeConsole();
};

/***
* hordesLog()
* log to console UI
*/
var hordesLog = function(msg){
  // if(msg.indexOf("*clr*")>-1){
  //   var mformat = msg.split("clr*")
  //   hordesConsole.append(mformat[1]+"<br/>");
  // }else{
  //   hordesConsole.prepend(msg+"<br/>");
  // }

  if(msg==="clear"){
    hordesConsoleBody.html("");
  }else{
      hordesConsoleBody.prepend(msg)//+divider);
  }


};

/***
* initEvents()
* initialize all events
*/
var initEvents = function(){
  // $('.horde-link').on('click',function(){
  //   hordeDetail()
  // });
  closeStoryDetailBtn.on("click",function(){
    hideStoryDetail();
  });

  storyItem.on("click",function(){
    showStoryDetail();
  });

  notebookBtn.on("click",function(){
    toggleNotebook();
    document.getElementById("notebookTextarea").focus();
  });

  refreshBtn.on("click",function(){
    refreshFeed();
  });

  rateBtn.on("click",function(){
    $('#myModal .modal-title').html("Source Rating");
    $('#myModal .modal-body').load("./rateSource.html");
    $('#myModal').modal();
  });

  weatherBtn.on("click",function(){
    document.location.href="./weather/index.html?noCache="+Math.round(Math.random()*999999);
  });

  printHordeBtn.on("click",function(){
    hordesLog("clear")
    // "srcName":srcObj.name.toString(),
    // "srcUrl":srcObj.url.toString(),
    // "title":item_title.toString(),
    // "author":item_author.toString(),
    // "link":item_link.toString(),
    // "description":item_description.toString(),
    // "image":item_image.toString(),
    // "media":item_media.toString(),
    // "pubdate":item_pubdate.toString()
    for(var a=0;a<HORDE.length;a++){
      hordesLog(HORDE[a].title+"<br/>"+HORDE[a].description)
    }
  });

  saveHordeBtn.on("click",function(){
    var now = new Date().getTime();

    require('./js/html2canvas.min');
    require('./js/html2canvas.svg.min');
    var jsPDF = require('./js/jspdf.debug');
    var html2pdf= require('./js/html2pdf')
    //var doc = new jsPDF();
    hordesLog("clear")
    var hordesString="";
    for(var a=0;a<HORDE.length;a++){
      hordesString += HORDE[a].title+"<br/>"+HORDE[a].link+"<br/>"+HORDE[a].description;//+"<hr class='dotted'>";
    }
    hordesConsoleBody.html(hordesString)
    document.title='horde_'+now+'.pdf';
    print(hordesConsoleBody.html())
    document.title='Hordes';

  });
  // hordesConsole.on('click',function(){
  //     if(hordesConsole.hasClass('open')){
  //       hordesConsole.removeClass('open');
  //     }else{
  //       hordesConsole.addClass('open');
  //     }
  // });

  hordeBtn.on("click",function(){
    horde()
  });
  hideConsoleBtn.on("click",function(){
    if(hordesConsole.hasClass('open')){
      hordesConsole.removeClass('open');
    }else{
      hordesConsole.addClass('open');
    }
  });
  hordesConsole.addClass('open');
}



/***
* hordeTwitter()
* integrate twitter for searching and eventually tweeting
*/
var hordeTwitter = function(){
  // today = moment().format('dddd');
  // localTime = moment().format('LT');
  // localTimeSeconds = moment().format('LTS');

};

/***
* checkSnopes()
* perform search on snopes.
*/
var checkSnopes=function(q){
  var query = "http://www.snopes.com/search/?q="+q;
  var results = $(".search-results");
  var item = $(".item");
  var text = $(".text");
  var title = $(".title");

};

/***
* checkTineye()
* perform search on tineye.
*/
var checkTineye=function(){

};


/***
* loadKeywordList()
* load keyword list
*/
var loadKeywordList = function(){
  $.get(userHome+"/hordes/keywords.txt", function(data){
      keywordList = data.split('\n');
  });
  return true;
}


/***
* resize()
* resize UI to fill areas
*/
$(window).resize(function(){
  if( window.innerHeight == screen.height) {
    $('.drag-region').hide();
    $('.app').css({"margin-top":"0px"});
    $('.leaflet-bar').css({"top":"0px"});
      // browser is fullscreen
  }else{
    $('.drag-region').show();
    $('.app').css({"margin-top":"0px"});
    $('.leaflet-bar').css({"top":"15px"});
  }
  doSizing();
});

/***
* ready()
* after everything is ready, initialize
*/
$(document).ready(function(){
  $.getJSON( userHome+"/hordes/config.json", function( data,success ) {
    config = data;
    mapboxAcct              = config[0].mapboxAcct;
    mapboxToken             = config[0].mapboxToken;
    mapboxId                = config[0].mapboxId;
    mapTheme                = config[0].mapboxThemes;
    CENTRAL_SERVICES        = config[0].centralServices;
  });

  audioSrc.connect(analyser);
  analyser.connect(ctx.destination);
  $("#hordeBar").hide()
  if(loadKeywordList()){
    loadSettings();
  }
});



