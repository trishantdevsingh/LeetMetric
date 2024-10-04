const userinp = document.getElementById("username");
const searchbtn = document.querySelector(".button");
const easyLabel = document.getElementById("easylabel");
const midLabel = document.getElementById("mediumlabel");
const hardLabel = document.getElementById("hardlabel");
const easy = document.querySelector(".easyprogress");
const mid = document.querySelector(".mediumprogress");
const hard = document.querySelector(".hardprogress");
const cardstats  =document.querySelector(".cardstats");
const stats  =document.querySelector(".stats");
function isValidUser(username){
    if(username.trim() === ""){
        alert("Username section cant't be left empty!")
        return false;
    }const regex = /[a-zA-Z0-9_]{1,15}$/;
    let matching = regex.test(username);
    if(!matching){
        alert("Invalid uername!");return false;
    }
    return true;
}

async function getdetails(username){
    let url = `https://leetcode-stats-api.herokuapp.com/${username}`;
    try{
        searchbtn.textContent = "Searching...";
        searchbtn.disabled=true;
        const res =  await fetch(url);
        if(!res.ok){
            throw new Error("Unable to fetch user details!");
        }
        const data = await res.json();
        if(data.status == 'error'){
            throw new Error("User does not exist!");
        }
        console.log(data);
        displayUserData(data);
    }
    catch(e){
        stats.innerHTML=e.message;
        console.log(e);
    }
    finally{
        searchbtn.textContent = "Search";
        searchbtn.disabled=false;
    }
    
}
function progress(solved , total ,label, circle){
    let percent = (solved/total)*100;
    circle.style.setProperty("--progress" , `${percent}%`);
    label.innerHTML=`${solved}/${total}`;
}
function displayUserData(data){
    const totalHardQues = data.totalHard;
    const totalEasyQues = data.totalEasy;
    const totalMidQues = data.totalMedium;
    const solvedHardQues = data.hardSolved;
    const solvedEasyQues = data.easySolved;
    const solvedMidQues = data.mediumSolved;
    const acceptanceRate = data.acceptanceRate;
    const ranking = data.ranking;
    const totalSolved = data.totalSolved;
    progress(solvedEasyQues,totalEasyQues,easyLabel,easy);
    progress(solvedMidQues,totalMidQues,midLabel,mid);
    progress(solvedHardQues,totalHardQues,hardLabel,hard);
    let arr = [
        {
            label : "Acceptance rate",value :acceptanceRate
        },
        {
            label:"Ranking",value:ranking
        },
        {
            label:"Total questions solved",value:totalSolved
        }
    ];
    cardstats.innerHTML = arr.map(data=>{
        
        return(
            `<div class="card">
                <h3>${data.label}</h3>
                <p>${data.value}</p>
            </div>`
        );
    }).join("");
}
searchbtn.addEventListener('click' , function(){
    const username = userinp.value;
    if(isValidUser(username)){
        getdetails(username);
    }
});
