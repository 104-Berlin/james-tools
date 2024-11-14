-- Add up migration script here

CREATE TABLE monthly (id uuid default uuid_generate_v4() PRIMARY KEY,
                                                                 position VARCHAR(255) NOT NULL,
                                                                                       debit FLOAT8 NOT NULL DEFAULT 0,
                                                                                                                     credit FLOAT8 NOT NULL DEFAULT 0);


CREATE TABLE user_monthly (user_id uuid NOT NULL,
                                        monthly_id uuid NOT NULL,
                                                        PRIMARY KEY (user_id,
                                                                     monthly_id),
                           FOREIGN KEY (user_id) REFERENCES users(id),
                           FOREIGN KEY (monthly_id) REFERENCES monthly(id));