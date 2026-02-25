# Star Wars Character Interactions Visualization

[cite_start]This project is an interactive, web-based visualization of the social network of Star Wars characters[cite: 13, 15]. [cite_start]It was developed as part of Assignment 4 for the Information Visualization (TNM111) course at Linköping University[cite: 4, 8, 10].

## Overview

[cite_start]The application visualizes character interactions extracted from Star Wars movie scripts[cite: 15]. [cite_start]Characters are represented as nodes, and they are connected by a link if they speak together within the same scene[cite: 16]. [cite_start]The size of each node reflects the total number of scenes the character appeared in[cite: 23].

## Features

- [cite_start]**Comparative View:** Features two side-by-side node-link diagrams to support the visual comparison of two different network states (episodes)[cite: 36].
- [cite_start]**Interactive Filtering (Option 2):** Users can dynamically filter the diagrams to represent specific episodes (1-7) or the entire saga using dropdown menus[cite: 45].
- [cite_start]**Brushing and Linking:** Clicking on a character node in one diagram highlights that same character in the other diagram (if they exist in that episode), fading out all other non-selected characters[cite: 39].
- [cite_start]**Details-on-Demand:** Hovering over a character node displays their name and total scene count, while hovering over an edge displays the names of the two connected characters and the number of scenes they share[cite: 40].

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
