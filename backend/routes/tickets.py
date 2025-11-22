# backend/routes/tickets.py
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from bson import ObjectId
from pydantic import BaseModel, constr, Field
from pymongo.errors import PyMongoError

from backend.database import db
from .auth import get_current_user, UserOut

router = APIRouter(tags=["tickets"])

# Simple length-limited phone type (avoid regex here for compatibility)
PhoneStr = constr(min_length=7, max_length=20)

class TicketIn(BaseModel):
    fullname: str = Field(..., min_length=2)
    phone: PhoneStr
    district: str
    drop_point: str
    price: int = Field(..., gt=0)


class TicketOut(TicketIn):
    id: str
    user_email: str
    user_name: str


class CreateResponse(BaseModel):
    message: str
    id: str


@router.post("/create", response_model=CreateResponse, status_code=status.HTTP_201_CREATED)
async def create_ticket(ticket: TicketIn, user: UserOut = Depends(get_current_user)):
    data = ticket.dict()
    data["user_email"] = user.email
    data["user_name"] = user.name

    try:
        result = await db.tickets.insert_one(data)
    except PyMongoError as e:
        raise HTTPException(status_code=500, detail="Database error") from e

    return {"message": "Ticket booked!", "id": str(result.inserted_id)}


@router.get("/my", response_model=List[TicketOut])
async def get_my_tickets(
    user: UserOut = Depends(get_current_user),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
):
    raw_tickets = await db.tickets.find({"user_email": user.email}).skip(skip).limit(limit).to_list(length=limit)
    out = []
    for t in raw_tickets:
        tid = str(t.pop("_id", ""))
        out.append({
            **t,
            "id": tid,
            "user_email": t.get("user_email"),
            "user_name": t.get("user_name"),
        })
    return out


@router.delete("/delete/{ticket_id}", status_code=status.HTTP_200_OK)
async def delete_ticket(ticket_id: str, user: UserOut = Depends(get_current_user)):
    try:
        oid = ObjectId(ticket_id)
    except Exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid ticket id")

    result = await db.tickets.delete_one({"_id": oid, "user_email": user.email})
    if result.deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ticket not found or not yours")

    return {"message": "Ticket deleted"}
