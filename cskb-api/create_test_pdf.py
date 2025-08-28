#!/usr/bin/env python3
"""
Create a comprehensive test PDF for testing the RAG API
"""

from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch

def create_test_pdf():
    """Create a comprehensive test PDF with diverse customer support information"""
    
    # Create the PDF document
    doc = SimpleDocTemplate("test_support_guide.pdf", pagesize=letter)
    styles = getSampleStyleSheet()
    
    # Create custom styles
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=16,
        spaceAfter=30,
        textColor='#2E86AB'
    )
    
    heading_style = ParagraphStyle(
        'CustomHeading',
        parent=styles['Heading2'],
        fontSize=14,
        spaceAfter=20,
        textColor='#A23B72'
    )
    
    body_style = ParagraphStyle(
        'CustomBody',
        parent=styles['Normal'],
        fontSize=11,
        spaceAfter=12,
        leftIndent=20
    )
    
    # Content
    story = []
    
    # Title
    story.append(Paragraph("Comprehensive Customer Support Policy and Procedures", title_style))
    story.append(Spacer(1, 20))
    
    # Support Hours
    story.append(Paragraph("1. Support Hours and Availability", heading_style))
    story.append(Paragraph("• Monday to Friday: 9:00 AM - 6:00 PM EST", body_style))
    story.append(Paragraph("• Weekend: 10:00 AM - 4:00 PM EST", body_style))
    story.append(Paragraph("• Emergency Support: 24/7 via hotline", body_style))
    story.append(Paragraph("• Holiday Schedule: Limited support on major holidays", body_style))
    story.append(Paragraph("• Time Zone Support: Available in EST, PST, and GMT", body_style))
    story.append(Spacer(1, 15))
    
    # Contact Methods
    story.append(Paragraph("2. Contact Methods and Channels", heading_style))
    story.append(Paragraph("• Phone Support: 1-800-SUPPORT (1-800-787-7678)", body_style))
    story.append(Paragraph("• Email Support: support@company.com", body_style))
    story.append(Paragraph("• Live Chat: Available on website during business hours", body_style))
    story.append(Paragraph("• Ticket System: support.company.com", body_style))
    story.append(Paragraph("• Social Media: Twitter @CompanySupport, Facebook", body_style))
    story.append(Paragraph("• Mobile App: In-app support chat available", body_style))
    story.append(Spacer(1, 15))
    
    # Response Times
    story.append(Paragraph("3. Response Time Commitments", heading_style))
    story.append(Paragraph("• Critical Issues: 2 hours maximum response time", body_style))
    story.append(Paragraph("• High Priority: 4 hours maximum response time", body_style))
    story.append(Paragraph("• Normal Issues: 24 hours maximum response time", body_style))
    story.append(Paragraph("• General Inquiries: 48 hours maximum response time", body_style))
    story.append(Paragraph("• Feature Requests: 72 hours for initial response", body_style))
    story.append(Paragraph("• Bug Reports: 24 hours for acknowledgment", body_style))
    story.append(Spacer(1, 15))
    
    # Password Reset
    story.append(Paragraph("4. Password Reset and Account Security", heading_style))
    story.append(Paragraph("• Visit password.company.com for password reset", body_style))
    story.append(Paragraph("• Enter your registered email address", body_style))
    story.append(Paragraph("• Check email inbox for password reset link", body_style))
    story.append(Paragraph("• Click the secure link provided in the email", body_style))
    story.append(Paragraph("• Follow instructions to set a new password", body_style))
    story.append(Paragraph("• Password requirements: minimum 8 characters", body_style))
    story.append(Paragraph("• Must include: uppercase, lowercase, numbers, symbols", body_style))
    story.append(Paragraph("• Two-factor authentication recommended", body_style))
    story.append(Spacer(1, 15))
    
    # Refund Policy
    story.append(Paragraph("5. Refund and Cancellation Policy", heading_style))
    story.append(Paragraph("• 30-day money-back guarantee on all purchases", body_style))
    story.append(Paragraph("• Contact support within 30 days of purchase", body_style))
    story.append(Paragraph("• Provide order number and reason for refund", body_style))
    story.append(Paragraph("• Refund processed within 5-7 business days", body_style))
    story.append(Paragraph("• Partial refunds available for subscription services", body_style))
    story.append(Paragraph("• No refunds after 30 days except for technical issues", body_style))
    story.append(Paragraph("• Cancellation available anytime for subscriptions", body_style))
    story.append(Spacer(1, 15))
    
    # Technical Support
    story.append(Paragraph("6. Technical Support Services", heading_style))
    story.append(Paragraph("• Remote desktop assistance for complex issues", body_style))
    story.append(Paragraph("• Screen sharing capabilities for troubleshooting", body_style))
    story.append(Paragraph("• Knowledge base articles at help.company.com", body_style))
    story.append(Paragraph("• Video tutorials for common technical issues", body_style))
    story.append(Paragraph("• Step-by-step troubleshooting guides", body_style))
    story.append(Paragraph("• System compatibility checker tool", body_style))
    story.append(Paragraph("• Performance optimization recommendations", body_style))
    story.append(Spacer(1, 15))
    
    # Product Support
    story.append(Paragraph("7. Product-Specific Support", heading_style))
    story.append(Paragraph("• Software Installation: Step-by-step guides available", body_style))
    story.append(Paragraph("• Hardware Compatibility: Check system requirements", body_style))
    story.append(Paragraph("• API Documentation: Developer support available", body_style))
    story.append(Paragraph("• Integration Support: Third-party app connections", body_style))
    story.append(Paragraph("• Customization Help: Theme and layout assistance", body_style))
    story.append(Paragraph("• Data Migration: Import/export support", body_style))
    story.append(Spacer(1, 15))
    
    # Training and Resources
    story.append(Paragraph("8. Training and Educational Resources", heading_style))
    story.append(Paragraph("• Free online training courses available", body_style))
    story.append(Paragraph("• Webinar schedule: Weekly live training sessions", body_style))
    story.append(Paragraph("• Certification programs for advanced users", body_style))
    story.append(Paragraph("• User community forum for peer support", body_style))
    story.append(Paragraph("• Best practices documentation", body_style))
    story.append(Paragraph("• Case study examples and success stories", body_style))
    story.append(Spacer(1, 15))
    
    # Billing Support
    story.append(Paragraph("9. Billing and Payment Support", heading_style))
    story.append(Paragraph("• Multiple payment methods accepted", body_style))
    story.append(Paragraph("• Credit card, PayPal, and bank transfer options", body_style))
    story.append(Paragraph("• Invoice generation and management", body_style))
    story.append(Paragraph("• Payment plan options for large purchases", body_style))
    story.append(Paragraph("• Tax documentation and receipts", body_style))
    story.append(Paragraph("• Subscription management and upgrades", body_style))
    story.append(Paragraph("• Bulk licensing and enterprise pricing", body_style))
    story.append(Spacer(1, 15))
    
    # Escalation Process
    story.append(Paragraph("10. Escalation and Advanced Support", heading_style))
    story.append(Paragraph("• Tier 1: Basic support and general inquiries", body_style))
    story.append(Paragraph("• Tier 2: Technical issues and complex problems", body_style))
    story.append(Paragraph("• Tier 3: Engineering and development support", body_style))
    story.append(Paragraph("• Manager escalation for unresolved issues", body_style))
    story.append(Paragraph("• Executive escalation for critical business impact", body_style))
    story.append(Paragraph("• SLA commitments for each support tier", body_style))
    story.append(Spacer(1, 15))
    
    # Quality Assurance
    story.append(Paragraph("11. Quality Assurance and Feedback", heading_style))
    story.append(Paragraph("• Customer satisfaction surveys after each interaction", body_style))
    story.append(Paragraph("• Support quality monitoring and evaluation", body_style))
    story.append(Paragraph("• Continuous improvement based on feedback", body_style))
    story.append(Paragraph("• Support agent training and certification", body_style))
    story.append(Paragraph("• Performance metrics and reporting", body_style))
    story.append(Paragraph("• Customer success stories and testimonials", body_style))
    story.append(Spacer(1, 15))
    
    # Emergency Procedures
    story.append(Paragraph("12. Emergency and Critical Issue Procedures", heading_style))
    story.append(Paragraph("• 24/7 emergency hotline: 1-800-EMERGENCY", body_style))
    story.append(Paragraph("• Critical system outage notifications", body_style))
    story.append(Paragraph("• Automated status page updates", body_style))
    story.append(Paragraph("• Escalation to on-call engineers", body_style))
    story.append(Paragraph("• Customer communication protocols", body_style))
    story.append(Paragraph("• Post-incident review and documentation", body_style))
    story.append(Paragraph("• Preventive measures and recommendations", body_style))
    
    # Build the PDF
    doc.build(story)
    print("✅ Comprehensive test PDF created: test_support_guide.pdf")

if __name__ == "__main__":
    create_test_pdf()
