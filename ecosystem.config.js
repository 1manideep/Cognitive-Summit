module.exports = {
    apps: [
        {
            name: "backend",
            cwd: "./backend",
            script: "venv/bin/python",
            args: "-m uvicorn main:app --host 0.0.0.0 --port 8000",
            interpreter: "none",
            env: {
                PYTHONUNBUFFERED: "1",
                PATH: process.env.PATH // Ensure path is inherited just in case
            }
        },
        {
            name: "frontend",
            cwd: "./frontend",
            script: "npm",
            args: "run dev",
            env: {
                NODE_ENV: "development"
            }
        },
        {
            name: "tunnel",
            script: "./cloudflared",
            args: "tunnel --url http://localhost:8000",
            interpreter: "none"
        }
    ]
};
