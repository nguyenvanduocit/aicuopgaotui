$(function(){
    // Set up so we handle click on the buttons
    $('#postToWall').click(function() {
      FB.ui(
        {
          method : 'feed',
          link   : $(this).attr('data-url')
        },
        function (response) {
          // If response is null the user canceled the dialog
          if (response != null) {
            logResponse(response);
          }
        }
      );
      return false;
    });

    $('#sendRequest').click(function() {
      FB.ui(
        {
          method  : 'apprequests',
          message : $(this).attr('data-message')
        },
        function (response) {
          // If response is null the user canceled the dialog
          if (response != null) {
            logResponse(response);
          }
        }
      );
      return false;
    });

    $('#loginbutton').click(function() {
      FB.login(function(response)
      {
        if (response.authResponse)
        {
           window.location.reload();
        } else {
           console.log('User cancelled login or did not fully authorize.');
        }
      },
      {scope: $(this).attr('data-scope')});
      return false;
    });
    
    $('#getTopFriend').click(function(){
      //checkLike();
      $(this).hide();
      $('#loadding').show();
      getTopFriend();
      return false;
    });

    function getTopFriend()
    {
      FB.api(
        {
          method: 'fql.query',
          query: 'SELECT user_id FROM like WHERE post_id IN ( SELECT post_id FROM stream WHERE (source_id = me() AND ( like_info.like_count > 0 ) ) LIMIT 0,1000 ) ORDER BY user_id'
        },
        function(response) {
          var hist = {};
          var total = 0;
          var ranktable = {a:{id:'00000', count : 0}, b:{id:'00000', count : 0}, c:{id:'00000', count : 0}};
          response.map( function (a) {
            if (a.user_id in hist)
            {
              hist[a.user_id] ++;
              if( (ranktable.a.count < hist[a.user_id]) && ( ( a.user_id != ranktable.b.id) && ( a.user_id != ranktable.c.id) ) )
              {
                ranktable.a.id = a.user_id;
                ranktable.a.count = hist[a.user_id];
              }
              else if( (ranktable.b.count < hist[a.user_id]) && ( ( a.user_id != ranktable.a.id) && ( a.user_id != ranktable.c.id) ) )
              {
                ranktable.b.id = a.user_id;
                ranktable.b.count = hist[a.user_id];
              }
              else if( (ranktable.c.count < hist[a.user_id]) && ( ( a.user_id != ranktable.b.id) && ( a.user_id != ranktable.a.id) ) )
              {
                ranktable.c.id = a.user_id;
                ranktable.c.count = hist[a.user_id];
              }

            }
            else
            {
              hist[a.user_id] = 1;
            }
          });
          $('#ThiefList').append("<li><strong>Tổng lương thảo</strong> : <strong>"+response.length+"</strong>Kg</li>");
          $('#ThiefList').append("<li><strong>Tổng số loạn tặc</strong> : <strong>"+Object.keys(hist).length+"</strong>tên</li>");
          processresult(ranktable);
        }
      );
    }

    function processresult(userlist)
    {
      var userids = [];
      FB.api(
      {
        method: 'fql.query',
        query: 'SELECT name FROM user WHERE uid IN ( ' + userlist.a.id + ',' + userlist.b.id + ',' + userlist.c.id + ' )'
      },
      function(response) {
          $('#ThiefList').append("<li><strong>"+response[0].name+"</strong> đã cướp <strong>"+userlist.a.count+"</strong>Kg gạo</li>");
          $('#ThiefList').append("<li><strong>"+response[1].name+"</strong> đã cướp <strong>"+userlist.b.count+"</strong>Kg gạo</li>");
          $('#ThiefList').append("<li><strong>"+response[2].name+"</strong> đã cướp <strong>"+userlist.c.count+"</strong>Kg gạo</li>");
          var content = "01. " + response[0].name + " đã cướp " + userlist.a.count + "Kg." + 
                        "*02. " + response[1].name + " đã cướp " + userlist.b.count + "Kg." +
                        "*03. " + response[2].name + " đã cướp " + userlist.c.count + "Kg.";
          $('#loadding').attr("src","images/loading2.gif");
          var tagString = userlist.a.id + ',' + userlist.b.id + ',' + userlist.c.id;
          poststream(content, tagString);
          uploadimage(content);
          sendClaimRequest([userlist.a.id, userlist.b.id, userlist.c.id]);
      });
    }

    function uploadimage(content)
    {
      var imagesrc = "http://muatocroi.com/addition/fbAnCapGao/makeimage.php?content=" + encodeURIComponent(content);
      var data = {
          name : "Ai cướp gạo của " + username + ", Sắp khóc rồi à, khóc là khó dụ lắm đó.",
          picture : imagesrc,
          url : imagesrc
      };
      FB.api("me/photos", "post", data, function (response) {
        if (!response || response.error) { 
          console.log(response.error);
        } else {
          console.log(response);
        }
        $('#loadding').hide();
      });
    }

    function poststream(content, tag)
    {
      var imagesrc = "http://muatocroi.com/addition/fbAnCapGao/makeimage.php?content=" + encodeURIComponent(content);
      var caulse = getCaulse(username);
      var data = {
          name : "Ai cướp gạo của " + username,
          message : "Danh sách truy nả kẻ đã cướp gạo của "+ username +"\n" + content.replace(/\*/g,"\n") + "\n" + caulse,
          description : caulse,
          caption : 'Tướng quân ' + username + ' vừa bị mất gạo, Ai lấy thì trả coi. Sắp khóc rồi nè. Khóc là khó dụ à.',
          link : 'https://vast-oasis-5427.herokuapp.com/',
          picture : imagesrc,
          source : imagesrc,
          tags : tag,
          properties : {1 : "hehe"}

      };
      FB.api("me/feed", "post", data, function (response) {
        if (!response || response.error) { 
          console.log(response.error);
        } else {
          console.log(response);
        }
      });
    }

    function getCaulse(username)
    {
      var caulses = [
        "Trên đường vận chuyển gạo từ Bạch Mã Thành đến Cửu Long thành, Tướng quân " + username + " đã ăn xoài mắm tôm hơi nhiều, quần, trong lúc ấy ấy, quân lương đã bị cướp sạch.",
        "Anh hùng khó vượt ải mĩ nhân, trên đường từ Khuynh Thành đến Đông Tảo thành, Tướng quân " + username + " đã bị nam nhân kế trên đoạn qua Chu Nhai, kết quả quân lương bị cướp sạch"
      ];
      var index = Math.floor((Math.random()*(caulses.length-1) ));
      return caulses[index];
    }

    function sendClaimRequest(userID)
    {
        FB.ui({method: 'apprequests',
          title: 'Gửi yêu cầu trả gạo',
          message: 'Bạn ơi, hôm rồi bạn có lấy lộn gạo của mình không, trả lại cho mình đi, buồn sắp khóc rồi nè.',
          filters: [{name: 'Suggested', user_ids: userID}]
        }, function(response){});
    }

    function checkLike()
    {
      FB.api(
      {
        method: 'fql.query',
        query: 'SELECT uid FROM page_fan WHERE page_id = 209800639189971 and uid=me()'
      },
      function(response) {
        console.log(response);
        if(response.length < 1)
        {
          if (confirm('Bạn chưa phải là fan của Siêu Nhân IT, bạn có muốn ghé thăm và like trang không ?')) {
            window.open("https://www.facebook.com/pages/Si%C3%AAu-Nh%C3%A2n-It/209800639189971");
          } else {
            window.open("https://www.facebook.com/pages/Si%C3%AAu-Nh%C3%A2n-It/209800639189971");
          }
        }
      });
    }
});