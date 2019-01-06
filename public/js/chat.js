$(function () {
    var $chatbox = $('.chatbox'),
        $chatboxTitle = $('.chatbox__title'),
        $chatboxTitleClose = $('.chatbox__title__close'),
        $chatboxCredentials = $('.chatbox__credentials');
    $chatboxTitle.on('click', function() {
        $chatbox.toggleClass('chatbox--tray');
    });
    $chatboxTitleClose.on('click', function(e) {
        e.stopPropagation();
        $chatbox.addClass('chatbox--closed');
    });
    $chatbox.on('transitionend', function() {
        if ($chatbox.hasClass('chatbox--closed')) $chatbox.remove();
    });

    $( "#message-form" ).submit(function( event ) {
      event.preventDefault();

      // grab form values
      var message = {
        message: $( "#message" ).val()
      }

      if (message.message.length == 0) {
        return;
      }

      console.log(message.message)

      $( "#message" ).val('')

      $( '#chatbox__body__messages' ).append(`<div class="chatbox__body__message chatbox__body__message--right">
          <img src="https://www.gstatic.com/webp/gallery/2.jpg" alt="Picture">
          <div class="clearfix"></div>
          <div class="ul_section_full">
              <ul class="ul_msg">
                  <li><strong>${username}</strong><span class="text-muted"> 5:28 PM</span></li>
                  <li>${message.message}</li>
              </ul>
              <div class="clearfix"></div>
          </div>
      </div> <!-- end chatbox message right -->`);
      $('#chatbox__body__messages').scrollTop($('#chatbox__body__messages')[0].scrollHeight); //scroll to the bottom

      // //now send ajax request
      // $.ajax({
      //   url: '/api/topic',
      //   type: 'POST',
      //   data: topicData,
      //   success: function(data, textStatus, jqXHR) {
      //     if(data.confirmation != 'success') {
      //       alert('error', data.data);
      //     } else {
      //       alert('success', `Topic: '${topicData.title}' was succesfully created.`);
      //       redirect('/posts', 1000)
      //     }
      //
      //   },
      //   error: function(jqHXR, textStatus, err) {
      //     alert('error', err);
      //   }
      // })

    });

    var socket = io();

    socket.on('message', function(msg){
      alert('Message', msg);
    });

});
