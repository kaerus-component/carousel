carousel
========

Simple carousel that toggles 'prev', 'show', 'next' classes on the carousel items.
It should not matter what type of html container is used as long as it contains some child elements.
If you have less than three elements the carousel creates clones from the existing nodes.
You define the style and transitioning effect on the parent container and the child elements 'prev','show','next' classes.

Usage
=====
```html
<!doctype html>
<html>
<head>
	<title>Carousel test</title>
</head>
<body>
	<div id="banner">
		<div>Hello</div>
		<div class="red">World!</div>
		<div class="back">You can slide anything you like</div>
		<div class="up resize">in almost any html container</div>
		<div class="spacing">and transition it as you want</div>
		<div>by defining only html and css.</div>
	</div>
	<style type="text/css">
		/* style the banner slide */
		#banner {
		    position: relative;
		    overflow: hidden;
		    padding: 0;
		    margin: 0;
		}

		#banner div {
		    position: relative;
		    display: none;
		    width: 100%;
		    height: 100%;
		    top: 0;
		    left: 0;
		    list-style-type: none;
		    padding: 0;
		    margin: 0;
		}  

		#banner div.show,
		#banner div.next,
		#banner div.prev {
		    display: block;
		}

		#banner div.next,
		#banner div.prev {
		    position: absolute;
		}

		/* add transitions */
		#banner div.show, 
		#banner div.prev {
	    	transition: .4s all ease;
    		-webkit-transition: 2s all ease;
    		-moz-transition: 2s all ease;
    		-o-transition: 2s all ease;
    	}

		/* next slide from left */
		#banner div.next {
    		left: -100%;
		}

		/* previous slide to right */
		#banner div.prev {
    		left: 100%;
		}

		#banner div.red {
			color: red;
		}	

		#banner div.back.next {
			left: 100%;
		}

		#banner div.back.prev {
			left: -100%;
		}

		#banner div.up.next {
			top: 100%;
		}

		#banner div.up.prev {
			top: -100%;
		}

		#banner div.resize.show {
			font-size: 2em;
		}

		#banner div.spacing.next {
			letter-spacing: 4em;
		}

	</style>
	<script src="../build/build.js"></script>
	<script>
		var carousel = require('carousel');
		
		new carousel('banner').start(0,3000);

	</script>
</body>
</html>
```

License
=======
```
Copyright (c) 2013 Kaerus (kaerus.com), Anders Elo <anders @ kaerus com>.
```
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
 
    http://www.apache.org/licenses/LICENSE-2.0
 
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

