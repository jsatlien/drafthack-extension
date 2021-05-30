class API {
    
    static serverAddress = localStorage.getItem('server_address') || 'http://localhost:3001'

    static addPlayer (draftId, playerId) {
        if (draftId && playerId) {
            const url =  `${this.serverAddress}/api/draft/${draftId}/${playerId}`;
            return $.ajax({
                url, 
                type: 'PUT',
            });
            // .then(success => {
            //     console.log('success!', success);
            // })
            // .catch(err => console.log(err));
        } else {
            console.error('PUT addPlayer failed: no draft id or player id');
        }
    }
    static createDraft (draftId) {
        const url =  `${this.serverAddress}/api/draft`;
        if (draftId) {
            return $.ajax({
                url,
                type: 'POST'
            })
        } else {
            console.error('POST createDraft: no draft id')
        }
    }
}