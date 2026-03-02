# Star Wars Character Interactions Visualization

This project is an interactive, web-based visualization of the social network of Star Wars characters. It was developed as part of Assignment 4 for the Information Visualization (TNM111) course at Linköping University.

## Overview

The application visualizes character interactions extracted from Star Wars movie scripts[cite: 15]. Characters are represented as nodes, and they are connected by a link if they speak together within the same scene.

## Features

- **Comparative View:** Features two side-by-side node-link diagrams to support the visual comparison of two different network states (episodes).
- **Brushing and Linking:** Clicking on a character node in one diagram highlights that same character in the other diagram (if they exist in that episode), hiding all other non-selected characters.
- **Details-on-Demand:** Hovering over a character node displays their name and total scene count, while hovering over an edge displays the names of the two connected characters and the number of scenes they share.
- **Connection Density Filtering:** Includes a dynamic slider to filter characters by their number of connections, allowing users to isolate key protagonists or simplify complex network structures in real-time.

## Technology Stack

- **Framework:** React / Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Visualization Library:** `react-force-graph-2d` (Canvas-based force-directed graph)

## How to Run the Application locally

1. **Prerequisites:** Ensure you have Node.js installed on your machine.
2. **Install Dependencies:** Open your terminal, navigate to the project folder, and run:
   ```bash
   npm install
   ```
3. **Start Server:** Run the following command to start the app:
   ```bash
   npm run dev
   ```
