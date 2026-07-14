# Deployment Guide — Taskhub

Hi, I'm Owoade Adekola (adekolaleke) — this is my Docker deployment for the Taskhub assignment.

This document explains how to build, run, and manage the Taskhub application using Docker.

## Prerequisites

- Docker and Docker Compose installed
- A .env file in the project root containing JWT_SECRET

## Project Structure

taskhub/ contains backend/, frontend/, docker-compose.yml, and .env

## Build the Images

Run: docker compose build

This builds both frontend and backend images using multi-stage Dockerfiles with non-root users.

## Start the Application

Run: docker compose up -d

This starts three containers: taskhub-mongodb (port 27017), taskhub-backend (port 3001), taskhub-frontend (port 3000).

Frontend: http://localhost:3000
Backend API docs: http://localhost:3001/api/docs

## Stop the Application

Run: docker compose down

This stops and removes containers but preserves MongoDB data (named volume).

To also wipe MongoDB data: docker compose down -v

## Rebuild After Code Changes

Run: docker compose up -d --build

Or rebuild one service: docker compose build frontend

## Environment Variables

PORT - used by backend, default 3001
MONGODB_URI - used by backend, points to the mongodb service internally
JWT_SECRET - used by backend, signs auth tokens, set via .env, never hardcoded
NEXT_PUBLIC_API_URL - used by frontend, backend URL, baked in at build time

## Docker Hub Images

Backend: https://hub.docker.com/r/adekolaleke/taskhub-backend
Frontend: https://hub.docker.com/r/adekolaleke/taskhub-frontend

Pull directly:
docker pull adekolaleke/taskhub-backend:latest
docker pull adekolaleke/taskhub-frontend:latest

## Security Practices Applied

- Multi-stage builds keep final images minimal
- Both containers run as non-root users (nestjs for backend, nextjs for frontend)
- File ownership set explicitly via --chown during copy operations
- Secrets passed via environment variables, never hardcoded into Dockerfiles
- .dockerignore excludes node_modules, .git, and env files from build context

## Assumptions Made

- MongoDB runs as an official mongo:7 image with default configuration; no extra auth was added to the database itself, since the assignment scope was containerizing the existing app
- Next.js standalone output mode was intentionally not enabled, to avoid modifying application configuration beyond what was required for Dockerization
- NEXT_PUBLIC_API_URL is set to http://localhost:3001/api, assuming local/demo deployment on the same machine

## Author

This deployment was set up by Owoade Adekola (adekolaleke) as part of the Kybern Academy DevOps assignment.

## Optimization Notes

The frontend image was optimized using Next.js standalone output mode, reducing the image size from approximately 1GB to under 200MB by bundling only the minimal runtime files needed, rather than the full node_modules and source tree.

Docker Compose healthchecks were added for MongoDB and the backend service, ensuring the frontend only starts once the backend is confirmed healthy, and the backend only starts once MongoDB is confirmed healthy.

## Troubleshooting

- If the frontend cannot reach the backend, verify NEXT_PUBLIC_API_URL is set correctly and rebuild the frontend image, since this variable is baked in at build time.
- If MongoDB fails to connect, check that the mongodb container is healthy with: docker compose ps
- If ports are already in use, stop any local services running on 3000, 3001, or 27017 before starting the stack.
