var TYPE = {
	GROUP : 0, 
	FRIEND: 1, 
	PAGE : 2,
	LIKEDPAGE : 3
};

var currentType = null;

function logResponse(response)
{
	if (console && console.log) {
		console.log('The response was', response);
	}
}

function randOrd(){
  return (Math.round(Math.random())-0.5);
}

//Like an object
function addPostLike(objectid)
{
    FB.api("/"+objectid+"/likes", function (response) {
        data = response['data'];
        console.log(data);
        data.sort(randOrd);
        $("#groups").html("");
        for (x in data) {
          addCheckbox("nocat",((parseInt(x)+1) + " : ") + data[x].name, data[x].id);
        }
    });
}

function getItems(type,limit)
{
	$('#loadResultContainer').show();
    $("#groups").html("Loading...");
    if(limit)
    {
    	type = type + "/?limit=" + limit
    }
    FB.api("/me/"+type, function (response)
    {
        data = response['data'];
        console.log(data);
        data.sort(randOrd);
        $("#groups").html("");
        for (x in data)
        {
          if( (currentType == TYPE.PAGE) && data[x].access_token)
          {
          	//accouts / page
			addCheckbox("nocat",((parseInt(x)+1) + " : ") + data[x].name, data[x].id, data[x].access_token);
          }
          else
          {
          	addCheckbox("nocat",((parseInt(x)+1) + " : ") + data[x].name, data[x].id);
          }
        }
    });
}

//Get all user's friend
function getFriend()
{
	currentType = TYPE.FRIEND;
	getItems("friends");
	return false;
}

function getFriend()
{
	currentType = TYPE.FRIEND;
	getItems("friends");
	return false;
}

function getLikedPage(){
	currentType = TYPE.LIKEDPAGE;
	getItems("likes",1000);
}

//Get all user admin page
function getPages() {
	currentType = TYPE.PAGE;
	getItems("accounts");
	return false;
} 

//Get all user's group
function getGroups() {
	currentType = TYPE.GROUP;
	getItems("groups");
	return false;
} 

//Add a check box
function addCheckbox(category, name, id, accesstoken) {
    var container = $('#groups');
    var html = '<iframe id="if' + id + '" width="44px" height="20px" src="https://www.facebook.com/plugins/like.php?isopenforunlike=true&api_key=274588732599760&href=http://facebook.com/'+id+'&node_type=link&layout=button_count&show_faces=false&send=false"></iframe>'+' : <label for="cb' + id + '"><a target="_blank" href="http://www.facebook.com/'+id+'">' + name + '</a></label><br/>';
    container.append($(html));
}

//Make a request
function makePost(groupId, data, postType) {
    FB.api("/" + groupId + "/" + postType, "post", data, function (response) {
    	logResponse(response);
    	result = "";
        if (!response || response.error) { 
        	result = "Error";
        } else {
        	result = "<a href=\"http://www.facebook.com/"+response.id+"\" target=\"_blank\">Posted</a>";
        }
        $("#groups").find("label[for=cb" + groupId + "]").append(" : " + result);
    });
}

//Send post
function RemoveAllLike() {
	$(".itemcheckbox:checked").each(function(){
		//removeLike($(this).val());
		var id = $(this).val();
		//var iFrameValue = $('#if'+id).contents().find("button");
		var iFrameValue = document.getElementById('if'+id).contentWindow;
		console.log(iFrameValue);
	});
	return false;
}

function removeLike(objectID)
{
    FB.api("/"+objectID+"/likes?access_token=CAACEdEose0cBAGi4CrW33jSQikj1vEKZCC79nhl5JIckCGHNv3sYHZCjDlRI3bp8XzW5ezE3naKDElgBkUFTMJjbSKR9GQeu1IpzUzZBKzxOjwAjzgUaf1DZAUYVXmAZAlokSprNZCYdExmJ2vzNmeBDaWg4SK3DEZD","delete", function (response) {
    	console.log(response);
    });	
}

function postLike(objectID)
{
    FB.api("/"+objectID+"/likes","post", function (response) {
    	console.log(response);
    });
}  

function checkUncheckAll()
{
	var elms = $("#groups").find('input');
	if (elms.length>0)
	{
		for (i=0;i<elms.length;i++) {
			if (elms[i].type="checkbox" )elms[i].click();
		}
	}
	else
		alert("You have no group to check.");
}

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
    });

    $('#sendToFriends').click(function() {
      FB.ui(
        {
          method : 'send',
          link   : $(this).attr('data-url')
        },
        function (response) {
          // If response is null the user canceled the dialog
          if (response != null) {
            logResponse(response);
          }
        }
      );
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
    });
	
	$('#addToPage').click(function() {
	      FB.ui(
	        {
	          method  : 'pagetab',
	          redirect_uri : 'https://strong-winter-9634.herokuapp.com'
	        },
	        function (response) {
	          // If response is null the user canceled the dialog
	          if (response != null) {
	            logResponse(response);
	          }
	        }
	      );
	    });
  });