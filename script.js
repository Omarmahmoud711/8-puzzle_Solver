//first thing we need to make a Data structure called priority queue , which is a binary heap
//we are going to use this data structure when we start solving by Greedy best first search algorithm 
//so this is the class implementing the priority queue
//----------------------------------------------------
class PriorityQueue {
    constructor() {
        this.elements = [];
    }

    enqueue(element, priority) {
        this.elements.push({ element, priority });
        this.elements.sort((a, b) => a.priority - b.priority);
    }

    dequeue() {
        return this.elements.shift().element;
    }

    isEmpty() {
        return this.elements.length === 0;
    }
}
//This priority queue is implemented as an array of objects,
//where each object has two properties: element (the actual data) and priority (the priority of that data).
// When you enqueue an element, it is added to the array, and the elements are sorted based on their priorities.
// When you dequeue an element, you remove the element with the highest priority. Here's an example:
//
//const pq = new PriorityQueue();-------->creates a new pq
//
// 
//pq.enqueue("Task 1", 3);
//pq.enqueue("Task 2", 1);
//pq.enqueue("Task 3", 2);
//
//const highestPriorityElement = pq.dequeue(); ----> "Task 2"
//const nextPriorityElement = pq.dequeue();   ---> "Task 3"
//const lowestPriorityElement = pq.dequeue(); ---> "Task 1"
//
// The elements array now looks like this (sorted by priority):
// [{ element: "Task 2", priority: 1 },
//  { element: "Task 3", priority: 2 },
//  { element: "Task 1", priority: 3 }]
//
//End of priority queue implementation & explanation




//now for implementing the stack that is going to be used in dfs:

class Stack {
    constructor() {
      this.items = [];
    }
  
    push(element) {
      this.items.push(element);
    }
  
    pop() {
      return this.items.pop();
    }
  
    peek() {
      return this.items[this.items.length - 1];
    }
  
    isEmpty() {
      return this.items.length === 0;
    }
  
    size() {
      return this.items.length;
    }
  }


  

let moveCount = 0;
// the move count variable is a variable that indicates how many states we pushed inside a stack or queue

let puzzle_state = [ 1,2,3,4,5,6,7,0,8]; // Initial puzzle state

//we can adjust the starting puzzle state as we like

let animationSpeed = 500; // Default animation speed




