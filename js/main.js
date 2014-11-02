$(document).ready(function(){

  function Media(name, type, selector, embed){
    this.name = name;
    this.type = type;
    this.state = 'playing' // 'paused' || 'playing'
    this.selector = selector;
    this.$ = $(this.selector);
    return this
  };

  // Root object
  // ===========================

  var hole = {
    video: {
      teaser: new Media('teaser','video','#video')
    },

    audio: {
      background: new Media('background','audio','#bg-music')
    },

    button: {
      play: $('#play'),
      mute: $('#mute')
    },

    overlay: $('#overlay'),
    
    parallax: {
      $: $('#scene'),
      init: function(){
        this.instance = this.$.parallax();
      }
    },

    counter: {
      $: $('#counter'),
      time: {
        end: '2014/12/12',
        format: '%D:%H:%M:%S'
      },
      init: function(){
        this.$.countdown(this.time.end, function(event) {
          $(this).html(event.strftime(hole.counter.time.format));
        });
      }
    },

    description: {
      $: $('#description'),
      init: function(){
        this.instance = this.$.parallax();
      }
    }
  }

  hole.description.init();

  // Video teaser
  // ===========================

  hole.video.teaser.cachedHtml = '<iframe src="//player.vimeo.com/video/110628738?byline=0&amp;portrait=0&amp;color=ff4800&amp;autoplay=1" width="854" height="480" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';  
  hole.video.teaser.insertHtml = function() {
    this.$.html(this.cachedHtml);
    return this.$
  };
  
  hole.video.teaser.clearHtml = function() {
    this.$.html('');
    return this.$
  };
  
  hole.video.teaser.toggle = function(state) {
    // if state == 'hide', hide. Else: show video
    var div = this.$[0],
        iframe = div.getElementsByTagName('iframe')[0].contentWindow;
    div.style.display = state == 'hide' ? 'none' : '';
    func = state == 'hide' ? 'pauseVideo' : 'playVideo';
    console.log('state:',func);
    iframe.postMessage('{"event":"command","func":"' + func + '","args":""}', '*');
  };

  // Audio background
  // ===========================

  hole.audio.background.pause = function() {
    hole.button.mute.addClass('is-muted');
    this.$[0].pause();
    this.state = 'paused';
  };

  hole.audio.background.play = function() {
    hole.button.mute.removeClass('is-muted');
    this.$[0].play();
    this.state = 'playing';
  };

  hole.audio.background.toggle = function() {
    switch (hole.audio.background.state) {
      case 'playing':
        hole.audio.background.pause();
        break;
      case 'paused':
        hole.audio.background.play();
        break;
    }
  };

  // Overlay methods
  // ===========================
  hole.overlay.visible = false;

  hole.overlay.show = function(callback){
    this
      .removeClass('hidden')
      .fadeIn(2000, callback);
  };

  hole.overlay.hide = function(callback){
    this
      .addClass('hidden')
      .fadeOut(200, callback);
  };

  // Parallax
  // ===========================
  hole.parallax.init();

  // Counter
  // ===========================
  hole.counter.init();

  // Controllers
  // ===========================

  // Mute button controller
  hole.button.mute.on('click',function(){
    
    hole.audio.background.toggle();
  
  });

  // Play button controller
  hole.button.play.on('click',function(){
    
    hole.overlay.show(function(){
      hole.video.teaser.insertHtml().fadeIn(600);
      hole.audio.background.pause();
    });

  });

  // Overlay controller
  hole.overlay.on('click',function(){
      
    hole.overlay.hide(function(){
      hole.video.teaser.$.fadeOut(200);
      hole.video.teaser.clearHtml();
      hole.audio.background.play();
    });

  });


  window.hole = hole;

});
