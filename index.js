var Emitter = require('emitter'),
    TRANSITIONS = ['prev','show','next'],
    DEFAULT_INTERVAL = 4000,
    CONTAINER_ID = 'carousel', 
    CLASS_NAME = 'carousel';


function Carousel(container,tag) {

    if(container) this.target(container);
    else this.target(CONTAINER_ID);

    if(tag) tag = tag.toUpperCase();

    var childs = this.elem.childNodes,
        nodes = [];

    /* get child nodes from parent container */
    for(var i = 0, l = childs.length; i < l; i++){
        if(childs[i].nodeType === 1 && (!tag || childs[i].nodeName === tag)){ 
            addTransitionListener(childs[i]);
            nodes.push(childs[i]);
        }    
    }

    /* clone nodes if we have less than three childs */
    for(var i = 0; nodes.length < 3; i++){
        nodes[nodes.length] = nodes[i].cloneNode(true);
        this.elem.appendChild(nodes[nodes.length-1]);
        addTransitionListener(nodes[nodes.length-1]);
    }

    /* cap the index */
    function cap(value){
        value = value % nodes.length;
        if(value < 0) value = nodes.length + value;

        return value;
    }

    /* item index */
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
            this.transits['prev'] = nodes[index];       
            index = cap(value);
            this.transits['show'] = nodes[index];
            this.transits['next'] = nodes[cap(index+1)];

            return index;
        }
    })
}

function addTransitionListener(elem){
    var cn = elem.className = CLASS_NAME + '-item';

    Emitter(elem).on('transition',function(type){
        this.className = type ? cn + ' ' + CLASS_NAME + '-' + type : cn;
    });
}

Carousel.prototype.target = function(elem){
    if(typeof elem === 'string')
        this.elem = document.getElementById(elem);
    else this.elem = elem;

    if(!this.elem) throw new Error("Carousel initiallized with invalid container");
    
    elem = this.elem;

    /* add class to container */
    if(elem.className) elem.className+= ' ' + CLASS_NAME;
    else elem.className = CLASS_NAME;

    return this;
}; 

Carousel.prototype.next = function(){
    if(this.transits['prev'])
        this.transits['prev'].emit('transition',null);

    this.index++;

    transition(this.transits);

    return this;
}

function transition(transits){
    TRANSITIONS.forEach(function(type){
        if(transits[type])
            transits[type].emit('transition',type);
    })     
}

Carousel.prototype.show = function(index){
    index = isNaN(index) ? this.index : index;
    
    this.index = index;

    transition(this.transits);

    return this;
};

Carousel.prototype.setInterval = function(interval){
    var self = this;

    interval = interval ? interval : DEFAULT_INTERVAL;

    this.interval = interval;

    this._timer = setInterval(function(){
        self.next();
    },this.interval);

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