document.addEventListener("DOMContentLoaded", function () {

    //this is the function where the page awakens at , by other means the page is displayed and adjusted by this function 

    const puzzleContainer = document.getElementById("puzzle");//this is our puzzle

    const randomizeButton = document.getElementById("randomizeButton");//the randomize button

    const moveCountElement = document.getElementById("moveCount");//the moves window

    const solveButton = document.getElementById("solveButton");//solve button

    const algorithmSelect = document.getElementById("algorithmSelect");//the select option algorithm 

    // first we need to Initialize the default puzzle tiles, so this is how we call this function 
    initializePuzzle();

    //this is the implementation of the function :
    function initializePuzzle() {

        for (let i = 0; i < 9; i++) {
            const tile = document.createElement("div");//creating the puzzle tiles , numbered from 0 to 8 

            tile.classList.add("tile");

            tile.setAttribute("data-id", i);

            if (puzzle_state[i] === 0) {
                tile.style.visibility = "hidden";//this is to make always the tile that has value 0 to be hidden 
            }

            //if we want to play with the puzzle without making the AI solving it we can do clicking on any tile 
            //but we need a move tile function
            //so @ clicking we call move function we send to it the index of the tile we clicked 
            //
            //ex:
            // 1    4   3
            // 2    5   6
            // 7    8   0
            //and we clicked on the number 4 , which is the tile index no.1 because this puzzle is represented as a 1D array like this 
            // [1,4,3,2,5,6,7,8,0]
            //later on we are going to check if the click that we made is a valid move or not by the help of another function
            tile.addEventListener("click", function () {

                moveTile(i,1);
                //the one that sent with the i here will not make any sense to u but this is how i'm telling the moves to 
                //increase , if i sent 1 then let the moves increase , if i sent 0 they don't increase
            });


            const tileContent = document.createElement("div");
            tileContent.classList.add("tile-content");
            tileContent.textContent = puzzle_state[i];
            tile.appendChild(tileContent);
            puzzleContainer.appendChild(tile);
            //thse are just to maintain the structure of the html , they have nothing to do with the algorithm.
        }
    }
    //end of initiallizing the page

    //this is the function that makes the movment of the tiles:
    //--------------------------------------------------------
    //let's use the disscussed example:
    // 1    4   3
    // 2    5   6
    // 7    8   0
    //--->we clicked on number 4 which is tileindex no.1
    function moveTile(tileIndex,increase) {
        //for the given example ,tileindex is now=1


        const emptyTileIndex = puzzle_state.findIndex(tile => tile === 0);
        //this line gets the index of the tile that has value 0 in it ,"the emppty tile", in our example the hidden tile is located
        //at index no.8
        //first we check if it's a valid move by the help of another function
        //we send to this function the tile ndex that we are trying to move , and the empty tile index

        if (isValidMove(tileIndex, emptyTileIndex)) {
            //if it's a valid move:
            puzzle_state[emptyTileIndex] = puzzle_state[tileIndex];//we do the swapping of them 
            puzzle_state[tileIndex] = 0;
            updatePuzzleState();//then we update the puzzle state by calling other function
            if(increase === 1){
            moveCount++;
            moveCountElement.textContent = moveCount;}
        }
    }


    //this is the function that check if the move is valid , it returns true or false
    //considering the same example:
    // 1    4   3
    // 2    5   6
    // 7    8   0
    //we clicked on 4
    //tile we want to move index =1 , empty tile index = 8
    function isValidMove(tileIndex, emptyTileIndex) {
        const row = Math.floor(tileIndex / 3);//the row where the tile we want to move is located at
        //for this example :floor(1/3)---->equals 0 

        const col = tileIndex % 3;//the column where the tile we want to move is located at
        //for this example :(1 % 3 )---->equals 1 

        const emptyRow = Math.floor(emptyTileIndex / 3);//the row where the empty tile  is located at
        //for this example :floor(8 / 3 )---->equals 2 

        const emptyCol = emptyTileIndex % 3;//the col where the empty tile  is located at
        //(8 % 3 )---->equals 2 

        const rowDiff = Math.abs(row - emptyRow);//get the rows diffrence in absolute 
        // abs( 0 - 2) = 2

        const colDiff = Math.abs(col - emptyCol);//get the columns diffrence in absolute 
        // abs( 1 - 2) = 1

        return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);

        //return (2 ===1 &&  1===0  ||  2==0 && 1===1) --->return false because this isn't a valid move from the start
    }


    //this is the function that updates the puzzle , for example if we made a valid move 
    //it just makes the the tile that we clicked on to be hidden as it was replaced with the hidden tile
    //and it makes the tile that is replaced to be visible 

    function updatePuzzleState() {
        const tiles = document.querySelectorAll('.tile');
        tiles.forEach((tile, index) => {
            if (puzzle_state[index] === 0) {
                tile.style.visibility = 'hidden';
            } else {
                tile.style.visibility = 'visible';
                tile.querySelector('.tile-content').textContent = puzzle_state[index];
            }
        });
    }



    //if we clicked on the randomize button , we go to a function called randomize tiles and execute it:
    randomizeButton.addEventListener("click", randomizeTiles);

    //this is the randomize function:
    function randomizeTiles() {
        do {
            shuffleArray(puzzle_state);
        } while (!isSolvable(puzzle_state));//do array shuffling untill u find a solvable pattern , because if we try to shuffle 
        //without checking that if this puzzle solvable or not we might end with a puzzle that looks like this :
        //1 2 3
        //4 5 6
        //8 7 0
        //whatever we do to try to solve this puzzle , it's unsolvable , so we keep random shuffling till we find a solvable pattern
        updatePuzzleState();
        //then we update the puzzle state and return the moves back to 0
        moveCount = 0;
        moveCountElement.textContent = moveCount;
    }

    //this is the function that shuffles the array it uses math.random with the size of array to make any possible pattern
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }


    //this is the function that checks the solvable or not , it's based on inversions 
    // if inversions can be devided by 2 then it's solvable,else , not solvable
    //for example: the puzzle now is represented like [1 2 3 4 5 6 8 7 0]
    //1 2 3
    //4 5 6
    //8 7 0
    function isSolvable(puzzle) {
        const inversionCount = countInversions(puzzle);
        return inversionCount % 2 === 0;
    }



    //we itterate in a nested loop overr the array and compare each number with the proceeding number , if the number is greater
    //than the proceeding number , this is called an inversion 
    //for example :
    //[1 2 3 4 5 6 8 7 0]
    //we checked one with all the elements "not including 0" so one is the smallest one of them
    //then we check 2 with 3,4,5,6,8,7 it's the smallest one so no inversions
    //we check 3 with 4,5,6,8,7 also no inversions
    //we check 4 with 5,6,8,7 still no inversions
    //we check 5 with 6,8,7 yet no inversions
    //check 6 with 8,7 still it's the smallest 
    //we check 8 with 7 -------> this is inversion because 8 > 7 and 7 is proceeding 8
    //we are left with 7 which is only 1 number , we don't compare it with anything
    //the inversions count is now =1 which can't be devided by 2 so this puzzle can't be solved
    function countInversions(puzzle) {
        let inversionCount = 0;
        for (let i = 0; i < puzzle.length - 1; i++) {
            for (let j = i + 1; j < puzzle.length; j++) {
                if (puzzle[i] > puzzle[j] && puzzle[i] !== 0 && puzzle[j] !== 0) {
                    inversionCount++;
                }
            }
        }
        return inversionCount;
    }




    //this is when we click on the solve button then we call a function called solve puzzle that has all the algorithms we implemented
    solveButton.addEventListener("click", solvePuzzle);



    //this is where all the algorithms are implemented at
    function solvePuzzle() {
        
    //first we need to know what is the algorithm that the user chosen by this line 
    const selectedAlgorithm = algorithmSelect.value;



    // we can always change the goal state from here 
    const goalState = [1,2,3,4,5,6,7,8,0]; 

    if (selectedAlgorithm === 'dfs') {
        moveCount=0;//number of pushed states =0
        let poppedCount = 0; // number of popped states
        const visitedStates = new Set();//set that holding the states we visited
        const stack = new Stack();//initializing the stack
        stack.push({ state: puzzle_state.slice(), path: [] });//first push the initial state along with empty array to hold the path taken
        console.log(puzzle_state, "pushed");//print it in the console

        let foundSolution = false;
        let printedRunningTime = false;

        animationSpeed = parseInt(prompt("Enter animation speed (milliseconds):", 500));
        const startTime = performance.now();

        function dfs() {
            if (stack.length === 0 || foundSolution) {
                if (!printedRunningTime) {
                    printedRunningTime = true;
                    const endTime = performance.now();
                    const runningTime = endTime - startTime;
                    console.log("Total running time: ", runningTime, "milliseconds");
                }
                return;
            }

            const { state, path } = stack.pop();
            console.log(state, "popped");
            poppedCount++;
            visitedStates.add(state.toString());

            if (arraysEqual(state, goalState)) {//sure that we found a solution
                // Puzzle is solved
                foundSolution = true;
                // Print the path to the goal state
                printPathToGoal(path);
                return;
            }

            const emptyTileIndex = state.findIndex(tile => tile === 0);

            const neighbors = getNeighbors(emptyTileIndex);

            for (const neighborIndex of neighbors) {// looping for the neighbors (4)
                const newState = state.slice();
                [newState[emptyTileIndex], newState[neighborIndex]] = [newState[neighborIndex], newState[emptyTileIndex]];//swaping

                if (!visitedStates.has(newState.toString())) {//check if it's visited or not
                    const newPath = path.slice();
                    newPath.push(newState.slice());//push it inside the path tuple
                    stack.push({ state: newState, path: newPath });//pushed

                    // Print current state to console
                    console.log(newState, "pushed");
                    moveCount++;
                    moveCountElement.textContent = moveCount;

                    // Schedule animation
                    setTimeout(() => {
                        updatePuzzleState();
                        dfs(); // Continue DFS
                    }, 0.01);
                }
            }
            console.log("number of poped states:",poppedCount);
        }

        dfs(); // Start DFS
    }

    if (selectedAlgorithm === 'bfs') {
        moveCount = 0;
        let deq=0;
        const visitedStates = new Set();
        const queue = [];
        queue.push({ state: puzzle_state.slice(), path: [] });
        console.log(puzzle_state, "enqueued");
        moveCount++;
        moveCountElement.textContent = moveCount;
        let foundSolution = false;
        let printedRunningTime = false;
        animationSpeed = parseInt(prompt("Enter animation speed (milliseconds):", 500));
        const startTime = performance.now();
    
        function bfs() {
            if (queue.length === 0 || foundSolution) {
                if (!printedRunningTime) {
                    printedRunningTime = true;
                    const endTime = performance.now();
                    const runningTime = endTime - startTime;
                    console.log("Total running time: ", runningTime, "milliseconds");
                }
                return;
            }
    
            const { state, path } = queue.shift();
            console.log(state, "dequeued");
            deq++;
            visitedStates.add(state.toString());
    
            if (arraysEqual(state, goalState)) {
                // Puzzle is solved
                foundSolution = true;
                // Print the path to the goal state
                printPathToGoal(path);
                return;
            }
    
            const emptyTileIndex = state.findIndex(tile => tile === 0);
    
            const neighbors = getNeighbors(emptyTileIndex);
    
            for (const neighborIndex of neighbors) {
                const newState = state.slice();
                [newState[emptyTileIndex], newState[neighborIndex]] = [newState[neighborIndex], newState[emptyTileIndex]];
    
                if (!visitedStates.has(newState.toString())) {
                    const newPath = path.slice();
                    newPath.push(newState.slice());
                    queue.push({ state: newState, path: newPath });
    
                    // Print current state to console
                    console.log(newState, "enqueued");
                    moveCount++;
                    moveCountElement.textContent = moveCount;
    
                    // Schedule animation
                    setTimeout(() => {
                        updatePuzzleState();
                        bfs(); // Continue BFS
                    },0.01);
                }
            }
            console.log("number of dequeued states:",deq);
        }
    
        bfs(); // Start BFS
    }
    

    else if(selectedAlgorithm === 'GA'){
        const geneticSolver = new GeneticAlgorithm(puzzle_state, goalState);
        geneticSolver.findSolution();
    }


else if (selectedAlgorithm === 'dijkstra') {
    moveCount = 0;
    const visitedStates = new Set();
    const priorityQueue = new PriorityQueue(); // Use PriorityQueue for path cost

    priorityQueue.enqueue({ state: puzzle_state.slice(), path: [], cost: 0 }); // Start with initial state

    let foundSolution = false;
    animationSpeed = parseInt(prompt("Enter animation speed (milliseconds):", 500));

    function dijkstra() {
        if (priorityQueue.isEmpty() || foundSolution) {
            return;
        }

        const { state, path, cost } = priorityQueue.dequeue();
        console.log(state, "dequeued");
        visitedStates.add(state.toString());

        if (arraysEqual(state, goalState)) {
            // Puzzle is solved
            foundSolution = true;
            // Print the path to the goal state
            printPathToGoal(path);
            return;
        }

        const emptyTileIndex = state.findIndex(tile => tile === 0);
        const neighbors = getNeighbors(emptyTileIndex);

        for (const neighborIndex of neighbors) {
            const newState = state.slice();
            [newState[emptyTileIndex], newState[neighborIndex]] = [newState[neighborIndex], newState[emptyTileIndex]];

            if (!visitedStates.has(newState.toString())) {
                const newPath = path.slice();
                newPath.push(newState.slice());
                const newCost = cost + 1; // Assuming uniform path cost

                priorityQueue.enqueue({ state: newState, path: newPath, cost: newCost }, newCost);

                // Print current state to console
                console.log(newState, "enqueued");
                moveCount++;
                moveCountElement.textContent = moveCount;

                // Schedule animation
                setTimeout(() => {
                    updatePuzzleState();
                    dijkstra(); // Continue Dijkstra's Algorithm
                },0.01);
            }
        }
    }

    dijkstra(); // Start Dijkstra's Algorithm
}



    else if (selectedAlgorithm === 'gbfs') {
        // Greedy Best-First Search (GBFS)
        moveCount = 0;
        const priorityQueue = new PriorityQueue();
        const visitedStates = new Set();

        priorityQueue.enqueue({ state: puzzle_state.slice(), path: [] }, heuristicFunction(puzzle_state, goalState));

        let foundSolution = false;
        animationSpeed = parseInt(prompt("Enter animation speed (milliseconds):", 500));

        function gbfs() {
            if (priorityQueue.isEmpty() || foundSolution) {
                return;
            }

            const { state, path } = priorityQueue.dequeue();
            console.log(state, "dequeued");
            visitedStates.add(state.toString());

            if (arraysEqual(state, goalState)) {
                // Puzzle is solved
                foundSolution = true;
                // Print the path to the goal state
                printPathToGoal(path);
                return;
            }

            const emptyTileIndex = state.findIndex(tile => tile === 0);

            const neighbors = getNeighbors(emptyTileIndex);

            for (const neighborIndex of neighbors) {
                const newState = state.slice();
                [newState[emptyTileIndex], newState[neighborIndex]] = [newState[neighborIndex], newState[emptyTileIndex]];

                if (!visitedStates.has(newState.toString())) {
                    const newPath = path.slice();
                    newPath.push(newState.slice());
                    priorityQueue.enqueue({ state: newState, path: newPath }, heuristicFunction(newState, goalState));

                    // Print current state to console
                    console.log(newState, "enqueued");
                    moveCount++;
                    moveCountElement.textContent = moveCount;

                    // Schedule animation
                    setTimeout(() => {
                        updatePuzzleState();
                        gbfs(); // Continue GBFS
                    }, 0.01);
                }
            }
        }

        gbfs(); // Start GBFS
    } else if (selectedAlgorithm === 'astar') {
        // A* Algorithm with Manhattan distance heuristic
        moveCount = 0;
        let deq=0;
        const priorityQueue = new PriorityQueue();
        const visitedStates = new Set();

        priorityQueue.enqueue({ state: puzzle_state.slice(), path: [] }, 0); // Priority is 0 for A*
        let foundSolution = false;
        let printedRunningTime = false;
        animationSpeed = parseInt(prompt("Enter animation speed (milliseconds):", 500));
        const startTime = performance.now();


        function astar() {
            if (priorityQueue.isEmpty() || foundSolution) {
                if (!printedRunningTime) {
                    printedRunningTime = true;
                    const endTime = performance.now();
                    const runningTime = endTime - startTime;
                    console.log("Total running time: ", runningTime, "milliseconds");
                }
                return;
            }

            const { state, path } = priorityQueue.dequeue();
            console.log(state, "dequeued");
            deq++;
            visitedStates.add(state.toString());

            if (arraysEqual(state, goalState)) {
                // Puzzle is solved
                foundSolution = true;
                // Print the path to the goal state
                printPathToGoal(path);
                return;
            }

            const emptyTileIndex = state.findIndex(tile => tile === 0);

            const neighbors = getNeighbors(emptyTileIndex);

            for (const neighborIndex of neighbors) {
                const newState = state.slice();
                [newState[emptyTileIndex], newState[neighborIndex]] = [newState[neighborIndex], newState[emptyTileIndex]];

                if (!visitedStates.has(newState.toString())) {
                    const newPath = path.slice();
                    newPath.push(newState.slice());

                    const heuristic = heuristicFunction(newState, goalState);
                    const priority = newPath.length + heuristic; // Priority = path length + heuristic

                    priorityQueue.enqueue({ state: newState, path: newPath }, priority);

                    // Print current state to the console
                    console.log(newState, "enqueued");
                    moveCount++;
                    moveCountElement.textContent = moveCount;

                    // Schedule animation
                    setTimeout(() => {
                        updatePuzzleState();
                        astar(); // Continue A*
                    }, 0.01);
                }
            }
            console.log("number of dequeued states:",deq);
        }

        astar(); // Start A*
    }



else if (selectedAlgorithm === 'ucs') {
    moveCount = 0;
    const visitedStates = new Set();
    const priorityQueue = new PriorityQueue(); // Use PriorityQueue to handle elements based on their path cost

    priorityQueue.enqueue({ state: puzzle_state.slice(), path: [], cost: 0 });

    let foundSolution = false;
    animationSpeed = parseInt(prompt("Enter animation speed (milliseconds):", 500));

    function ucs() {
        if (priorityQueue.isEmpty() || foundSolution) {
            return;
        }

        const { state, path, cost } = priorityQueue.dequeue();
        console.log(state, "dequeued");
        visitedStates.add(state.toString());

        if (arraysEqual(state, goalState)) {
            // Puzzle is solved
            foundSolution = true;
            // Print the path to the goal state
            printPathToGoal(path);
            return;
        }

        const emptyTileIndex = state.findIndex(tile => tile === 0);
        const neighbors = getNeighbors(emptyTileIndex);

        for (const neighborIndex of neighbors) {
            const newState = state.slice();
            [newState[emptyTileIndex], newState[neighborIndex]] = [newState[neighborIndex], newState[emptyTileIndex]];

            if (!visitedStates.has(newState.toString())) {
                const newPath = path.slice();
                newPath.push(newState.slice());
                const newCost = cost + 1; // Assuming uniform path cost

                priorityQueue.enqueue({ state: newState, path: newPath, cost: newCost }, newCost);

                // Print current state to console
                console.log(newState, "enqueued");
                moveCount++;
                moveCountElement.textContent = moveCount;

                // Schedule animation
                setTimeout(() => {
                    updatePuzzleState();
                    ucs(); // Continue UCS
                }, animationSpeed);
            }s
        }
    }

    ucs(); // Start UCS
}
else if (selectedAlgorithm === 'HC') {
    let currentState = puzzle_state.slice();
    let currentHeuristic = heuristicFunction(currentState, goalState);
    let steps = 0;
    const animationSpeed = parseInt(prompt("Enter animation speed (milliseconds):", 500));

    function hillClimbingStep() {
        let bestNeighbor = null;
        let bestHeuristic = currentHeuristic;

        const emptyTileIndex = currentState.findIndex(tile => tile === 0);
        const neighbors = getNeighbors(emptyTileIndex);

        for (const neighborIndex of neighbors) {
            const newState = currentState.slice();
            [newState[emptyTileIndex], newState[neighborIndex]] = [newState[neighborIndex], newState[emptyTileIndex]];

            const neighborHeuristic = heuristicFunction(newState, goalState);

            if (neighborHeuristic < bestHeuristic) {
                bestHeuristic = neighborHeuristic;
                bestNeighbor = newState;
            }
        }

        if (!bestNeighbor) {
            console.log("No solution found using Hill Climbing");
            return;
        }

        currentState = bestNeighbor;
        currentHeuristic = bestHeuristic;

        steps++;
        console.log("Step " + steps + ":");
        console.log(currentState);

        if (currentHeuristic === 0) {
            console.log("Solution found using Hill Climbing:", currentState);
            return;
        }

        // Perform tile movement animation
        setTimeout(() => {
            puzzle_state = currentState.slice();
            updatePuzzleState();
            hillClimbingStep();
        }, animationSpeed);
    }

    console.log("Initial State:");
    console.log(currentState);
    hillClimbingStep(); // Start the Hill Climbing algorithm step-by-step
}


}


