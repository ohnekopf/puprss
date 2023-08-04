"use strict";

let store=[]
let out=[]
let done=false;

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
		store=store.concat( bar );
	}
}


let a= getjson().then(function (){
	done=true;
	let btn=document.getElementById("btn-add");
	btn.disabled=false;

});


function search (term) {
	let out=[];
	for (let n in  store){
		let hz=store[n];
		if (hz[0].includes(term)){
			out[out.length]=hz;
		}
	}
	return out;
}

function output (list) {
		out=list;
		const outdiv=document.getElementById("outdiv");
		let tbl = document.createElement("table");
		tbl.style.fontFamily="sans-serif" ;
		tbl.innerHTML='<tr  ><td>Hanzi</td><td>Freq Rank</td></tr>';
		outdiv.innerHTML="";
		outdiv.appendChild(tbl);

		for (let n in  list){
			let current=list[n];
			let tr = document.createElement("tr");
			tr.innerHTML=`<td>${current[0]}</td><td>${current[1]}</td>`;
			tbl.appendChild(tr);
		}
}



function ifenter () {
	if (!done){return;};
	const input=document.getElementById("in");
	let terms=search(input.value);
	output(terms);
}

