"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskMenuChoice = exports.ProjectMenuChoice = exports.MainMenuChoice = void 0;
var MainMenuChoice;
(function (MainMenuChoice) {
    MainMenuChoice["Dashboard"] = "\uD83D\uDCCA Show Dashboard";
    MainMenuChoice["ManageProjects"] = "\uD83D\uDCC1 Manage Projects";
    MainMenuChoice["ManageTasks"] = "\uD83D\uDCDD Manage Tasks";
    MainMenuChoice["Exit"] = "\uD83D\uDEAA Exit";
})(MainMenuChoice || (exports.MainMenuChoice = MainMenuChoice = {}));
var ProjectMenuChoice;
(function (ProjectMenuChoice) {
    ProjectMenuChoice["CreateProject"] = "\u2795 Create New Project";
    ProjectMenuChoice["ListProjects"] = "\uD83D\uDCCB List All Projects";
    ProjectMenuChoice["ViewProject"] = "\uD83D\uDC41\uFE0F View Project Details";
    ProjectMenuChoice["UpdateProject"] = "\u270F\uFE0F Update Project";
    ProjectMenuChoice["DeleteProject"] = "\u274C Delete Project";
    ProjectMenuChoice["Back"] = "\u21A9\uFE0F Back to Main Menu";
})(ProjectMenuChoice || (exports.ProjectMenuChoice = ProjectMenuChoice = {}));
var TaskMenuChoice;
(function (TaskMenuChoice) {
    TaskMenuChoice["CreateTask"] = "\u2795 Create New Task";
    TaskMenuChoice["ListTasksAll"] = "\uD83D\uDCCB List All Tasks";
    TaskMenuChoice["ListTasksByProject"] = "\uD83D\uDCD1 List Tasks by Project";
    TaskMenuChoice["ViewTask"] = "\uD83D\uDC41\uFE0F View Task Details";
    TaskMenuChoice["UpdateTask"] = "\u270F\uFE0F Update Task";
    TaskMenuChoice["DeleteTask"] = "\u274C Delete Task";
    TaskMenuChoice["Back"] = "\u21A9\uFE0F Back to Main Menu";
})(TaskMenuChoice || (exports.TaskMenuChoice = TaskMenuChoice = {}));
