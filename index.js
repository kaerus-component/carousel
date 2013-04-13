var TRANSITIONS = ['prev','show','next'],
    DEFAULT_INTERVAL = 4000;


function Carousel(container,classname,tag) {

    if(typeof container === 'string')
        container = document.getElementById(container);

    if(!container) throw new Error("invalid carousel container");

    classname = classname ? classname : 'carousel';

    if(tag) tag = tag.toUpperCase();

    var childs = container.childNodes, nodes = [];

    /* get child nodes from parent container */
    for(var i = 0, l = childs.length; i < l; i++){
        if(childs[i].nodeType === 1 && (!tag || childs[i].nodeName === tag)){ 
            childs[i].className = classname;
            nodes.push(childs[i]);
        }    
    }

    /* clone nodes if we have less than three childs */
    for(var i = 0; nodes.length < 3; i++){
        nodes[nodes.length] = nodes[i].cloneNode(true);
        container.appendChild(nodes[nodes.length-1]);
        nodes[nodes.length-1].className = classname;
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
            this.transits['prev'] = nodes[index];       
            index = cap(value);
            this.transits['show'] = nodes[index];
            this.transits['next'] = nodes[cap(index+1)];

            return index;
        }
    })
}


Carousel.prototype.next = function(){
    var node;

    if((node = this.transits['prev']))
        node.className = node.className.split(' ')[0];

    this.index++;

    transition(this.transits);

    return this;
}

function transition(transits){
    var node, classname; 

    TRANSITIONS.forEach(function(type){
        if((node = transits[type])) {
            classname = node.className.split(' ')[0];
            node.className = classname + ' ' + classname + '-' + type;
        }
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
