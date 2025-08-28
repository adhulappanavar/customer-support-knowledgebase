#!/usr/bin/env python3
"""
SQLite Database Module for Ticket Management System
Handles database initialization, schema creation, and sample data
"""

import sqlite3
import os
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
import json

class TicketDatabase:
    def __init__(self, db_path: str = "tickets.db"):
        self.db_path = db_path
        self.init_database()
    
    def get_connection(self):
        """Get a database connection"""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row  # Enable dict-like access
        return conn
    
    def init_database(self):
        """Initialize database with schema and sample data"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        # Create tables
        self.create_tables(cursor)
        
        # Insert sample data if tables are empty
        if self.is_empty(cursor):
            self.insert_sample_data(cursor)
        
        conn.commit()
        conn.close()
        print(f"✅ Database initialized: {self.db_path}")
    
    def create_tables(self, cursor):
        """Create all necessary tables"""
        
        # Users table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                full_name VARCHAR(100) NOT NULL,
                role VARCHAR(20) DEFAULT 'customer',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Categories table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS categories (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name VARCHAR(50) UNIQUE NOT NULL,
                description TEXT,
                sla_hours INTEGER DEFAULT 24,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Priority levels table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS priority_levels (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name VARCHAR(20) UNIQUE NOT NULL,
                description TEXT,
                sla_hours INTEGER NOT NULL,
                color VARCHAR(7) DEFAULT '#000000',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Status table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS statuses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name VARCHAR(30) UNIQUE NOT NULL,
                description TEXT,
                is_active BOOLEAN DEFAULT 1,
                color VARCHAR(7) DEFAULT '#000000',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Tickets table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS tickets (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                ticket_number VARCHAR(20) UNIQUE NOT NULL,
                title VARCHAR(200) NOT NULL,
                description TEXT NOT NULL,
                user_id INTEGER NOT NULL,
                category_id INTEGER NOT NULL,
                priority_id INTEGER NOT NULL,
                status_id INTEGER NOT NULL,
                assigned_to INTEGER,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                resolved_at TIMESTAMP,
                due_date TIMESTAMP,
                tags TEXT,
                FOREIGN KEY (user_id) REFERENCES users (id),
                FOREIGN KEY (category_id) REFERENCES categories (id),
                FOREIGN KEY (priority_id) REFERENCES priority_levels (id),
                FOREIGN KEY (status_id) REFERENCES statuses (id),
                FOREIGN KEY (assigned_to) REFERENCES users (id)
            )
        """)
        
        # Ticket comments table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS ticket_comments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                ticket_id INTEGER NOT NULL,
                user_id INTEGER NOT NULL,
                comment TEXT NOT NULL,
                is_internal BOOLEAN DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (ticket_id) REFERENCES tickets (id),
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        """)
        
        # Ticket history table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS ticket_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                ticket_id INTEGER NOT NULL,
                user_id INTEGER NOT NULL,
                action VARCHAR(50) NOT NULL,
                old_value TEXT,
                new_value TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (ticket_id) REFERENCES tickets (id),
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        """)
    
    def is_empty(self, cursor) -> bool:
        """Check if tables are empty"""
        cursor.execute("SELECT COUNT(*) FROM users")
        return cursor.fetchone()[0] == 0
    
    def insert_sample_data(self, cursor):
        """Insert sample data for testing"""
        
        # Insert sample users
        users = [
            (1, 'admin', 'admin@company.com', 'System Administrator', 'admin'),
            (2, 'john_doe', 'john@company.com', 'John Doe', 'customer'),
            (3, 'jane_smith', 'jane@company.com', 'Jane Smith', 'customer'),
            (4, 'support_agent', 'support@company.com', 'Support Agent', 'agent'),
            (5, 'manager', 'manager@company.com', 'Support Manager', 'manager')
        ]
        
        cursor.executemany("""
            INSERT INTO users (id, username, email, full_name, role) 
            VALUES (?, ?, ?, ?, ?)
        """, users)
        
        # Insert sample categories
        categories = [
            (1, 'Technical Issue', 'Software or hardware problems', 24),
            (2, 'Billing Question', 'Payment and invoice inquiries', 48),
            (3, 'Feature Request', 'New functionality suggestions', 72),
            (4, 'Account Access', 'Login and permission issues', 12),
            (5, 'General Inquiry', 'Other questions and information', 24)
        ]
        
        cursor.executemany("""
            INSERT INTO categories (id, name, description, sla_hours) 
            VALUES (?, ?, ?, ?)
        """, categories)
        
        # Insert sample priority levels
        priorities = [
            (1, 'Low', 'Minor issues, no immediate impact', 72, '#28a745'),
            (2, 'Medium', 'Moderate impact on user experience', 48, '#ffc107'),
            (3, 'High', 'Significant impact on user experience', 24, '#fd7e14'),
            (4, 'Critical', 'System down or major functionality broken', 4, '#dc3545'),
            (5, 'Emergency', 'Complete system failure', 1, '#6f42c1')
        ]
        
        cursor.executemany("""
            INSERT INTO priority_levels (id, name, description, sla_hours, color) 
            VALUES (?, ?, ?, ?, ?)
        """, priorities)
        
        # Insert sample statuses
        statuses = [
            (1, 'Open', 'Ticket is open and awaiting response', 1, '#007bff'),
            (2, 'In Progress', 'Ticket is being worked on', 1, '#ffc107'),
            (3, 'Waiting for Customer', 'Awaiting customer response', 1, '#6c757d'),
            (4, 'Resolved', 'Issue has been resolved', 1, '#28a745'),
            (5, 'Closed', 'Ticket is closed', 1, '#6c757d')
        ]
        
        cursor.executemany("""
            INSERT INTO statuses (id, name, description, is_active, color) 
            VALUES (?, ?, ?, ?, ?)
        """, statuses)
        
        # Insert sample tickets
        tickets = [
            (1, 'TKT-001', 'Cannot login to application', 'I am unable to access the system with my credentials', 2, 1, 3, 1, 4, '2024-01-15 09:00:00', '2024-01-15 09:00:00', None, '2024-01-16 09:00:00', 'login,access'),
            (2, 'TKT-002', 'Invoice not received', 'I completed my order but did not receive an invoice', 3, 2, 2, 1, 4, '2024-01-15 10:30:00', '2024-01-15 10:30:00', None, '2024-01-17 10:30:00', 'billing,invoice'),
            (3, 'TKT-003', 'Feature request: Dark mode', 'Would be great to have a dark theme option', 2, 3, 1, 1, None, '2024-01-15 11:15:00', '2024-01-15 11:15:00', None, '2024-01-18 11:15:00', 'feature,ui'),
            (4, 'TKT-004', 'System performance slow', 'The application is running very slowly today', 3, 1, 2, 2, 4, '2024-01-15 14:20:00', '2024-01-15 14:20:00', None, '2024-01-17 14:20:00', 'performance,slow'),
            (5, 'TKT-005', 'Password reset not working', 'The password reset link is not functioning', 2, 4, 3, 1, 4, '2024-01-15 16:45:00', '2024-01-15 16:45:00', None, '2024-01-16 16:45:00', 'password,reset')
        ]
        
        cursor.executemany("""
            INSERT INTO tickets (id, ticket_number, title, description, user_id, category_id, priority_id, status_id, assigned_to, created_at, updated_at, resolved_at, due_date, tags) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, tickets)
        
        # Insert sample comments
        comments = [
            (1, 1, 4, 'Investigating login issue. Please check if you are using the correct email address.', 0),
            (2, 1, 2, 'Yes, I am using the correct email. The password is also correct.', 0),
            (3, 1, 4, 'I can see the issue. Your account was temporarily locked due to multiple failed attempts. I have unlocked it now.', 0),
            (4, 2, 4, 'Looking into the invoice issue. Can you confirm your email address?', 0),
            (5, 3, 4, 'Thank you for the suggestion! I have added this to our feature roadmap.', 0)
        ]
        
        cursor.executemany("""
            INSERT INTO ticket_comments (id, ticket_id, user_id, comment, is_internal) 
            VALUES (?, ?, ?, ?, ?)
        """, comments)
        
        print("✅ Sample data inserted successfully")
    
    def generate_ticket_number(self) -> str:
        """Generate a unique ticket number"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute("SELECT COUNT(*) FROM tickets")
        count = cursor.fetchone()[0]
        
        conn.close()
        return f"TKT-{str(count + 1).zfill(3)}"
    
    def create_ticket(self, title: str, description: str, user_id: int, 
                     category_id: int, priority_id: int, tags: str = "") -> int:
        """Create a new ticket"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        ticket_number = self.generate_ticket_number()
        due_date = datetime.now() + timedelta(hours=24)  # Default 24h SLA
        
        cursor.execute("""
            INSERT INTO tickets (ticket_number, title, description, user_id, 
                               category_id, priority_id, status_id, due_date, tags)
            VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?)
        """, (ticket_number, title, description, user_id, category_id, priority_id, due_date, tags))
        
        ticket_id = cursor.lastrowid
        
        # Add to history
        cursor.execute("""
            INSERT INTO ticket_history (ticket_id, user_id, action, new_value)
            VALUES (?, ?, 'created', ?)
        """, (ticket_id, user_id, f"Ticket created: {title}"))
        
        conn.commit()
        conn.close()
        
        return ticket_id
    
    def get_ticket(self, ticket_id: int) -> Optional[Dict[str, Any]]:
        """Get a ticket by ID with all related information"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT 
                t.*,
                u.username as user_username, u.full_name as user_full_name,
                c.name as category_name, c.sla_hours as category_sla,
                p.name as priority_name, p.color as priority_color, p.sla_hours as priority_sla,
                s.name as status_name, s.color as status_color,
                a.username as assigned_username, a.full_name as assigned_full_name
            FROM tickets t
            JOIN users u ON t.user_id = u.id
            JOIN categories c ON t.category_id = c.id
            JOIN priority_levels p ON t.priority_id = p.id
            JOIN statuses s ON t.status_id = s.id
            LEFT JOIN users a ON t.assigned_to = a.id
            WHERE t.id = ?
        """, (ticket_id,))
        
        row = cursor.fetchone()
        conn.close()
        
        if row:
            return dict(row)
        return None
    
    def get_tickets(self, user_id: Optional[int] = None, status_id: Optional[int] = None,
                   category_id: Optional[int] = None, priority_id: Optional[int] = None,
                   assigned_to: Optional[int] = None, limit: int = 100, offset: int = 0) -> List[Dict[str, Any]]:
        """Get tickets with optional filters"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        query = """
            SELECT 
                t.*,
                u.username as user_username, u.full_name as user_full_name,
                c.name as category_name,
                p.name as priority_name, p.color as priority_color,
                s.name as status_name, s.color as status_color,
                a.username as assigned_username, a.full_name as assigned_full_name
            FROM tickets t
            JOIN users u ON t.user_id = u.id
            JOIN categories c ON t.category_id = c.id
            JOIN priority_levels p ON t.priority_id = p.id
            JOIN statuses s ON t.status_id = s.id
            LEFT JOIN users a ON t.assigned_to = a.id
            WHERE 1=1
        """
        
        params = []
        
        if user_id:
            query += " AND t.user_id = ?"
            params.append(user_id)
        
        if status_id:
            query += " AND t.status_id = ?"
            params.append(status_id)
        
        if category_id:
            query += " AND t.category_id = ?"
            params.append(category_id)
        
        if priority_id:
            query += " AND t.priority_id = ?"
            params.append(priority_id)
        
        if assigned_to:
            query += " AND t.assigned_to = ?"
            params.append(assigned_to)
        
        query += " ORDER BY t.created_at DESC LIMIT ? OFFSET ?"
        params.extend([limit, offset])
        
        cursor.execute(query, params)
        rows = cursor.fetchall()
        conn.close()
        
        return [dict(row) for row in rows]
    
    def update_ticket(self, ticket_id: int, updates: Dict[str, Any], user_id: int) -> bool:
        """Update a ticket"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        # Get current ticket data for history
        cursor.execute("SELECT * FROM tickets WHERE id = ?", (ticket_id,))
        current = cursor.fetchone()
        
        if not current:
            conn.close()
            return False
        
        # Build update query
        set_clauses = []
        params = []
        
        for field, value in updates.items():
            if field in ['title', 'description', 'category_id', 'priority_id', 'status_id', 'assigned_to', 'tags', 'due_date']:
                set_clauses.append(f"{field} = ?")
                params.append(value)
        
        if not set_clauses:
            conn.close()
            return False
        
        set_clauses.append("updated_at = ?")
        params.append(datetime.now().isoformat())
        params.append(ticket_id)
        
        query = f"UPDATE tickets SET {', '.join(set_clauses)} WHERE id = ?"
        cursor.execute(query, params)
        
        # Add to history
        for field, value in updates.items():
            if field in ['title', 'description', 'category_id', 'priority_id', 'status_id', 'assigned_to', 'tags', 'due_date']:
                old_value = current[field]
                cursor.execute("""
                    INSERT INTO ticket_history (ticket_id, user_id, action, old_value, new_value)
                    VALUES (?, ?, ?, ?, ?)
                """, (ticket_id, user_id, f"updated_{field}", str(old_value), str(value)))
        
        conn.commit()
        conn.close()
        
        return True
    
    def add_comment(self, ticket_id: int, user_id: int, comment: str, is_internal: bool = False) -> int:
        """Add a comment to a ticket"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            INSERT INTO ticket_comments (ticket_id, user_id, comment, is_internal)
            VALUES (?, ?, ?, ?)
        """, (ticket_id, user_id, comment, is_internal))
        
        comment_id = cursor.lastrowid
        
        # Add to history
        cursor.execute("""
            INSERT INTO ticket_history (ticket_id, user_id, action, new_value)
            VALUES (?, ?, 'comment_added', ?)
        """, (ticket_id, user_id, f"Comment added: {comment[:50]}..."))
        
        conn.commit()
        conn.close()
        
        return comment_id
    
    def get_comments(self, ticket_id: int, include_internal: bool = False) -> List[Dict[str, Any]]:
        """Get comments for a ticket"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        if include_internal:
            cursor.execute("""
                SELECT c.*, u.username, u.full_name
                FROM ticket_comments c
                JOIN users u ON c.user_id = u.id
                WHERE c.ticket_id = ?
                ORDER BY c.created_at ASC
            """, (ticket_id,))
        else:
            cursor.execute("""
                SELECT c.*, u.username, u.full_name
                FROM ticket_comments c
                JOIN users u ON c.user_id = u.id
                WHERE c.ticket_id = ? AND c.is_internal = 0
                ORDER BY c.created_at ASC
            """, (ticket_id,))
        
        rows = cursor.fetchall()
        conn.close()
        
        return [dict(row) for row in rows]
    
    def get_ticket_history(self, ticket_id: int) -> List[Dict[str, Any]]:
        """Get ticket history"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT h.*, u.username, u.full_name
            FROM ticket_history h
            JOIN users u ON h.user_id = u.id
            WHERE h.ticket_id = ?
            ORDER BY h.created_at ASC
        """, (ticket_id,))
        
        rows = cursor.fetchall()
        conn.close()
        
        return [dict(row) for row in rows]
    
    def get_statistics(self) -> Dict[str, Any]:
        """Get ticket statistics"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        # Total tickets
        cursor.execute("SELECT COUNT(*) FROM tickets")
        total_tickets = cursor.fetchone()[0]
        
        # Open tickets
        cursor.execute("SELECT COUNT(*) FROM tickets WHERE status_id IN (1, 2, 3)")
        open_tickets = cursor.fetchone()[0]
        
        # Resolved tickets
        cursor.execute("SELECT COUNT(*) FROM tickets WHERE status_id = 4")
        resolved_tickets = cursor.fetchone()[0]
        
        # Critical tickets
        cursor.execute("SELECT COUNT(*) FROM tickets WHERE priority_id IN (4, 5) AND status_id IN (1, 2, 3)")
        critical_tickets = cursor.fetchone()[0]
        
        # Tickets by category
        cursor.execute("""
            SELECT c.name, COUNT(*) as count
            FROM tickets t
            JOIN categories c ON t.category_id = c.id
            GROUP BY c.id, c.name
            ORDER BY count DESC
        """)
        tickets_by_category = [dict(row) for row in cursor.fetchall()]
        
        # Tickets by priority
        cursor.execute("""
            SELECT p.name, p.color, COUNT(*) as count
            FROM tickets t
            JOIN priority_levels p ON t.priority_id = p.id
            GROUP BY p.id, p.name, p.color
            ORDER BY p.id
        """)
        tickets_by_priority = [dict(row) for row in cursor.fetchall()]
        
        conn.close()
        
        return {
            'total_tickets': total_tickets,
            'open_tickets': open_tickets,
            'resolved_tickets': resolved_tickets,
            'critical_tickets': critical_tickets,
            'tickets_by_category': tickets_by_category,
            'tickets_by_priority': tickets_by_priority
        }
    
    def get_categories(self) -> List[Dict[str, Any]]:
        """Get all categories"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute("SELECT * FROM categories ORDER BY name")
        rows = cursor.fetchall()
        conn.close()
        
        return [dict(row) for row in rows]
    
    def get_priorities(self) -> List[Dict[str, Any]]:
        """Get all priority levels"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute("SELECT * FROM priority_levels ORDER BY id")
        rows = cursor.fetchall()
        conn.close()
        
        return [dict(row) for row in rows]
    
    def get_statuses(self) -> List[Dict[str, Any]]:
        """Get all statuses"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute("SELECT * FROM statuses WHERE is_active = 1 ORDER BY id")
        rows = cursor.fetchall()
        conn.close()
        
        return [dict(row) for row in rows]
    
    def get_users(self, role: Optional[str] = None) -> List[Dict[str, Any]]:
        """Get users with optional role filter"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        if role:
            cursor.execute("SELECT * FROM users WHERE role = ? ORDER BY full_name", (role,))
        else:
            cursor.execute("SELECT * FROM users ORDER BY full_name")
        
        rows = cursor.fetchall()
        conn.close()
        
        return [dict(row) for row in rows]

# Global database instance
db = TicketDatabase()
