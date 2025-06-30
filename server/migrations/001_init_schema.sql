CREATE TABLE
    product_assignments (
        id SERIAL PRIMARY KEY,
        reservation_uuid UUID NOT NULL,
        name TEXT NOT NULL
    );

CREATE TABLE
    product_charges (
        id SERIAL PRIMARY KEY,
        special_product_assignment_id INTEGER REFERENCES product_assignments (id),
        active BOOLEAN NOT NULL,
        amount NUMERIC(10, 2) NOT NULL
    );