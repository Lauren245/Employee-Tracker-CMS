-- Insert data into department table
INSERT INTO department (name) VALUES 
('Engineering'),
('Human Resources'),
('Marketing');

-- Insert data into role table
INSERT INTO role (title, salary, department_Id) VALUES 
('Software Engineer', 80000, 1),
('HR Manager', 60000, 2),
('Marketing Specialist', 50000, 3);

-- Insert data into employee table
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES 
('John', 'Doe', 1, NULL),
('Jane', 'Smith', 2, NULL),
('Emily', 'Jones', 3, NULL),
('Michael', 'Brown', 1, 1),
('Sarah', 'Davis', 3, 3);
