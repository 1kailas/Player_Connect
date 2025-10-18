package com.sports.model.enums;

/**
 * Status of Events/Tournaments
 */
public enum EventStatus {
    DRAFT,              // Event being planned
    REGISTRATION_OPEN,  // Registration open for participants
    REGISTRATION_CLOSED,// Registration closed
    UPCOMING,           // Scheduled but not started
    LIVE,               // Currently happening
    COMPLETED,          // Event finished
    CANCELLED,          // Event cancelled
    POSTPONED           // Event postponed
}
