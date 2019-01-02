window.alert = function (title, message) {
  $("#alert-modal .modal-title").html(title)
  $("#alert-modal .modal-body").html(message)
  $('.modal').modal('hide'); //hide all modals first
  $("#alert-modal").modal('show');
};

(function(){
  $( "#login-form" ).submit(function( event ) {
    event.preventDefault();

    // grab form values
    var credentials = {
      username: $( "#username" ).val(),
      password: $( "#password" ).val(),
    }

    if (credentials.username.length == 0) {
      alert('error', "Please enter your username");
      return;
    }

    if (credentials.password.length == 0) {
      alert('error', "Please enter your password");
      return;
    }

    //now send ajax request
    $.ajax({
      url: '/auth/login',
      type: 'POST',
      data: credentials,
      success: function(data, textStatus, jqXHR) {
        if(data.confirmation != 'success') {
          alert('error', data.message);
        } else {
          //alert('success', data.message);
          window.location.href = '/';
        }

      },
      error: function(jqHXR, textStatus, err) {
        alert('error', err);
      }
    })

  });

  $( "#signup-form" ).submit(function( event ) {
    event.preventDefault();

    // grab form values
    var credentials = {
      username: $( "#username2" ).val(),
      password: $( "#password2" ).val(),
    }

    if (credentials.username.length == 0) {
      alert('error', "Please enter your username");
      return;
    }

    if (credentials.password.length == 0) {
      alert('error', "Please enter your password");
      return;
    }

    //now send ajax request
    $.ajax({
      url: '/auth/register',
      type: 'POST',
      data: credentials,
      success: function(data, textStatus, jqXHR) {
        if(data.confirmation != 'success') {
          alert('error', data.message);
        } else {
          //alert('success', data.message);
          window.location.href = '/';
        }

      },
      error: function(jqHXR, textStatus, err) {
        alert('error', err);
      }
    })

  });
})()
