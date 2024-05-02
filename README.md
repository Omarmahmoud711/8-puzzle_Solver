# 8-Puzzle Solver

## Project Overview
This project is an 8-puzzle solver with an interactive interface. It allows users to select from a range of solving algorithms, visualize the solving process in real-time, and track the number of states pushed during the solving process.

## Features
- **Interactive Interface**: Move tiles manually, randomize the puzzle, and solve with various algorithms.
- **Algorithm Selection**: Choose from DFS, BFS, A*, GBFS, UCS, Dijkstra's Algorithm, Genetic Algorithm (GA), and Hill Climbing (HC).
- **Real-Time Visualization**: Observe the solving process with animations.
- **Move Counter**: Displays the number of states pushed during solving.

## Getting Started
To run the 8-puzzle solver, open the `index.html` file in a modern web browser. Follow the steps below to set up the project.


## Open the Project
1. Open the `index.html` file in your browser.
2. Click the `Randomize` button to shuffle the puzzle.
3. Select an algorithm from the dropdown menu.
4. Click `Solve` to begin the puzzle-solving process.

## Algorithms
- **DFS (Depth-First Search)**: Explores paths by pushing and popping states from a stack.
- **BFS (Breadth-First Search)**: Uses a queue to explore states in a breadth-first manner.
- **A\* (A-star)**: Combines path cost and heuristic (Manhattan distance) for optimality.
- **GBFS (Greedy Best-First Search)**: Chooses paths based on heuristic priority.
- **UCS (Uniform Cost Search)**: Explores states based on path cost.
- **Dijkstra's Algorithm**: Similar to UCS but guarantees the shortest path.
- **Genetic Algorithm (GA)**: Mimics the process of natural selection to evolve solutions.
- **Hill Climbing (HC)**: Iteratively improves a solution by making small changes.
