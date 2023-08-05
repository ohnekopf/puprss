"use strict";

let jiqi={};
jiqi.store=[];
jiqi.out=[];
jiqi.done=false;
jiqi.pagesize=20;
jiqi.currpage=0;

const files=[
	"./term_meta_bank_1.json",
	"./term_meta_bank_2.json",
	"./term_meta_bank_3.json",
	"./term_meta_bank_4.json",
	"./term_meta_bank_5.json"
];

async function getjson() {
	let a=[];
	for ( let file in files){
		a=a.concat(fetch(files[file]));
	}
	let b=[]
	for ( let pr in a){
		let foo = await a[pr] ;
		b=b.concat(foo );
	}
	for ( let pr in b){
		let bar= await b[pr].json();
		jiqi.store=jiqi.store.concat( bar );
	}
}

/*let a= getjson().then(function (){
	done=true;
	let btn=document.getElementById("btn-add");
	btn.disabled=false;

});
*/
function whendone(){
	jiqi.done=true;
	let btn=document.getElementById("btn-add");
	btn.disabled=false;

}
let a= getjson().then(whendone);

function search (term) {
	let out=[];
	for (let n in  jiqi.store){
		let hz=jiqi.store[n];
		if (hz[0].includes(term)){
			out[out.length]=hz;
		}
	}
	return out;
}

function output (list) {//this should be a method 
		jiqi.out=list; //store state
		jiqi.currpage=0;

		let maxpage=Math.floor(jiqi.out.length/jiqi.pagesize);
		maxpage-= (jiqi.out.length % jiqi.pagesize == 0) ? 1 : 0 ;
	
		jiqi.maxpage=maxpage; // calculate max page number

		tblupdate(); // print
}

function setpage(npage){   //this should be a method 
	if (npage<0 || npage>jiqi.maxpage){ return;}
	jiqi.currpage=npage;
	tblupdate();
}

function btnback() {//this should be a method 
	setpage(jiqi.currpage-1);
}
function btnfwrd(){//this should be a method 
	setpage(jiqi.currpage+1);
}



function tblupdate () { //this should be a method
	// delete previous content 
		const outdiv=document.getElementById("outdiv");
		let tbl = document.createElement("table");
		tbl.style.fontFamily="sans-serif" ;
		tbl.innerHTML='<tr  ><td>Hanzi</td><td>Freq Rank</td></tr>';
		outdiv.innerHTML="";
		outdiv.appendChild(tbl);

	//actually  make the list
		let list = jiqi.out.slice(jiqi.currpage*jiqi.pagesize,
									(jiqi.currpage+1)*jiqi.pagesize);
		for (let n in  list){
			let current=list[n];
			let tr = document.createElement("tr");
			tr.innerHTML=`<td>${current[0]}</td><td>${current[1]}</td>`;
			tbl.appendChild(tr);
		}

	// set buttons
	const back=document.getElementById("back");
	const fwrd=document.getElementById("fwrd");
	fwrd.disabled=false;
	if (0==jiqi.currpage){
		back.disabled=true;
	}else{
		back.disabled=false;
	}
	if (jiqi.maxpage==jiqi.currpage){
		fwrd.disabled=true;
	}else{
		fwrd.disabled=false;
	}
	mandarinspot.annotate();
}



function ifenter () {
	if (! jiqi.done){return;};
	const input=document.getElementById("in");
	let terms=search(input.value); // search terms, no side effects

	output(terms); // store terms to jiqi.out, print first page
}