function printPathToGoal(path) {
    console.log("Path to Goal State:");

    function moveNext(step) {
        if (step < path.length) {
            console.log(`Step ${step + 1}:`, path[step]);

            const currentState = path[step];
            const emptyTileIndex = currentState.findIndex(tile => tile === 0);

            // Update the puzzle state with the current state
            puzzle_state = currentState;

            if (step < path.length - 1) {
                // Move the tile if it's not in its final position
                const tileToMove = puzzle_state[emptyTileIndex];
                const tileIndex = currentState.indexOf(tileToMove);
                if (isValidMove(tileIndex, emptyTileIndex)) {
                    moveTile(tileIndex,0);
                }
            } else {
                // Last step: Force the tile move regardless of its position
                moveTile(emptyTileIndex,0);
                setTimeout(() => {
                    updatePuzzleState();
                    console.log('Puzzle solved in' ,step+1,'steps');
                }, animationSpeed);
                return;
            }

            setTimeout(() => {
                updatePuzzleState();
                moveNext(step + 1);
            }, animationSpeed);
        }
    }

    moveNext(0); // Start the movement with the first step in the path
}


    

    function arraysEqual(arr1, arr2) {
        if (arr1.length !== arr2.length) return false;
        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) return false;
        }
        return true;
    }

    function getNeighbors(emptyTileIndex) {
        const neighbors = [];

        if (emptyTileIndex - 1 >= 0 && emptyTileIndex % 3 !== 0) {
            neighbors.push(emptyTileIndex - 1);//has left neighbor
        }
        if (emptyTileIndex + 1 < 9 && emptyTileIndex % 3 !== 2) {
            neighbors.push(emptyTileIndex + 1);//has right neibor
        }

        if (emptyTileIndex - 3 >= 0) {
            neighbors.push(emptyTileIndex - 3);//has upward neigbor
        }
        if (emptyTileIndex + 3 < 9) {
            neighbors.push(emptyTileIndex + 3);//has downward neighbor
        }


        return neighbors;
    }


});

