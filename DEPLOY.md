# Deployment Guide

This guide provides instructions for deploying the Content Moderator service in different environments.

## Prerequisites

- Docker and Docker Compose installed
- Hugging Face API token

## Environment Setup

1. Create a `.env` file in the root directory with all required environment variables (see README.md for details)

2. Ensure the required port is available:
   - Content Moderator API: 4002

## Production Deployment

1. Build and start the service:

```bash
docker-compose up -d --build
```

2. Verify the service is running:

```bash
docker-compose ps
```

3. Check the logs:

```bash
docker-compose logs -f content-moderator
```

## Health Checks

The service exposes a health check endpoint at `/health`. You can use this to monitor the service status.

## API Documentation

Access the API documentation at:

```bash
http://localhost:4002/api
```

## Scaling

The service is designed to be stateless and can be scaled horizontally. To scale the content moderator service:

```bash
docker-compose up -d --scale content-moderator=3
```

## Troubleshooting

### Common Issues

1. **Service not starting**

   - Check if the required port is available
   - Verify environment variables are correctly set
   - Check Docker logs for errors

### Logs

To view logs for the service:

```bash
docker-compose logs -f content-moderator
```

## Security Considerations

1. Use secure connections (HTTPS) in production
2. Regularly update dependencies
3. Monitor system logs for suspicious activity
4. Implement rate limiting for API endpoints
5. Use secure environment variables management

## Maintenance

### Updating the Service

1. Pull the latest changes:

```bash
git pull origin main
```

2. Rebuild and restart the service:

```bash
docker-compose up -d --build
```

### Cleaning Up

To remove all containers:

```bash
docker-compose down
```

To remove unused images:

```bash
docker image prune -a
```
