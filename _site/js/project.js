jQuery(document).ready(function(){
  var viewPortWidth = jQuery(window).width();
  var viewPortHeight = jQuery(window).height();
  var totalDocHeight = jQuery(document).height();
  var footerHeight = jQuery("#footer").height();
  console.log(totalDocHeight);
  var numSection = $('.section').length;

  // Dynamically generate anchor list
  var sectionArray = new Array(numSection);
  sectionArray.fill("page");
  sectionArray[0] = "top";
  sectionArray[1] = "brief";
  // var lastPos = jQuery("#last").offset().top;
  $('#fullpage').fullpage({
    css3: true,
    scrollBar: false,
    scrollingSpeed: 700,
    verticalCentered: false,
    responsiveWidth: 768, //was 768, 980, 840
    easing: 'easeInOutCubic',
    touchSensitivity: 15,
    fixedElements: '#height-bar, #go-to-top',
    anchors: sectionArray,
    onLeave: function(index, nextIndex, direction){
            var leavingSection = $(this);

            //after leaving section 2
            if(index == 1 && direction =='down'){
                /* make go-to-top appear fully */
                $("#go-to-top").fadeToggle( "slow", "linear" );
            }

            if(nextIndex == 1 && direction == 'up'){
              $("#go-to-top").fadeToggle( "slow", "linear" );
            }
        },
    afterLoad: function(anchorLink, index){
            var loadedSection = $(this);
            if(anchorLink == "top"){
              $("#go-to-top").css("display", "none");
            }
        }
    });

  jQuery(window).scroll(function(){
    var scrollPos = jQuery(window).scrollTop();
    console.log(scrollPos);
    var heightBarWidth = scrollPos*100/(totalDocHeight-footerHeight);
    if(heightBarWidth >= 100){
      $('#height-bar').css("width", 100 + "%");
    }
    else{
    $('#height-bar').css("width", heightBarWidth + "%");
    }
  });

});
