Stadiums

    GET /api/stadiums - Get all stadiums

    GET /api/stadiums/:id - Get a specific stadium

    GET /api/stadiums/:id/seats - Get a stadium with all its seats

    POST /api/stadiums - Create a new stadium

    PUT /api/stadiums/:id - Update a stadium

    DELETE /api/stadiums/:id - Delete a stadium

Seats

    GET /api/seats - Get all seats

    GET /api/seats/:id - Get a specific seat

    GET /api/seats/stadium/:stadiumId - Get all seats for a specific stadium

    POST /api/seats - Create a new seat

    POST /api/seats/bulk - Create multiple seats at once

    PUT /api/seats/:id - Update a seat

    PATCH /api/seats/:id/status - Update just the status of a seat

    DELETE /api/seats/:id - Delete a seat

Event Zones

    GET /api/zones - Get all zones

    GET /api/zones/:id - Get a specific zone

    GET /api/zones/schedule/:scheduleId - Get all zones for a specific event schedule

    POST /api/zones - Create a new zone

    PUT /api/zones/:id - Update a zone

    PATCH /api/zones/:id/status - Update just the status of a zone

    DELETE /api/zones/:id - Delete a zone
