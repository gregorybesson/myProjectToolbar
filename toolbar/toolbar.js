// Change the URL of your served files
var serverUrl = 'http://myProjectToolbar.domain/toolbar/';

var cssUrl  = serverUrl + 'toolbar.css';
var jsUrl   = serverUrl + 'html2canvas.js';
var postUrl = serverUrl + 'toolbar-jira.php';


// Loading the css file
var head  = document.getElementsByTagName('head')[0];
var link  = document.createElement('link');
link.rel  = 'stylesheet';
link.type = 'text/css';
link.href = cssUrl;
link.media = 'all';
head.appendChild(link);

// Loading ** asynchronously ** the html2canvas js
var js = document.createElement("script");
js.type = "text/javascript";
js.src = jsUrl;
head.appendChild(js);

/*
  The html associated to the toolbar
*/
function writeHTMLasJS(){
document.write("<div id=\"adfab-toolbar\">");
document.write("	<div class=\"adf-toolbar-entry\">");
document.write("	    <div class=\"adf-toolbar-preview\">");
document.write("	        <img src=\"data:image\/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAABUUlEQVR42n1SPQtBYRj1J/gTNqUMRgaFIorJZDMrGcwGVjeDwcBilWKQhZRkkkxG5TOlyMdxnu7Nx/Xy9gznnOece5/7vNeCrzObIRJBNCrg+1hM/HRCqQSrFTYbNA3n89/A/Y7xGH4/4nHEYggEhFL8GTgcUCjA7Uang3ZbQLEoojpwu6Hfh8eDbBbHoxSB14vBQFqKwGaDXE4CHEM/o5FQimyZA5cLul1jhuvV6BGQUmSLho/AaoVUCsEgFouPiUkpskXDK8B0swmHA/W6YvG1mrRo0F8igfVaHmO3o1xGo4HJxLASkFJkiwbaJMA193pwOuFyIRRCOCyb3e2w3QogpcgWDbTRLIHlEsPhq+ZzuW8WwbtOmwTex+VaWi1kMsjnpQhIn0tT3DQ/q1KBz4dEQoqA9LlQ9b80naJaRTIpRUD671/SM/s90mkpApOb5wFcZpqHpuTsnAAAAABJRU5ErkJggg==\" alt=\"AdFab Toolbar\">");
document.write("	        <span class=\"adf-toolbar-info adf-toolbar-bold\" id=\"adf-toolbar-issue\">v1.0<\/span>");
document.write("	        <div class=\"adf-toolbar-detail\">");
document.write("	            <span class=\"adf-toolbar-info\">");
document.write("	                <a href=\"javascript:takeScreenShot()\">creer un bug<\/a>");
document.write("	            <\/span>");
document.write("	            <span class=\"adf-toolbar-info adf-toolbar-spacing\">");
document.write("	                <a href=\"http:\/\/www.adfab.fr\/\">Site AdFab<\/a>");
document.write("	            <\/span>");
document.write("	        <\/div>");
document.write("	    <\/div>");
document.write("	<\/div>");
document.write("");
document.write("    <a id=\"adb-toolbar-toggle\" class=\"adb-toolbar-hide-button\" href=\"javascript:void(0);\"><\/a>");
document.write("<\/div>");
}

function isIE () {
  var myNav = navigator.userAgent.toLowerCase();
  return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
}

/*
  Take a screenshot and send it to the Jira Issuer
*/
function takeScreenShot(){
	document.getElementById("adfab-toolbar").style.display = "none";
	var issue = prompt("Decrivez le bug : ", "");
	var ie = isIE();
	html2canvas(window.parent.document.body).then(function(canvas) {
		var canvasData = canvas.toDataURL("image/png");
			canvasData += "&code=" + toolbarCode + "&summary=" +encodeURIComponent(unescape(issue))+"&url="+encodeURIComponent(document.URL);


		if (ie > 0 && ie < 10) {
		 	var ajax = new XDomainRequest();
		 	ajax.open("POST",postUrl);
		} else {
			var ajax = new XMLHttpRequest();
			ajax.open("POST",postUrl,true);
		}
		
		ajax.onload = function() {
		 console.log(ajax.responseText);
		 document.getElementById("adf-toolbar-issue").innerHTML = ajax.responseText;
		};

		ajax.onerror = function() {
		  console.log('There was an error!');
		};

		ajax.send(canvasData );

		document.getElementById("adfab-toolbar").style.display = "block";
	}, function(error) {
        // Impossible to make a screenshot. I create the jira issue anyway
        var canvasData = "noimage";
            canvasData += "&code=" + toolbarCode + "&summary=" +encodeURIComponent(unescape(issue))+"&url="+encodeURIComponent(document.URL);

        if (ie > 0 && ie < 10) {
            var ajax = new XDomainRequest();
            ajax.open("POST",postUrl);
        } else {
            var ajax = new XMLHttpRequest();
            ajax.open("POST",postUrl,true);
        }
        
        ajax.onload = function() {
         console.log(ajax.responseText);
         document.getElementById("adf-toolbar-issue").innerHTML = ajax.responseText;
        };

        ajax.onerror = function() {
          console.log('There was an error!');
        };

        ajax.send(canvasData);

        document.getElementById("adfab-toolbar").style.display = "block";
    });
}

