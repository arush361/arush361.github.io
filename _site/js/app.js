jQuery(document).ready(function(){
  var viewPortWidth = jQuery(window).width();
  var viewPortHeight = jQuery(window).height();
  var navPos = jQuery("#papa-nav").offset().top;

  jQuery(window).resize(allResizeFunctions());

  // onClick functions for the hamburger menu
  displayHamburgerMenu();

  var animateTheseClasses = ['.section-header', '.project', '.skill'];

  // Scroll to point
   $('a[href*="#"]:not([href="#"])').click(function() {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: target.offset().top - 96
        }, 1250);
        return false;
      }
    }
  });

  // This is for the typed section on the landing area
  $(".typed").typed({
        strings: [
        "I am a state level Snooker player!",
        "I speak 4 languages - English, German,Hindi ,Punjabi.",
        "My team was adjudged as North Zone Winner for Google Case Challenge in 2019.",
        /*"I also design beautiful cheat sheets. Here's a <a href='/AI.pdf' target = '_blank'>sample</a> I had done for my AI mid-term in Fall 2016.",*/
        "Worked across projects focusing on Digital Transformation/Project Management/Software Development",
        "Currently, I'm reading <a href='https://www.goodreads.com/en/book/show/39286958-measure-what-matters' target = '_blank'>Measure What Matters by John Doerr</a>.",
        "Some of the Product Managers I follow are Ben Horowitz, Nir Eyal & Scott Sehlhorst."],
        typeSpeed: 0,
        startDelay: 1000,
        backDelay: 3000,
        showCursor: true,
        loopCount: 10000,
        loop: true,
        typeSpeed: -2,
        shuffle: true
      });

  jQuery(window).scroll(function(){
    var scrollPos = jQuery(window).scrollTop();
    var logoOpacity = opacityControl((4*scrollPos)/(viewPortWidth*3));
    var introOpacity = opacityControl(1 - (scrollPos-200)*2/viewPortHeight);
    $('.logo').css({
        'opacity' : logoOpacity
    });

    if (viewPortWidth > 767){
      moveInClass('.project');
      moveInClass('.skill');
    }
    // moveInClass('.section-header');
    // Parallax for the action shot
    $('.intro').css({
      'transform' : 'translate(0px, ' + scrollPos/16 + '%)'
    });
    $('.intro').css({
      'opacity' : introOpacity
    });


    if (scrollPos >= (navPos)){
      jQuery(".nav-wrap").addClass("fixed");
    }
    else{
      jQuery(".nav-wrap").removeClass("fixed");
    }
});
  // For the Curious Carls who want to check if I'm being responsive
  jQuery(window).resize(doThisOnResize());

});
//
// function superimposeCorrect(skewedWrapper, degrees, navOffset, vw, vh){
//   // pass the div and the number of degrees it has been skewed
//   var wrapperHeight = jQuery(skewedWrapper).height();
//   console.log("Original height of " + skewedWrapper + " is " + wrapperHeight);
//   console.log("New wrapper has been pulled back up by " + navOffset);
//   // console.log(jQuery(skewedWrapper).offset().top);
//   // console.log(vw, wrapperHeight);
//   var radians= Math.abs(degrees)*Math.PI/180;
//   var skewDelta = (vw*Math.tan(radians))/2;
//   var topOffset = -skewDelta - navOffset;
//   // topOffset needs to have something to do with the viewPortWidth and viewPortHeight -
//   // that will be your mediaquery
//
//   var newHeight = wrapperHeight + 4*skewDelta + navOffset;
//   // console.log(topOffset, newHeight);
//   document.styleSheets[0].addRule(skewedWrapper + '.special:before', 'height: ' + newHeight + 'px;');
//   document.styleSheets[0].addRule(skewedWrapper + '.special:before', 'top: ' + topOffset + 'px;');
//   jQuery(skewedWrapper).toggleClass("special");
// }

function opacityControl(opacityMeasure){
  if (opacityMeasure < 1 && opacityMeasure >= 0) return opacityMeasure;
  else if (opacityMeasure > 1) return 1;
  else if (opacityMeasure < 0) return 0;
}

function displayHamburgerMenu(){
  $( ".ham-nav-link" ).click(function() {
    $('#slide-menu-toggler').trigger('click');
  });
}

function moveInClass(classToAnimate){
  var scrollPos = jQuery(window).scrollTop();
  var viewPortHeight = jQuery(window).height();
  $(classToAnimate).each(function(){
    if (scrollPos > $(this).offset().top - (14*viewPortHeight/15)){
      $(this).addClass('appear');
    }
    else {
      $(this).removeClass('appear');
    };

  });
}

function allResizeFunctions(){
  var viewPortWidth = jQuery(window).width();
  var viewPortHeight = jQuery(window).height();
}
