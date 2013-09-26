<?php
require_once('AppInfo.php');

// Enforce https on production
if (substr(AppInfo::getUrl(), 0, 8) != 'https://' && $_SERVER['REMOTE_ADDR'] != '127.0.0.1') {
  header('Location: https://'. $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI']);
  exit();
}

require_once('utils.php');
require_once('sdk/src/facebook.php');

$facebook = new Facebook(array(
  'appId'  => AppInfo::appID(),
  'secret' => AppInfo::appSecret(),
  'fileUpload' => true,
));

$facebook->setFileUploadSupport(true);
$user_id = $facebook->getUser();

if ($user_id) {
  try {
    // Fetch the viewer's basic information
    $basic = $facebook->api('/me');
  } catch (FacebookApiException $e) {
    // If the call fails we check if we still have a user. The user will be
    // cleared if the error is because of an invalid accesstoken
    if (!$facebook->getUser()) {
      //header('Location: '. AppInfo::getUrl($_SERVER['REQUEST_URI']));
      //exit("invalid accesstoken");
    }
  }
  include_once 'function.php';
}

?>
<!DOCTYPE html>
<html xmlns:fb="http://ogp.me/ns/fb#" lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=2.0, user-scalable=yes" />

    <title><?php echo he($app_name); ?></title>
    <meta property="og:title" content="<?php echo he($app_name); ?>" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="<?php echo AppInfo::getUrl(); ?>" />
    <meta property="og:image" content="<?php echo AppInfo::getUrl('/logo.png'); ?>" />
    <meta property="og:site_name" content="<?php echo he($app_name); ?>" />
    <meta property="og:description" content="ứng dụng rất hay dùng để xem những ai đã chôm lương thảo tại wall của các bạn." />
    <meta property="fb:app_id" content="<?php echo AppInfo::appID(); ?>" />

    <link href="css/mainsite.css" type="text/css" rel="stylesheet" />
    <link href="css/style.css" type="text/css" rel="stylesheet" />
    <script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
    <script type="text/javascript" src="js/script.js"></script>
    <!--[if IE]>
      <script type="text/javascript">
        var tags = ['header', 'section'];
        while(tags.length)
          document.createElement(tags.pop());
      </script>
    <![endif]-->
  </head>
  <body>
    <div id="fb-root"></div>
    <script type="text/javascript">
      window.fbAsyncInit = function() {
        FB.init({
          appId      : '<?php echo AppInfo::appID(); ?>', // App ID
          channelUrl : '//<?php echo $_SERVER["HTTP_HOST"]; ?>/channel.html', // Channel File
          status     : true, // check login status
          cookie     : true, // enable cookies to allow the server to access the session
          xfbml      : true, // parse XFBML
          oauth      : true,
          frictionlessRequests : true
        });
        FB.Event.subscribe('auth.login', function(response) {
          window.location.reload();
        });
        FB.Canvas.setAutoGrow();
        FB.Event.subscribe('edge.create',function(){window.location.reload()});
      };

      // Load the SDK Asynchronously
      (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s);
        js.id = id;
        js.async = true;
        js.src = "//connect.facebook.net/en_US/all.js";
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
    </script>

        <div id="wrapper">
        <div id="wrapperHeader">
            <div id="header">
                <ul id="nav">
                    <li class=""><a class="logo" href="http://senviet.org" title="Trang Chủ" target="_blank">Trang Chủ</a></li>
                    <li class=""><a class="Nav01" href="#" title="Cơ chế hoạt động">Cơ chế hoạt động</a></li>
                    <li class=""><a class="Nav02" href="https://www.facebook.com/pages/Si%C3%AAu-Nh%C3%A2n-It/209800639189971" title="Fanpage" target="_blank">Fanpage</a></li>
                    <li class=""><a class="Nav03" href="#" title="Chia sẻ" id="postToWall" data-url="https://vast-oasis-5427.herokuapp.com">Chia sẻ</a></li>
                    <li class=""><a class="Nav04" href="#" title="Send request" id="sendRequest" data-message="Hãy cùng xem ai là người trộm gạo nhà mình nhé.">Send request</a></li>
                    <li class=""><a class="Nav05" href="https://www.facebook.com/pages/Si%C3%AAu-Nh%C3%A2n-It/209800639189971" title="Hỗ trợ" target="_blank">Hỗ trợ</a></li>
                    <li class=""><a class="Nav06" href="https://www.facebook.com/pages/Si%C3%AAu-Nh%C3%A2n-It/209800639189971" title="About" target="_blank">About</a></li>        
                </ul>
            </div>
        </div>
        <div id="wrapperContent">
            <div class="Content">
                <div class="Main">
                    
                    <?php if (isset($basic)): ?>
                      <?php if(isFan()): ?>
                      <script>var username = "<?php echo $basic['name'] ?>";</script>
                      <div id="Thiefcontent">
                        <ul id="ThiefList"></ul>
                      </div>
                      <img id="loadding" class="centerbutton" src="../images/loading.gif" style="display:none"/>
                      <a href="http://muatocroi.com" class="BtHuongDan centerbutton" title="Hướng dẫn người mới" id="getTopFriend">Hướng dẫn người mới</a>
                      <?php else: ?>
                        <ul id="Thiefcontent"><li>Chúa công phải lập quốc trước.</li><li>Ấn vào nút like phía dưới để làm đơn xin lập quốc.</li><li><div class="fb-like" data-href="https://www.facebook.com/pages/Si%C3%AAu-Nh%C3%A2n-It/209800639189971" data-width="360" data-show-faces="true" data-send="true"></div></li></ul>
                      <?php endif; ?>
                    <?php else: ?>
                    
                    <div class="centerbutton" data-scope="photo_upload, publish_stream, share_item, read_friendlists read_stream, xmpp_login, manage_friendlists, publish_actions, email, user_birthday, friends_birthday, user_groups, friends_groups, user_likes, friends_likes, user_photos, friends_photos, user_status, friends_status, user_subscriptions, friends_subscriptions, publish_actions, manage_pages" id="loginbutton">Login</div>

                    <?php endif; ?>
                </div>
                <div class="Sidebar">
                    <h2 class="TitleMenu">Trùm cướp bóc</h2>
                    <ul id="sidenavMenu">
                        <li><a href="#" title="Giới thiệu">Đang cập nhật</a></li>
                    </ul>
                </div>
                <img class="clear" src="images/img2.jpg" alt="" width="100%"/>&nbsp;&nbsp;&nbsp;Một sản phẩm của Sen Việt org
            </div>
        </div>
        <div id="wrapperFooter"> </div>
    </div>
</body>
</html>