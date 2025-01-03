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
