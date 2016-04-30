var feed = null;

$(function() {
    loadFeed("penguins"); 
});

function onBtnClick() {
    var categoryArr = $(".input").tagsinput('items');
    $('.input-category').text("on " + categoryArr);
    for (var i=0; i<categoryArr.length; i++) {
        loadFeed(categoryArr[i]);
    }
}

function loadFeed(category) {
    if (category == "") { category = "penguins"; }
    console.log(category);
    
    // Clear div
    $("#_instafeed").html("");
 
    //Set up instafeed
    var imgs = [];
    feed = new Instafeed({
        clientId: 'f2259c6e745d4df087e9d4659325ae97',
        //target: 'instafeed',
        get: 'tagged',
        tagName: category,
        links: true,
        limit: 3,
        sortBy: 'most-recent',
        success: function(images) {
            
            var captions = {'desc': '', 'confidence': ''};
            
            function successCB(data) {
                //console.log(data);
                var desc = data.description.captions[0].text;
                var confidence = data.description.captions[0].confidence;  
                //captions.push([desc, confidence]); 
                captions['desc'] = desc;
                captions['confidence'] = (confidence*100).toFixed(2);   
            }
            
            //console.log("Desc " + captions);
            //console.log(captions[0][0]);       
            
            var result;
            for (var i in images.data) {
                var image = images.data[i];
                //console.log(image);
                var imgUrl = image.images.standard_resolution.url;
                
                
                // Call MS Cognitive services 
                $.ajax({
                    url: "https://api.projectoxford.ai/vision/v1.0/describe?maxCandidates=1",
                    beforeSend: function(xhrObj){
                        // Request headers
                        xhrObj.setRequestHeader("Content-Type","application/json");
                        xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","bc6e814e6a3c4db595d49fb5ec045ee7");
                    },
                    type: "POST",
                    async: false,
                    data: '{ "url":\"' + imgUrl + '\"}',
                    success: function(data) {
                        successCB(data);
                    }
                });
                
                // Display data 
                result = this._makeTemplate(this.options.template, {
                    model: image,
                    link: image.link,
                    image: image.images[this.options.resolution].url,
                    caption: image.caption.text,
                    //likes: image.likes.count,
                    confidence: captions['confidence'],
                    username: image.user.username,
                    //date: image.date,
                    //imgUrl: imgUrl.substring(0,20)
                    msdesc: captions['desc']
                });
                imgs.push(result);
                //console.log(result);
                //$('#_instafeed').append(result);
            }
            $('#_instafeed').html(imgs);
        },
        resolution: 'standard_resolution',
        template: '<div class="photo-box-ms"><div class="col-md-4">' +
                  '<div class="photo-box"><div class="image-wrap">' +
                   '<a href="{{link}}" target="_blank"><img src="{{image}}"></a>' +
                   '</div></div></div>' +
                   '<div class="col-md-8"><div class="ms-wrap">' +
                   '<span class="ms-says">Microsoft says...</span><br>' +
                   '<div class="ms-words">I am {{confidence}} \% sure this is {{msdesc}}</div></div>' +
                   '<div class="user-wrap"><span class="user-says">{{username}} says....</span><br>' +
                   '<div class="user-words">{{caption}}</div>' +
                   '</div></div></div>'
        /*
        template: '<div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">' +
                    '<div class="photo-box"><div class="image-wrap">' +
                    '<a href="{{link}}"><img src="{{image}}"></a>' +
                    '<div class="likes">I am {{confidence}} \% sure that this is {{msdesc}}</div></div>' +
                    '<div class="description">{{caption}}' +
                    '</div></div></div>'
        */            
    });
    feed.run();
 
}

/*==== INFINITE SCROLLING ======*/
$(window).scroll(function(){
  if($(window).scrollTop() + $(window).height() > $(document).height() - 100) 
    {
      feed.next();
    }
  
});

// MS cognitive vision key: bc6e814e6a3c4db595d49fb5ec045ee7
// Other valid instagram client ID: 2e5a3f8cc1754723a81d216f3d302a69