$(document).ready(function(){
  $('.delete-data').on('click', function(e){
    $target = $(e.target);
    const id = $target.attr('data-id');
    $.ajax({
      type:'DELETE',
      url: '/data/'+id,
      success: function(response){
        alert('Deleting Data Entry');
        window.location.href='/';
      },
      error: function(err){
        console.log(err);
      }
    });
  });
});
