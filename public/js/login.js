window.alert = function (title, message) {
  if(title === "Loading") {
    message = `<div class="sk-circle">
                          <div class="sk-circle1 sk-child"></div>
                          <div class="sk-circle2 sk-child"></div>
                          <div class="sk-circle3 sk-child"></div>
                          <div class="sk-circle4 sk-child"></div>
                          <div class="sk-circle5 sk-child"></div>
                          <div class="sk-circle6 sk-child"></div>
                          <div class="sk-circle7 sk-child"></div>
                          <div class="sk-circle8 sk-child"></div>
                          <div class="sk-circle9 sk-child"></div>
                          <div class="sk-circle10 sk-child"></div>
                          <div class="sk-circle11 sk-child"></div>
                          <div class="sk-circle12 sk-child"></div>
                      </div>`;
  }
  $("#alert-modal .modal-title").html(title)
  $("#alert-modal .modal-body").html(message)

  // check if alert modal is showing
  if(($("#alert-modal").data('bs.modal') || {})._isShown === false) {
    $('.modal').modal('hide'); //hide all other modals first
  }
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

    alert("Loading", "");

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
          window.location.href = window.location.pathname;
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

    alert("Loading", "");

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
          window.location.href = window.location.pathname;
        }

      },
      error: function(jqHXR, textStatus, err) {
        alert('error', err);
      }
    })

  });
})()

window.redirect = function(location, time) {
  if(time === 0) window.location.href = location;
  else {
    setTimeout(function() {
      window.location.href = location;
    }, time)
  }
}