function heuristicFunction(state, goalState) {
    // Calculate the Manhattan distance heuristic
    let heuristic = 0;
    for (let i = 0; i < state.length; i++) {
        if (state[i] !== 0) {
            const goalIndex = goalState.indexOf(state[i]);
            const rowDiff = Math.abs(Math.floor(i / 3) - Math.floor(goalIndex / 3));
            const colDiff = Math.abs(i % 3 - goalIndex % 3);
            heuristic += rowDiff + colDiff;
        }
    }
    return heuristic;
}



class GeneticAlgorithm {
    constructor(initialState, goalState) {
        this.initialState = initialState.slice();
        this.goalState = goalState.slice();
        this.population = [];
        this.populationSize = 50;
        this.mutationRate = 0.2;
        this.generation = 1;
    }

    // Check if the puzzle is solved
    isSolved(state) {
        return state.join('') === this.goalState.join('');
    }

    // Initialize the population with random states
    initializePopulation() {
        for (let i = 0; i < this.populationSize; i++) {
            let state = this.initialState.slice();
            this.shuffleArray(state);
            this.population.push({ state, fitness: 0 });
        }
    }

    // Calculate fitness by comparing the state with the goal state according to the number of mispositioned tiles
    calculateFitness(state) {
        let fitness = 0;
        for (let i = 0; i < state.length; i++) {
            if (state[i] === this.goalState[i]) {
                fitness++;
            }
        }
        return fitness;
    }