writeHTMLasJS();

/* 
  The toolbar
*/
(function() {

    /**
     * @param {Cookie} cookie
     * @returns {Toolbar}
     * @constructor
     */
    var Toolbar = function(cookie) {
        /** @type {Toolbar} */
        var self = this;
        /** @type {HTMLElement} */
        var container = document.getElementById("adfab-toolbar");
        /** @type {number} */
        var width = container.offsetWidth;
        /** @type {number} */
        var windowWidthDifference = window.innerWidth - width;
        /** @type {HTMLElement} */
        var toggleTrigger = document.getElementById("adb-toolbar-toggle");
        /** @type {boolean} */
        var hidden;
        /** @type {string} */
        var cookieKeyHidden = "adt-hidden";
        /** @type {number} */
        var widthHiddenState = 25;

        self.toggle = function() {
            !self.isHidden() ? self.hide() : self.show();
        };

        /**
         * @returns {boolean}
         * @throws {Error}
         */
        self.isHidden = function() {
            if (typeof(hidden) == "undefined") {
                throw new Error("Field 'hidden' didn't initialize.");
            }

            return hidden;
        };

        self.hide = function() {
            slide((widthHiddenState - width));

            toggleTrigger.innerHTML = ">";
            toggleTrigger.setAttribute("title", "Show Toolbar");
            hidden = true;

            cookie.set(cookieKeyHidden, 1);
        };

        self.show = function() {
            slide(0);

            toggleTrigger.innerHTML = "<";
            toggleTrigger.setAttribute("title", "Hide Toolbar");
            hidden = false;

            cookie.set(cookieKeyHidden, 0);
        };

        init();

        function init() {
            (cookie.get(cookieKeyHidden) == 1)
                ? self.hide()
                : self.show();

            initEvents();
        }

        function initEvents() {
            bindEvent(toggleTrigger, "click", self.toggle);
            bindEvent(window, "resize", resize);
        }

        /**
         * @param {number} toPosition
         */
        function slide(toPosition) {
            var increment = 30;

            var currentPosition = (container.style.left.length > 0)
                ? parseInt(container.style.left)
                : 0;

            if (currentPosition == toPosition) {
                return;
            }

            var moveLeft = (toPosition < currentPosition);
            var newPosition = toPosition;

            if (moveLeft) {
                var leftStep = currentPosition - increment;

                if (leftStep > toPosition) {
                    newPosition = leftStep;
                }
            } else {
                var rightStep = currentPosition + increment;

                if (rightStep < toPosition) {
                    newPosition = rightStep;
                }
            }

            container.style.left = newPosition + "px";

            setTimeout(function() { slide(toPosition); }, 3);
        }

        /**
         * @param {HTMLElement} node
         * @param {string} event
         * @param {function} handler
         */
        function bindEvent(node, event, handler) {
            if (node.attachEvent) {
                node.attachEvent("on" + event, handler);
            } else if (node.addEventListener) {
                node.addEventListener(event, handler, false);
            }
        }

        function resize() {
            var newWidth = window.innerWidth - windowWidthDifference;

            container.style.width = newWidth + "px";
            width = newWidth;

            self.isHidden() ? self.hide() : self.show();
        }

        return self;
    };

    /**
     * @returns {Cookie}
     * @constructor
     */
    var Cookie = function() {
        /** @type {Cookie} */
        var self = this;

        /**
         * @param {string} key
         * @returns {string|null}
         */
        self.get = function(key) {
            var cookie = document.cookie;

            if (cookie.indexOf(key + "=") == -1) {
                return null;
            }

            var regexp = new RegExp(key + "\=([^;]+)");

            return regexp.exec(cookie)[1];
        };

        /**
         * @param {string} key
         * @param {string} value
         */
        self.set = function(key, value) {
            document.cookie = key + "=" + value;
        };

        return self;
    };

    window.ADT = new Toolbar(new Cookie());

})();
