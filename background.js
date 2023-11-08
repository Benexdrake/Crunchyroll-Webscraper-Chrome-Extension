chrome.tabs.onUpdated.addListener(async (tabId, tab) => {

    if(tab?.url?.includes('https://www.crunchyroll.com/de/music'))
    {
        let urls = await fetch('http://localhost:3000/api/crunchyroll/urls').then(x => {return x.json()})

        for(let url of urls)
        {
            let newtab = await chrome.tabs.create({url:url});
            await WaitRemoveTab(newtab.id)
        }
    }
});


async function WaitRemoveTab(id)
{
    await new Promise(f => setTimeout(f, 3000));
    chrome.tabs.remove(id, function() {});
}