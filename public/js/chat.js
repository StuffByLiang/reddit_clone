$(document).ready(function () {
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

      var name = $('#message').attr('to')

      console.log(name + ' ' + message.message)

      $( "#message" ).val('')

      $( '#chatbox__body__messages-' + name ).append(`<div class="chatbox__body__message chatbox__body__message--right">
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
      $('#chatbox__body__messages-' + name).scrollTop($('#chatbox__body__messages-' + name)[0].scrollHeight); //scroll to the bottom

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

      // now send the message
      socket.emit('message', {
        username: name,
        message: message.message
      })

    });

    var socket = io();

    let connected = false;

    socket.emit('add user', username)

    socket.on('connected', function(users){
      for(let name in users) {
        if(name != username) { //dont display yourself
          initiateUser(name)
        }
      }

      // hide all the boxes
      $('.chatbox__body__messages').hide();

      connected = true;
    });

    socket.on('user joined', function(data){
      initiateUser(data.username)
    });

    socket.on('disconnect', function () {
      $('#chatbox__users').empty()
      connected = false;
    });

    socket.on('reconnect', function () {
      if(!connected)
        socket.emit('add user', username);
    });

    socket.on('user left', function (data) {
      cleanupUser(data.username);
    });

    socket.on('message', function (data) {
      $(`#chatbox__body__messages-${data.username}`).append(`<div class="chatbox__body__message chatbox__body__message--left">
          <img src="https://www.gstatic.com/webp/gallery/2.jpg" alt="Picture">
          <div class="clearfix"></div>
          <div class="ul_section_full">
              <ul class="ul_msg">
                  <li><strong>${data.username}</strong><span class="text-muted"> 5:28 PM</span></li>
                  <li>${data.message}</li>
              </ul>
              <div class="clearfix"></div>
          </div>
      </div><!-- end chatbox message left -->`);

      $(`#chatbox__body__messages-${data.username}`).scrollTop($(`#chatbox__body__messages-${data.username}`)[0].scrollHeight); //scroll to the bottom

      $(`#${data.username}-lastmessage`).html(data.message.substring(0,18)) // change the last message on the right

    });

});

function initiateUser(name) {
  $('#chatbox__users').append(`<div id="${name}" class="chatbox__user__container d-flex">
    <img src="/images/users/avatar-1.jpg" alt="user" class="rounded-circle">
    <div class="justify-content-center">
      <p class="header-title">${name}</p>
      <p id="${name}-lastmessage" class="text-muted">Text</p>
    </div>
  </div> <!-- end chatbox user container -->`);

  $('#chatbox__body').append(`<div id="chatbox__body__messages-${name}" class="chatbox__body__messages">
    <div class="chatbox__body__message chatbox__body__message--left">
        <div class="ul_section_full">
            <ul class="ul_msg">
                <li>Say something to ${name}!</li>
            </ul>
            <div class="clearfix"></div>
        </div>

    </div> <!-- end chatbox message right -->
  </div> <!-- end chatbox body messages -->`);

  // hide this chatbox
  $('#chatbox__body__messages-' + name).hide();

  // make the new appended user box clickable
  $(`#${name}`).on('click', function(event){
      let username = $(this).attr('id');
      console.log(username)

      // hide all chat boxes
      $('.chatbox__body__messages').hide();

      // show the user chatbox
      $('#chatbox__body__messages-' + username).show();

      $('#message').attr('to', username); // set the variable to the name of the person you are talking to
  });
}

function cleanupUser(name) {
  $(`#${name}`).remove();
  $(`#chatbox__body__messages-${name}`).remove();
}
