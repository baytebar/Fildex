# Free SSL Certificate Setup with Certbot

This guide explains how to set up free SSL certificates using Certbot (Let's Encrypt) for your Fildex application.

## Prerequisites

- Ubuntu/Debian server with root or sudo access
- Domain name pointing to your server
- Nginx or Apache web server installed
- Ports 80 and 443 open in firewall

## Installation

### 1. Install Certbot

```bash
# Update package list
sudo apt update

# Install Certbot
sudo apt install certbot python3-certbot-nginx
```

### 2. Install Nginx (if not already installed)

```bash
sudo apt install nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

## SSL Certificate Setup

### Method 1: Automatic Setup with Nginx Plugin

```bash
# Get certificate and automatically configure Nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### Method 2: Manual Setup

1. **Get the certificate only:**
```bash
sudo certbot certonly --nginx -d yourdomain.com -d www.yourdomain.com
```

2. **Configure Nginx manually** (add to your site configuration):

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    # SSL Configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";

    # Your application configuration
    location / {
        proxy_pass http://localhost:3000;  # Frontend
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:5000;  # Backend API
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Auto-Renewal Setup

### 1. Test Auto-Renewal

```bash
# Test the renewal process
sudo certbot renew --dry-run
```

### 2. Set up Cron Job for Auto-Renewal

```bash
# Edit crontab
sudo crontab -e

# Add this line to run renewal check twice daily
0 12 * * * /usr/bin/certbot renew --quiet
```

### 3. Alternative: Systemd Timer (Recommended)

Create a systemd timer for more reliable renewal:

```bash
# Create timer file
sudo nano /etc/systemd/system/certbot-renewal.timer
```

Add this content:
```ini
[Unit]
Description=Certbot Renewal Timer

[Timer]
OnCalendar=*-*-* 12:00:00
RandomizedDelaySec=3600
Persistent=true

[Install]
WantedBy=timers.target
```

Enable and start the timer:
```bash
sudo systemctl enable certbot-renewal.timer
sudo systemctl start certbot-renewal.timer
```

## Verification Commands

### Check Certificate Status
```bash
# List all certificates
sudo certbot certificates

# Check certificate expiration
sudo certbot certificates -d yourdomain.com
```

### Test SSL Configuration
```bash
# Test SSL with OpenSSL
openssl s_client -connect yourdomain.com:443 -servername yourdomain.com

# Test with curl
curl -I https://yourdomain.com
```

### Online SSL Testing
- Visit [SSL Labs](https://www.ssllabs.com/ssltest/) to test your SSL configuration
- Use [Mozilla Observatory](https://observatory.mozilla.org/) for security analysis

## Troubleshooting

### Common Issues

1. **Port 80 not accessible:**
```bash
# Check if port 80 is open
sudo netstat -tlnp | grep :80
sudo ufw allow 80
sudo ufw allow 443
```

2. **Domain not pointing to server:**
```bash
# Check DNS resolution
nslookup yourdomain.com
dig yourdomain.com
```

3. **Certificate renewal fails:**
```bash
# Check renewal logs
sudo tail -f /var/log/letsencrypt/letsencrypt.log

# Force renewal
sudo certbot renew --force-renewal
```

4. **Nginx configuration issues:**
```bash
# Test Nginx configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### Log Files
- Certbot logs: `/var/log/letsencrypt/letsencrypt.log`
- Nginx logs: `/var/log/nginx/error.log` and `/var/log/nginx/access.log`

## Security Best Practices

### 1. SSL Configuration
```nginx
# Strong SSL configuration
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
ssl_prefer_server_ciphers off;
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 10m;
```

### 2. Security Headers
```nginx
# Add security headers
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header X-Frame-Options DENY;
add_header X-Content-Type-Options nosniff;
add_header X-XSS-Protection "1; mode=block";
add_header Referrer-Policy "strict-origin-when-cross-origin";
```

### 3. Firewall Configuration
```bash
# Configure UFW firewall
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

## Multiple Domains/Subdomains

### Wildcard Certificate
```bash
# Get wildcard certificate (requires DNS challenge)
sudo certbot certonly --manual --preferred-challenges dns -d *.yourdomain.com -d yourdomain.com
```

### Multiple Domains
```bash
# Add domains to existing certificate
sudo certbot certonly --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com
```

## Environment-Specific Setup

### Development
- Use self-signed certificates for local development
- Configure hosts file for local domains

### Staging
- Use Let's Encrypt staging environment:
```bash
sudo certbot --staging -d staging.yourdomain.com
```

### Production
- Use production certificates
- Set up monitoring for certificate expiration
- Configure proper backup procedures

## Monitoring and Alerts

### Certificate Expiration Monitoring
```bash
# Create monitoring script
sudo nano /usr/local/bin/check-ssl-expiry.sh
```

Add this content:
```bash
#!/bin/bash
DOMAIN="yourdomain.com"
DAYS_BEFORE_EXPIRY=30

EXPIRY_DATE=$(echo | openssl s_client -servername $DOMAIN -connect $DOMAIN:443 2>/dev/null | openssl x509 -noout -dates | grep notAfter | cut -d= -f2)
EXPIRY_TIMESTAMP=$(date -d "$EXPIRY_DATE" +%s)
CURRENT_TIMESTAMP=$(date +%s)
DAYS_UNTIL_EXPIRY=$(( (EXPIRY_TIMESTAMP - CURRENT_TIMESTAMP) / 86400 ))

if [ $DAYS_UNTIL_EXPIRY -lt $DAYS_BEFORE_EXPIRY ]; then
    echo "WARNING: SSL certificate for $DOMAIN expires in $DAYS_UNTIL_EXPIRY days"
    # Add email notification here
fi
```

Make it executable:
```bash
sudo chmod +x /usr/local/bin/check-ssl-expiry.sh
```

## Backup and Recovery

### Backup Certificates
```bash
# Create backup directory
sudo mkdir -p /backup/ssl

# Backup certificates
sudo cp -r /etc/letsencrypt /backup/ssl/
sudo cp -r /etc/nginx/sites-available /backup/ssl/nginx-sites
```

### Restore Certificates
```bash
# Restore from backup
sudo cp -r /backup/ssl/letsencrypt /etc/
sudo cp -r /backup/ssl/nginx-sites /etc/nginx/sites-available/
sudo systemctl reload nginx
```

## Additional Resources

- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [Certbot Documentation](https://certbot.eff.org/docs/)
- [Nginx SSL Configuration](https://nginx.org/en/docs/http/configuring_https_servers.html)
- [SSL Labs Best Practices](https://github.com/ssllabs/research/wiki/SSL-and-TLS-Deployment-Best-Practices)

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review Certbot logs: `/var/log/letsencrypt/letsencrypt.log`
3. Test your configuration with online SSL tools
4. Consult the official Let's Encrypt community forums
