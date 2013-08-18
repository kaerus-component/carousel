// CAROUSEL ////////////////////////////////////////////////////////
/* element class mappings */
var CAROUSEL_SLIDE = 'slide', ACTIVE_SLIDE = 'show', NEXT_SLIDE = 'next', PREVIOUS_SLIDE = 'prev';

function Carousel(container,tag) {

    if(!container) container = "carousel";

    if(typeof container === 'string')
        container = document.getElementById(container);

    if(!container) throw new Error("invalid carousel container");

    if(tag) tag = tag.toUpperCase();

    var childs = container.childNodes;

    var nodes = this.slides = [];

    /* get child nodes from parent container */
    for(var i = 0, l = childs.length; i < l; i++){
        if(childs[i].nodeType === 1 && (!tag || childs[i].nodeName === tag)){ 
            nodes.push(childs[i]);
        }    
    }

    /* clone nodes if we have less than three childs */
    for(var i = 0; nodes.length < 3; i++){
        nodes[nodes.length] = nodes[i].cloneNode(true);
        container.appendChild(nodes[nodes.length-1]);
    }

    /* adds slide class to every element */
    addClass(nodes,CAROUSEL_SLIDE);

    var index, carousel = this;

    /* manages index updates */
    Object.defineProperty(this,'index',{
        enumerable:false,
        get: function(){
            return index;
        },
        set: function(to_index){    

            if(index === to_index) return index;

            to_index = cap(nodes.length,to_index);

            /* allows user to handle transitions */
            if(typeof carousel.onChange === 'function'){
                carousel.onChange(to_index,index);
            } else carousel.transit(to_index,index);

            return index = to_index;
        }
    })
}

/* cap the index */
function cap(max,value){
    value = value % max;
    if(value < 0) value = max + value;

    return value;
}

function addClass(node,type){  
    if(typeof type === 'string') type = [type];

    if(Array.isArray(node)){
        for(var i = 0; i < node.length; i++)
            addClass(node[i],type);
    } else {
        node.className = node.className
                            .split(' ').filter(function(f){ return type.indexOf(f) < 0 })
                            .concat(type).join(' ');
    }                        
}

function clearClass(node,type){

    if(typeof type === 'string') type = [type];

    if(Array.isArray(node)){
        for(var i = 0; i < node.length; i++)
            clearClass(node[i],type);
    } else {
        node.className = node.className
                            .split(' ')
                            .filter(function(f){ return type.indexOf(f) < 0 })
                            .reduce(function(a,b){
                                return a ? a + (b ? ' ' + b : '') : b||'';
                            },'');
    }                        
}

Carousel.prototype.next = function(){
    
    this.stop();

    this.index++;  

    return this;
}

Carousel.prototype.prev = function(){
 
    this.stop();

    this.index--;

    return this;
}

Carousel.prototype.transit = function(index,from){
    
    clearClass(this.slides,[ACTIVE_SLIDE,NEXT_SLIDE,PREVIOUS_SLIDE]);

    var prev = cap(this.slides.length,index-1),
        next = cap(this.slides.length,index+1);

    addClass(this.slides[prev], PREVIOUS_SLIDE);
    addClass(this.slides[index], ACTIVE_SLIDE);
    addClass(this.slides[next], NEXT_SLIDE);

    if(!this.paused) this.nextInterval();

    return this;
}

Carousel.prototype.nextInterval = function(){ 
    var self = this; 
    
    if(!this.timer){
        this.startTime = new Date();

        this.timer = setTimeout(function(){
            self.timer = null;
            self.next();
        },this.interval);
    }    

    return this;
}

Carousel.prototype.setInterval = function(interval){
    
    this.interval = isNaN(interval) ? (this.interval||4000): interval;

    return this;
}

Carousel.prototype.show = function(index){
    index = isNaN(index) ? this.index : index;
    
    this.stop();

    this.index = index; 

    return this;
};

Carousel.prototype.start = function(index,interval){  
    
    this.paused = undefined;

    this.setInterval(interval);

    this.show(index);
    
    return this;
};

Carousel.prototype.stop = function(){

    this.startTime = null;

    if(this.timer){
        clearTimeout(this.timer);
        this.timer = null;
    }    

    return this;
}

Carousel.prototype.pause = function(skipPauseInterval){

    this.paused = true;

    if(this.startTime && !skipPauseInterval) {
        this.pauseInterval = new Date() - this.startTime;
    }

    this.stop();

    return this;
}

Carousel.prototype.resume = function(skipPauseInterval){
    
    this.paused = false;

    if(skipPauseInterval || !this.pausesInterval) {
        this.nextInterval();
    } else {
        var interval = this.interval;

        /* resume from paused interval */
        this.setInterval(this.pauseInterval).nextInterval();

        this.interval = interval;
    }

    this.pauseInterval = null;

    return this;
}

module.exports = Carousel;