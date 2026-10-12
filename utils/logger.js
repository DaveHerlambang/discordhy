function write(method, scope, args) {
    console[method](`[${new Date().toISOString()}] [${scope}]`, ...args);
}

module.exports = {
    info: (scope, ...args) => write('log', scope, args),
    warn: (scope, ...args) => write('warn', scope, args),
    error: (scope, ...args) => write('error', scope, args),
};
