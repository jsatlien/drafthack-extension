//API class
class API {
 static serverAddress = "http://localhost:3001"

  static async getServerAddress() {
    const url = chrome.runtime.getURL('./config/config.json');
    const response = await fetch(url);
    const config = await response.json();
    this.serverAddress = config.server_address;
    console.log(this.serverAddress);
  }

  static async addPlayer(draftId, playerId) {
    await this.getServerAddress();
    if (draftId && playerId) {
      const url = `${this.serverAddress}/api/draft/${draftId}/${playerId}`;
      const response = await fetch(url, {
        method: 'PUT'
      });
      return response.json();
    } else {
      console.error('PUT addPlayer failed: no draft id or player id');
    }
  }

  static async createDraft(draftId) {
    await this.getServerAddress();

    console.log('creating...');
    const url = `${this.serverAddress}/api/draft`;
    if (draftId) {
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
          external_id: draftId,
          type: 'sleeper',
          picked: []
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.json();
    } else {
      console.error('POST createDraft: no draft id')
      return Promise.rejest(new Error('POST createDraft: no draft id'))
    }
  }
}

chrome.runtime.onConnect.addListener(function(port) {
  console.assert(port.name == "drafthack");
  port.onMessage.addListener(async function (msg) {
    console.log(msg);
    let response;
    switch (msg.type) {
      case 'ADD_DRAFT':
        console.log('adding draft') 
        response = await API.createDraft(msg.draftId);
        console.log(response);
        break;
      case 'PICK_PLAYER': 
        console.log('picking player');
        response = await API.addPlayer(msg.draftId, msg.playerId);
        console.log(response);
        break;  
    }
  });
});