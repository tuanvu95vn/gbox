window.addEventListener("load", function () {
    initPhotoSwipeFromDOM('.gallery-carousel');
});
//Back to top
document.querySelector(".backtotop").addEventListener("click", function (e) {
    e.preventDefault
    window.scrollBy(
        {
            top: -document.body.offsetHeight,
            behavior: "smooth"
        }
    );
})

//Change Button Select
btnSelect = $('.btn')
btnSelect.click(function () {
    $(this).addClass('active')
    $(this).siblings().removeClass('active')
})

hamburger = $('.hamburger')
navMB = $('.nav-mb')





// //.......................HEADER...........................
//- Click Hamburger

hamburger.click(function (event) {
    event.stopPropagation();
    $(this).toggleClass('clicked')
    navMB.toggleClass('active')
})
$(window).scroll(function () {
    hamburger.removeClass('clicked')
    navMB.removeClass('active')
})
$('body').click(function () {
    hamburger.removeClass('clicked')
    navMB.removeClass('active')
})

// btn = $('.btn')
// btn.click(function () {
//     $(this).addClass('active')
//     $(this).siblings().removeClass('active')
// })

// //----Change hover nav-----------
// $('header .nav-main li').hover(function(){
//     $('header .nav-main a').addClass('inactive')
// },
// function(){
//     $('header .nav-main a').removeClass('inactive')
// })


//-----Hide Header-----
window.onscroll = function (e) {
    // alert('a')
    // print "false" if direction is down and "true" if up
    let getScroll = document.querySelector("html").scrollTop;
    // console.log(getScroll,hSlider - offsetHeightHeader)
    if (((this.oldScroll > this.scrollY)) && (getScroll <= 200)) {
        $('header').removeClass('hide')
        // console.log('remove hide')
    }
    if ((this.oldScroll < this.scrollY) && (getScroll >= 200)) {
        $('header').addClass('hide')
        // console.log('add hide')
    }
    this.oldScroll = this.scrollY;
}

// //-------------------------MAIN-----------------------------
// Accordion button more 
var btn = document.querySelector(".project .more");
var list = document.querySelector(".project  .project__list");
var icon = document.querySelector(".project .more i");
if(btn !== null) {
    btn.addEventListener("click", function () {
        if (list.style.maxHeight != list.scrollHeight + "px" ) {
            list.style.maxHeight = list.scrollHeight + "px";
            btn.classList.add("active");
        } else {
            list.style.maxHeight = 730 + 'px';
            btn.classList.remove("active");
        } 
    })
}



jQuery(document).ready(function(){
    var elem = document.querySelector('.gallery-wrap');
    if(elem.classList.contains('cafe')){
        var flSlider = new Flickity( elem, {
            // options
                cellAlign: 'center',
                contain: true,
                wrapAround: false,
                draggable: false,
                prevNextButtons: false,
                pageDots: false,
                freeScroll: false,
                fullscreen: true,
            });
    }
    else {
        var flSlider = new Flickity( elem, {
            // options
                cellAlign: 'left',
                contain: true,
                wrapAround: true,
                draggable: true,
                prevNextButtons: true,
                pageDots: false,
                freeScroll: false,
                fullscreen: true,
            });
    }
    $('.btn-ctr .btn-right').click(function () {
        flSlider.next(false,false)
    })
    $('.btn-ctr .btn-left').click(function () {
        flSlider.previous(false,false)
    })
    $('.btn-fullscreen').on( 'click', function() {
        flSlider.viewFullscreen();
      });
    //-Fix bug resize but not responsive
    $(window).resize(function(){
        flSlider.destroy()
        flSlider = new Flickity( elem, {
            // options
              cellAlign: 'left',
              contain: true,
              draggable: true,
              prevNextButtons: false,
              pageDots: false,
              freeScroll: false
          });
    })
})

