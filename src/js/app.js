jQuery(document).ready(function ($) {
  function init() {
    // hide lightbox containers
    if ($('.thumbnail').length) {
      $('.thumbnail').hide();
    }

    // sticky player
    $('#player').sticky({
      stickyClass: 'sticky'
    });

    // tabs
    $('.tabs-lang a').click(function (e) {
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

      $(this).find('a[data-class-tweet]').attr('href', tweet).attr('target', '_blank');
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
            minutes = parts[0]
            seconds = parts[1]
            seconds = parseInt(seconds, 10) + (parseInt(minutes, 10) * 60);
          ;

          return seconds;
        }

        var jumpToSeconds = toSeconds(jumpTo);

        // alert(jumpToSeconds);

        $(this).css({
          'cursor': 'pointer'
        });

        $(this).click(function (e) {
          e.preventDefault();

          player.getDuration()
            .then(function (duration) {
              console.log('duration: ' + duration);
            }).catch(function (error) {
              // an error occured
            });

          player.setCurrentTime(jumpTo)
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
        });
      });
    }

    vimeo();
  }

  init();
});
