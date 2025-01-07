-- Insert data into department table
INSERT INTO department (name) VALUES 
('Engineering'),
('Human Resources'),
('Marketing'),
('Sales'),
('Finance');

-- Insert data into role table
INSERT INTO role (title, salary, department_Id) VALUES 
('Software Engineer', 80000, 1),
('HR Manager', 60000, 2),
('Marketing Specialist', 50000, 3),
('Sales Representative', 55000, 4),
('Financial Analyst', 70000, 5),
('Senior Software Engineer', 100000, 1),
('Recruiter', 50000, 2),
('Marketing Manager', 75000, 3),
('Sales Manager', 80000, 4),
('Chief Financial Officer', 120000, 5);

-- Insert data into employee table
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES 
('John', 'Doe', 1, NULL),
('Jane', 'Smith', 2, NULL),
('Emily', 'Jones', 3, NULL),
('Michael', 'Brown', 1, 1),
('Sarah', 'Davis', 3, 3),
('David', 'Wilson', 4, NULL),
('Laura', 'Taylor', 5, NULL),
('James', 'Anderson', 6, 1),
('Patricia', 'Thomas', 7, 2),
('Linda', 'Jackson', 8, 3),
('Robert', 'White', 9, 4),
('Barbara', 'Harris', 10, 5);
