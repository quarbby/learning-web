$(function() {
 
    //Set up instafeed
    var imgs = [];
    var feed = new Instafeed({
        clientId: 'f2259c6e745d4df087e9d4659325ae97',
        target: 'instafeed',
        get: 'tagged',
        tagName: 'cats',
        links: true,
        limit: 8,
        sortBy: 'most-recent',
        success: function(images) {
            //console.log(images.data);
            var result;
            for (var i in images.data) {
                var image = images.data[i];
                console.log(image);
                var imgUrl = image.images.standard_resolution.url;
                
                result = this._makeTemplate(this.options.template, {
                    model: image,
                    link: image.link,
                    image: image.images[this.options.resolution].url,
                    caption: image.caption.text,
                    likes: image.likes.count,
                    date: image.date,
                    imgUrl: imgUrl.substring(0,20)
                });
                imgs.push(result);
            }
            $('#instafeed').html(imgs);
        },
        resolution: 'standard_resolution',
        template: '<div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">' +
                    '<div class="photo-box"><div class="image-wrap">' +
                    '<a href="{{link}}"><img src="{{image}}"></a>' +
                    '<div class="likes">{{imgUrl}} Likes</div></div>' +
                    '<div class="description">{{caption}}' +
                    '<div class="date">{{imgUrl}}</div></div></div></div>'
    });
    feed.run();
 
});

// MS cognitive vision key: bc6e814e6a3c4db595d49fb5ec045ee7