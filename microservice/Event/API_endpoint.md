API Endpoints

Your Event Service now exposes the following endpoints:
Events

    GET /api/events - Get all events

    GET /api/events/:id - Get a specific event

    POST /api/events - Create a new event

    PUT /api/events/:id - Update an event

    DELETE /api/events/:id - Delete an event

Event Schedules

    GET /api/schedules - Get all schedules

    GET /api/schedules/:id - Get a specific schedule

    GET /api/schedules/event/:eventId - Get schedules for a specific event

    POST /api/schedules - Create a new schedule

    PUT /api/schedules/:id - Update a schedule

    DELETE /api/schedules/:id - Delete a schedule

Event Zones

    GET /api/zones - Get all zones

    GET /api/zones/:id - Get a specific zone

    GET /api/zones/schedule/:scheduleId - Get zones for a specific schedule

    POST /api/zones - Create a new zone

    PUT /api/zones/:id - Update a zone

    DELETE /api/zones/:id - Delete a zone
