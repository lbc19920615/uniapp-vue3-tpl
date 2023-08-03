worker.onMessage(e => {
    worker.postMessage(e)
})

// console.dir(worker)