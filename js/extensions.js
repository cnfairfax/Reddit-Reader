_.mixin({
	findPrimeFactor: function(n) {
		var i=2;
		while (i<=n){
			if (n%i == 0){
				n/=i;    
			}else{
				i++;
			}
		}
		return i;
	}
});

$.fn.extend({    //create default methods that you want to define
    do: function(callback){
		return (this.length ? callback : $.noop).call(this, this) || this;
	},
    fire: function(event){
		return this.trigger(event);
	}
});