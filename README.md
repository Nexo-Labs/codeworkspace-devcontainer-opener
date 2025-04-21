# Dev Container Opener VSCode Extension

A simple extension to quickly open predefined project folders in a Dev Container.

## Features

*   Adds a command `Open Project in Dev Container` to the command palette.
*   Presents a Quick Pick list of your predefined projects.
*   Opens the selected project folder in a new VS Code window.
*   If a `.devcontainer` folder exists, VS Code will prompt to reopen the folder in a container.

## Configuration

1.  **Modify `src/extension.ts`**: Update the `PROJECTS_BASE_PATH` constant with the absolute path to the directory containing your project folders.
2.  **Modify `src/extension.ts`**: Update the `PROJECT_NAMES` array with the names of your project folders.

## Running the Extension Locally

1.  Clone or download this repository.
2.  Open the folder in VS Code.
3.  Run `npm install` in the terminal to install dependencies.
4.  Press `F5` to open a new Extension Development Host window with the extension running.
5.  Open the command palette (`Ctrl+Shift+P` or `Cmd+Shift+P`) and type `Open Project in Dev Container`.
