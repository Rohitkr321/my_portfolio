// ===== VISITOR TRACKING & NOTIFICATION SYSTEM =====

/**
 * This system tracks portfolio visitors and sends notifications via email
 * Using a free service (Web3Forms) to send email notifications
 */

async function initVisitorTracking() {
    // Configuration
    const config = {
        // Replace this with your Web3Forms access key
        // Get free key at: https://web3forms.com/
        web3formsKey: 'YOUR_WEB3FORMS_ACCESS_KEY_HERE',
        
        // Your email to receive notifications
        yourEmail: 'kabeerfeb2@gmail.com',
        
        // Check if already visited in this session
        sessionKey: 'portfolio_visit_tracked',
        
        // Enable/disable tracking
        enabled: true
    };
    
    // Don't track if disabled or already tracked in this session
    if (!config.enabled || sessionStorage.getItem(config.sessionKey)) {
        return;
    }
    
    try {
        // Get visitor information
        const visitorInfo = await getVisitorInfo();
        
        // Send notification email
        await sendVisitorNotification(visitorInfo, config);
        
        // Mark as tracked for this session
        sessionStorage.setItem(config.sessionKey, 'true');
        
        console.log('Visitor tracked successfully');
    } catch (error) {
        console.error('Error tracking visitor:', error);
    }
}

/**
 * Get comprehensive visitor information
 */
