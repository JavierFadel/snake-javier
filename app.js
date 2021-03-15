// General constant for gameboard
const GAME_PIXEL_COUNT = 40;
const SQUARE_OF_GAME_PIXEL_COUNT = Math.pow(GAME_PIXEL_COUNT, 2);
const INITIAL_SCORE = 6;

let totalFoodAte = 0;



// Gameboard const
const gameContainer = document.querySelector('#gameContainer');

const createGameBoardPixels = () => {
    // Populate the [#gameContainer] div with small div's representing game pixels
    for (let i = 1; i <= SQUARE_OF_GAME_PIXEL_COUNT; ++i) {
        gameContainer.innerHTML = `${gameContainer.innerHTML} <div class="gameBoardPixel" id="pixel${i}"></div>`;
        // console.log(`${gameContainer.innerHTML} <div class="gameBoardPixel" id="pixel${i}"></div>`);
    }
}
// const gameBoardPixels = document.querySelector('.gameBoardPixel');
const gameBoardPixels = document.getElementsByClassName('gameBoardPixel');
console.log(gameBoardPixels);



// Food
let currentFoodPosition = 0;
const createFood = () => {
    // Remove previous food
    gameBoardPixels[currentFoodPosition].classList.remove('food');

    // Create new food 
    currentFoodPosition = Math.random();
    currentFoodPosition = Math.floor(currentFoodPosition * SQUARE_OF_GAME_PIXEL_COUNT);
    gameBoardPixels[currentFoodPosition].classList.add('food');
}



// Setting direction key
const LEFT_DIR = 'ArrowLeft';
const UP_DIR = 'ArrowUp';
const RIGHT_DIR = 'ArrowRight';
const DOWN_DIR = 'ArrowDown';



// Set snake default direction
let snakeCurrentDirection = RIGHT_DIR;

const changeDirection = newDirectionCode => {
    // Change direction of the snake
    if (newDirectionCode == snakeCurrentDirection) return;

    // Prevent sudden move
    if (newDirectionCode == LEFT_DIR && snakeCurrentDirection != RIGHT_DIR) {
        snakeCurrentDirection = newDirectionCode;
    } else if (newDirectionCode == UP_DIR && snakeCurrentDirection != DOWN_DIR) {
        snakeCurrentDirection = newDirectionCode;
    } else if (newDirectionCode == RIGHT_DIR && snakeCurrentDirection != LEFT_DIR) {
        snakeCurrentDirection = newDirectionCode;
    } else if (newDirectionCode == DOWN_DIR && snakeCurrentDirection != UP_DIR) {
        snakeCurrentDirection = newDirectionCode;
    }
}



// Starting point of the snake is in the middle of the board
// TODO: fix this
let currentSnakeHeadPosition = SQUARE_OF_GAME_PIXEL_COUNT / 2;
let snakeLength = 500;

// Make snake move continously by calling this function repeatedly
const moveSnake = () => {
    switch (snakeCurrentDirection) {
        case LEFT_DIR:
            --currentSnakeHeadPosition;
            const isSnakeHeadAtLastGameBoardPixelTowardsLeft = 
                currentSnakeHeadPosition % GAME_PIXEL_COUNT == GAME_PIXEL_COUNT - 1 || 
                currentSnakeHeadPosition < 0;
            if (isSnakeHeadAtLastGameBoardPixelTowardsLeft) {
                currentSnakeHeadPosition = currentSnakeHeadPosition + GAME_PIXEL_COUNT;
            }
            break;
        case UP_DIR:
            currentSnakeHeadPosition = currentSnakeHeadPosition - GAME_PIXEL_COUNT;
            const isSnakeHeadAtLastGameBoardPixelTowardsUp = 
                currentSnakeHeadPosition < 0;

            if (isSnakeHeadAtLastGameBoardPixelTowardsUp) {
                currentSnakeHeadPosition = currentSnakeHeadPosition + SQUARE_OF_GAME_PIXEL_COUNT;
            }
            break;
        case RIGHT_DIR:
            ++currentSnakeHeadPosition;
            const isSnakeHeadAtLastGameBoardPixelTowardsRight = 
                currentSnakeHeadPosition % GAME_PIXEL_COUNT == 0;
            if (isSnakeHeadAtLastGameBoardPixelTowardsRight) {
                currentSnakeHeadPosition = currentSnakeHeadPosition - GAME_PIXEL_COUNT;
            }
            break;
        case DOWN_DIR:
            currentSnakeHeadPosition = currentSnakeHeadPosition + GAME_PIXEL_COUNT;
            const isSnakeHeadAtLastGameBoardPixelTowardsDown = 
                currentSnakeHeadPosition > SQUARE_OF_GAME_PIXEL_COUNT - 1;
            if (isSnakeHeadAtLastGameBoardPixelTowardsDown) {
                currentSnakeHeadPosition = currentSnakeHeadPosition - SQUARE_OF_GAME_PIXEL_COUNT;
            }
            break;
        default:
            break;
    }

    let nextSnakeHeadPixel = gameBoardPixels[currentSnakeHeadPosition];

    // Kill snake if it bites itself
    if (nextSnakeHeadPixel.classList.contains('snakeBodyPixel')) {
        // Stop moving snake
        clearInterval(moveSnakeInterval);
        if (
            !alert(
                `You score is ${totalFoodAte + INITIAL_SCORE}.`
                )
            );
        window.location.reload();
    }

    // If not killed add the snake body
    nextSnakeHeadPixel.classList.add('snakeBodyPixel');

    // This function removes the snake body as the snake moving
    // Also note that snakeLength is used as the timeout interval
    setTimeout(() => {
        nextSnakeHeadPixel.classList.remove('snakeBodyPixel');
    }, snakeLength);

    // If snake bites the food 
    if (currentSnakeHeadPosition == currentFoodPosition) {
        // Update total food ate
        totalFoodAte++;
        // Update in UI
        document.getElementById('pointsEarned').innerHTML = totalFoodAte + INITIAL_SCORE;
        // Increase snake length
        snakeLength = snakeLength + 100;
        // Create new food
        createFood();
    }
}




// Create gameboard
createGameBoardPixels();
// Create initial food
createFood();

// Move snake
// the variable, 'moveSnakeInterval' is used to stop the snake on snake killed
var moveSnakeInterval = setInterval(moveSnake, 80);

// Call change direction function on keyboard key-down event
addEventListener('keydown', (e) => changeDirection(e.key));