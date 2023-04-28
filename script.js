let xp = 0;
let health=100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory =["stick"];

const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterNameText = document.querySelector("#monsterNameText");
const monsterHealthText = document.querySelector("#monsterHealthText");

const weapons = [
    {
        name: "stick",
        power: 5
    },
    {
        name: "dagger",
        power: 30
    },
    {
        name: "claw hammer",
        power: 50
    },
    {
        name: "sword",
        power: 100
    }
];

const monster = [
    {
        name: "slime",
        level: 2,
        health: 15
    },
    {
        name: "fanged beast",
        level: 8,
        health: 50
    },
    {
        name: "dragon",
        level: 20,
        health: 300
    }
];

const locations = [
    {
        name : "town square",
        "button text": ["Go to store", "Go to cave", "Fight Dragon"],
        "button functions": [goStore,goCave,fightDragon],
        text : "You are in the town square. You see a sign that says \"store\"."
    },
    {
        name : "store",
        "button text": ["Buy 10 health (10 gold)", "Buy weapon (30 gold)", "Go to town square"],
        "button functions": [buyHealth,buyWeapon,goTown],
        text : "You enter the store"
    },
    {
        name: "cave",
        "button text": ["Fight Slime", "Fight fanged Beast", "Go to town square"],
        "button functions": [fightSlime,fightBeast,goTown],
        text : "You enter the cave. You see some monsters."
    },
    {
        name: "fight",
        "button text": ["Attack", "Dodge", "Run"],
        "button functions": [attack,dodge,goTown],
        text : "You are fighting a monster"
    },
    {
        name: "kill monster",
        "button text": ["Go to town square", "Go to town square", "Go to town square"],
        "button functions": [luckyplayer,goTown,goTown],
        // if you wanna use double quotes inside a line use single quotes outside
        text : 'The monster screams "Arg!" as it dies. You gain experience points and find gold.'
    },
    {
        name: "lose",
        "button text": ["Replay?", "Replay?", "Replay?"],
        "button functions": [restart,restart,restart],
        text : "You die and the monster eats pie."
    },
    {
        name: "win",
        "button text": ["Replay?", "Replay?", "Replay?"],
        "button functions": [restart,restart,restart],
        text : "You defeated the dragon! YOU WIN."
    },
    {
        name: "lucky player",
        "button text": ["3", "7", "Go to town square?"],
        "button functions": [selectThree,selectSeven,goTown],
        text : "You are lucky, you found a secret game. Pick a number mentioned above. Ten numbers will be picked randomly from 0 and 10. If the number you selected matches with the random number. you win some gold"
    }
];

// initialize buttons

button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

function update(location){
    monsterStats.style.display = "none";
    button1.innerText = location["button text"][0];
    button2.innerText = location["button text"][1];
    button3.innerText = location["button text"][2];
    button1.onclick = location["button functions"][0];
    button2.onclick = location["button functions"][1];
    button3.onclick = location["button functions"][2];
    // text.innerText = location["text"]; we can also use this but we can also use the below
    text.innerText = location.text;   // now this only works if its a single word (e.g -text,hello,bye)
}

function goTown(){
    update(locations[0]);
}

function goStore() {
    update(locations[1]);
}

function goCave() {
    update(locations[2])
}



function buyHealth() {
    if(gold>=10){
    gold-=10;  // or gold = gold -10;
    health +=10;
    goldText.innerText = gold;
    healthText.innerText = health;
    }
    else{
        text.innerText = "You don't have enough gold to buy Health";
    }
}

function buyWeapon(){
    if(currentWeapon< weapons.length-1){
    if(gold>=30){
        gold-=30;
        currentWeapon++;
        goldText.innerText= gold;
        let newWeapon = weapons[currentWeapon].name;  //or let newWeapon = weapons[currentWeapon]["name"]
        text.innerText= "You now have a " + newWeapon + ".";
        inventory.push(newWeapon);   //to push elements into an array
        text.innerText += " In your inventory you have : "+ inventory;
    } else {
        text.innerText= "You don't have enough gold to buy a weapon";
    }
} else {
    text.innerText= "You already have the most powerful weapon in your inventory";
    button2.innerText = "Sell weapon for 15 gold";
    button2.onclick = sellWeapon;
}
}

