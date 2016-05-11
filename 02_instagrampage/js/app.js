var feed = null;

/*
$(document).on({
    ajaxStart: function() { console.log("ajax start"); $(".modal").show();  },
    ajaxStop: function() { console.log("ajax end"); $(".modal").hide(); }    
});
*/

$(function() {
    $('input').tagsinput({
    tagClass: function(item) {
        return 'label label-danger';
    }
    });
    
    //showModal();
    loadFeed('Penguins');
    //hideModal();
});

function onBtnClick() {
    var categoryArr = $('input').tagsinput('items')[1];
    if (categoryArr.length == 0) {
        $('input').attr('placeholder','Please enter some tags!');
    }
    $('.input-category').text("on " + categoryArr);
    for (var i=0; i<categoryArr.length; i++) {
        loadFeed(categoryArr[i]);
    }
}

function loadFeed(category) {
    if (category == "") { category = "penguins"; }
    
    // Clear div
    $("#_instafeed").html("");
 
    //Set up instafeed
    var imgs = [];
    feed = new Instafeed({
        clientId: '<YOUR INSTAGRAM KEY>',
        //target: 'instafeed',
        get: 'tagged',
        tagName: category,
        links: true,
        limit: 3,
        sortBy: 'most-recent',
        before: function() {
            $(".modal").show();   
        },
        after: function() {
            $(".modal").hide();     
        },
        success: function(images) {
            
            var captions = {'desc': '', 'confidence': '', 'tags': []};
            var imgs = [];
            
            function successCB(data) {
                //console.log(data);
                var len = 10;
                if (data.description.tags.length < len) {
                    len = data.description.tags.length;
                }
                for (var i=0; i<len; i++)
                {
                    captions['tags'].push(data.description.tags[i]);
                }
                //console.log(tagsArray);
                var desc = data.description.captions[0].text;
                var confidence = data.description.captions[0].confidence;  
                //captions.push([desc, confidence]); 
                captions['desc'] = desc;
                captions['confidence'] = (confidence*100).toFixed(2); 
            }
            
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
                /*
                result = this._makeTemplate(this.options.template, {
                    model: image,
                    link: image.link,
                    image: image.images[this.options.resolution].url,
                    caption: image.caption.text,
                    //likes: image.likes.count,
                    confidence: captions['confidence'],
                    username: image.user.username,
                    usernamelink: "https://www.instagram.com/" + image.user.username + "/",
                    //date: image.date,
                    //imgUrl: imgUrl.substring(0,20)
                    msdesc: captions['desc']
                });
                */
                
                // Microsoft caption bot tagging                 
                var msTagsCode = '<div class="bootstrap-tagsinput" id="ms-tags">'; 
                for (var i=0; i<captions['tags'].length; i++) {
                    msTagsCode = msTagsCode + '<span class="tag label bg-success" id="ms-tags-tag">' +
                                    captions['tags'][i] + '</span>';
                }           
                msTagsCode = msTagsCode + '</div>';
                                
                // User caption tagging
                //var re = /(?:^|\W)#(\w+)(?!\w)/g, match, matches = [];
                var re = /#(\S*)/g, match, matches = [];
                while (match = re.exec(image.caption.text)) {
                    matches.push(match[1]);
                }            
                //console.log(matches);
                /* Decided to put the whole caption anyway
                var newCaption = image.caption.text;
                for (var i=0; i<matches.length; i++) {
                    var stringToReplace = '#' + matches[i];
                    newCaption = newCaption.replace(stringToReplace, '');
                }                    
                console.log(newCaption.trim());
                */
                var len = 10; if (matches.length < 10) {len = matches.length; }
                var userTagsCode =   '<div class="bootstrap-tagsinput" id="user-tags">';              
                for (var i=0; i<len; i++) {
                    userTagsCode = userTagsCode + '<span class="tag label bg-success" id="user-tags-tag">' +
                                    matches[i] + '</span>';
                }           
                userTagsCode = userTagsCode + '</div>';
                
                result = 
                  '<div class="photo-box-ms"><div class="col-md-4">' +
                  '<div class="photo-box"><div class="image-wrap">' +
                   '<a href=\"' + image.link +  '\'" target="_blank"><img src=\"' + image.images.standard_resolution.url +  '\"></a>' +
                   '</div></div></div>' +
                   '<div class="col-md-8"><div class="ms-wrap">' +
                   '<span class="ms-says">Microsoft says...</span><br>' +
                   '<div class="ms-words">I am ' +  captions['confidence'] + '\% sure this is ' + captions['desc']  + '</div>' +
                   msTagsCode + '</div>' +
                   '<div class="user-wrap"><a href=\"https://www.instagram.com/' + image.user.username +  '><span class="user-says">' + image.user.username + 'says....</span></a><br>' +
                   '<div class="user-words">' + image.caption.text + '</div>' + userTagsCode + 
                   '</div></div></div>';
                   
                imgs.push(result);
                //console.log(result);
                //$('#_instafeed').append(result);
            }
            $('#_instafeed').html(imgs);
            
        },
        resolution: 'standard_resolution',
        /*
        template: '<div class="photo-box-ms"><div class="col-md-4">' +
                  '<div class="photo-box"><div class="image-wrap">' +
                   '<a href="{{link}}" target="_blank"><img src="{{image}}"></a>' +
                   '</div></div></div>' +
                   '<div class="col-md-8"><div class="ms-wrap">' +
                   '<span class="ms-says">Microsoft says...</span><br>' +
                   '<div class="ms-words">I am {{confidence}} \% sure this is {{msdesc}}</div></div>' +
                   '<div class="user-wrap"><a href="{{usernamelink}}><span class="user-says">{{username}} says....</span></a><br>' +
                   '<div class="user-words">{{caption}}</div>' +
                   '</div></div></div>'
        */            
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
    //hideModal();
 
}

function refreshFeed() {
    var category = $('.input-category').text();
    category = category.replace('on ', '');
    category = category.trim();
    var categoryArr = category.split(",");
    for (var i=0; i<categoryArr.length; i++) {
        loadFeed(categoryArr[i]);
    }
}

/*==== INFINITE SCROLLING ======*/
$(window).scroll(function(){
  if($(window).scrollTop() + $(window).height() > $(document).height() - 100) 
    {
      feed.next();
    }
  
});