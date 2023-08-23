const grid = JSON.parse(localStorage.getItem('grid')) || [
  [{user: undefined}, {user: undefined}, {user: undefined}],
  [{user: undefined}, {user: undefined}, {user: undefined}],
  [{user: undefined}, {user: undefined}, {user: undefined}]
];
const singleplayerScore = JSON.parse(localStorage.getItem('singleplayerScore')) || {wins: 0, losses: 0, draws: 0};
const twoplayerScore = JSON.parse(localStorage.getItem('twoplayerScore')) || {wins: 0, losses: 0, draws: 0};
const isDarkMode = JSON.parse(localStorage.getItem('darkMode')) || false;
let moveAlternator = JSON.parse(localStorage.getItem('moveAlternator')) || 9;
let meSymbol = localStorage.getItem('meSymbol') || 'cross';
let aiSymbol = (meSymbol === 'cross') ? 'circle' : 'cross';
let gameMode = localStorage.getItem('gameMode') || 'singleplayer';

if (isDarkMode) {
  document.querySelector('.dark-mode-switch').classList.add('dark-mode-switched');
  document.querySelector('.dark-mode-button').classList.add('dark-mode-button-switched');
  document.body.classList.add('dark-mode');
}

pickGameMode(gameMode);
pickSymbol(meSymbol);
updateHTML();
updateScore();


function pickSymbol(symbol) {
  document.querySelectorAll('.symbol-button').forEach((button) => {
    button.classList.remove('symbol-chosen');
  });
  document.querySelectorAll('.symbol').forEach((symbol) => {
    symbol.classList.remove('icon-white');
  });
  document.querySelector(`.${symbol}-button`).classList.add('symbol-chosen');
  document.querySelector(`.${symbol}`).classList.add('icon-white');
  meSymbol = symbol;
  aiSymbol = (meSymbol === 'cross') ? 'circle' : 'cross';
  localStorage.setItem('meSymbol', meSymbol);
  updateHTML();
}

function pickGameMode(chosenGameMode) {
  document.querySelectorAll('.gamemode').forEach((button) => {
    button.classList.remove('gamemode-chosen');
  });
  document.querySelectorAll('.gamemode-icon').forEach((symbol) => {
    symbol.classList.remove('icon-white');
  });
  document.querySelector(`.${chosenGameMode}`).classList.add('gamemode-chosen');
  document.querySelector(`.${chosenGameMode}-icon`).classList.add('icon-white');
  gameMode = chosenGameMode;
  if (gameMode === 'twoplayer') {
    document.querySelector('.first-label').innerHTML = 'PLAYER 1';
    document.querySelector('.second-label').innerHTML = 'PLAYER 2';
  } else {
    document.querySelector('.first-label').innerHTML = 'PLAYER';
    document.querySelector('.second-label').innerHTML = 'COMPUTER';
  }
  localStorage.setItem('gameMode', gameMode);
  updateScore();
}

function updateHTML() {
  grid.forEach((row, i) => {
    row.forEach((box, j) => {
      const gridBox = document.querySelector(`.R${i}C${j}`);
      if (box.user) {
        gridBox.classList.add('ttt-box-occupied');
        gridBox.style.cursor = 'default';
        const symbol = (box.user === 'me') ? meSymbol : aiSymbol;
        gridBox.innerHTML = `<img class="icon iR${i}C${j}" src="images/${symbol}.svg">`;
      } else {
        gridBox.classList.remove('ttt-box-occupied');
        gridBox.style.cursor = 'pointer';
        gridBox.innerHTML = '';
      }
    });
  });
  localStorage.setItem('grid', JSON.stringify(grid));
}

function clearHTML() {
  grid.forEach((row, i) => {
    row.forEach((box, j) => {
      box.user = undefined;
      const gridBox = document.querySelector(`.R${i}C${j}`);
      gridBox.classList.remove('ttt-box-win');
      gridBox.classList.remove('ttt-box-loss');
      updateHTML();
    });
  });
  moveAlternator = 9;
}

