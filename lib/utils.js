module.exports = {
    /**
     * Returns method for calling passed method name on future object with inline
     * and future arguments
     * @param  {String}    method Method name
     * @param  {Any}       param1 (optional)
     * ...
     * @param  {Any}       paramN (optional)
     * @return {Function}  callback(obj, paramM, paramN, …)
     */
    callOn: function () {
        var args = Array.prototype.slice.call(arguments),
            command = args.shift();

        return function() {
            var cmdArgs = Array.prototype.slice.call(arguments),
                self = cmdArgs.shift();
            args.push.apply(args, cmdArgs);
            self[command].apply(self, args);
        };
    }
};
