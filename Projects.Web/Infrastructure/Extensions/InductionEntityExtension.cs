using Projects.Entities.Projects;
using Projects.Web.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Projects.Web.Infrastructure.Extensions
{
    public static class InductionEntityExtension
    {
        public static void AddInduction(this tbl_induction induction, InductionViewModel inductionVm)
        {
            // induction.Empid = inductionVm.Empid;
            induction.tenant_id = inductionVm.tenant_id;
            induction.project_id = inductionVm.project_id;
            induction.master_emp_id = inductionVm.master_emp_id;
            induction.empcode = inductionVm.empcode;
            induction.name = inductionVm.name;
            induction.date_of_joining = DateTime.Now;//inductionVm.date_of_joining;
            induction.induction_date = DateTime.Now;
           // induction.induction = inductionVm.induction;
            induction.wbi_no = inductionVm.wbi_no;
        }

        public static void AddInductiondriver(this tbl_induction induction, InductionViewModel inductionVm)
        {
            induction.tenant_id = inductionVm.tenant_id;
            induction.project_id = inductionVm.project_id;
            induction.master_emp_id = inductionVm.master_emp_id;
            induction.empcode = inductionVm.empcode;
            induction.name = inductionVm.name;
            induction.date_of_joining = DateTime.Now;//inductionVm.date_of_joining;
            induction.induction_date = DateTime.Now;
            induction.wbi_no = inductionVm.wbi_no;
        }
    }
}