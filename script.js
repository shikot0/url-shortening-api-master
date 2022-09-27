const urlInput = document.getElementById('url-input'); 
const submitBtn = document.getElementById('submit-button');
const features = document.querySelectorAll('.feature'); 
const showMenuBtn = document.getElementById('show-nav-button');
const nav = document.querySelector('nav'); 

const urlOutputWrapper = document.getElementById('shortened-links-wrapper')
  
let storedLinks = localStorage.getItem("savedLinks") ? JSON.parse(localStorage.getItem("savedLinks")) : [];


const observer = new IntersectionObserver(entries => { 
	entries.forEach(entry => {
		if(entry.isIntersecting) {
			entry.target.classList.add('show');
		}
	}) 
})
features.forEach(feature => { 
	observer.observe(feature); 
})
showMenuBtn.addEventListener('click', () => {
	nav.classList.toggle('visible'); 
}) 
 
let copyBtns = []; 


submitBtn.addEventListener('click',() => {
	if(urlInput.value == '')  {
		urlInput.parentElement.classList.add('invalid')
	}else { 
		fetch(`https://api.shrtco.de/v2/shorten?url=${urlInput.value}`) 
		.then(resp => {
			return resp.json()
		})
		.then(data => {
			const shortenedLink = document.createElement('div');
			shortenedLink.classList.add('shortened-link-div');
			shortenedLink.innerHTML = `<p class="original-link">${urlInput.value}</p> 
									   <div class="output"> 
										 <p class="shortened-link-output">${data.result.full_short_link}</p>
									   </div>`
			const button = document.createElement('button');
			button.classList.add('copy-button');
			button.innerText = `Copy`; 
			shortenedLink.lastElementChild.append(button);
			urlOutputWrapper.append(shortenedLink);

			copyBtns.push(button); 
			storedLinks.push({
				output: data.result.full_short_link,
				input: urlInput.value,
			});  
			console.log(storedLinks) 
			localStorage.setItem("savedLinks", JSON.stringify(storedLinks));         
			 
			copyBtns.forEach(button => {
				button.addEventListener('click', () => { 
					navigator.clipboard.writeText(button.parentElement.firstElementChild.innerText)
					.then(() => {
						copyBtns.forEach(button => {
							button.innerText = `Copy`;
							button.style.backgroundColor = `hsl(180, 66%, 49%)`; 
						})
						button.innerText = `Copied!`;
						button.style.backgroundColor = `hsl(257, 27%, 26%)`; 
					}) 
				}) 
			})  
		})
	}
})       
 

  
window.addEventListener('DOMContentLoaded', () => {
	if(JSON.parse(localStorage.getItem("savedLinks")) != [{}]) {   
		storedLinks.forEach(link => {  
			const savedLink = document.createElement('div');
			savedLink.classList.add('shortened-link-div');
			savedLink.innerHTML = `<p class="original-link">${link.input}</p> 
								   <div class="output"> 
									 <p class="shortened-link-output">${link.output}</p> 
								   </div>`
			const button = document.createElement('button');
			button.classList.add('copy-button');
			button.innerText = `Copy`; 
			savedLink.lastElementChild.append(button); 
			copyBtns.push(button); 
			copyBtns.forEach(button => {
				button.addEventListener('click', () => { 
					navigator.clipboard.writeText(button.parentElement.firstElementChild.innerText)
					.then(() => {
						copyBtns.forEach(button => {
							button.innerText = `Copy`;
							button.style.backgroundColor = `hsl(180, 66%, 49%)`; 
						})
						button.innerText = `Copied!`;
						button.style.backgroundColor = `hsl(257, 27%, 26%)`; 
					}) 
				}) 
			})  
			urlOutputWrapper.append(savedLink);  
		}) 
	}
})


// CLEAR LOCALSTORAGE
setInterval(() => {
	localStorage.clear("savedLinks")
}, 300000) 