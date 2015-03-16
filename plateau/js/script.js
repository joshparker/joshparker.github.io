var youtubeId = "M8YjvHYbZ9w";
var invocation = new XMLHttpRequest();
var url = "https://www.googleapis.com/youtube/v3/videos?id=" + youtubeId + "&key=YOUR_API_KEY
 &part=snippet,contentDetails,statistics,status";
YoutubeVideo(youtubeId, function(video){
	if (invocation) {
		invocation.open('GET', url, true);
		invocation.onreadyStateChange = function() {
			  console.log(video.title);
			  var webm = video.getSource("video/webm", "medium");
			  console.log("WebM: " + webm.url);
			  var mp4 = video.getSource("video/mp4", "medium");
			  console.log("MP4: " + mp4.url);

			  $("<video controls='controls'/>").attr("src", webm.url).appendTo("body");
		}
		invocation.send();
	}
  
});