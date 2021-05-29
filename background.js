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