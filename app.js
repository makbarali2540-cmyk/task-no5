const express = require("express");
const AppError = require("./errors");
const app = express();
app.use(express.json());
const { validateTask } = require("./validation");
const { loadtask, savetask } = require("./storage");
const { getTaskById } = require("./task-manager");
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        message: "Task Manager API is running"
    });
});
app.get("/tasks", async(req, res, next) => {
    try {
        const tasks = await loadtask();

        res.status(200).json(tasks);
    } catch (error) {
        next(error);
    }
});
app.get("/tasks/:id", async(req, res, next) => {
    try {
        const tasks = await loadtask();
        const id = Number(req.params.id);
        const task = getTaskById(tasks, id);
        res.status(200).json(task);
    } catch (error) {
        next(error);
    }
});
app.post("/tasks", validateTask, async(req, res) => {
    try {
        const tasks = await loadtask();
        const task = req.body;
        if (tasks.some(existingTask => existingTask.id === task.id)) {
            throw new AppError(
                400,
                "DUPLICATE_TASK_ID",
                "Task already exists"
            );
        }
        tasks.push(task);
        await savetask(tasks);
        res.status(201).json(task);
    } catch (error) {
        nrxt(error);
    }
});
app.use((req, res, next) => {
    next(
        new AppError(
            404,
            "ROUTE_NOT_FOUND",
            "Route not found"
        )
    );
});
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        return res.status(400).json({
            error: {
                code: "INVALID_JSON",
                message: "Invalid JSON request body",
                details: null
            }
        });
    }
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            error: {
                code: err.code,
                message: err.message,
                details: err.details
            }
        });
    }
    console.error(err);
    res.status(500).json({
        error: {
            code: "INTERNAL_SERVER_ERROR",
            message: "Internal server error",
            details: null
        }
    });
});
module.exports = app;