package com.sports.model.enums;

/**
 * Event Request Status
 */
public enum EventRequestStatus {
    PENDING,      // Awaiting admin review
    APPROVED,     // Admin approved, event created
    REJECTED,     // Admin rejected the request
    CANCELLED     // User cancelled the request
}