function updateScore() {
  if (gameMode === 'singleplayer') {
    localStorage.setItem('singleplayerScore', JSON.stringify(singleplayerScore));
    document.querySelector('.wins').innerHTML = singleplayerScore.wins;
    document.querySelector('.losses').innerHTML = singleplayerScore.losses;
    document.querySelector('.draws').innerHTML = singleplayerScore.draws;
  } else {
    localStorage.setItem('twoplayerScore', JSON.stringify(twoplayerScore));
    document.querySelector('.wins').innerHTML = twoplayerScore.wins;
    document.querySelector('.losses').innerHTML = twoplayerScore.losses;
    document.querySelector('.draws').innerHTML = twoplayerScore.draws;
  }
}

function rngMove() {
  function zeroToTwo() {
    const randomNumber = Math.random();
    if (randomNumber < 1/3) {
      return 0;
    } else if (randomNumber < 2/3) {
      return 1;
    } else {
      return 2;
    }
  }
  const aiMove = {i: undefined, j: undefined};
  let kCtr = 0, lCtr = 0;
  for (let i = 0; i < grid.length; i++) {
    let iCtr = 0, jCtr = 0;
    for (let j = 0; j < grid.length; j++) {
      if (grid[i][j].user === 'me') {
        iCtr++;
        if (i === j) {
          kCtr++;
        } if (i + j === 2) {
          lCtr++;
        }
      } if (grid[j][i].user === 'me') {
        jCtr++;
      }
    }
    for (let j = 0; j < grid.length; j++) {
      if (!grid[i][j].user) {
        if (iCtr === 2) {
          console.log(`Possible row counter found at [${i}][${j}]`);
          aiMove.i = i, aiMove.j = j;
          return aiMove;
        }
      }
      if (!grid[j][i].user) {
        if (jCtr === 2) {
          console.log(`Possible col counter found at [${j}][${i}]`);
          aiMove.i = j, aiMove.j = i;
          return aiMove;
        }
      }
    }
  }
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid.length; j++) {
      if (!grid[i][j].user) {
        if (i === j && kCtr === 2) {
          console.log(`Possible diag1 counter found at [${i}][${j}]`);
          aiMove.i = i, aiMove.j = j;
          return aiMove;
        }
        if (i + j === 2 && lCtr === 2) {
          console.log(`Possible diag2 counter found at [${i}][${j}]`);
          aiMove.i = i, aiMove.j = j;
          return aiMove;
        }
      }
    }
  }
  if (!aiMove.i && !aiMove.j) {
    while (true) {
      aiMove.i = zeroToTwo();
      aiMove.j = zeroToTwo();
      if (!grid[aiMove.i][aiMove.j].user) {
        break;
      }
    }
  }
  return aiMove;
}

function pickMove(i, j, user) {
  if (!grid[i][j].user) {
    grid[i][j].user = user;
    moveAlternator--;
    updateHTML();
    localStorage.setItem('moveAlternator', JSON.stringify(moveAlternator));
    localStorage.setItem('grid', JSON.stringify(grid));
  }
}

function playGame(i, j, user) {
  if (!grid[i][j].user) {
    if (moveAlternator % 2 === 0 && gameMode === 'twoplayer') {
      user = 'ai';
    }
    pickMove(i, j, user);
    if (checkWin(i, j, user).winStats === 'win') {
      displayResult(checkWin(i, j, user));
      return;
    } else if (checkWin(i, j, user).winStats === 'loss') {
      displayResult(checkWin(i, j, user));
      return;
    }

    if (!findEmpty()) {
      displayResult(undefined);
      return;
    }

    if (gameMode === 'singleplayer') {
      const aiMove = rngMove();
      pickMove(aiMove.i, aiMove.j, 'ai');
      if (checkWin(aiMove.i, aiMove.j, 'ai').winStats === 'loss') {
        displayResult(checkWin(aiMove.i, aiMove.j, 'ai'));
        return;
      }
      if (!findEmpty()) {
        displayResult(undefined);
        return;
      }
    }
  }
}

