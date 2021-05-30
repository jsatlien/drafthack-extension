
window.addEventListener('load', (event) => {
    console.log('load event fired');
    const path = window.location.pathname;
    if (window.location.host === 'sleeper.app' && path.includes('/draft/')) {
        console.log(window.location);
        const draftId = path.split('/')[3];

        console.log(draftId);

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
            API.createDraft(draftId)
            .then(data => console.log(data))
            .catch(err => console.log(err));
        }

        //let cells = document.getElementsByClassName('cell');
        // addCellChangeEvents($());
        // const c
        const cells = $('.cell');
        console.log(cells);
        if (cells.length) {
            cells.each(function () {
                if ($(this).hasClass('drafted')) {
                    console.log('drafted!')
                    let playerId = getPlayerId($(this));
                    if (playerId && !currentDraft.picked.includes(playerId)) {
                        currentDraft.picked.push(playerId);
                        saveDraft(currentDraft);
                    }
                } else {
                    $(this).on('DOMSubtreeModified', function (e) {
                        console.log('cell modified')
                        console.log($(this));
                        const playerAriaLabel = $(this).find('.avatar-player').attr('aria-label');
                        if (playerAriaLabel) {
                            let playerId = getPlayerId($(this));
                            if (playerId && !currentDraft.picked.includes(playerId)) {
                                currentDraft.picked.push(playerId);
                                console.log(currentDraft.picked);
                                saveDraft(currentDraft);
                            }
                        }
                    })
                }
            });
         
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

function saveDraft(currentDraft) {
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
