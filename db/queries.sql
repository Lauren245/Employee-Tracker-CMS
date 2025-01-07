--view all departments
SELECT *
FROM department;

--view all roles
SELECT rol.id AS ID, rol.title AS Title, 
        dep.name AS Department, rol.salary AS Salary
FROM role AS rol
    JOIN department AS dep
        ON rol.department_id = dep.id;

--view all employees
SELECT emp.id AS ID, emp.first_name AS "First Name",
        emp.last_name AS "Last Name", rol.title AS Title, 
        dep.name AS Department, rol.salary AS Salary,
        --include case statement to replace empty space with null if employee has no manager
        CASE
            WHEN mgr.id IS NULL THEN 'null'
            ELSE CONCAT(mgr.first_name, ' ', mgr.last_name)
        END AS Manager
FROM employee AS emp
    JOIN role AS rol 
        ON emp.role_id = rol.id
    JOIN department AS dep 
        ON rol.department_id = dep.id
    LEFT JOIN employee AS mgr
        ON emp.manager_id = mgr.id
--ensures the employee can't be their own manager.
WHERE emp.id <> emp.manager_id OR emp.manager_id IS NULL;

--add a department

--add a role

-- update employee role


SELECT emp.id, emp.first_name, emp.last_name, emp.role_id, 
    rol.department_id, rol.title, dep.name
FROM employee emp 
    JOIN role rol 
        ON emp.role_id = rol.id
    JOIN department dep 
        ON rol.department_id = dep.id
WHERE dep.id = 1;