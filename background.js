// let server = localStorage.getItem('server_address') || 'http://localhost:3001';
// localStorage.setItem('server_address', server);

// chrome.storage.sync.set({key: value}, function() {
//   console.log('Value is set to ' + value);
// });


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
      return fetch(url, {
        method: 'PUT'
      });
      // .then(success => {
      //     console.log('success!', success);
      // })
      // .catch(err => console.log(err));
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
    // if (msg.joke == "Knock knock")
    //   port.postMessage({question: "Who's there?"});
    // else if (msg.answer == "Madame")
    //   port.postMessage({question: "Madame who?"});
    // else if (msg.answer == "Madame... Bovary")
    //   port.postMessage({question: "I don't get it."});
  });
});


// let color = '#3aa757';
// let foundSleeper = false;
// let lobbyOpen = false;

// chrome.tabs.onUpdated.addListener(
//   function (tabId, changeInfo, tab) {
//     chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//       // since only one tab should be active and in the current window at once
//       // the return variable should only have one entry
//       const activeTab = tabs[0];
//       console.log(activeTab);
//       if (!lobbyOpen) {

//         if (activeTab && Object.keys(activeTab).length != 0) {
//           const { url, id } = activeTab;
//           if (url && url.includes('/sleeper.app/draft/')) {
//             foundSleeper = true;
//             if (activeTab.status === 'complete') {
//               draftOpen(tabId);
//             }         
//           }
//           else 
//             foundSleeper = false;
//         } else if (foundSleeper && !lobbyOpen) {
//             draftOpen(tabId);
//         }
//       }
//     });
//   }
// );

// function draftOpen (draftTabId) {
//   chrome.tabs.sendMessage(draftTabId, {
//     message: 'draft_lobby_open'
//   }, function (response) {
//     if (response) {
//       processDraftInitResponse(response);
//     }
//   });
//   lobbyOpen = true;
// }

// function processDraftInitResponse (res) {
//   if (!res.success) {
//     switch (res.error) {
//       case 'cells_not_found':
//         console.log('reload required');
//     }
//   }
// } 