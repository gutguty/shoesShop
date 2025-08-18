
create TABLE products(
     id SERIAL PRIMARY KEY,
     title VARCHAR(255) NOT NULL,
     description TEXT,
     image VARCHAR(500) NOT NULL,
     price INTEGER NOT NULL,
     size VARCHAR(10) NOT NULL,
     gender VARCHAR(16) NOT NULL<
);

create TABLE orders(
    id SERIAL PRIMARY KEY,
    orders_name VARCHAR(255) NOT NULL ,
    orders_phone VARCHAR(20) NOT NULL,
    orders_email VARCHAR(255) NOT NULL,
    total_price INTEGER NOT NULL,
);

-- Промежуточная таблица для решения проблемы "один заказ - много товаров"
create TABLE order_items(
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL,
    card_id INTEGER NOT NULL,
    quantity INTEGER DEFAULT 1,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (card_id) REFERENCES products(id)
);