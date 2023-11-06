async function SingleAnime()
{
    await new Promise(f => setTimeout(f, 2000));
    
    let id;
    let imageUrl_Banner;
    let genres = [];
    let publisher;
    let audios = [];
    let subTitles = [];

    // ID
    id = window.location.href.split('/')[5];

    // Image
    let img = GetElementsByClassName('content-image__fade--is-ready--5a8us')
    if(img.length > 0)
    {
        imageUrl_Banner = img[0]?.outerHTML.split('"')[3];
    }
    
    // Genre
    gen = GetElementsByClassName('badge__text-wrapper--Cku2k badge__text-wrapper--is-link--7wvjx');
    if(gen.length > 0)
    {
        for(g of gen)
        {
            let genre = g.innerText
            if(genre !== "")
                genres.push(genre);
        }
    }

    let tables = GetElementsByClassName('details-table__table-column-value--KeNXo')

    // Publisher
    publisher = tables[0].innerText

    // Audio
    let audioSplit = tables[1].innerText.split(',')
    for(let audio of audioSplit)
    {
        audios.push(audio.trim())
    }
    
    // subTitle
    let subTitleSplit = tables[2].innerText.split(',')
    for(let sub of subTitleSplit)
    {
        subTitles.push(sub.trim())
    }
    
    let anime = {id, imageUrl_Banner, genres, publisher, audios, subTitles}

    SendDataToAPI(anime);


}

async function New()
{
    await new Promise(f => setTimeout(f, 2000));

    let id;
    let url;
    let title;
    let description;
    let seasons;
    let episodes;
    let imageUrl_Card;
    let rating;


    //Scroll the Website to the End
    for(let i = 0; i < 45; i++)
    {
        console.log('>>>>>>>',i)
        await new Promise(f => setTimeout(f, 1500));
        window.scrollTo({ left: scroll, top: document.body.scrollHeight, behavior: "smooth" });
        scroll = document.body.scrollHeight;
    }


    let cards = GetElementsByClassName('browse-card-hover__poster-wrapper--Yf-IK');

    
    for(let i = 0; i < cards.length; i++)
     {
        // Url
     	url = cards[i].href

        // ID
        id = url.split('/')[5]
        
        // Title text--gq6o- text--is-m--pqiL- browse-card-hover__title--8m4Az
        let t = GetElementsByClassName('text--gq6o- text--is-m--pqiL- browse-card-hover__title--8m4Az')
        title = t[i].innerText

        // Description text--gq6o- text--is-m--pqiL- browse-card-hover__description--e28NH browse-card-hover__description--is-long--YqYWq
        let d = GetElementsByClassName('text--gq6o- text--is-m--pqiL- browse-card-hover__description--e28NH browse-card-hover__description--is-long--YqYWq')
        description = d[i].innerText

        // Seasons / Episodes
        let se = GetElementsByClassName('browse-card-hover__series-meta--hgyIc')
        let seSplit = se[i].innerText.split(/\r?\n/)
        seasons = parseInt(seSplit[0])
        episodes = parseInt(seSplit[1])

        //Image Url Card browse-card__poster-wrapper--pU-AW
        let img = GetElementsByClassName('browse-card__poster-wrapper--pU-AW')
        imageUrl_Card = img[i].outerHTML.split('"')[27];

        //Rating text--gq6o- text--is-m--pqiL- star-rating-short-static__rating--bdAfR
        let r = GetElementsByClassName('text--gq6o- text--is-m--pqiL- star-rating-short-static__rating--bdAfR')
        rating = parseFloat(r[i].innerText);

        let anime = {id,url,imageUrl_Card,title,description,seasons,episodes,rating}
        await SendDataToAPI(anime)
     }
}

async function SendDataToAPI(anime)
{
    console.log(anime)
    // Send Anime to API.
    await fetch('http://localhost:3000/api/crunchyroll/update', {
    method: "POST",
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    body: JSON.stringify({anime:anime, pw:123456})
});

}

function GetElementsByClassName(elementname)
{
    return window.document.getElementsByClassName(elementname);
}

if(window.location.href.includes('https://www.crunchyroll.com/de/series'))
    SingleAnime()

if(window.location.href.includes('https://www.crunchyroll.com/de/videos/new'))
    New();