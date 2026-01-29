                                                      module.exports = {
  apps: [{
    name: "v-dental",
    script: "dist/src/main.js",
    instances: "max",               // Utilize all CPU cores
    exec_mode: "cluster",           // Enable cluster mode
    autorestart: true,
    watch: false,                   // Disable in production
    max_memory_restart: "1G",       // Restart if memory exceeds 1GB
    env_production: {
      NODE_ENV: "pro",       // Changed from "pro" to standard "production"
      DATABASE_PORT: "5432",
      DATABASE_PASSWORD: "D4UjhsF0uY64%X@D",
      DATABASE_HOST: "localhost",
      DATABASE_NAME: "real-workspace", 
      DATABASE_USER: "postgres",
      JWT_SECRET: "D4UjhsF0uY64%X@D",
      PORT: 3002
    },
    error_file: "./logs/tivo-err.log",
    out_file: "./logs/tivo-out.log",
    log_file: "./logs/tivo-combined.log",
    time: true          
  }]
};
