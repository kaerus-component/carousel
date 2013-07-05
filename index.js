// CAROUSEL ////////////////////////////////////////////////////////
var ACTIVE_SLIDE = 'show', NEXT_SLIDE = 'next', PREVIOUS_SLIDE = 'prev';

function Carousel(container,tag) {

    if(typeof container === 'string')
        container = document.getElementById(container);

    if(!container) throw new Error("invalid carousel container");

    if(tag) tag = tag.toUpperCase();

    var childs = container.childNodes;

    var nodes = this.nodes = [];

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

    /* add slide class to every element */
    nodes.forEach(function(node){
        addClass(node,'slide');
    });

    /* cap the index */
    function cap(value){
        value = value % nodes.length;
        if(value < 0) value = nodes.length + value;

        return value;
    }

    /* node index */
    var index = 0;

    /* manages index updates */
    Object.defineProperty(this,'index',{
        enumerable:false,
        get: function(){
            return cap(index);
        },
        set: function(value){    

            index = cap(value);

            nodes.forEach(function(node){
                clearClass(node,[ACTIVE_SLIDE,NEXT_SLIDE,PREVIOUS_SLIDE]);
            });
 
            addClass(nodes[cap(index-1)], PREVIOUS_SLIDE);
            addClass(nodes[index], ACTIVE_SLIDE);
            addClass(nodes[cap(index+1)], NEXT_SLIDE);

            return index;
        }
    })
}

function addClass(node,type){
    
    if(typeof type === 'string') type = [type];

    node.className = node.className
                            .split(' ').filter(function(f){ return f ? type.indexOf(f) < 0 : false })
                            .concat(type).join(' ');
}

function clearClass(node,type){

    if(typeof type === 'string') type = [type];

    node.className = node.className
                            .split(' ')
                            .filter(function(f){ return type.indexOf(f) < 0 })
                            .reduce(function(a,b){
                                return a ? + (b ? ' ' + b : '') : b||'';
                            },'');
}

Carousel.prototype.next = function(){
   
    this.index = this.onNext(this.index);  
    this.setNextInterval();

    return this;
}

Carousel.prototype.prev = function(){

    this.index = this.onPrev(this.index);
    this.setNextInterval();

    return this;
}

Carousel.prototype.onNext = function(index){
    return ++index;
}

Carousel.prototype.onPrev = function(index){
    return --index;
}

Carousel.prototype.setNextInterval = function(interval){ 
    var self = this; 

    this.interval = isNaN(interval) ? (this.interval||4000): interval;

    if(!this.transit){
        this.startTime = new Date();

        this.transit = setTimeout(function(){
            self.transit = null;
            self.next();
        },this.interval);
    }    

    return this;
}

Carousel.prototype.show = function(index){
    index = isNaN(index) ? this.index : index;
    
    this.index = index; 

    return this;
};

Carousel.prototype.start = function(index,interval){  
    
    this.show(index);
    
    this.setNextInterval(interval);

    return this;
};

Carousel.prototype.stop = function(){

    this.startTime = null;

    if(this.transit){
        clearTimeout(this.transit);
        delete this.transit;
    }    

    return this;
}

Carousel.prototype.pause = function(){

    if(this.startTime) 
        this.pauseInterval = new Date() - this.startTime;

    this.stop();

    return this;
}

Carousel.prototype.resume = function(){

    this.setNextInterval(this.pauseInterval);

    return this;
}

module.exports = Carousel;