async function getVisitorInfo() {
    const info = {
        timestamp: new Date().toISOString(),
        localTime: new Date().toLocaleString(),
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        screenResolution: `${screen.width}x${screen.height}`,
        viewportSize: `${window.innerWidth}x${window.innerHeight}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        referrer: document.referrer || 'Direct visit',
        currentPage: window.location.href,
        cookiesEnabled: navigator.cookieEnabled,
        onlineStatus: navigator.onLine
    };
    
    // Try to get IP and location information from free API
    try {
        const ipResponse = await fetch('https://ipapi.co/json/');
        if (ipResponse.ok) {
            const ipData = await ipResponse.json();
            info.ip = ipData.ip || 'Unknown';
            info.city = ipData.city || 'Unknown';
            info.region = ipData.region || 'Unknown';
            info.country = ipData.country_name || 'Unknown';
            info.countryCode = ipData.country_code || 'Unknown';
            info.postal = ipData.postal || 'Unknown';
            info.latitude = ipData.latitude || 'Unknown';
            info.longitude = ipData.longitude || 'Unknown';
            info.org = ipData.org || 'Unknown';
            info.isp = ipData.org || 'Unknown';
        }
    } catch (error) {
        console.warn('Could not fetch IP info:', error);
        info.ip = 'Unable to detect';
        info.location = 'Unable to detect';
    }
    
    // Get browser name
    info.browser = getBrowserName(info.userAgent);
    
    // Get device type
    info.deviceType = getDeviceType(info.userAgent);
    
    return info;
}

/**
 * Get browser name from user agent
 */
function getBrowserName(userAgent) {
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) return 'Chrome';
    if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari';
    if (userAgent.includes('Edg')) return 'Edge';
    if (userAgent.includes('Opera') || userAgent.includes('OPR')) return 'Opera';
    return 'Unknown';
}

/**
 * Get device type from user agent
 */
function getDeviceType(userAgent) {
    if (/mobile/i.test(userAgent)) return 'Mobile';
    if (/tablet/i.test(userAgent)) return 'Tablet';
    return 'Desktop';
}

/**
 * Send visitor notification via Web3Forms (free email service)
 */
async function sendVisitorNotification(info, config) {
    // Create email content
    const emailSubject = `🎯 New Portfolio Visitor from ${info.city || 'Unknown'}, ${info.country || 'Unknown'}`;
    
    const emailBody = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 20px; }
        .info-row { display: flex; margin: 10px 0; padding: 10px; background: white; border-radius: 5px; }
        .label { font-weight: bold; width: 150px; color: #10b981; }
        .value { flex: 1; }
        .section { margin: 20px 0; }
        .section-title { font-size: 18px; font-weight: bold; color: #10b981; margin-bottom: 10px; border-bottom: 2px solid #10b981; padding-bottom: 5px; }
        .footer { background: #1f2937; color: white; padding: 15px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; }
        .highlight { background: #10b981; color: white; padding: 2px 8px; border-radius: 3px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="margin: 0;">🎯 New Portfolio Visitor!</h1>
            <p style="margin: 5px 0 0 0;">Someone just visited your portfolio - Rohit Kumar</p>
        </div>
        
        <div class="content">
            <div class="section">
                <div class="section-title">📍 Location Information</div>
                <div class="info-row">
                    <span class="label">IP Address:</span>
                    <span class="value"><span class="highlight">${info.ip || 'Unknown'}</span></span>
                </div>
                <div class="info-row">
                    <span class="label">City:</span>
                    <span class="value">${info.city || 'Unknown'}</span>
                </div>
                <div class="info-row">
                    <span class="label">Region:</span>
                    <span class="value">${info.region || 'Unknown'}</span>
                </div>
                <div class="info-row">
                    <span class="label">Country:</span>
                    <span class="value">${info.country || 'Unknown'} (${info.countryCode || 'N/A'})</span>
                </div>
                <div class="info-row">
                    <span class="label">Coordinates:</span>
                    <span class="value">${info.latitude || 'N/A'}, ${info.longitude || 'N/A'}</span>
                </div>
                <div class="info-row">
                    <span class="label">ISP/Organization:</span>
                    <span class="value">${info.org || 'Unknown'}</span>
                </div>
            </div>
            
            <div class="section">
                <div class="section-title">💻 Device & Browser</div>
                <div class="info-row">
                    <span class="label">Device Type:</span>
                    <span class="value">${info.deviceType}</span>
                </div>
                <div class="info-row">
                    <span class="label">Browser:</span>
                    <span class="value">${info.browser}</span>
                </div>
                <div class="info-row">
                    <span class="label">Platform:</span>
                    <span class="value">${info.platform}</span>
                </div>
                <div class="info-row">
                    <span class="label">Screen:</span>
                    <span class="value">${info.screenResolution}</span>
                </div>
                <div class="info-row">
                    <span class="label">Viewport:</span>
                    <span class="value">${info.viewportSize}</span>
                </div>
            </div>
            
            <div class="section">
                <div class="section-title">🕐 Time & Language</div>
                <div class="info-row">
                    <span class="label">Visit Time:</span>
                    <span class="value">${info.localTime}</span>
                </div>
                <div class="info-row">
                    <span class="label">Timezone:</span>
                    <span class="value">${info.timezone}</span>
                </div>
                <div class="info-row">
                    <span class="label">Language:</span>
                    <span class="value">${info.language}</span>
                </div>
            </div>
            
            <div class="section">
                <div class="section-title">🔗 Visit Details</div>
                <div class="info-row">
                    <span class="label">Current Page:</span>
                    <span class="value">${info.currentPage}</span>
                </div>
                <div class="info-row">
                    <span class="label">Referrer:</span>
                    <span class="value">${info.referrer}</span>
                </div>
            </div>
        </div>
        
        <div class="footer">
            <p style="margin: 0;">This is an automated notification from your portfolio visitor tracking system.</p>
            <p style="margin: 5px 0 0 0;">Portfolio: Rohit Kumar - Software Engineer</p>
        </div>
    </div>
</body>
</html>
    `.trim();
    
    // Send via Web3Forms
    const formData = new FormData();
    formData.append('access_key', config.web3formsKey);
    formData.append('subject', emailSubject);
    formData.append('from_name', 'Portfolio Visitor Tracker');
    formData.append('email', config.yourEmail);
    formData.append('message', emailBody);
    formData.append('content_type', 'text/html');
    
    const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
    });
    
    if (!response.ok) {
        throw new Error('Failed to send notification');
    }
    
    return await response.json();
}

// Initialize tracking when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure page is fully loaded
    setTimeout(initVisitorTracking, 2000);
});