    // Perform crossover between two parent states
    //
    //                                         start  End
    //                                           |     |
    crossover(parent1, parent2) {//parent 1=[5,3,7,6,0,1,8,4,2]
                                //parent 2= [1,6,8,2,4,7,3,5,0]
        const childState = [];  
        const startPos = Math.floor(Math.random() * parent1.state.length);//start pos=2
        const endPos = Math.floor(Math.random() * parent1.state.length);//end pos=5
        //              i < 9
        for (let i = 0; i < parent1.state.length; i++) {
            //      2    <   5    && 1 > 2       &&  1 <  5 ------->false
            if (startPos < endPos && i > startPos && i < endPos) {
                childState[i] = parent1.state[i];
                //        false also
            } else if (startPos > endPos && (i < startPos || i > endPos)) {
                childState[i] = parent1.state[i];
            } else {
                childState[i] = null;
            }
        }
        //childstate=[null,null,null,6,0,null,null,null,null]
        //the previous for loop takes the region between the start of parent 1 and the end and leaves the rest as null

        for (let i = 0; i < parent2.state.length; i++) {
            if (!childState.includes(parent2.state[i])) {
                for (let j = 0; j < childState.length; j++) {
                    if (childState[j] === null) {
                        childState[j] = parent2.state[i];
                        break;
                    }
                }
            }
        }//this for loop takes elements from parent 2 respectivly , if they don't exist already in the child 
        //childstate=[1,8,2,6,0,4,7,3,5]

        return childState;
    }

