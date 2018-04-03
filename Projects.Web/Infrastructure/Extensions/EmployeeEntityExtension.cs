using Projects.Entities.Projects;
using Projects.Web.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Projects.Web.Infrastructure.Extensions
{
    public static class EmployeeEntityExtension
    {
        public static void AddEmployeeMaster(this tbl_employee employee, EmployeeViewModel employeeVm)
        {
            employee.tenant_id = employeeVm.tenant_id;
            employee.project_id = employeeVm.project_id;
            employee.Designation = employeeVm.Designation;
            employee.emp_name = employeeVm.emp_name;
            //employee.date_created = employeeVm.date_created;
            employee.date_created = TimeZoneInfo.ConvertTimeFromUtc(employeeVm.date_created, TimeZoneInfo.FindSystemTimeZoneById("India Standard Time"));
            employee.CreatedBy = employeeVm.CreatedBy;


        }
    }
}