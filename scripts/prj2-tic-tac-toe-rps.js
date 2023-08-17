let tttOnGoing = false;
grid.forEach((row) => {
  row.forEach((box) => {
    if (box.user) {
      tttOnGoing = true;
      return;
    }
  });
});
if (!tttOnGoing && gameMode === 'singleplayer') showRpsHTML(500);

function rpsPickMove() {
  const randomNumber = Math.random();
  if (randomNumber < 1/3) {
    return 'rock';
  } else if (randomNumber >= 1/3 && randomNumber <2/3) {
    return 'paper';
  } else {
    return 'scissors';
  }
}

function rpsPlayGame(moveMe){
  let moveAi;
  const rpsResult = {winStatus: undefined, moveMe, moveAi};
  const rock = document.querySelector('.js-rock-button');
  const paper = document.querySelector('.js-paper-button');
  const scissors = document.querySelector('.js-scissors-button');
  const rps = document.querySelector('.rps-container');
  do {
    rpsResult.moveAi = rpsPickMove();
    if (moveMe === 'rock') {
      if (rpsResult.moveAi === 'paper') {
        rpsResult.winStatus = false;
      } else {
        rpsResult.winStatus = true;
      }
    } else if (moveMe === 'paper') {
      if (rpsResult.moveAi === 'scissors') {
        rpsResult.winStatus = false;
      } else {
        rpsResult.winStatus = true;
      }
    } else {
      if (rpsResult.moveAi === 'rock') {
        rpsResult.winStatus = false;
      } else {
        rpsResult.winStatus = true;
      }
    }
  } while (moveMe === rpsResult.moveAi);

  document.querySelector(`.js-${moveMe}-button`).classList.add('chosen-move');
  document.querySelector(`.js-${rpsResult.moveAi}-button`).classList.add('computer-move');
  document.querySelector(`.${rpsResult.moveAi}-icon`).classList.add('rps-icon');

  if (rpsResult.winStatus === true) {
    document.querySelector('.rps-title').innerHTML = 'You won!';
    document.querySelector('.rps-subtitle').innerHTML = 'You move first';
  } else {
    document.querySelector('.rps-title').innerHTML = 'You lost!';
    document.querySelector('.rps-subtitle').innerHTML = 'AI moves first';
  }
  setTimeout(() => {
    rps.style.opacity = '0';
    setTimeout(() => {
      rps.innerHTML = ``;
      rps.style.height = '0';
      rps.style.width = '0';
    }, 500);
  }, 1000);
  return rpsResult;
}

function showRpsHTML(interval) {
  const rpsHTML = `
  <div class="rps-box">
    <div class="rps-text">
      <p class="rps-title">Fight for the first move</p>
      <p class="rps-subtitle">in a game of Rock, Paper, Scissors!</p>
    </div>
    <div class="game-choices">
      <button class="game-choice js-rock-button"><img class="rock-icon" src="images/rps-rock.svg"></button>
      <button class="game-choice js-paper-button"><img class="paper-icon" src="images/rps-paper.svg"></button>
      <button class="game-choice js-scissors-button"><img class="scissors-icon" src="images/rps-scissors.svg"></button>
    </div>
  </div>`;
  const rps = document.querySelector('.rps-container');
  rps.innerHTML = rpsHTML;
  rps.style.height = '100vh';
  rps.style.width = '100vw';
  setTimeout(() => {
    rps.style.opacity = '1';
  }, interval);
  document.querySelector('.js-rock-button').addEventListener('click', () => {
    if (!rpsPlayGame('rock').winStatus) {
      const aiMove = rngMove();
      pickMove(aiMove.i, aiMove.j, 'ai');
    }
  });
  document.querySelector('.js-paper-button').addEventListener('click', () => {
    if (!rpsPlayGame('paper').winStatus) {
      const aiMove = rngMove();
      pickMove(aiMove.i, aiMove.j, 'ai');
    }
  });
  document.querySelector('.js-scissors-button').addEventListener('click', () => {
    if (!rpsPlayGame('scissors').winStatus) {
      const aiMove = rngMove();
      pickMove(aiMove.i, aiMove.j, 'ai');
    }
  });
}