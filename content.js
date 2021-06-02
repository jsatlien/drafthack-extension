
window.addEventListener('load', (event) => {
    console.log('load event fired');
    const path = window.location.pathname;
    if (window.location.host === 'sleeper.app' && path.includes('/draft/')) {
        var port = chrome.runtime.connect({name: "drafthack"});
        port.postMessage('port connected to extension');
        console.log(port);
        console.log(window.location);
        const draftId = path.split('/')[3];

        console.log(draftId);

        if (draftId)
            port.postMessage({
                type: 'DRAFT_LOBBY_OPEN',
                draftId
            })

        const drafts = JSON.parse(localStorage.getItem('drafts')) || [];
        let currentDraft;
        if (draftId && drafts.length) {
            currentDraft = drafts.filter(dr => dr.id === draftId)[0];
        }

        if (!currentDraft) {
            currentDraft = {
                id: draftId,
                picked: []
            };
            //go ahead and push/save current draft in local storage
            drafts.push(currentDraft);
            localStorage.setItem('drafts', JSON.stringify(drafts));
            port.postMessage({
                type: 'ADD_DRAFT',
                draftId
            });
        }

        const cells = $('.cell');
        console.log(cells);
        if (cells.length) {
            cells.each(function () {
                if ($(this).hasClass('drafted')) {
                    console.log('drafted!')
                    let playerId = getPlayerId($(this));
                    if (playerId && !currentDraft.picked.includes(playerId)) {
                        currentDraft.picked.push(playerId);
                        saveDraft(port, currentDraft, playerId);
                    }
                } else {
                    $(this).on('DOMSubtreeModified', function (e) {
                        console.log('cell modified')
                        console.log($(this));
                        const playerAriaLabel = $(this).find('.avatar-player').attr('aria-label');
                        if (playerAriaLabel) {
                            let playerId = getPlayerId($(this));
                            if (playerId && !currentDraft.picked.includes(playerId)) {
                                saveDraft(port, currentDraft, playerId);
                            }
                        }
                    })
                }
            });    
        } else {
            //emit message to backend and tell client to reload draft page
        }
        console.log(cells);

    }
});

function getPlayerId(cellJqueryObj) {
    const playerAriaLabel = cellJqueryObj.find('.avatar-player').attr('aria-label');
    if (playerAriaLabel) {
        const playerId = playerAriaLabel.split(' ')[2];
        return playerId;
    }
}

function saveDraft(port, currentDraft, playerId) {
    currentDraft.picked.push(playerId);
    port.postMessage({
        type: 'PICK_PLAYER',
        draftId: currentDraft.id,
        playerId
    });
    const drafts = JSON.parse(localStorage.getItem('drafts'));
    let index = -1;
    drafts.forEach((draft, i) => {
        if (draft.id == currentDraft.id) {
            index = i;
        }
    });
    if (index >= 0) {
        drafts[index] = currentDraft;
    }

    localStorage.setItem('drafts', JSON.stringify(drafts));
}
