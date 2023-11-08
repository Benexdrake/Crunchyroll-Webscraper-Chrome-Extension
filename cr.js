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
    let img = window.document.getElementsByClassName('content-image__image--7tGlg content-image__fade--is-ready--5a8us')
    if(img.length > 0)
    {
        let image = img[0]?.outerHTML.split('"')[3];
        imageUrl_Banner = await imageUrlToBase64(image);
    }
    

    // Genre
    gen = document.getElementsByClassName('badge__text-wrapper--Cku2k badge__text-wrapper--is-link--7wvjx');
    if(gen.length > 0)
    {
        for(g of gen)
        {
            let genre = g.innerText
            if(genre !== "")
                genres.push(genre);
        }
    }

    let tables = document.getElementsByClassName('details-table__table-column-value--KeNXo')

    // Publisher
    publisher = tables[0]?.innerText

    // Audio
    let audioSplit = tables[1]?.innerText?.split(',')
    for(let audio of audioSplit)
    {
        audios.push(audio.trim())
    }
    
    // subTitle
    let subTitleSplit = tables[2]?.innerText.split(',')
    for(let sub of subTitleSplit)
    {
        subTitles.push(sub.trim())
    }
    
    let anime = {id, imageUrl_Banner, genres, publisher, audios, subTitles}

    await SendDataToAPI(anime, 'http://localhost:3000/api/crunchyroll/update');
}

async function New()
{
    await new Promise(f => setTimeout(f, 2000));

    //Scroll the Website to the End
    for(let i = 0; i < 45; i++)
    {
        console.log('>>>>>>>',i)
        await new Promise(f => setTimeout(f, 2000));
        window.scrollTo({ left: scroll, top: document.body.scrollHeight, behavior: "smooth" });
        scroll = document.body.scrollHeight;
    }


    let cards = window.document.getElementsByClassName('browse-card');

    for(let card of cards)
    {
        let anime = await getAnimeFromCard(card);
        if(anime)
        {
            await SendDataToAPI(anime, 'http://localhost:3000/api/crunchyroll/update')
        }
    }
}

async function getAnimeFromCard(card)
{
    let id, url,title,description,seasons,episodes,imageUrl_Card,rating;

    // Url
    let u = card.getElementsByClassName('browse-card__poster-wrapper--pU-AW');
    url = u[0].href;

    // ID
    id = url.split('/')[5]

    // Title
    let t = card.getElementsByClassName('text--gq6o- text--is-m--pqiL- browse-card-hover__title--8m4Az')
    title = t[0].innerText

    // Description
    let d = card.getElementsByClassName('text--gq6o- text--is-m--pqiL- browse-card-hover__description--e28NH browse-card-hover__description--is-long--YqYWq')
    
    if(d[0]?.innerText)
        description = d[0].innerText

    // Seasons / Episodes
    let se = card.getElementsByClassName('browse-card-hover__series-meta--hgyIc')
    if(se.length > 0)
    {
        let seSplit = se[0]?.innerText.split(/\r?\n/)
        seasons = parseInt(seSplit[0])
        episodes = parseInt(seSplit[1])
    }

    // Image Url Card
    let i = card.getElementsByClassName('content-image__image--7tGlg content-image__fade--is-ready--5a8us')
    imageUrl_Card = await imageUrlToBase64(i[0].src);

    // Rating
    let r = card.getElementsByClassName('text--gq6o- text--is-m--pqiL- star-rating-short-static__rating--bdAfR')
    rating = parseFloat(r[0].innerText);

    return {id,url,imageUrl_Card,title,description,seasons,episodes,rating}
}

async function SendDataToAPI(anime, apiUrl)
{
    Output(anime)
    // Send Anime to API.
    await fetch(apiUrl, {
    method: "POST",
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    body: JSON.stringify({anime:anime, pw:123456})
});

}

const imageUrlToBase64 = async (url) => {
    const data = await fetch(url);
    const blob = await data.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const base64data = reader.result;
        resolve(base64data);
      };
      reader.onerror = reject;
    });
  };

function GetElementsByClassName(elementname)
{
    let elements = window.document.getElementsByClassName(elementname);
    console.log(elements.length)
    return elements
}

function Output(anime)
{
    console.log('Saving', anime.title)
}

if(window.location.href.includes('https://www.crunchyroll.com/de/series'))
    SingleAnime()

if(window.location.href.includes('https://www.crunchyroll.com/de/videos/new'))
    New();