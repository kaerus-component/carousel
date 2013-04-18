var PREV = 'prev', SHOW = 'show', NEXT = 'next', 
    TRANSIT = [PREV, SHOW, NEXT];

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

    /* cap the index */
    function cap(value){
        value = value % nodes.length;
        if(value < 0) value = nodes.length + value;

        return value;
    }

    /* node index */
    var index = 0;

    /* nodes in transit */
    this.transits = {};

    /* manages index updates */
    Object.defineProperty(this,'index',{
        enumerable:false,
        get: function(){
            return index;
        },
        set: function(value){
            this.transits[PREV] = nodes[index];       
            index = cap(value);
            this.transits[SHOW] = nodes[index];
            this.transits[NEXT] = nodes[cap(index+1)];

            return index;
        }
    })
}


Carousel.prototype.next = function(){
   
    /* clears previous */
    if(this.transits[PREV])
        setClass(this.transits[PREV],null);

    this.index++;

    this.transition();

    return this;
}

function setClass(node,type){
    var classnames;

    classnames = node.className.split(' ').filter(function(f){return TRANSIT.indexOf(f) < 0});
    if(type) classnames[classnames.length] = type;
    node.className = classnames.join(' ');
}

Carousel.prototype.transition = function(){
    for(var i = 0; i < 3; i++){
        if((node = this.transits[TRANSIT[i]])) {
            setClass(node,TRANSIT[i]);
        }
    }    
}

Carousel.prototype.show = function(index){
    index = isNaN(index) ? this.index : index;
    
    Object.keys(this.transits).forEach(function(type){
        if(this.transits[type])
            setClass(this.transits[type],null);
    });

    this.index = index;

    this.transition();

    return this;
};

Carousel.prototype.setInterval = function(interval){ 
    var self = this;

    interval = isNaN(interval) ? (this.interval || 4000): interval;

    this.interval = interval;

    this.stop();

    function carousel(){self.next()}

    this._timer = setInterval(carousel,interval);

    return this;
}

Carousel.prototype.start = function(index,interval){  
    this.show(index);    
    this.setInterval(interval);

    return this;
};

Carousel.prototype.stop = function(){
    if(this._timer){
        clearInterval(this._timer);
        delete this._timer;
    }    
}

module.exports = Carousel;
