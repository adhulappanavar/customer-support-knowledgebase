#!/usr/bin/env python3
"""
FastAPI Ticketing System
Independent ticket management system with SQLite database
"""

from fastapi import FastAPI, HTTPException, Query, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime
import uvicorn

from database import db

# Initialize FastAPI app
app = FastAPI(
    title="Ticket Management System",
    description="Independent ticketing system for customer support",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class TicketCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: str = Field(..., min_length=10)
    user_id: int
    category_id: int
    priority_id: int
    tags: Optional[str] = ""

class TicketUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, min_length=10)
    category_id: Optional[int] = None
    priority_id: Optional[int] = None
    status_id: Optional[int] = None
    assigned_to: Optional[int] = None
    tags: Optional[str] = None

class TicketResponse(BaseModel):
    id: int
    ticket_number: str
    title: str
    description: str
    user_id: int
    user_username: str
    user_full_name: str
    category_id: int
    category_name: str
    priority_id: int
    priority_name: str
    priority_color: str
    status_id: int
    status_name: str
    status_color: str
    assigned_to: Optional[int]
    assigned_username: Optional[str]
    assigned_full_name: Optional[str]
    created_at: str
    updated_at: str
    resolved_at: Optional[str]
    due_date: Optional[str]
    tags: Optional[str]

class TicketStats(BaseModel):
    total_tickets: int
    open_tickets: int
    resolved_tickets: int
    critical_tickets: int
    tickets_by_category: List[Dict[str, Any]]
    tickets_by_priority: List[Dict[str, Any]]

class CategoryResponse(BaseModel):
    id: int
    name: str
    description: str
    sla_hours: int

class PriorityResponse(BaseModel):
    id: int
    name: str
    description: str
    sla_hours: int
    color: str

class StatusResponse(BaseModel):
    id: int
    name: str
    description: str
    is_active: bool
    color: str

class CommentCreate(BaseModel):
    comment: str = Field(..., min_length=1)
    is_internal: bool = False

class CommentResponse(BaseModel):
    id: int
    ticket_id: int
    user_id: int
    username: str
    full_name: str
    comment: str
    is_internal: bool
    created_at: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    full_name: str
    role: str
    created_at: str

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "Ticket Management System"}

# Ticket endpoints
@app.post("/tickets", response_model=Dict[str, Any])
async def create_ticket(ticket: TicketCreate):
    """Create a new ticket"""
    try:
        ticket_id = db.create_ticket(
            title=ticket.title,
            description=ticket.description,
            user_id=ticket.user_id,
            category_id=ticket.category_id,
            priority_id=ticket.priority_id,
            tags=ticket.tags
        )
        
        return {
            "message": "Ticket created successfully",
            "ticket_id": ticket_id,
            "ticket_number": db.get_ticket(ticket_id)["ticket_number"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create ticket: {str(e)}")

@app.get("/tickets", response_model=List[TicketResponse])
async def get_tickets(
    user_id: Optional[int] = Query(None, description="Filter by user ID"),
    status_id: Optional[int] = Query(None, description="Filter by status ID"),
    category_id: Optional[int] = Query(None, description="Filter by category ID"),
    priority_id: Optional[int] = Query(None, description="Filter by priority ID"),
    assigned_to: Optional[int] = Query(None, description="Filter by assigned agent"),
    limit: int = Query(100, description="Number of tickets to return"),
    offset: int = Query(0, description="Number of tickets to skip")
):
    """Get tickets with optional filters"""
    try:
        tickets = db.get_tickets(
            user_id=user_id,
            status_id=status_id,
            category_id=category_id,
            priority_id=priority_id,
            assigned_to=assigned_to,
            limit=limit,
            offset=offset
        )
        return tickets
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch tickets: {str(e)}")

@app.get("/tickets/{ticket_id}", response_model=TicketResponse)
async def get_ticket(ticket_id: int):
    """Get a specific ticket by ID"""
    try:
        ticket = db.get_ticket(ticket_id)
        if not ticket:
            raise HTTPException(status_code=404, detail="Ticket not found")
        return ticket
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch ticket: {str(e)}")

@app.put("/tickets/{ticket_id}")
async def update_ticket(ticket_id: int, updates: TicketUpdate, user_id: int = Query(..., description="User ID making the update")):
    """Update a ticket"""
    try:
        # Convert Pydantic model to dict, excluding None values
        update_data = {k: v for k, v in updates.dict().items() if v is not None}
        
        if not update_data:
            raise HTTPException(status_code=400, detail="No valid updates provided")
        
        success = db.update_ticket(ticket_id, update_data, user_id)
        if not success:
            raise HTTPException(status_code=404, detail="Ticket not found")
        
        return {"message": "Ticket updated successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update ticket: {str(e)}")

# Comment endpoints
@app.post("/tickets/{ticket_id}/comments", response_model=Dict[str, Any])
async def add_comment(ticket_id: int, comment: CommentCreate, user_id: int = Query(..., description="User ID adding the comment")):
    """Add a comment to a ticket"""
    try:
        comment_id = db.add_comment(
            ticket_id=ticket_id,
            user_id=user_id,
            comment=comment.comment,
            is_internal=comment.is_internal
        )
        
        return {
            "message": "Comment added successfully",
            "comment_id": comment_id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to add comment: {str(e)}")

@app.get("/tickets/{ticket_id}/comments", response_model=List[CommentResponse])
async def get_comments(ticket_id: int, include_internal: bool = Query(False, description="Include internal comments")):
    """Get comments for a ticket"""
    try:
        comments = db.get_comments(ticket_id, include_internal)
        return comments
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch comments: {str(e)}")

# History endpoint
@app.get("/tickets/{ticket_id}/history")
async def get_ticket_history(ticket_id: int):
    """Get ticket history"""
    try:
        history = db.get_ticket_history(ticket_id)
        return history
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch ticket history: {str(e)}")

# Statistics endpoint
@app.get("/statistics", response_model=TicketStats)
async def get_statistics():
    """Get ticket statistics"""
    try:
        stats = db.get_statistics()
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch statistics: {str(e)}")

# Reference data endpoints
@app.get("/categories", response_model=List[CategoryResponse])
async def get_categories():
    """Get all categories"""
    try:
        categories = db.get_categories()
        return categories
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch categories: {str(e)}")

@app.get("/priorities", response_model=List[PriorityResponse])
async def get_priorities():
    """Get all priority levels"""
    try:
        priorities = db.get_priorities()
        return priorities
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch priorities: {str(e)}")

@app.get("/statuses", response_model=List[StatusResponse])
async def get_statuses():
    """Get all statuses"""
    try:
        statuses = db.get_statuses()
        return statuses
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch statuses: {str(e)}")

@app.get("/users", response_model=List[UserResponse])
async def get_users(role: Optional[str] = Query(None, description="Filter by user role")):
    """Get users with optional role filter"""
    try:
        users = db.get_users(role=role)
        return users
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch users: {str(e)}")

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "Ticket Management System API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health",
        "endpoints": {
            "tickets": "/tickets",
            "categories": "/categories",
            "priorities": "/priorities",
            "statuses": "/statuses",
            "users": "/users",
            "statistics": "/statistics"
        }
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
