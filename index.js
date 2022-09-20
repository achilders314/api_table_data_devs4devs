let sortedTableButton = document.getElementById('sort-data')
let sortedTableBody = document.getElementById('tbody')
let tableSectionBody = document.getElementById('data-table')
let controls = document.getElementById('controls')
let characterLookupBody = document.getElementById('character-lookup')


let dataTableButton = document.getElementById('data-table-button')
let characterLookupButton = document.getElementById('character-lookup-button')

let characterName = document.getElementById('character-name')
let characterPic = document.getElementById('character-pic')
let characterHomeworld = document.getElementById('homeworld')
let characterSpecies = document.getElementById('species')
let characterWiki = document.getElementById('wiki')


sortedTableButton.addEventListener('click', () => {
    fetchData();
}, false);
dataTableButton.addEventListener('click', () => {
    clickDataTable();
}, false);
characterLookupButton.addEventListener('click', () => {
    clickCharacterLookup();
}, false);

function clickDataTable(){
    controls.hidden = false;
    tableSectionBody.hidden = false;
    characterLookupBody.hidden = true;
    dataTableButton.classList.toggle('active');
    characterLookupButton.classList.toggle('active');
    fetchData();
    }

function clickCharacterLookup(){
    controls.hidden = true;
    tableSectionBody.hidden = true;
    characterLookupBody.hidden = false;
    dataTableButton.classList.toggle('active');
    characterLookupButton.classList.toggle('active');
    }

let characterData = []

function fetchData() {
    characterData = [];
    fetch('https://akabab.github.io/starwars-api/api/all.json')
    .then((response) => response.json())
    .then((data) => {   
        for(let i=0; i<data.length; i++){
            let first = data[i].name.split(' ')[0];
            let last = (data[i].name.split(' ')[1] === undefined) ? '' : data[i].name.split(' ')[1];
            let homeworld = (data[i].homeworld === undefined) ? '' : data[i].homeworld;
            let species = (data[i].species === undefined) ? '' : data[i].species;
            let wiki = (data[i].wiki === undefined) ? '' : data[i].wiki;
            let image = (data[i].image === undefined) ? '' : data[i].image;
            characterData.push({first: first, last: last, homeworld: homeworld, species: species, wiki: wiki, image: image})
        }
        return characterData
    })
    .then(characterData => sortData(characterData));
}

function sortData(data){
    let sortBy = document.getElementById('category');
    let sortByValue = sortBy['options'][sortBy.selectedIndex].value;
    console.log(sortByValue)
    const filteredUsers = data.filter(person => person[sortByValue] != '')
    console.log(filteredUsers)
    let sortedUsers = filteredUsers.sort((objA, objB) => {
        if(sortByValue !== "homeworld"){
        let nameA = objA[sortByValue].toLowerCase();
        let nameB = objB[sortByValue].toLowerCase();

        if(nameB > nameA){return -1}
        if(nameA > nameB){return 1}
        return 0;
    }
    else{
        let nameA = objA[sortByValue].toString().toLowerCase();
        let nameB = objB[sortByValue].toString().toLowerCase();

        if(nameB > nameA){return -1}
        if(nameA > nameB){return 1}
        return 0;
    }
    }

);
    displayData(sortedUsers);
}

function capitalizeFirst(word){
    let newWord = ''
    if(word !== ''){
    newWord = word[0].toUpperCase() + word.slice(1);
    }
    return newWord;
}

function rowIsClicked(row){
    let name = row.dataset.value;
    clickCharacterLookup();
    characterLookup(name);
  }

function addRowClickEvents(){
    let rows = document.querySelectorAll('.character-click');
    rows.forEach(row => {
      row.addEventListener('click', () => {
        rowIsClicked(row)
      }, false)
    })
}

function displayData(data){
    sortedTableBody.innerHTML = ''
    console.log(data)
    for(let i=0; i<data.length; i++){
        sortedTableBody.innerHTML += `
        <tr>
            <td class="character-click" data-value="${data[i]['first'] +' '+ data[i]['last']}" style="text-decoration: underline; color: blue; cursor: pointer;">${capitalizeFirst(data[i]['first'])}</td>
            <td>${capitalizeFirst(data[i]['last'])}</td>
            <td>${capitalizeFirst(data[i]['homeworld'])}</td>
            <td>${capitalizeFirst(data[i]['species'])}</td>
            <td><a href=${data[i]['wiki']} target="_blank">${data[i]['first']}'s Wiki</a></td>
            <td><img src=${capitalizeFirst(data[i]['image'])} alt="image of ${data[i]['first']}" style="width: 20px"></td>
        </tr>
            `
    }
    tableSectionBody.hidden = false;
    addRowClickEvents();
}

function characterLookup(name){
    let filteredCharacter;
        for(let i=0; i<characterData.length; i++){
            let charName = `${characterData[i]['first']} ${characterData[i]['last']}`
        if(charName === name){
            console.log(characterData[i])
            filteredCharacter = characterData[i]
        }
    }
    characterName.innerText = `Character: ${name}`;
    characterPic.innerHTML = (filteredCharacter.image === '') ? `<img style="max-width=100%; max-height: 300px;" src="no-image.png" />` : `<img style="max-width=100%;max-height: 300px" src=${filteredCharacter.image} />`
    characterHomeworld.innerText = `Homeworld: ${capitalizeFirst(filteredCharacter.homeworld)}`
    characterSpecies.innerText = `Species: ${capitalizeFirst(filteredCharacter.species)}`
    characterWiki.innerHTML = `Want more details? <a href=${filteredCharacter.wiki} target="_blank">Visit ${filteredCharacter.first}'s Wiki</a>`

}
