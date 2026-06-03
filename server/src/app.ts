import cors from "cors";
import express from "express";

export const buildApp = () => {
	const app = express();

	// Middleware
	app.use(cors());

	// Routes
	app.get("/health", (_req, res) => {
		res.json({ status: "ok" });
	});

	return app;
};