function sellWeapon(){
    if(inventory.length>1){
        gold += 15;
        goldText.innerText = gold;
        // if we use let keyword the scope of this currentWeapon is to only this block i.e if statement
        let currentWeapon = inventory.shift();
        text.innerText = "You sold a " + currentWeapon + ".";
        text.innerText +=" In your inventory you have: " + inventory;
    } else {
        text.innerText = "Don't sell your only weapon!";
    }
}


function fightSlime(){
    fighting = 0;
    goFight();
}

function fightBeast(){
    fighting = 1;
    goFight();
}

function fightDragon() {
    fighting = 2;
    goFight();
}

function goFight(){
    update(locations[3]);
    monsterHealth = monster[fighting].health;
    // below is updating css styles through javascript
    monsterStats.style.display = "block"; // to display the monster stats that is hidden through css.
    monsterNameText.innerText= monster[fighting].name;
    monsterHealthText.innerText = monsterHealth;
}

function attack(){
    text.innerText = "The " + monster[fighting].name + " attacks.";
    text.innerText += "You attack it with your " + weapons[currentWeapon].name + ".";
    if(MonsterHit()){
        health -= getMonsterAttackValue(monster[fighting].level);
    } else {
        text.innerText += "You miss broooooooo. "
    }
    // health -= getMonsterAttackValue(monster[fighting].level);
    monsterHealth -= weapons[currentWeapon].power + Math.floor(Math.random() * xp)+1; //4:15:00
    healthText.innerText = health;
    monsterHealthText.innerText = monsterHealth;
    if (health<=0){
        lose();
    }else if (monsterHealth<=0) {
        // if( fighting === 2){   //means if he is fighting dragon
        //     winGame();
        // } else {
        //     defeatMonster();
        // }
        fighting ===2 ? winGame() : defeatMonster();
    }
    if(Math.random <= .1 && inventory.length !==1){   //here we the players only weapon should not break.
        text.innerText += "Your " + inventory.pop() + "breaks. Better luck next time"; 
        //inventory.pop() removes the last element from the array
        currentWeapon--;
    }
}
function MonsterHit(){
    return Math.random() > .2 || health <20;//Math.random always returns a number b/w 0&1 so 80 % of the time
    // its true and 205 false since it is .2 alse here we used or operator.
    //and here it's always a hit if players health is less than 20.

}


function getMonsterAttackValue(level){
    let hit = (level*5) - (Math.floor(Math.random()*xp));
    // console.log(hit);
    return hit;
}

function dodge(){
    text.innerText = "You dodged the attack from " + monster[fighting].name + ".";
}

function defeatMonster(){
    gold += Math.floor(monster[fighting].level * 6.7);
    xp += monster[fighting].level;
    goldText.innerText = gold;
    xpText.innerText = xp;
    update(locations[4]);
}
function lose(){
    update(locations[5]);
}

function winGame(){
    update(locations[6]);
}

// when we call function restart all the variable should go back to its initial state
function restart(){
     xp = 0;
     health=100;
     gold = 50;
     currentWeapon = 0;
     inventory =["stick"];
     goldText.innerText = gold;
     healthText.innerText = health;
     xpText.innerText = xp;
     goTown();   
}

function luckyplayer(){   //if the player gets lucky and click omn some random button this function will be called
    update(locations[7]);
}

function selectThree(){
    select(3)
}
function selectSeven(){
    select(7);
}
function select(Randnum){
    let numbers = [];
    while(numbers.length <10){
        numbers.push(Math.floor(Math.random() *11));
    }
    text.innerText = "You have selected " +Randnum + " So. Here are the random numbers:\n";

    for(let j=0; j<10; j++){  
        text.innerText += numbers[j] + "\n";
    }
    if(numbers.indexOf(Randnum) !==-1){ //here it means if Randnum is present in the numbers otherwise it will return -1
        text.innerText +="Lucky. You won 30 gold!";
        gold+=30;
        goldText.innerText = gold;
    } else {
        text.innerText +="Bad Luck! You lose 5 health!";
        health -=5;
        healthText.innerText = health;
        if(health<=0){
            lose();
        }
    }
}
//just for creating a new branch in github
