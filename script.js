function goToNote(noteId){
	saveLastNote();
	openNote(noteId);
}
function saveLastNote(){
	let titleInput = document.getElementById('noteTitleInput');
	let textInput = document.getElementById('noteTextInput');

	let liList = Array.from(document.querySelectorAll('li'));
	for(let i = 0; i<liList.length; ++i){
		if(liList[i].dataset.selected === 'true'){
			let note = JSON.parse(localStorage.getItem(liList[i].dataset.noteId));
			if(titleInput.value!==note.title||textInput.value!==note.text){
				updateNote(note);
			}
			break;
		}
		if(i===liList.length-1){
			if((titleInput.value!=='') || (textInput.value!=='')){
				let note = createNewNote();
				addNoteToList(note);
			}	
		}
	}
}
function updateNote(note){
	let titleInput = document.getElementById('noteTitleInput');
	let textInput = document.getElementById('noteTextInput');
	note.date = formatDate(new Date);
	note.title = titleInput.value;
	note.text = textInput.value;
	localStorage.setItem(note.id, JSON.stringify(note));
	let liList = Array.from(document.querySelectorAll('li'));
	for(let i = 0; i<liList.length; ++i){
		if(liList[i].dataset.selected === 'true'){
			
			//????
			let ul = document.querySelector('ul');
			ul.prepend(liList[i]);
			liList[i].dataset.selected === 'false';
			selectDataInList(note);
			break;
			//
		}
	}
}
function selectDataInList(note){
	//меняем в li заголовок
	let titleSpan = document.querySelector('li .titleRow span');
	if(note.title===''){
		titleSpan.textContent = 'No title';
	}
	else{
		titleSpan.textContent = note.title.slice(0, 20);
	}
	//меняем в li текст заметки
	let textSpan = document.querySelector('li .textRow span');
	if(note.text===''){
		textSpan.textContent = 'No text';
	}
	else{
		textSpan.textContent = note.text.slice(0, 27);

	}
	//Меняем дату
	let dateSpan = document.querySelector('li .dateRow span');
	dateSpan.textContent = note.date;
	//li1 = document.querySelector('li');
	//li1.onclick = () => { clickLi(li1)}
}
function addNoteToList(note){
	//добавляем новый li
	addNewLi();
	let li = document.querySelector('li');
	li.dataset.noteId = note.id;
	selectDataInList(note);


	/*//меняем в li заголовок
	let titleSpan = document.querySelector('li .titleRow span');
	titleSpan.textContent = note.title;
	
	//меняем в li текст заметки

	let textSpan = document.querySelector('li .textRow span');
	textSpan.textContent = note.text;

	//Меняем дату
	let dateSpan = document.querySelector('li .dateRow span');
	dateSpan.textContent = note.date;*/

}
function addNewLi(){
	let li1 = document.querySelector('li');
	let newLi = li1.cloneNode(true);
	newLi.style.visibility = 'visible';
	let ul = document.querySelector('ul');
	ul.prepend(newLi);
	li1 = document.querySelector('li');
	li1.onclick = () => { clickLi(li1); };
	//li1.mouseover = () => { li1.style.backgroundColor = 'lightgray'; }
	//vcxli1.mouseout = () => { li1.style.backgroundColor = 'white'; }
	let btRemove = document.querySelector('li div .removeBt');
	btRemove.onclick = () => {removeLi(li1)};
	//li1.addEventListener("onclick", clickLi(li1));
}
function clickLi(element){
	goToNote(element.dataset.noteId);
	let liList = Array.from(document.querySelectorAll('li'));
	for(let i = 0; i<liList.length; ++i){
		liList[i].style.backgroundColor = 'white';
		liList[i].dataset.selected = 'false';
	}
	element.style.backgroundColor = 'lightgray';
	element.dataset.selected = 'true';
	//goToNote(element.dataset.noteId);
}
function openNote(noteId){
	let note = JSON.parse(localStorage.getItem(noteId));
	let titleInput = document.getElementById('noteTitleInput');
	let textInput = document.getElementById('noteTextInput');
	titleInput.value = note.title;
	textInput.value = note.text;
}



function clearNotepad(){
	document.getElementById('noteTitleInput').value = '';
	document.getElementById('noteTextInput').value = '';
}


function generateId(){
	let symbols = 'aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ1234567890';
	let id = '';
	for(var i=0; i<10; ++i){
		id+=symbols.charAt(Math.round(Math.random()*(symbols.length)));
	}
	return id;
}
function formatDate(date){
	let day = date.getDate()<10 ? '0'+date.getDate() : date.getDate();
	let month = date.getMonth()<10 ? '0'+date.getMonth() : date.getMonth();
	let year = date.getFullYear();
	let hours = date.getHours()<10 ? '0'+date.getHours() : date.getHours();
	let minutes = date.getMinutes()<10 ? '0'+date.getMinutes() : date.getMinutes();
	let seconds = date.getSeconds()<10 ? '0'+date.getSeconds() : date.getSeconds();
	return day+'.'+month+'.'+year+' '+hours+':'+minutes+':'+seconds;
}
function createNewNote(){
	let title = document.getElementById('noteTitleInput').value;
	let text = document.getElementById('noteTextInput').value;
	let noteId = generateId();
	let now = new Date;
	let date = formatDate(now);
	let newNote = new Note(noteId, title, text, date);
	let value = JSON.stringify(newNote);
	localStorage.setItem(noteId, value);
	return newNote;
}
function addNewNote(){
	saveLastNote();
	clearNotepad();
	let liList = Array.from(document.querySelectorAll('li'));
	for(let i = 0; i<liList.length; ++i){
		liList[i].style.backgroundColor = 'white';
		liList[i].dataset.selected = 'false';
	}
}
function removeLi(li){
	if(li.dataset.selected==='true'){
		clearNotepad();
	}
	localStorage.removeItem(li.dataset.noteId);
	li.remove();
	event.stopPropagation();
}

function showAllNotes(){
	if(localStorage.length!==0){
		let keys = Object.keys(localStorage);
		let notes =[];
		for(let key of keys){
			let note = JSON.parse(localStorage.getItem(key));
			notes.push(note);
		}
		notes.sort(compare);
		notes.forEach(addNoteToList);
	}
	
}
function compare(a, b){
	let aD = a.date;
	let bD = b.date;
	let aArr = aD.split(' ');
	let aDate = aArr[0].split('.');
	let aTime = aArr[1].split('.');
	let bArr = bD.split(' ');
	let bDate = bArr[0].split('.');
	let bTime = bArr[1].split('.');
	if(aDate[2]<bDate[2])
		return -1;
	else if(aDate[2]>bDate[2])
		return 1;
	else{
		if(aDate[1]<bDate[1])
			return -1;
		else if(aDate[1]>bDate[1])
			return 1;
		else{
			if(aDate[0]<bDate[0])
				return -1;
			else if(aDate[0]>bDate[0])
				return 1;
			else{
				if(aTime[0]<bTime[0]){
					return -1;
				}
				else if(aTime[0]>bTime[0]){
					return 1;
				}
				else{
					if(aTime[1]<bTime[1])
						return -1;
					else if(aTime[0]>bTime[0])
						return 1;
					else{
						if(aTime[2]<bTime[2])
							return -1;
						else
							return 1;
					}
				}
			}
		}
	}	
}
function addNoteFromStorage(note){
	addNoteToList();
}
(function (){
	const addButton = document.getElementById('addNote');
	addButton.onclick = () => { addNewNote()}
})()

showAllNotes();