var initPhotoSwipeFromDOM = function(gallerySelector) {
    console.log('a')
    var parseThumbnailElements = function(el) {
        var thumbElements = el.childNodes,
            numNodes = thumbElements.length,
            items = [],
            figureEl,
            linkEl,
            size,
            item;
        for(var i = 0; i < numNodes; i++) {
            figureEl = thumbElements[i]; // <figure> element
            if(figureEl.nodeType !== 1) {
                continue;
            }
            linkEl = figureEl.children[0]; // <a> element
            size = linkEl.getAttribute('data-size').split('x');
            item = {
                src: linkEl.getAttribute('href'),
                w: parseInt(size[0], 10),
                h: parseInt(size[1], 10)
            };
            if(figureEl.children.length > 1) {
                item.title = figureEl.children[1].innerHTML; 
            }
            if(linkEl.children.length > 0) {
                // <img> thumbnail element, retrieving thumbnail url
                item.msrc = linkEl.children[0].getAttribute('src');
            } 
            item.el = figureEl; // save link to element for getThumbBoundsFn
            items.push(item);
        }
        return items;
    };
    var closest = function closest(el, fn) {
        return el && ( fn(el) ? el : closest(el.parentNode, fn) );
    };
    var onThumbnailsClick = function(e) {
        e = e || window.event;
        e.preventDefault ? e.preventDefault() : e.returnValue = false;
        var eTarget = e.target || e.srcElement;
        var clickedListItem = closest(eTarget, function(el) {
            return (el.tagName && el.tagName.toUpperCase() === 'FIGURE');
        });
        if(!clickedListItem) {
            return;
        }
        var clickedGallery = clickedListItem.parentNode,
            childNodes = clickedListItem.parentNode.childNodes,
            numChildNodes = childNodes.length,
            nodeIndex = 0,
            index;
        for (var i = 0; i < numChildNodes; i++) {
            if(childNodes[i].nodeType !== 1) { 
                continue; 
            }
            if(childNodes[i] === clickedListItem) {
                index = nodeIndex;
                break;
            }
            nodeIndex++;
        }
        if(index >= 0) {
            openPhotoSwipe( index, clickedGallery );
        }
        return false;
    };
    var photoswipeParseHash = function() {
        var hash = window.location.hash.substring(1),
        params = {};
        if(hash.length < 5) {
            return params;
        }
        var vars = hash.split('&');
        for (var i = 0; i < vars.length; i++) {
            if(!vars[i]) {
                continue;
            }
            var pair = vars[i].split('=');  
            if(pair.length < 2) {
                continue;
            }           
            params[pair[0]] = pair[1];
        }
        if(params.gid) {
            params.gid = parseInt(params.gid, 10);
        }
        return params;
    };
    var openPhotoSwipe = function(index, galleryElement, disableAnimation, fromURL) {
        var pswpElement = document.querySelectorAll('.pswp')[0],
            gallery,
            options,
            items;
        items = parseThumbnailElements(galleryElement);
        options = {
            galleryUID: galleryElement.getAttribute('data-pswp-uid'),
            getThumbBoundsFn: function(index) {
                var thumbnail = items[index].el.getElementsByTagName('img')[0], // find thumbnail
                    pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                    rect = thumbnail.getBoundingClientRect(); 

                return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
            },
            showAnimationDuration : 0,
            hideAnimationDuration : 0
        };
        if(fromURL) {
            if(options.galleryPIDs) {
                for(var j = 0; j < items.length; j++) {
                    if(items[j].pid == index) {
                        options.index = j;
                        break;
                    }
                }
            } else {
                options.index = parseInt(index, 10) - 1;
            }
        } else {
            options.index = parseInt(index, 10);
        }
        if( isNaN(options.index) ) {
            return;
        }
        if(disableAnimation) {
            options.showAnimationDuration = 0;
        }
        gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
        gallery.init();
    };
    var galleryElements = document.querySelectorAll( gallerySelector );
    for(var i = 0, l = galleryElements.length; i < l; i++) {
        galleryElements[i].setAttribute('data-pswp-uid', i+1);
        galleryElements[i].onclick = onThumbnailsClick;
    }
    var hashData = photoswipeParseHash();
    if(hashData.pid && hashData.gid) {
        openPhotoSwipe( hashData.pid ,  galleryElements[ hashData.gid - 1 ], true, true );
    }
};


 