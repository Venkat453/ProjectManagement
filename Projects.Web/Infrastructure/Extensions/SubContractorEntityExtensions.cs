using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Projects.Web.Models;
using Projects.Entities.Projects;
using Projects.Data.Repositories;

namespace Projects.Web.Infrastructure.Extensions
{
    public static class SubContractorEntityExtensions
    {
        public static void AddSubcontractor(this tbl_subcontractor subcontractor,SubContractorViewModel subcontractorVm)
        {
            subcontractor.tenant_id = subcontractorVm.tenant_id;
            subcontractor.company_name = subcontractorVm.company_name;
            subcontractor.project_id = subcontractorVm.project_id;            
            subcontractor.reg_No = subcontractorVm.reg_No;
            subcontractor.subcontractor_name = subcontractorVm.subcontractor_name;
            subcontractor.current_street = subcontractorVm.current_street;
            subcontractor.current_country = subcontractorVm.current_country;
            subcontractor.current_state = subcontractorVm.current_state;
            subcontractor.current_city = subcontractorVm.current_city;
            subcontractor.current_zip = subcontractorVm.current_zip;
            subcontractor.current_contact_number = subcontractorVm.current_contact_number;
            subcontractor.alternative_contactNumber = subcontractorVm.alternative_contactNumber;
            subcontractor.contractor_photo_file_name = subcontractorVm.contractor_photo_file_name;
            subcontractor.service_tax_no = subcontractorVm.service_tax_no;
            subcontractor.pan = subcontractorVm.pan;
            subcontractor.bank_account_no = subcontractorVm.bank_account_no;
            subcontractor.bank_name = subcontractorVm.bank_name;          
            subcontractor.bank_branch = subcontractorVm.bank_branch;
            subcontractor.ifsc = subcontractorVm.ifsc;
            subcontractor.contractor_photo = subcontractorVm.contractor_photo;
            subcontractor.contractor_photo_file_type = subcontractorVm.contractor_photo_file_type; 
            subcontractor.agreement = subcontractorVm.agreement;
            subcontractor.agreement_file_type = subcontractorVm.agreement_file_type;
            subcontractor.contractor_agreement_file_name = subcontractorVm.contractor_agreement_file_name;
            subcontractor.created_date = DateTime.Now;
            subcontractor.created_by = subcontractorVm.created_by;
            subcontractor.modified_date = DateTime.Now;
            subcontractor.modified_by = subcontractorVm.modified_by;
        }
    }
}