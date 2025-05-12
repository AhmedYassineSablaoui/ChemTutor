CREATE TABLE compounds (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    formula VARCHAR(50) NOT NULL,
    UNIQUE(name, formula)
);

INSERT INTO compounds (name, formula) VALUES
('Ethylene', 'C2H4'),
('Water', 'H2O'),
('Ethanol', 'CH3CH2OH');
