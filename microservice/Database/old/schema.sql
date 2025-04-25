CREATE TABLE Stadiums (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    venue_type ENUM('stadium', 'arena', 'theater', 'concert_hall') NOT NULL,
    seating_capacity INT NOT NULL,
    status ENUM('active', 'under_maintenance', 'closed') NOT NULL,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    zip_code VARCHAR(20) NOT NULL,
    geo_location POINT,
    contact_phone VARCHAR(20),
    contact_email VARCHAR(255),
    website VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

CREATE TABLE StadiumSections (
    id INT NOT NULL AUTO_INCREMENT,
    stadium_id INT NOT NULL,
    section_name VARCHAR(100) NOT NULL,
    section_type ENUM('vip', 'premium', 'standard', 'economy') NOT NULL,
    capacity INT NOT NULL,
    description TEXT,
    PRIMARY KEY (id),
    FOREIGN KEY (stadium_id) REFERENCES Stadiums(id) ON DELETE CASCADE,
    UNIQUE KEY (stadium_id, section_name)
);

CREATE TABLE EventCategories (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    PRIMARY KEY (id),
    UNIQUE KEY (name)
);

CREATE TABLE EventOrganizers (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    website VARCHAR(255),
    PRIMARY KEY (id)
);

CREATE TABLE EventList (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    category_id INT NOT NULL,
    organizer_id INT NOT NULL,
    description TEXT,
    event_type ENUM('concert', 'sports', 'theater', 'conference', 'exhibition') NOT NULL,
    duration INT COMMENT 'Duration in minutes',
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (category_id) REFERENCES EventCategories(id),
    FOREIGN KEY (organizer_id) REFERENCES EventOrganizers(id)
);

CREATE TABLE EventSchedules (
    id INT NOT NULL AUTO_INCREMENT,
    stadium_id INT NOT NULL,
    event_id INT NOT NULL,
    date DATE NOT NULL,
    time_start TIME NOT NULL,
    time_end TIME NOT NULL,
    status ENUM('scheduled', 'ongoing', 'completed', 'canceled', 'postponed') NOT NULL DEFAULT 'scheduled',
    gates_open_time TIME,
    ticket_sale_start DATETIME,
    ticket_sale_end DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (stadium_id) REFERENCES Stadiums(id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES EventList(id) ON DELETE CASCADE
);

CREATE TABLE PricingTiers (
    id INT NOT NULL AUTO_INCREMENT,
    schedule_id INT NOT NULL,
    section_id INT NOT NULL,
    tier_name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    availability INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (schedule_id) REFERENCES EventSchedules(id) ON DELETE CASCADE,
    FOREIGN KEY (section_id) REFERENCES StadiumSections(id) ON DELETE CASCADE
);

CREATE TABLE Seats (
    id INT NOT NULL AUTO_INCREMENT,
    stadium_id INT NOT NULL,
    section_id INT NOT NULL,
    row_name VARCHAR(10) NOT NULL,
    seat_number VARCHAR(10) NOT NULL,
    status ENUM('available', 'reserved', 'sold', 'blocked', 'maintenance') NOT NULL DEFAULT 'available',
    seat_type ENUM('regular', 'accessible', 'premium', 'vip') NOT NULL DEFAULT 'regular',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (stadium_id) REFERENCES Stadiums(id) ON DELETE CASCADE,
    FOREIGN KEY (section_id) REFERENCES StadiumSections(id) ON DELETE CASCADE,
    UNIQUE KEY (stadium_id, section_id, row_name, seat_number)
);

-- Users table (formerly Customers)
CREATE TABLE Users (
    id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    birth_date DATE NOT NULL,
    address VARCHAR(255),
    account_status ENUM('active', 'inactive', 'suspended') NOT NULL DEFAULT 'active',
    verification_status ENUM('verified', 'unverified') NOT NULL DEFAULT 'unverified',
    role ENUM('user', 'admin', 'event_organizer') NOT NULL DEFAULT 'user',
    google_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY (username),
    UNIQUE KEY (email),
    UNIQUE KEY (google_id)
);

-- RefreshTokens table
CREATE TABLE RefreshTokens (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    used BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (id),
    UNIQUE KEY (token),
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);


CREATE TABLE Carts (
    id INT NOT NULL AUTO_INCREMENT,
    customer_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    status ENUM('active', 'checkout', 'abandoned', 'completed') NOT NULL DEFAULT 'active',
    PRIMARY KEY (id),
    FOREIGN KEY (customer_id) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE CartItems (
    id INT NOT NULL AUTO_INCREMENT,
    cart_id INT NOT NULL,
    schedule_id INT NOT NULL,
    seat_id INT NOT NULL,
    pricing_tier_id INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (cart_id) REFERENCES Carts(id) ON DELETE CASCADE,
    FOREIGN KEY (schedule_id) REFERENCES EventSchedules(id) ON DELETE CASCADE,
    FOREIGN KEY (seat_id) REFERENCES Seats(id) ON DELETE CASCADE,
    FOREIGN KEY (pricing_tier_id) REFERENCES PricingTiers(id) ON DELETE CASCADE,
    UNIQUE KEY (cart_id, seat_id, schedule_id)
);

CREATE TABLE Reservations (
    id INT NOT NULL AUTO_INCREMENT,
    customer_id INT NOT NULL,
    schedule_id INT NOT NULL,
    seat_id INT NOT NULL,
    reserved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    status ENUM('active', 'expired', 'converted', 'canceled') NOT NULL DEFAULT 'active',
    PRIMARY KEY (id),
    FOREIGN KEY (customer_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (schedule_id) REFERENCES EventSchedules(id) ON DELETE CASCADE,
    FOREIGN KEY (seat_id) REFERENCES Seats(id) ON DELETE CASCADE,
    UNIQUE KEY (seat_id, schedule_id, status)
);

CREATE TABLE Orders (
    id INT NOT NULL AUTO_INCREMENT,
    customer_id INT NOT NULL,
    cart_id INT NOT NULL,
    order_number VARCHAR(50) NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'confirmed', 'canceled', 'refunded') NOT NULL DEFAULT 'pending',
    PRIMARY KEY (id),
    FOREIGN KEY (customer_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (cart_id) REFERENCES Carts(id),
    UNIQUE KEY (order_number)
);

CREATE TABLE Tickets (
    id INT NOT NULL AUTO_INCREMENT,
    order_id INT NOT NULL,
    customer_id INT NOT NULL,
    schedule_id INT NOT NULL,
    seat_id INT NOT NULL,
    barcode VARCHAR(100) UNIQUE,
    qr_code VARCHAR(255),
    price DECIMAL(10, 2) NOT NULL,
    status ENUM('issued', 'validated', 'used', 'canceled', 'refunded') NOT NULL DEFAULT 'issued',
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (order_id) REFERENCES Orders(id) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (schedule_id) REFERENCES EventSchedules(id) ON DELETE CASCADE,
    FOREIGN KEY (seat_id) REFERENCES Seats(id) ON DELETE CASCADE,
    UNIQUE KEY (schedule_id, seat_id)
);

CREATE TABLE PaymentMethods (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (id)
);

CREATE TABLE Payments (
    id INT NOT NULL AUTO_INCREMENT,
    order_id INT NOT NULL,
    payment_method_id INT NOT NULL,
    transaction_id VARCHAR(100),
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    status ENUM('pending', 'completed', 'failed', 'refunded') NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (order_id) REFERENCES Orders(id) ON DELETE CASCADE,
    FOREIGN KEY (payment_method_id) REFERENCES PaymentMethods(id),
    UNIQUE KEY (transaction_id)
);

CREATE TABLE Promotions (
    id INT NOT NULL AUTO_INCREMENT,
    code VARCHAR(50) NOT NULL,
    description TEXT,
    discount_type ENUM('percentage', 'fixed_amount') NOT NULL,
    discount_value DECIMAL(10, 2) NOT NULL,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    usage_limit INT,
    current_usage INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (id),
    UNIQUE KEY (code)
);

-- ```Dockerfile
-- FROM mysql:8

-- COPY db_schema.sql /docker-entrypoint-initdb.d/

-- ```

-- ```bash
-- docker build -t stadium-booking-by-thuc .

-- docker run -d --name SE-ProjectDB-local -e MYSQL_ROOT_PASSWORD=pass -p 3306:3306  stadium-booking-by-thuc

-- ```