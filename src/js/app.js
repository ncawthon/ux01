jQuery(document).ready(function ($) {
  function init() {
    // hide lightbox containers
    if ($('.thumbnail').length) {
      $('.thumbnail').hide();
    }

    // sticky player
    $('#player').sticky({
      stickyClass: 'sticky',
      responsiveWidth: true,
      zIndex: 9999
    });
    $('#player').on('sticky-start', function() {
      $(this)
        .find('iframe')
        .animate({
          height: 250
        }, 200)
      ;
    });
    $('#player').on('sticky-end', function() {
      $(this)
        .find('iframe')
        .animate({
          height: 500
        }, 200)
      ;
    });

    // tabs
    $('.tabs-lang a').on('touchstart click', function (e) {
      e.preventDefault();

      $(this).parent().addClass('active');
      $(this).parent().siblings().removeClass('active');

      var tab = $(this).attr('href');

      $('.tab-content').not(tab).css('display', 'none');
      $(tab).fadeIn();
    });

    //tweets
    $('[data-tweet-attribute]').each(function () {
      var text = $(this).find('span[data-tweet-quote]').text();
      text = encodeURIComponent(text);
      var handle = $(this).attr('data-tweet-attribute').replace(/\@/g, '');
      var url = 'http://ux01.org';
      url = encodeURIComponent(url);
      var tweet = 'https://twitter.com/intent/tweet?text=' + text + '&via=' + handle + '&url=' + url;

      $(this).on('touchstart click', function(e) {
        var
          w = 575,
          h = 400,
          top = ($(window).height() - h) / 2,
          left = ($(window).width() - w) / 2,
          opts =
            'status=1' +
            ',width=' + w +
            ',height=' + h +
            ',top=' + top +
            'left=' + left
        ;

        window.open(tweet, 'twitter', opts);

        return false;
      });

    });

    // vimeo api
    function vimeo() {
      var video = $('#video');
      var player = new Vimeo.Player(video);

      $('[data-jumpto]').each(function () {
        var jumpTo = $(this).attr('data-jumpto-time');

        function toSeconds(str) {
          var
            parts = str.split(':'),
            minutes = parts[0],
            seconds = parts[1],
            seconds = parseInt(seconds, 10) + (parseInt(minutes, 10) * 60)
          ;

          return seconds;
        }

        var jumpToSeconds = toSeconds(jumpTo);

        $(this).on('touchstart click', function (e) {
          e.preventDefault();

          player.getDuration()
            .then(function (duration) {
              console.log('duration: ' + duration);
            }).catch(function (error) {
              // an error occured
            });

          player.setCurrentTime(jumpToSeconds)
            .then(function (seconds) {
              console.log('setCurrentTime: ' + seconds);
            }).catch(function (error) {
              switch (error.name) {
                case 'RangeError':
                // the time was less than 0 or greater than the video’s duration
                break;
              default:
                // some other error occurred
                break;
              }
            });

            player.play()
              .then(function () {
                // the video was played
              }).catch(function (error) {
                switch (error.name) {
                  case 'PasswordError':
                    // the video is password-protected
                    break;
                  case 'PrivacyError':
                    // the video is private
                    break;
                  default:
                    // somr other error occured
                    break;
                }
              })
        });
      });
    }

    vimeo();
  }

  init();
});
