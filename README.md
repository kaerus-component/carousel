carousel
========

Simple carousel that toggles 'prev', 'show', 'next' classes on the carousel items.
It should not matter what type of html container is used as long as it contains some child elements.
If you have less than three elements the carousel creates clones from the existing nodes.
You define the style and transitioning effect on the parent container and the child elements 'prev','show','next' classes.

<p align="center">
  <img src="https://raw.github.com/kaerus-component/carousel/master/screenshot.png"/>
</p>

Usage
=====
```javascript
var carousel = require('carousel');

/* start carousel using #slideshow container */
new carousel('slideshow').start(0,5000);
```

Demo
====
<a href="http://www.kaerus.com/#!developments%23carousel">Live demo at Kaerus.com</a>

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

