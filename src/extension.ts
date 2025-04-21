import * as vscode from 'vscode';
import * as path from 'path'; // Import path module
import * as fs from 'fs/promises'; // Importar promesas de fs

// --- Configuración --- 
// !!! IMPORTANTE: Reemplaza esto con la ruta real a tu directorio de proyectos !!!
const PROJECTS_BASE_PATH = '/Users/ruben/projects'; 

// Nombres de los proyectos (puedes añadir más)
const PROJECT_NAMES = ['eisenhower', 'marx'];
// ---------------------

export function activate(context: vscode.ExtensionContext) {

    console.log('"devcontainer-opener" is now active!');

    // Define la función para abrir la carpeta
    const openFolderInNewWindow = async (folderPath: string) => {
        const folderName = path.basename(folderPath);
        vscode.window.showInformationMessage(`Opening project: ${folderName} at ${folderPath}`);
        const folderUri = vscode.Uri.file(folderPath);
        try {
            await vscode.commands.executeCommand('vscode.openFolder', folderUri, {
                forceNewWindow: true
            });
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to open project ${folderName}: ${error}`);
            console.error(error);
        }
    };

    // Comando 1: Abrir desde menú contextual o paleta (lista predefinida)
    let openProjectDisposable = vscode.commands.registerCommand('extension.openProjectInDevContainer', async (uri?: vscode.Uri) => {
        if (uri) {
            // Caso 1: Comando llamado desde el menú contextual
            await openFolderInNewWindow(uri.fsPath);
        } else {
            // Caso 2: Comando llamado desde la paleta de comandos
            const quickPickItems = PROJECT_NAMES.map(name => ({ label: name }));
            const selectedItem = await vscode.window.showQuickPick(quickPickItems, {
                placeHolder: 'Select a project to open in a Dev Container',
            });

            if (selectedItem) {
                const projectName = selectedItem.label;
                const projectPath = path.join(PROJECTS_BASE_PATH, projectName);
                await openFolderInNewWindow(projectPath);
            } else {
                vscode.window.showInformationMessage('No project selected.');
            }
        }
    });

    // Comando 2: Descubrir y abrir proyectos con .devcontainer
    let discoverDisposable = vscode.commands.registerCommand('extension.discoverAndOpenDevContainer', async () => {
        try {
            const entries = await fs.readdir(PROJECTS_BASE_PATH, { withFileTypes: true });
            const devContainerProjects = [];

            for (const entry of entries) {
                if (entry.isDirectory()) {
                    const projectPath = path.join(PROJECTS_BASE_PATH, entry.name);
                    const devContainerPath = path.join(projectPath, '.devcontainer');
                    try {
                        // Intentar acceder a la carpeta .devcontainer
                        await fs.access(devContainerPath);
                        devContainerProjects.push({ label: entry.name, description: projectPath });
                    } catch (err) {
                        // Si fs.access falla, significa que .devcontainer no existe o no es accesible
                        // No hacemos nada, simplemente no lo añadimos a la lista
                    }
                }
            }

            if (devContainerProjects.length === 0) {
                vscode.window.showInformationMessage(`No projects with a .devcontainer folder found in ${PROJECTS_BASE_PATH}`);
                return;
            }

            const selectedItem = await vscode.window.showQuickPick(devContainerProjects, {
                placeHolder: 'Select a discovered project to open in a Dev Container',
            });

            if (selectedItem) {
                await openFolderInNewWindow(selectedItem.description); // Usamos la ruta guardada en description
            } else {
                vscode.window.showInformationMessage('No project selected.');
            }

        } catch (error) {
            vscode.window.showErrorMessage(`Error discovering projects: ${error}`);
            console.error(error);
            // Sugerir al usuario que revise la ruta PROJECTS_BASE_PATH
            vscode.window.showWarningMessage(`Please check if the PROJECTS_BASE_PATH ('${PROJECTS_BASE_PATH}') in the extension settings is correct and accessible.`);
        }
    });

    context.subscriptions.push(openProjectDisposable);
    context.subscriptions.push(discoverDisposable); // Añadir el nuevo comando a las suscripciones
}

// This method is called when your extension is deactivated
export function deactivate() {}
