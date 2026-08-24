function validateTask(req, res, next) {
    const { id, title, completed, priority } = req.body;
    const details = {};
    if (typeof id !== "number" || !Number.isInteger(id)) {
        details.id = "id must ba  an integer";
    }
    if (typeof title !== "string" || title.trim() === "") {
        details.title = "title is required and must be a non-empty string";
    }
    if (typeof completed !== "boolean") {
        details.completed = "completed must be a boolean";
    }

    const allowedPriorities = ["low", "medium", "high"];
    if (!allowedPriorities.includes(priority)) {
        details.priority = "priority must be low, medium, or high";
    }
    if (Object.keys(details).length > 0) {
        return res.status(400).json({
            error: {
                code: "VALIDATION_ERROR",
                message: "Invalid task data",
                details
            }
        });
    }
    next();
}
module.exports = {
    validateTask
};