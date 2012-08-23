/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
module.exports = function createThrottledFunction(fn, MAX_DURATION, cache) {
	MAX_DURATION = MAX_DURATION || 2000;
	cache = cache || {};
	var lastTime = new Date();

	return function throttledFunction(identifier) {
		var args = Array.prototype.slice.call(arguments, 0);
		var callback = args.pop();
		var currentTime = new Date();

		// clear all if old
		if(currentTime - lastTime > MAX_DURATION) {
			for(var name in cache)
				delete cache[name];
		}

		var cacheEntry = cache[identifier];

		if(cacheEntry) {
			if(cacheEntry.listeners) {
				cacheEntry.listeners.push(callback);
				return cacheEntry.retVal;
			} else if(currentTime - cacheEntry.time <= MAX_DURATION) {
				callback(cacheEntry.err, cacheEntry.result);
				return cacheEntry.retVal;
			}
		}

		var listeners = [callback];
		cache[identifier] = cacheEntry = {
			listeners: listeners
		};

		// do the request
		lastTime = currentTime;
		args.push(function onThrottledFunctionCallback(err, result) {
			cacheEntry.time = currentTime;
			cacheEntry.err = err;
			cacheEntry.result = result;
			delete cacheEntry.listeners;
			listeners.forEach(function forEachFn(listener) {
				listener(err, result);
			});
		});
		var retVal = fn.apply(null, args);
		cacheEntry.retVal = retVal;
		return retVal;
	}
}

module.exports.sync = function createThrottledFunctionSync(fn, MAX_DURATION) {
	var err, result;
	var throttledFunction = createThrottledFunction(function() {
		var retVal, args = Array.prototype.slice.call(arguments, 0);
		var callback = args.pop();
		try {
			retVal = fn.apply(null, args);
		} catch(e) { callback(e); }
		callback();
		return retVal;
	}, MAX_DURATION);
	return function() {
		var args = Array.prototype.slice.call(arguments, 0);
		args.push(nop);
		return throttledFunction.apply(null, args);
	}
}

function nop(err) { if(err) throw err; }