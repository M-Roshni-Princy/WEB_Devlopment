# Daybook — To-Do App and Notes App

Daybook is a small React project for keeping track of everyday tasks and saving notes in one place. It was built for the Week 04 Web Development Minor Project.

## Features

### To-Do App
- Add, edit, complete, and delete tasks
- See whether a task is pending or completed
- Filter tasks by All, Pending, and Completed
- Add a due date to a task
- Keep tasks saved in the browser with local storage

### Notes App
- Create, edit, and delete notes
- Search notes by title or content
- Organize notes into Personal, College, Ideas, and Work categories
- See the last updated date
- Keep notes saved in the browser with local storage

## Technologies Used
- React.js
- JavaScript (ES6+)
- Vite
- CSS3
- Lucide React icons
- Browser Local Storage

## Run the Project

1. Install [Node.js](https://nodejs.org/) if it is not already installed.
2. Extract the project ZIP and open the `minor-project-04` folder in VS Code.
3. Open a terminal in that folder.
4. Install the dependencies:

   ```bash
   npm install
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open the local URL shown in the terminal, usually `http://localhost:5173`.

## Project Structure

```text
minor-project-04/
├── index.html
├── package.json
├── README.md
└── src/
    ├── App.jsx
    ├── main.jsx
    ├── styles.css
    └── components/
        ├── TodoApp.jsx
        └── NotesApp.jsx
```

Tasks and notes are stored in the browser used to run the app. They are not synced between devices.
