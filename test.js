var blob = new Blob([JSON.stringify({ hello: '1`23' }, null, 2)], {
    type: 'application/json',
})