    // Perform mutation on a state, it just make a swap between 2 random indecies
    mutate(state) {
        const index1 = Math.floor(Math.random() * state.length);
        let index2 = Math.floor(Math.random() * state.length);

        while (index2 === index1) {
            index2 = Math.floor(Math.random() * state.length);
        }

        [state[index1], state[index2]] = [state[index2], state[index1]];
        return state;
    }

    // Evolve the population
    evolve() {
        this.population.sort((a, b) => b.fitness - a.fitness);

        const newPopulation = [];

        // Keep the top 10% of fittest individuals
        const eliteCount = this.populationSize * 0.1;
        for (let i = 0; i < eliteCount; i++) {
            newPopulation.push(this.population[i]);
        }

        // Fill the rest of the population with new children
        for (let i = eliteCount; i < this.populationSize; i++) {
            const parent1 = this.population[Math.floor(Math.random() * this.population.length)];
            const parent2 = this.population[Math.floor(Math.random() * this.population.length)];
            const childState = this.crossover(parent1, parent2).slice();

            if (Math.random() < this.mutationRate) {
                this.mutate(childState);//check if it's time to mutate a child or not randomly
            }

            newPopulation.push({ state: childState, fitness: this.calculateFitness(childState) });
        }

        this.population = newPopulation;//make the new generatiom
        this.generation++;
    }

findSolution() {
        this.initializePopulation();

        let maxGenerations = 1000;
        while (maxGenerations > 0) {
            let bestFitness = -1;
            let bestState = [];

            for (let i = 0; i < this.population.length; i++) {
                const state = this.population[i].state;
                const fitness = this.population[i].fitness;

                if (fitness > bestFitness) {
                    bestFitness = fitness;
                    bestState = state.slice();
                }
            }

            console.log(`Generation: ${this.generation} - Best Fitness: ${bestFitness}`);
            console.log('Best State:', bestState);

            if (this.isSolved(bestState)) {
                console.log("Solution found in generation", this.generation);
                console.log("Solution:", bestState);
                return;
            }

            this.evolve();
            maxGenerations--;
        }

        console.log("No solution found within the maximum generations.");
    }
    // Utility function to shuffle an array
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
}




