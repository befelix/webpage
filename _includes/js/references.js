function createVideoElement(url) {
    // Create new video iframe
    var iframe = document.createElement("iframe");
    iframe.setAttribute("width", "560");
    iframe.setAttribute("height", "315");
    iframe.setAttribute("src", url);
    iframe.setAttribute("frameborder", "0");
    iframe.setAttribute("allowfullscreen", "true");
    return iframe
  }

// A function to add videos to divs
function getVideoUrl(link, autoplay=1) {
    // Extract video information
    var target = link.getAttribute('href');
    var video_id = link.getAttribute('video-id');
    var starttime = link.getAttribute('start');

    var url = "https://www.youtube.com/embed/" + video_id + "?autoplay=" + autoplay;
    // Add starttime to url if defined
    if (typeof starttime !== 'undefined') {
        url += "&start=" + starttime;
    }
    return url;
}

function getParameterByName(url, name) {
    // Extract url parameters
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(url);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

function replaceVideolinkByTab(link) {
    var video_url = link.getAttribute("href");

    var video_id = getParameterByName(video_url, 'v');
    var starttime = getParameterByName(video_url, 'start');
    var key = link.closest('div.reference').getAttribute('data-key');

    // Set attributes
    link.setAttribute("data-bs-toggle", "pill");
    link.setAttribute("href", '#' + key + '-video');
    link.setAttribute("video-id", video_id);
    link.setAttribute("role", "tab");
    link.setAttribute("artia-controls", key + "-video");
    if (starttime) {
        link.setAttribute('start', starttime);
    }
}

function handleTabClick(event) {
    var link = this
    ul = link.closest("ul");

    // If we're opening a new tab with content, let's remove existing videos (iframes)
    var video_div = ul.closest("div.reference").querySelector("div.tab-pane.ratio");
    if (video_div != null) {
        video_div.innerHTML = "";
    }

    previous_active = ul.getAttribute("previous-active");
    if (previous_active == link.id){
        // Here we've reclicked the same that was previously active -> deactivate
        link.classList.remove("active");
        target = document.querySelector(link.getAttribute("href"))
        target.classList.remove("active");
        ul.removeAttribute("previous-active");
    } else {
        // Update new active target
        ul.setAttribute("previous-active", link.id);

        // Load video into div on-demand
        if (link.classList.contains('video-tab')) {
            var video_iframe = createVideoElement(getVideoUrl(link));
            video_div.appendChild(video_iframe);
        }
    }
}

document.addEventListener("DOMContentLoaded", function(event) {

    // Make video links point to tab instead and add information
    document.querySelectorAll("div.reference a.nav-link").forEach(function (link) {
        if (link.classList.contains("video-tab")) {
            var video_url = link.getAttribute("href");

            var video_id = getParameterByName(video_url, 'v');
            var starttime = getParameterByName(video_url, 'start');
            var key = link.closest('div.reference').getAttribute('data-key');

            // Set attributes
            link.setAttribute("data-bs-toggle", "pill");
            link.setAttribute("href", '#' + key + '-video');
            link.setAttribute("video-id", video_id);
            link.setAttribute("role", "tab");
            link.setAttribute("artia-controls", key + "-video");
            if (starttime) {
                link.setAttribute('start', starttime);
            }
        }

        // handle the closing of active tabs
        if (link.hasAttribute("data-bs-toggle")) {
            link.addEventListener("click", handleTabClick);
        }
    });

    // Clicking the close button at the bottom of the abstract is equivalent to
    // clicking the Abstract button
    document.querySelectorAll("a.duplicate").forEach(function(link) {
        link.addEventListener("click", function(){
            var parent = this.getAttribute("duplicate-target");
            document.querySelector(parent).click();
        })
    })
});
