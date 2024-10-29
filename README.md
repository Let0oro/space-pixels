# React + TypeScript Space Invaders w/ Pixel art

Enjoy your own adventure joining to all other players in this amazing game.

For deploy the back: [click here](https://github.com/Let0oro/space-pixels-API), clone the repository, install dependencies, open Docker and run ```npm run docker:restart``` in your CMD.

Here’s the detailed project description in English, covering the overview and detailed sections:

---

### General Project Overview

**Space Pixels** is a **React** and **TypeScript** frontend that supports a pixel art-style spaceship game. Players can create and customize ships, view their scores, and explore multiple features within an interactive interface. Connected to the backend, the frontend offers an integrated user experience in a gaming and social environment.

---

### Project Sections

#### Components

The `components` folder organizes the main UI and game elements, including:

- **NavBar**: Navigation bar linking key pages.
- **UserProfile**: Displays user info and profile settings.
- **ShipCustomizer**: Pixel art editor where users can create and personalize ships.
- **GameCanvas**: Main game area where users control ships and fight enemies.
- **Store**: In-game store where users can purchase items to enhance gameplay.
- **Leaderboard**: Global leaderboard for users to compare their scores.

---

### Pages (Main Pages)

The project’s main views are organized within the `pages` folder, covering components like:

- **HomePage**: A central hub with direct links to the game, profile, and store.
- **UserDashboard**: Personalized panel displaying user achievements and stats.
- **GamePage**: View containing the Space Invaders-style game and integrating `GameCanvas`.
- **StorePage**: Dedicated in-game store page for purchasing upgrades.
- **LeaderboardPage**: View displaying the user leaderboard and overall scores.

---

### Login and Register

The login and register pages handle authentication with form validation, enabling secure account creation and login through `jsonwebtoken`. User sessions are maintained with cookies, allowing users to re-enter without needing to reauthenticate.

---

### FrontFetch: Server Fetch Simplification

`FrontFetch` consolidates API calls into a class, unifying calls so developers can simply use methods like `FrontFetch.getUser()` or `FrontFetch.updateScore()` instead of repeating fetch logic. This setup speeds up backend integration and improves code readability.

---

### Error Handling

This system catches and manages errors during user actions and API calls, providing:

- **Specific error messages** displayed to users, enhancing usability and easing debugging.

---

### Ship Creation Canvas

In the ship creation component, users can customize ship designs using a pixel art editor. The editor uses an interactive grid on `canvas` where players can choose colors and adjust pixels. Designs are saved as hexadecimal color arrays, which are then sent to the backend to be stored and later loaded in-game.

---

### Global State and Context Management with Zustand

The **Zustand** library manages global state, providing unified access to shared data, such as user profiles, theme preferences, and ship configurations. This state solution facilitates smooth data flow without excessive prop-passing between components.

---

### Cookies and Sessions

For session persistence, the project uses session cookies storing JWT tokens, ensuring secure sessions that maintain user states between visits. Cookies sync with the backend in each interaction, creating a seamless user experience.

---

### UI and User Experience (UX)

The user interface has a retro, pixel-art design well-suited to the game’s theme. UX enhancements include:

- **Transition animations** between pages and visual effects on buttons and interactive elements.
- **Instant feedback**, such as pop-up messages informing users of the success or failure of their actions.

---

### Space Invaders Game

The core of Space Pixels is a **Space Invaders** game where players control customized ships to battle enemies. Game logic controls movement, firing, and collisions, creating a dynamic and synchronized environment in real-time.

---

### User Messages

To improve the user experience, the project includes informative messages and feedback that notify the user of key events, such as saving a new ship, connection errors, or reaching milestones.

---

### Menu and Page Navigation

Navigation between different pages is intuitive, guided by a main menu that facilitates movement between game, profile, and store. Dynamic routes are implemented to adapt content based on each user's authentication status and preferences.

---

The **Space Pixels** frontend combines modular structure and intuitive design, providing a personalized, backend-connected experience where players can record, update, and view their activities and customizations in real time.