function checkWin(boxRow, boxCol, user) {
  const box = grid[boxRow][boxCol];
  const result = {winStats: undefined, winBox: []};
  let iCtr = 0, jCtr = 0, kCtr = 0, lCtr = 0;
  grid.forEach((row, i) => {
    row.forEach((box, j) => {
      if (box.user === user) {
        if (i === boxRow) {
          iCtr++;
          if (iCtr === 3) {
            result.winStats = true;
            for (let i = 0; i < 3; i++) {
              result.winBox.push({row: boxRow, col: i});
            }
          }
        } if (j === boxCol) {
          jCtr++;
          if (jCtr === 3) {
            result.winStats = true;
            for (let i = 0; i < 3; i++) {
              result.winBox.push({row: i, col: boxCol});
            }
          }
        } if (i === j) {
          kCtr++;
          if (kCtr === 3) {
            result.winStats = true;
            for (let i = 0; i < 3; i++) {
              result.winBox.push({row: i, col: i});
            }
          }
        } if (i + j === 2) {
          lCtr++;
          if (lCtr === 3) {
            result.winStats = true;
            for (let i = 0; i < 3; i++) {
              for (let j = 0; j < 3; j++) {
                if (i + j === 2) {
                  result.winBox.push({row: i, col: j});
                }
              }
            }
          }
        }
      }
    });
  });
  if (result.winStats) {
    if (box.user === 'me') {
      result.winStats = 'win';
    } else {
      result.winStats = 'loss';
    }
  } else {
    result.winStats = undefined;
  }
  return result;
}

function displayResult(result) {
  const score = (gameMode === 'singleplayer') ? singleplayerScore : twoplayerScore;
  document.querySelector('.ttt-cover').style.width = '100%';
  if (result) {
    if (result.winStats === 'win') {
      score.wins++;
    } else {
      score.losses++;
    }
    result.winBox.forEach((box) => {
      document.querySelector(`.R${box.row}C${box.col}`).classList.add(`ttt-box-${result.winStats}`);
      document.querySelector(`.iR${box.row}C${box.col}`).classList.add('icon-white');
    });
  } else {
    score.draws++;
    grid.forEach((row, i) => {
      row.forEach((box, j) => {
        document.querySelector(`.R${i}C${j}`).classList.add(`ttt-box-loss`);
        document.querySelector(`.iR${i}C${j}`).classList.add('icon-white');
      });
    });
    if (gameMode === 'singleplayer') showRpsHTML(1000);
  }
  updateScore();
  setTimeout(() => {
    clearHTML();
    document.querySelector('.ttt-cover').style.width = '0px';
  }, 1000);
}

function findEmpty() {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid.length; j++) {
      if (!grid[i][j].user) {
        return true;
      }
    }
  }
  return false;
}

grid.forEach((row, i) => {
  row.forEach((_, j) => {
    const box = document.querySelector(`.R${i}C${j}`);
    box.addEventListener('click', () => {
      playGame(i, j, 'me');
    });
  });
});

document.querySelector('.singleplayer').addEventListener('click', () => {
  pickGameMode('singleplayer');
  clearHTML();
});
document.querySelector('.twoplayer').addEventListener('click', () => {
  pickGameMode('twoplayer');
  clearHTML();
});
document.querySelector('.cross-button').addEventListener('click', () => {
  pickSymbol('cross');
});
document.querySelector('.circle-button').addEventListener('click', () => {
  pickSymbol('circle');
});
document.querySelector('.reset-score').addEventListener('click', () => {
  pickSymbol('circle');
  if (gameMode === 'singleplayer') {
    singleplayerScore.wins = 0, singleplayerScore.losses = 0, singleplayerScore.draws = 0;
  } else {
    twoplayerScore.wins = 0, twoplayerScore.losses = 0, twoplayerScore.draws = 0;
  }
  updateScore();
});

document.querySelector('.dark-mode-button').addEventListener('click', () => {
  document.querySelector('.dark-mode-switch').classList.toggle('dark-mode-switched');
  document.querySelector('.dark-mode-button').classList.toggle('dark-mode-button-switched');
  document.body.classList.toggle('dark-mode');

  const isDarkMode = document.body.classList.contains('dark-mode');
  localStorage.setItem('darkMode', isDarkMode);
});
