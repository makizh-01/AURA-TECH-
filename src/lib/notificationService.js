/**
 * AURA TECH Automated Notification Service
 * Handles Email (auratech008@gmail.com) and WhatsApp messaging to clients
 */

export function sendWhatsAppNotification(booking) {
  const phone = (booking.client_phone || '').replace(/[^0-9]/g, '');
  // Format international number (default +91 for India if 10 digits)
  const formattedPhone = phone.length === 10 ? `91${phone}` : phone;

  const statusText = (booking.status || 'Pending Review').replace('_', ' ').toUpperCase();
  
  const message = 
`*AURA TECH Project Notification* 🚀

Hello *${booking.client_name}*,

Your project booking status has been updated!

📌 *Project Title:* ${booking.project_title}
🏷 *Category:* ${booking.project_type || 'General'}
📊 *Current Status:* ${statusText}
🗓 *Expected Time:* ${booking.expected_time || '1 - 2 Weeks'}
👤 *Account Type:* ${booking.client_type || 'Student'}

For technical support, contact our Help Desk: +91 93452 56633.

Thank you for choosing *AURA TECH* — A Reliable Backbone Of Your Business.`;

  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodedMessage}`;
  
  // Open WhatsApp in new tab
  window.open(whatsappUrl, '_blank');
}

export function sendEmailNotification(booking) {
  const email = booking.client_email;
  const statusText = (booking.status || 'Pending Review').replace('_', ' ').toUpperCase();
  
  const subject = encodeURIComponent(`AURA TECH - Project Status Update: ${booking.project_title}`);
  
  const body = encodeURIComponent(
`Hello ${booking.client_name},

This is an automated status update from AURA TECH (auratech008@gmail.com).

Project Title: ${booking.project_title}
Category: ${booking.project_type || 'General'}
Current Status: ${statusText}
Expected Timeline: ${booking.expected_time || '1 - 2 Weeks'}
Account Category: ${booking.client_type || 'Student'}

Description / Specs:
${booking.description || 'N/A'}

Our engineering team is actively working to ensure 100% on-time delivery. If you have any questions or require modifications, please contact our Help Desk at +91 93452 56633 or reply directly to auratech008@gmail.com.

Best regards,
AURA TECH Engineering & Management Team
auratech008@gmail.com | +91 90252 55617
`
  );

  const mailtoUrl = `mailto:${email}?subject=${subject}&body=${body}`;
  window.location.href = mailtoUrl;
}
