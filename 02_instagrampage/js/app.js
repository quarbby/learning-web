$(function() {
 
    //Set up instafeed
    var imgs = [];
    var feed = new Instafeed({
        clientId: 'f2259c6e745d4df087e9d4659325ae97',
        //target: 'instafeed',
        get: 'tagged',
        tagName: 'cats',
        links: true,
        limit: 3,
        sortBy: 'most-recent',
        success: function(images) {
            
            //console.log(images.data);
            /*
            $.ajax({
                url: "https://api.projectoxford.ai/vision/v1.0/describe?maxCandidates=1",
                beforeSend: function(xhrObj){
                    // Request headers
                    xhrObj.setRequestHeader("Content-Type","application/json");
                    xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","bc6e814e6a3c4db595d49fb5ec045ee7");
                },
                type: "POST",
                async: false,
                data: '{ "url": "https://scontent.cdninstagram.com/t51.2885-15/s640x640/sh0.08/e35/13098967_164793917250826_685040446_n.jpg?ig_cache_key=MTIzOTExNDM1OTY4NTAyMzkwNA%3D%3D.2.l" }',
                success: function(data) {
                    successCB(data);
                }
            });
            */
            
            var captions = {'desc': '', 'confidence': 0};
            
            function successCB(data) {
                console.log(data);
                var desc = data.description.captions[0].text;
                var confidence = data.description.captions[0].confidence;  
                //captions.push([desc, confidence]); 
                captions['desc'] = desc;
                captions['confidence'] = (confidence*100).toFixed(2);   
                console.log("Confidence " + confidence);         
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
                    //date: image.date,
                    //imgUrl: imgUrl.substring(0,20)
                    msdesc: captions['desc']
                });
                imgs.push(result);
            }
            $('#_instafeed').html(imgs);
        },
        resolution: 'standard_resolution',
        template: '<div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">' +
                    '<div class="photo-box"><div class="image-wrap">' +
                    '<a href="{{link}}"><img src="{{image}}"></a>' +
                    '<div class="likes">I am {{confidence}} \% sure that this is {{msdesc}}</div></div>' +
                    '<div class="description">{{caption}}' +
                    '</div></div></div>'
    });
    feed.run();
 
});

// MS cognitive vision key: bc6e814e6a3c4db595d49fb5ec045ee7