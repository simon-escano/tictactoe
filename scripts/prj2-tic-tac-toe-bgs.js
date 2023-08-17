const bgObject = JSON.parse(localStorage.getItem('background')) || {choice: 0, filetype: 0};
changeBackground(bgObject);

function changeBackground(bgObject) {
  if (document.querySelector('.mini-background-selected')) {
    document.querySelector('.mini-background-selected').classList.remove('mini-background-selected');
  }
  document.querySelector('.background-container').innerHTML = `<img class="background" src="images/background${bgObject.choice}.${bgObject.filetype}">`
  if (bgObject.choice === 0) {
    document.querySelector(`.bgChoice${bgObject.choice}`).classList.add('none-selected');
  } else {
    document.querySelector(`.bgChoice${bgObject.choice}`).classList.add('mini-background-selected');
  }
  localStorage.setItem('background', JSON.stringify(bgObject));
}

document.querySelectorAll('.mini-background').forEach((bg, i) => {
  bg.addEventListener('click', () => {
    changeBackground({choice: (i+1), filetype: 'jpg'});
  });
});
document.querySelector('.bgChoice0').addEventListener('click', () => {
  changeBackground({choice: 0, filetype: 0});
}) 