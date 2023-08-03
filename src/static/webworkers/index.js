// console.log(self);

self.onmessage = function(e) {
    // console.log(e);
    self.postMessage(e.data)
}